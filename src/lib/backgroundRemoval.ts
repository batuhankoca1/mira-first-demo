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
  if (width <= maxDim && height <= maxDim) return { width, height };
  if (width >= height) {
    return { width: maxDim, height: Math.max(1, Math.round((height * maxDim) / width)) };
  }
  return { width: Math.max(1, Math.round((width * maxDim) / height)), height: maxDim };
}

function canvasToDataURL(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return canvas.toDataURL(type, quality);
}

function clamp01(x: number) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

// The segmentation pipeline may return different mask encodings.
// We normalize everything into a Float32Array in [0..1] of length width*height.
function toFloatMask(maskData: any, expectedLength: number): Float32Array {
  // Common case: Float32Array already
  if (maskData instanceof Float32Array) {
    if (maskData.length !== expectedLength) throw new Error("Mask size mismatch");
    return maskData;
  }

  // Common case: Uint8ClampedArray (0..255)
  if (maskData instanceof Uint8ClampedArray || maskData instanceof Uint8Array) {
    if (maskData.length !== expectedLength) throw new Error("Mask size mismatch");
    const out = new Float32Array(expectedLength);
    for (let i = 0; i < expectedLength; i++) out[i] = maskData[i] / 255;
    return out;
  }

  // Sometimes the mask is wrapped (e.g. Tensor-like)
  const maybe = maskData?.data ?? maskData?.value ?? maskData;
  if (maybe instanceof Float32Array) return toFloatMask(maybe, expectedLength);
  if (maybe instanceof Uint8ClampedArray || maybe instanceof Uint8Array) return toFloatMask(maybe, expectedLength);

  throw new Error("Unsupported mask format");
}

function maskToGrayscaleCanvas(mask: Float32Array, width: number, height: number) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(width, height);
  for (let i = 0; i < mask.length; i++) {
    const g = Math.round(clamp01(mask[i]) * 255);
    const o = i * 4;
    img.data[o] = g;
    img.data[o + 1] = g;
    img.data[o + 2] = g;
    img.data[o + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

const BG_LABELS = new Set([
  "wall",
  "floor",
  "ceiling",
  "sky",
  "ground",
  "road",
  "sidewalk",
  "building",
  "tree",
  "grass",
  "water",
  "mountain",
  "sand",
  "snow",
  "carpet",
  "rug",
  "curtain",
  "blind",
  "windowpane",
  "door",
  "background",
]);

type BBox = { minX: number; minY: number; maxX: number; maxY: number };

function computeBoundingBoxFromAlpha(
  rgbaCanvas: HTMLCanvasElement,
  alphaThreshold = 10
): BBox {
  const ctx = rgbaCanvas.getContext("2d")!;
  const { width, height } = rgbaCanvas;
  const img = ctx.getImageData(0, 0, width, height);

  let minX = width,
    minY = height,
    maxX = -1,
    maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = img.data[(y * width + x) * 4 + 3];
      if (a > alphaThreshold) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0 || maxY < 0) {
    return { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1 };
  }

  return { minX, minY, maxX, maxY };
}

// Garment integrity rule: never erode. We ONLY expand/fill small holes.
function fillSmallHoles(mask: Float32Array, width: number, height: number): Float32Array {
  const out = new Float32Array(mask.length);
  // 1 pass dilation-ish: take max of neighborhood and original
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      let m = mask[i];
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny < 0 || ny >= height || nx < 0 || nx >= width) continue;
          m = Math.max(m, mask[ny * width + nx]);
        }
      }
      // keep extra pixels: never less than original
      out[i] = Math.max(mask[i], m);
    }
  }
  return out;
}

function composeRGBA(rgbCanvas: HTMLCanvasElement, alphaMask01: Float32Array) {
  const ctx = rgbCanvas.getContext("2d")!;
  const { width, height } = rgbCanvas;
  const img = ctx.getImageData(0, 0, width, height);

  // CRITICAL: keep RGB intact; set alpha only.
  for (let i = 0; i < alphaMask01.length; i++) {
    img.data[i * 4 + 3] = Math.round(clamp01(alphaMask01[i]) * 255);
  }

  ctx.putImageData(img, 0, 0);
}

function cropPadCenterTo400(srcCanvas: HTMLCanvasElement, bbox: BBox): HTMLCanvasElement {
  const padding = 16;
  const srcW = srcCanvas.width;
  const srcH = srcCanvas.height;

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

  const out = document.createElement("canvas");
  out.width = AVATAR_ASSET_SIZE;
  out.height = AVATAR_ASSET_SIZE;
  const octx = out.getContext("2d")!;

  // Fit within 400x400, keep aspect
  const maxSize = AVATAR_ASSET_SIZE * 0.92;
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
  onProgress?.("Decoding image...");

  // Properly decode WEBP/etc to full-resolution pixels
  const bitmap = await createImageBitmap(file);

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

  onProgress?.("Loading model...");
  const segmenter = await getSegmenter();

  onProgress?.("Removing background...");
  const inputForModel = canvasToDataURL(rgbCanvas, "image/jpeg", 0.92);
  const segments = await segmenter(inputForModel);

  const expectedLen = infW * infH;

  // Build background-union mask
  const bgUnion = new Float32Array(expectedLen);
  let bgCount = 0;

  for (const seg of Array.isArray(segments) ? segments : []) {
    const label = String(seg?.label ?? "").toLowerCase();
    const raw = seg?.mask?.data;
    if (!raw) continue;

    const m = toFloatMask(raw, expectedLen);

    if (BG_LABELS.has(label)) {
      bgCount++;
      for (let i = 0; i < expectedLen; i++) {
        bgUnion[i] = Math.max(bgUnion[i], m[i]);
      }
    }
  }

  // Foreground = NOT background (prefer keeping pixels)
  const fg = new Float32Array(expectedLen);

  if (bgCount > 0) {
    for (let i = 0; i < expectedLen; i++) fg[i] = clamp01(1 - bgUnion[i]);
  } else {
    // If background labels are not present, fallback to union of all segments
    const union = new Float32Array(expectedLen);
    for (const seg of Array.isArray(segments) ? segments : []) {
      const raw = seg?.mask?.data;
      if (!raw) continue;
      const m = toFloatMask(raw, expectedLen);
      for (let i = 0; i < expectedLen; i++) union[i] = Math.max(union[i], m[i]);
    }

    // If union is mostly 1, it's likely background; invert.
    let mean = 0;
    for (let i = 0; i < expectedLen; i++) mean += union[i];
    mean /= expectedLen;

    const inverted = mean > 0.6;
    for (let i = 0; i < expectedLen; i++) fg[i] = clamp01(inverted ? 1 - union[i] : union[i]);
  }

  // Fill small holes (never erode)
  const fgFilled = fillSmallHoles(fg, infW, infH);

  // Compose RGBA
  composeRGBA(rgbCanvas, fgFilled);
  const composedDataUrl = canvasToDataURL(rgbCanvas, "image/png");

  // Debug mask view (foreground mask)
  const maskCanvas = maskToGrayscaleCanvas(fgFilled, infW, infH);
  const maskDataUrl = canvasToDataURL(maskCanvas, "image/png");

  // Crop based on alpha (very forgiving threshold)
  const bbox = computeBoundingBoxFromAlpha(rgbCanvas, 8);

  onProgress?.("Preparing wearable asset...");
  const sprite = cropPadCenterTo400(rgbCanvas, bbox);

  const assetBlob = await new Promise<Blob>((resolve, reject) => {
    sprite.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("PNG export failed"))),
      "image/png",
      1.0
    );
  });

  const assetDataUrl = await blobToBase64(assetBlob);

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
