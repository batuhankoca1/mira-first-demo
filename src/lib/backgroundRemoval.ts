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

// Normalize mask to Float32 [0..1] length width*height
function toFloatMask(maskData: any, expectedLength: number): Float32Array {
  if (maskData instanceof Float32Array) {
    if (maskData.length !== expectedLength) throw new Error("Mask size mismatch");
    return maskData;
  }

  if (maskData instanceof Uint8ClampedArray || maskData instanceof Uint8Array) {
    if (maskData.length !== expectedLength) throw new Error("Mask size mismatch");
    const out = new Float32Array(expectedLength);
    for (let i = 0; i < expectedLength; i++) out[i] = maskData[i] / 255;
    return out;
  }

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

function computeBoundingBoxFromAlpha(rgbaCanvas: HTMLCanvasElement, alphaThreshold = 10): BBox {
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

// ------------- Garment-first mask utilities -------------

function makeBinaryMask(mask: Float32Array, threshold: number): Uint8Array {
  const out = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) out[i] = mask[i] >= threshold ? 1 : 0;
  return out;
}

function dilateBinary(bin: Uint8Array, width: number, height: number, radius = 1): Uint8Array {
  const out = new Uint8Array(bin.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let v = 0;
      for (let dy = -radius; dy <= radius && !v; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          if (bin[ny * width + nx]) {
            v = 1;
            break;
          }
        }
      }
      out[y * width + x] = v;
    }
  }
  return out;
}

// Keep only the largest connected component (garment as a single solid object)
function largestConnectedComponent(bin: Uint8Array, width: number, height: number) {
  const visited = new Uint8Array(bin.length);
  const keep = new Uint8Array(bin.length);

  let bestCount = 0;
  let bestPixels: Uint8Array | null = null;

  const queue = new Int32Array(bin.length);

  for (let i = 0; i < bin.length; i++) {
    if (!bin[i] || visited[i]) continue;

    let qh = 0;
    let qt = 0;
    queue[qt++] = i;
    visited[i] = 1;

    const pixels = new Uint8Array(bin.length);
    let count = 0;

    while (qh < qt) {
      const idx = queue[qh++];
      pixels[idx] = 1;
      count++;

      const x = idx % width;
      const y = (idx / width) | 0;

      const n1 = x > 0 ? idx - 1 : -1;
      const n2 = x < width - 1 ? idx + 1 : -1;
      const n3 = y > 0 ? idx - width : -1;
      const n4 = y < height - 1 ? idx + width : -1;

      if (n1 >= 0 && bin[n1] && !visited[n1]) {
        visited[n1] = 1;
        queue[qt++] = n1;
      }
      if (n2 >= 0 && bin[n2] && !visited[n2]) {
        visited[n2] = 1;
        queue[qt++] = n2;
      }
      if (n3 >= 0 && bin[n3] && !visited[n3]) {
        visited[n3] = 1;
        queue[qt++] = n3;
      }
      if (n4 >= 0 && bin[n4] && !visited[n4]) {
        visited[n4] = 1;
        queue[qt++] = n4;
      }
    }

    if (count > bestCount) {
      bestCount = count;
      bestPixels = pixels;
    }
  }

  if (!bestPixels || bestCount === 0) {
    return { keep, area: 0 };
  }

  keep.set(bestPixels);
  return { keep, area: bestCount };
}

// Fill internal holes in a binary mask (guarantee no holes inside garment)
function fillHoles(bin: Uint8Array, width: number, height: number): Uint8Array {
  // Flood fill background from borders; anything not reached and not garment is a hole.
  const visited = new Uint8Array(bin.length);
  const queue = new Int32Array(bin.length);
  let qt = 0;

  const pushIfBg = (x: number, y: number) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    if (bin[idx]) return; // garment
    visited[idx] = 1;
    queue[qt++] = idx;
  };

  // borders
  for (let x = 0; x < width; x++) {
    pushIfBg(x, 0);
    pushIfBg(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfBg(0, y);
    pushIfBg(width - 1, y);
  }

  let qh = 0;
  while (qh < qt) {
    const idx = queue[qh++];
    const x = idx % width;
    const y = (idx / width) | 0;

    const left = x > 0 ? idx - 1 : -1;
    const right = x < width - 1 ? idx + 1 : -1;
    const up = y > 0 ? idx - width : -1;
    const down = y < height - 1 ? idx + width : -1;

    if (left >= 0 && !visited[left] && !bin[left]) {
      visited[left] = 1;
      queue[qt++] = left;
    }
    if (right >= 0 && !visited[right] && !bin[right]) {
      visited[right] = 1;
      queue[qt++] = right;
    }
    if (up >= 0 && !visited[up] && !bin[up]) {
      visited[up] = 1;
      queue[qt++] = up;
    }
    if (down >= 0 && !visited[down] && !bin[down]) {
      visited[down] = 1;
      queue[qt++] = down;
    }
  }

  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    // if it's garment already OR it's a hole (background not reachable from border)
    out[i] = bin[i] || !visited[i] ? 1 : 0;
  }
  return out;
}

function binaryToSoftAlpha(bin: Uint8Array, softBase: Float32Array): Float32Array {
  const out = new Float32Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    if (bin[i]) {
      // prefer false positives: ensure a minimum alpha for kept pixels
      out[i] = Math.max(0.65, softBase[i]);
    } else {
      out[i] = 0;
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

  const maxSize = AVATAR_ASSET_SIZE * 0.92;
  const scale = Math.min(maxSize / cropW, maxSize / cropH);
  const drawW = cropW * scale;
  const drawH = cropH * scale;
  const dx = (AVATAR_ASSET_SIZE - drawW) / 2;
  const dy = (AVATAR_ASSET_SIZE - drawH) / 2;

  octx.drawImage(cropped, dx, dy, drawW, drawH);
  return out;
}

function makeSpriteNoMask(rgbCanvas: HTMLCanvasElement): HTMLCanvasElement {
  // Fallback: keep original pixels (no masking), but still output a centered 400x400 sprite.
  // Background will remain inside the crop, but outside the sprite is transparent.
  const out = document.createElement("canvas");
  out.width = AVATAR_ASSET_SIZE;
  out.height = AVATAR_ASSET_SIZE;
  const ctx = out.getContext("2d")!;

  const maxSize = AVATAR_ASSET_SIZE * 0.92;
  const scale = Math.min(maxSize / rgbCanvas.width, maxSize / rgbCanvas.height);
  const drawW = rgbCanvas.width * scale;
  const drawH = rgbCanvas.height * scale;
  const dx = (AVATAR_ASSET_SIZE - drawW) / 2;
  const dy = (AVATAR_ASSET_SIZE - drawH) / 2;
  ctx.drawImage(rgbCanvas, dx, dy, drawW, drawH);
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

  // Background union (soft)
  const bgUnion = new Float32Array(expectedLen);
  let bgCount = 0;

  for (const seg of Array.isArray(segments) ? segments : []) {
    const label = String(seg?.label ?? "").toLowerCase();
    const raw = seg?.mask?.data;
    if (!raw) continue;
    const m = toFloatMask(raw, expectedLen);

    if (BG_LABELS.has(label)) {
      bgCount++;
      for (let i = 0; i < expectedLen; i++) bgUnion[i] = Math.max(bgUnion[i], m[i]);
    }
  }

  // Foreground soft mask: prefer keeping pixels.
  const fgSoft = new Float32Array(expectedLen);
  if (bgCount > 0) {
    for (let i = 0; i < expectedLen; i++) fgSoft[i] = clamp01(1 - bgUnion[i]);
  } else {
    // Fallback union of all segments (then decide invert)
    const union = new Float32Array(expectedLen);
    for (const seg of Array.isArray(segments) ? segments : []) {
      const raw = seg?.mask?.data;
      if (!raw) continue;
      const m = toFloatMask(raw, expectedLen);
      for (let i = 0; i < expectedLen; i++) union[i] = Math.max(union[i], m[i]);
    }

    let mean = 0;
    for (let i = 0; i < expectedLen; i++) mean += union[i];
    mean /= expectedLen;
    const inverted = mean > 0.6;
    for (let i = 0; i < expectedLen; i++) fgSoft[i] = clamp01(inverted ? 1 - union[i] : union[i]);
  }

  // ---- Garment-first: make a single solid silhouette ----
  // Very low threshold: we prefer false positives.
  const bin0 = makeBinaryMask(fgSoft, 0.12);

  // Keep ONE solid object: largest component.
  const { keep, area } = largestConnectedComponent(bin0, infW, infH);

  // Confidence check: if foreground is too tiny, masking is unreliable.
  const areaRatio = area / expectedLen;
  const lowConfidence = areaRatio < 0.01;

  if (lowConfidence) {
    console.warn("[BG Removal] Low confidence mask; using NO-MASK fallback", { areaRatio });

    const sprite = makeSpriteNoMask(rgbCanvas);
    const maskCanvas = maskToGrayscaleCanvas(fgSoft, infW, infH);
    const maskDataUrl = canvasToDataURL(maskCanvas, "image/png");

    const composedDataUrl = canvasToDataURL(rgbCanvas, "image/png");

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

  // Fill holes inside the garment.
  const keepFilled = fillHoles(keep, infW, infH);

  // Gentle dilation to avoid cutting sleeves/collars.
  const keepPadded = dilateBinary(keepFilled, infW, infH, 1);

  // Build final alpha mask (soft + minimum alpha for kept pixels)
  const alpha = binaryToSoftAlpha(keepPadded, fgSoft);

  // Compose RGBA
  composeRGBA(rgbCanvas, alpha);
  const composedDataUrl = canvasToDataURL(rgbCanvas, "image/png");

  // Debug mask view is final alpha
  const maskCanvas = maskToGrayscaleCanvas(alpha, infW, infH);
  const maskDataUrl = canvasToDataURL(maskCanvas, "image/png");

  // Crop based on alpha (forgiving)
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
