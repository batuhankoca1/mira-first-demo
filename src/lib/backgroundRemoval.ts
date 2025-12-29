const AVATAR_ASSET_SIZE = 400;
const EDGE_DETECT_MAX_DIM = 256;

export type CropRect = {
  // normalized [0..1] coords relative to the decoded image
  x: number;
  y: number;
  w: number;
  h: number;
};

export type DetectedBBox = { x: number; y: number; w: number; h: number };

export type ClothingDebugViews = {
  originalDataUrl: string;
  bboxPreviewDataUrl: string;
  spriteDataUrl: string;
};

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

function canvasToDataURL(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return canvas.toDataURL(type, quality);
}

function fitWithinMaxDim(width: number, height: number, maxDim: number) {
  if (width <= maxDim && height <= maxDim) return { width, height, scale: 1 };
  if (width >= height) {
    const newW = maxDim;
    const newH = Math.max(1, Math.round((height * maxDim) / width));
    return { width: newW, height: newH, scale: newW / width };
  }
  const newH = maxDim;
  const newW = Math.max(1, Math.round((width * maxDim) / height));
  return { width: newW, height: newH, scale: newH / height };
}

function computeSobelEdgesBBox(imageData: ImageData): { bbox: DetectedBBox | null; edgeCount: number } {
  const { width, height, data } = imageData;
  const gray = new Float32Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    // luminance
    gray[i] = 0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
  }

  const mag = new Float32Array(width * height);
  let sum = 0;
  let sumSq = 0;

  const at = (x: number, y: number) => gray[y * width + x];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const gx =
        -1 * at(x - 1, y - 1) +
        1 * at(x + 1, y - 1) +
        -2 * at(x - 1, y) +
        2 * at(x + 1, y) +
        -1 * at(x - 1, y + 1) +
        1 * at(x + 1, y + 1);

      const gy =
        -1 * at(x - 1, y - 1) +
        -2 * at(x, y - 1) +
        -1 * at(x + 1, y - 1) +
        1 * at(x - 1, y + 1) +
        2 * at(x, y + 1) +
        1 * at(x + 1, y + 1);

      const m = Math.sqrt(gx * gx + gy * gy);
      const idx = y * width + x;
      mag[idx] = m;
      sum += m;
      sumSq += m * m;
    }
  }

  const n = (width - 2) * (height - 2);
  const mean = sum / Math.max(1, n);
  const variance = sumSq / Math.max(1, n) - mean * mean;
  const std = Math.sqrt(Math.max(0, variance));

  // Adaptive threshold: keep strong edges, but avoid over-pruning.
  const threshold = mean + std * 1.25;

  let minX = width,
    minY = height,
    maxX = -1,
    maxY = -1;
  let edgeCount = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (mag[idx] >= threshold) {
        edgeCount++;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (edgeCount < 80 || maxX < 0 || maxY < 0) {
    return { bbox: null, edgeCount };
  }

  return {
    bbox: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 },
    edgeCount,
  };
}

function padBBox(b: DetectedBBox, width: number, height: number, padPx: number): DetectedBBox {
  const x = Math.max(0, b.x - padPx);
  const y = Math.max(0, b.y - padPx);
  const x2 = Math.min(width - 1, b.x + b.w - 1 + padPx);
  const y2 = Math.min(height - 1, b.y + b.h - 1 + padPx);
  return { x, y, w: x2 - x + 1, h: y2 - y + 1 };
}

function cropAndNormalizeToSprite(
  sourceCanvas: HTMLCanvasElement,
  cropPx: { x: number; y: number; w: number; h: number }
) {
  const { x, y, w, h } = cropPx;

  const cropped = document.createElement("canvas");
  cropped.width = Math.max(1, Math.floor(w));
  cropped.height = Math.max(1, Math.floor(h));
  const cctx = cropped.getContext("2d")!;
  cctx.drawImage(sourceCanvas, x, y, w, h, 0, 0, cropped.width, cropped.height);

  const sprite = document.createElement("canvas");
  sprite.width = AVATAR_ASSET_SIZE;
  sprite.height = AVATAR_ASSET_SIZE;
  const sctx = sprite.getContext("2d")!;

  // Transparent background by default; we preserve ALL pixels inside the crop.
  const maxSize = AVATAR_ASSET_SIZE * 0.92;
  const scale = Math.min(maxSize / cropped.width, maxSize / cropped.height);
  const drawW = cropped.width * scale;
  const drawH = cropped.height * scale;
  const dx = (AVATAR_ASSET_SIZE - drawW) / 2;
  const dy = (AVATAR_ASSET_SIZE - drawH) / 2;

  sctx.drawImage(cropped, dx, dy, drawW, drawH);

  return { cropped, sprite, spriteScale: scale, crop: { x, y, w, h } };
}

function bboxFromManualCrop(bitmapW: number, bitmapH: number, rect: CropRect): DetectedBBox {
  const x = clamp(Math.round(rect.x * bitmapW), 0, bitmapW - 1);
  const y = clamp(Math.round(rect.y * bitmapH), 0, bitmapH - 1);
  const w = clamp(Math.round(rect.w * bitmapW), 1, bitmapW - x);
  const h = clamp(Math.round(rect.h * bitmapH), 1, bitmapH - y);
  return { x, y, w, h };
}

export async function processClothingFile(
  file: File,
  options?: {
    manualCrop?: CropRect | null;
    onProgress?: (status: string) => void;
  }
): Promise<{
  assetBlob: Blob;
  assetDataUrl: string;
  detectedBBox: DetectedBBox;
  debug: ClothingDebugViews;
}>
{
  const onProgress = options?.onProgress;

  onProgress?.("Decoding image...");
  const bitmap = await createImageBitmap(file);

  // Full-resolution working canvas (we are NOT masking, only cropping)
  const full = document.createElement("canvas");
  full.width = bitmap.width;
  full.height = bitmap.height;
  const fctx = full.getContext("2d")!;
  fctx.drawImage(bitmap, 0, 0);

  const originalDataUrl = canvasToDataURL(full, "image/png");

  // Determine crop bbox
  let bbox: DetectedBBox;

  if (options?.manualCrop) {
    bbox = bboxFromManualCrop(bitmap.width, bitmap.height, options.manualCrop);
  } else {
    onProgress?.("Auto-cropping...");

    // Edge detection on a downscaled canvas for speed
    const { width: dw, height: dh, scale: downScale } = fitWithinMaxDim(
      bitmap.width,
      bitmap.height,
      EDGE_DETECT_MAX_DIM
    );

    const det = document.createElement("canvas");
    det.width = dw;
    det.height = dh;
    const dctx = det.getContext("2d")!;
    dctx.drawImage(bitmap, 0, 0, dw, dh);

    const img = dctx.getImageData(0, 0, dw, dh);
    const { bbox: bb, edgeCount } = computeSobelEdgesBBox(img);

    if (!bb) {
      // Fallback: no auto-crop (use full image)
      bbox = { x: 0, y: 0, w: bitmap.width, h: bitmap.height };
    } else {
      const padded = padBBox(bb, dw, dh, 8);
      // Map back to full resolution
      bbox = {
        x: Math.round(padded.x / downScale),
        y: Math.round(padded.y / downScale),
        w: Math.round(padded.w / downScale),
        h: Math.round(padded.h / downScale),
      };

      // Clamp to bounds
      bbox.x = clamp(bbox.x, 0, bitmap.width - 1);
      bbox.y = clamp(bbox.y, 0, bitmap.height - 1);
      bbox.w = clamp(bbox.w, 1, bitmap.width - bbox.x);
      bbox.h = clamp(bbox.h, 1, bitmap.height - bbox.y);

      // If edge bbox is suspiciously small, fallback to full
      const areaRatio = (bbox.w * bbox.h) / (bitmap.width * bitmap.height);
      if (areaRatio < 0.06 || edgeCount < 120) {
        bbox = { x: 0, y: 0, w: bitmap.width, h: bitmap.height };
      }
    }
  }

  // Create sprite (no masking)
  onProgress?.("Preparing sprite...");
  const { sprite } = cropAndNormalizeToSprite(full, bbox);

  // Debug: bbox preview
  const bboxPreview = document.createElement("canvas");
  bboxPreview.width = full.width;
  bboxPreview.height = full.height;
  const bctx = bboxPreview.getContext("2d")!;
  bctx.drawImage(full, 0, 0);
  bctx.strokeStyle = "rgba(255,0,0,0.9)";
  bctx.lineWidth = Math.max(2, Math.round(Math.min(full.width, full.height) * 0.002));
  bctx.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h);

  const bboxPreviewDataUrl = canvasToDataURL(bboxPreview, "image/png");
  const spriteDataUrl = canvasToDataURL(sprite, "image/png");

  const assetBlob = await new Promise<Blob>((resolve, reject) => {
    sprite.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG export failed"))), "image/png", 1.0);
  });

  const assetDataUrl = await blobToBase64(assetBlob);

  return {
    assetBlob,
    assetDataUrl,
    detectedBBox: bbox,
    debug: {
      originalDataUrl,
      bboxPreviewDataUrl,
      spriteDataUrl,
    },
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
