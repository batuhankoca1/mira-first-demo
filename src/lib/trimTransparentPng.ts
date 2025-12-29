import { useEffect, useMemo, useState } from "react";

const cache = new Map<string, string>();

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image failed to load: ${src}`));
    img.src = src;
  });
}

export async function trimTransparentPng(
  src: string,
  options?: {
    alphaThreshold?: number;
    padPct?: number;
    maxDim?: number;
  }
): Promise<string> {
  const cached = cache.get(src);
  if (cached) return cached;

  const alphaThreshold = options?.alphaThreshold ?? 10;
  const padPct = options?.padPct ?? 0.04;
  const maxDim = options?.maxDim ?? 1024;

  const img = await loadImage(src);

  // Draw (optionally downscale) into a working canvas.
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.min(1, maxDim / Math.max(iw, ih));
  const w = Math.max(1, Math.round(iw * scale));
  const h = Math.max(1, Math.round(ih * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2D context");

  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = data[(y * w + x) * 4 + 3];
      if (a > alphaThreshold) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  // If fully transparent or couldn't detect, return original.
  if (!found) {
    cache.set(src, src);
    return src;
  }

  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const pad = Math.round(Math.max(bw, bh) * padPct);

  const sx = Math.max(0, minX - pad);
  const sy = Math.max(0, minY - pad);
  const sw = Math.min(w - sx, bw + pad * 2);
  const sh = Math.min(h - sy, bh + pad * 2);

  const out = document.createElement("canvas");
  out.width = sw;
  out.height = sh;
  const octx = out.getContext("2d");
  if (!octx) throw new Error("No 2D context (out) ");

  octx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
  const trimmed = out.toDataURL("image/png");

  cache.set(src, trimmed);
  return trimmed;
}
