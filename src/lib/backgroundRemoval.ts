import { pipeline, env } from "@huggingface/transformers";

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_INFERENCE_DIMENSION = 512;
const AVATAR_ASSET_SIZE = 400;

let segmenterInstance: any = null;

async function getSegmenter() {
  if (!segmenterInstance) {
    console.log("[BG Removal] Loading segmentation model...");
    segmenterInstance = await pipeline(
      "image-segmentation",
      "Xenova/segformer-b0-finetuned-ade-512-512",
      { device: "webgpu" }
    );
    console.log("[BG Removal] Model loaded");
  }
  return segmenterInstance;
}

function fitWithinMaxDim(width: number, height: number, maxDim: number) {
  if (width <= maxDim && height <= maxDim) return { width, height, scale: 1 };
  if (width >= height) {
    const newW = maxDim;
    const newH = Math.round((height * maxDim) / width);
    return { width: newW, height: newH, scale: newW / width };
  }
  const newH = maxDim;
  const newW = Math.round((width * maxDim) / height);
  return { width: newW, height: newH, scale: newH / height };
}

function canvasToDataURL(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return canvas.toDataURL(type, quality);
}

function maskToGrayscaleCanvas(mask: Float32Array, width: number, height: number) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(width, height);
  for (let i = 0; i < mask.length; i++) {
    const v = Math.max(0, Math.min(1, mask[i]));
    const g = Math.round(v * 255);
    const o = i * 4;
    img.data[o] = g;
    img.data[o + 1] = g;
    img.data[o + 2] = g;
    img.data[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/**
 * Find the best foreground mask from segmentation result.
 * The model returns multiple segments - we want to keep the subject (clothing) not background.
 * We'll combine all non-background segments OR pick the largest central object.
 */
function findBestMask(
  segmentationResult: any[],
  width: number,
  height: number
): Float32Array {
  console.log("[BG Removal] Processing", segmentationResult.length, "segments");
  
  // Create a combined mask - we want to keep everything that's NOT background/wall/floor
  const combinedMask = new Float32Array(width * height);
  
  // Background-like labels to exclude
  const bgLabels = new Set([
    'wall', 'floor', 'ceiling', 'sky', 'ground', 'road', 'sidewalk', 
    'building', 'tree', 'grass', 'water', 'mountain', 'sand', 'snow',
    'carpet', 'rug', 'curtain', 'blind', 'windowpane', 'door'
  ]);
  
  // Foreground/clothing-like labels to prioritize
  const fgLabels = new Set([
    'person', 'clothes', 'shirt', 'pants', 'dress', 'jacket', 'coat',
    'shoe', 'bag', 'accessory', 'hat', 'scarf', 'tie', 'belt'
  ]);
  
  let hasExplicitForeground = false;
  
  for (const segment of segmentationResult) {
    const label = (segment.label || '').toLowerCase();
    const mask = segment.mask?.data as Float32Array | undefined;
    
    if (!mask || mask.length !== width * height) continue;
    
    const isBg = bgLabels.has(label);
    const isFg = fgLabels.has(label);
    
    console.log(`[BG Removal] Segment: "${label}", isBg: ${isBg}, isFg: ${isFg}`);
    
    if (isFg) {
      hasExplicitForeground = true;
      // Add this mask to combined (keep foreground)
      for (let i = 0; i < mask.length; i++) {
        combinedMask[i] = Math.max(combinedMask[i], mask[i]);
      }
    } else if (!isBg) {
      // Unknown label - add it as potential foreground
      for (let i = 0; i < mask.length; i++) {
        combinedMask[i] = Math.max(combinedMask[i], mask[i] * 0.8);
      }
    }
  }
  
  // If we found no explicit foreground, use simple center-weighted approach
  if (!hasExplicitForeground && segmentationResult.length > 0) {
    console.log("[BG Removal] No explicit foreground found, using center-weighted approach");
    
    // Find the segment with highest center mass
    let bestScore = -1;
    let bestMask: Float32Array | null = null;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    
    for (const segment of segmentationResult) {
      const mask = segment.mask?.data as Float32Array | undefined;
      if (!mask || mask.length !== width * height) continue;
      
      let weightedSum = 0;
      let totalMass = 0;
      
      for (let i = 0; i < mask.length; i++) {
        if (mask[i] < 0.3) continue;
        
        const x = i % width;
        const y = Math.floor(i / width);
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const centerWeight = 1 - (dist / maxDist);
        
        weightedSum += mask[i] * centerWeight;
        totalMass += mask[i];
      }
      
      const score = totalMass > 100 ? weightedSum / totalMass : 0;
      
      if (score > bestScore) {
        bestScore = score;
        bestMask = mask;
      }
    }
    
    if (bestMask) {
      for (let i = 0; i < bestMask.length; i++) {
        combinedMask[i] = bestMask[i];
      }
    }
  }
  
  // If still empty, try inverting the first segment (assuming it's background)
  const hasContent = combinedMask.some(v => v > 0.3);
  if (!hasContent && segmentationResult.length > 0) {
    console.log("[BG Removal] Inverting first segment as fallback");
    const firstMask = segmentationResult[0].mask?.data as Float32Array | undefined;
    if (firstMask && firstMask.length === width * height) {
      for (let i = 0; i < firstMask.length; i++) {
        combinedMask[i] = 1 - firstMask[i];
      }
    }
  }
  
  return combinedMask;
}

/**
 * Apply soft edge preservation - don't threshold too aggressively
 * This preserves garment edges better
 */
function refineMask(mask: Float32Array, width: number, height: number): Float32Array {
  const refined = new Float32Array(mask.length);
  
  // Apply a small morphological close to fill holes
  // First dilate slightly
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      let maxVal = mask[i];
      
      // Check 3x3 neighborhood
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            maxVal = Math.max(maxVal, mask[ny * width + nx] * 0.7);
          }
        }
      }
      refined[i] = maxVal;
    }
  }
  
  // Boost confidence for values above threshold
  for (let i = 0; i < refined.length; i++) {
    if (refined[i] > 0.25) {
      refined[i] = Math.min(1, refined[i] * 1.3);
    }
  }
  
  return refined;
}

type BBox = { minX: number; minY: number; maxX: number; maxY: number };

function computeBoundingBox(mask: Float32Array, width: number, height: number, threshold: number): BBox {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (mask[y * width + x] >= threshold) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  
  // Fallback if nothing found
  if (maxX < minX || maxY < minY) {
    return { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1 };
  }
  
  return { minX, minY, maxX, maxY };
}

function composeRGBA(
  rgbCanvas: HTMLCanvasElement,
  mask: Float32Array
): void {
  const { width, height } = rgbCanvas;
  const ctx = rgbCanvas.getContext("2d")!;
  const img = ctx.getImageData(0, 0, width, height);

  // Keep original RGB intact, only set alpha from mask
  for (let i = 0; i < mask.length; i++) {
    const alpha = Math.round(Math.max(0, Math.min(1, mask[i])) * 255);
    img.data[i * 4 + 3] = alpha;
  }

  ctx.putImageData(img, 0, 0);
}

function cropAndPadToAvatar(
  srcCanvas: HTMLCanvasElement,
  bbox: BBox
): HTMLCanvasElement {
  const srcW = srcCanvas.width;
  const srcH = srcCanvas.height;

  const padding = 12;
  const minX = Math.max(0, bbox.minX - padding);
  const minY = Math.max(0, bbox.minY - padding);
  const maxX = Math.min(srcW - 1, bbox.maxX + padding);
  const maxY = Math.min(srcH - 1, bbox.maxY + padding);

  const cropW = Math.max(1, maxX - minX + 1);
  const cropH = Math.max(1, maxY - minY + 1);

  const cropped = document.createElement("canvas");
  cropped.width = cropW;
  cropped.height = cropH;
  const cctx = cropped.getContext("2d")!;
  cctx.drawImage(srcCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

  // Scale to fit into 400x400 with padding, then center
  const out = document.createElement("canvas");
  out.width = AVATAR_ASSET_SIZE;
  out.height = AVATAR_ASSET_SIZE;
  const octx = out.getContext("2d")!;

  const maxSize = AVATAR_ASSET_SIZE * 0.88;
  const scale = Math.min(maxSize / cropW, maxSize / cropH);
  const drawW = cropW * scale;
  const drawH = cropH * scale;
  const dx = (AVATAR_ASSET_SIZE - drawW) / 2;
  const dy = (AVATAR_ASSET_SIZE - drawH) / 2;

  octx.drawImage(cropped, dx, dy, drawW, drawH);
  return out;
}

export type ClothingDebugViews = {
  originalDataUrl: string;
  maskDataUrl: string;
  composedDataUrl: string;
};

export async function processClothingFile(
  file: File,
  onProgress?: (status: string) => void
): Promise<{ assetBlob: Blob; assetDataUrl: string; debug: ClothingDebugViews }> {
  onProgress?.("Resim okunuyor...");

  // Decode file to bitmap (handles WEBP, HEIC, etc.)
  const bitmap = await createImageBitmap(file);
  console.log("[BG Removal] Original size:", bitmap.width, "x", bitmap.height);

  // Resize for inference
  const { width: infW, height: infH } = fitWithinMaxDim(
    bitmap.width,
    bitmap.height,
    MAX_INFERENCE_DIMENSION
  );

  const rgbCanvas = document.createElement("canvas");
  rgbCanvas.width = infW;
  rgbCanvas.height = infH;
  const rgbCtx = rgbCanvas.getContext("2d")!;
  rgbCtx.drawImage(bitmap, 0, 0, infW, infH);

  const originalDataUrl = canvasToDataURL(rgbCanvas, "image/png");

  onProgress?.("Model yükleniyor...");
  const segmenter = await getSegmenter();

  onProgress?.("Arka plan temizleniyor...");
  const inputForModel = canvasToDataURL(rgbCanvas, "image/jpeg", 0.92);
  const segmentationResult = await segmenter(inputForModel);

  console.log("[BG Removal] Segmentation result:", segmentationResult);

  // Find best foreground mask
  let mask = findBestMask(segmentationResult, infW, infH);
  
  // Refine mask to preserve edges
  mask = refineMask(mask, infW, infH);

  // Debug: raw mask
  const maskCanvas = maskToGrayscaleCanvas(mask, infW, infH);
  const maskDataUrl = canvasToDataURL(maskCanvas, "image/png");

  // Compute bounding box
  const bbox = computeBoundingBox(mask, infW, infH, 0.2);
  console.log("[BG Removal] Bounding box:", bbox);

  // Compose RGBA (original RGB + mask alpha)
  composeRGBA(rgbCanvas, mask);
  const composedDataUrl = canvasToDataURL(rgbCanvas, "image/png");

  onProgress?.("Avatar için hazırlanıyor...");
  const avatarCanvas = cropAndPadToAvatar(rgbCanvas, bbox);

  const assetBlob = await new Promise<Blob>((resolve, reject) => {
    avatarCanvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("PNG export failed"))),
      "image/png",
      1.0
    );
  });

  const assetDataUrl = await blobToBase64(assetBlob);

  console.log("[BG Removal] Asset created, size:", assetBlob.size, "bytes");

  return {
    assetBlob,
    assetDataUrl,
    debug: { originalDataUrl, maskDataUrl, composedDataUrl },
  };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
