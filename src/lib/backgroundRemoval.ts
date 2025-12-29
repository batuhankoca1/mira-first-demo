import { pipeline, env } from "@huggingface/transformers";

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_INFERENCE_DIMENSION = 512;
const AVATAR_ASSET_SIZE = 400;

let segmenterInstance: any = null;

async function getSegmenter() {
  if (!segmenterInstance) {
    segmenterInstance = await pipeline(
      "image-segmentation",
      "Xenova/segformer-b0-finetuned-ade-512-512",
      { device: "webgpu" }
    );
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

type ComponentResult = {
  keep: Uint8Array; // 0/1
  bbox: { minX: number; minY: number; maxX: number; maxY: number };
};

function largestConnectedComponent(
  mask: Float32Array,
  width: number,
  height: number,
  threshold = 0.5
): ComponentResult {
  const bin = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) bin[i] = mask[i] >= threshold ? 1 : 0;

  const visited = new Uint8Array(mask.length);

  let bestCount = 0;
  let bestKeep: Uint8Array | null = null;
  let bestBBox = { minX: width, minY: height, maxX: -1, maxY: -1 };

  const queue = new Int32Array(mask.length);

  const push = (idx: number, qLen: number) => {
    queue[qLen] = idx;
    return qLen + 1;
  };

  for (let i = 0; i < bin.length; i++) {
    if (!bin[i] || visited[i]) continue;

    let qHead = 0;
    let qLen = 0;
    qLen = push(i, qLen);
    visited[i] = 1;

    const keep = new Uint8Array(mask.length);
    let count = 0;
    let minX = width,
      minY = height,
      maxX = -1,
      maxY = -1;

    while (qHead < qLen) {
      const idx = queue[qHead++];
      keep[idx] = 1;
      count++;

      const x = idx % width;
      const y = (idx / width) | 0;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;

      // 4-neighbor
      const left = x > 0 ? idx - 1 : -1;
      const right = x < width - 1 ? idx + 1 : -1;
      const up = y > 0 ? idx - width : -1;
      const down = y < height - 1 ? idx + width : -1;

      if (left >= 0 && bin[left] && !visited[left]) {
        visited[left] = 1;
        qLen = push(left, qLen);
      }
      if (right >= 0 && bin[right] && !visited[right]) {
        visited[right] = 1;
        qLen = push(right, qLen);
      }
      if (up >= 0 && bin[up] && !visited[up]) {
        visited[up] = 1;
        qLen = push(up, qLen);
      }
      if (down >= 0 && bin[down] && !visited[down]) {
        visited[down] = 1;
        qLen = push(down, qLen);
      }
    }

    if (count > bestCount) {
      bestCount = count;
      bestKeep = keep;
      bestBBox = { minX, minY, maxX, maxY };
    }
  }

  // If nothing detected, keep everything (fallback to avoid empty output)
  if (!bestKeep || bestCount === 0) {
    return {
      keep: new Uint8Array(mask.length).fill(1),
      bbox: { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1 },
    };
  }

  return { keep: bestKeep, bbox: bestBBox };
}

function composeRGBAFromMask(
  rgbCanvas: HTMLCanvasElement,
  mask: Float32Array,
  keep: Uint8Array
) {
  const { width, height } = rgbCanvas;
  const ctx = rgbCanvas.getContext("2d")!;
  const img = ctx.getImageData(0, 0, width, height);

  // IMPORTANT: Keep original RGB intact. Only write alpha.
  for (let i = 0; i < mask.length; i++) {
    const o = i * 4;
    const a = keep[i] ? Math.round(Math.max(0, Math.min(1, mask[i])) * 255) : 0;
    img.data[o + 3] = a;
  }

  ctx.putImageData(img, 0, 0);
}

function cropAndPadToAvatar(
  srcCanvas: HTMLCanvasElement,
  bbox: { minX: number; minY: number; maxX: number; maxY: number }
) {
  const srcW = srcCanvas.width;
  const srcH = srcCanvas.height;

  const padding = 8;
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

  // Scale to fit into 400x400 with ~10% padding, then center.
  const out = document.createElement("canvas");
  out.width = AVATAR_ASSET_SIZE;
  out.height = AVATAR_ASSET_SIZE;
  const octx = out.getContext("2d")!;

  const maxSize = AVATAR_ASSET_SIZE * 0.9;
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

  // Ensure WEBP (and others) decode to full-res pixels
  const bitmap = await createImageBitmap(file);

  // Inference canvas (keeps original RGB intact at this working resolution)
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
  const inputForModel = canvasToDataURL(rgbCanvas, "image/jpeg", 0.9);
  const result = await segmenter(inputForModel);

  const mask: Float32Array | undefined = result?.[0]?.mask?.data;
  if (!mask || mask.length !== infW * infH) {
    throw new Error("Segmentation mask missing or size mismatch");
  }

  // Clean mask: keep only largest connected component, then bbox crop
  const { keep, bbox } = largestConnectedComponent(mask, infW, infH, 0.5);

  // Compose final RGBA = (original RGB, alpha = mask)
  composeRGBAFromMask(rgbCanvas, mask, keep);

  const composedDataUrl = canvasToDataURL(rgbCanvas, "image/png");

  // Debug mask view (raw mask, not cleaned)
  const maskCanvas = maskToGrayscaleCanvas(mask, infW, infH);
  const maskDataUrl = canvasToDataURL(maskCanvas, "image/png");

  onProgress?.("Preparing wearable asset...");
  const avatarCanvas = cropAndPadToAvatar(rgbCanvas, bbox);

  const assetBlob = await new Promise<Blob>((resolve, reject) => {
    avatarCanvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG export failed"))), "image/png", 1.0);
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
