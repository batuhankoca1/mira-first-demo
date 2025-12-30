import { pipeline, env } from "@huggingface/transformers";

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_DIM = 512;

function scaleImage(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
) {
  let w = image.naturalWidth;
  let h = image.naturalHeight;

  if (w > MAX_DIM || h > MAX_DIM) {
    const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }

  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(image, 0, 0, w, h);
}

export async function removeBackgroundBrowser(imageElement: HTMLImageElement): Promise<Blob> {
  console.log("[BgRemove] starting...");

  const segmenter = await pipeline(
    "image-segmentation",
    "Xenova/segformer-b0-finetuned-ade-512-512",
    { device: "webgpu" }
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  scaleImage(canvas, ctx, imageElement);

  const base64 = canvas.toDataURL("image/jpeg", 0.85);

  const result = await segmenter(base64);

  if (!result || !Array.isArray(result) || !result[0]?.mask) {
    throw new Error("No segmentation mask");
  }

  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const octx = out.getContext("2d")!;
  octx.drawImage(canvas, 0, 0);

  const imgData = octx.getImageData(0, 0, out.width, out.height);
  const data = imgData.data;

  const maskData = result[0].mask.data as unknown as ArrayLike<number>;
  const len = Math.min(maskData.length, data.length / 4);
  for (let i = 0; i < len; i++) {
    // invert: 1 -> keep (subject), 0 -> remove
    const alpha = Math.round((1 - maskData[i]) * 255);
    data[i * 4 + 3] = alpha;
  }

  octx.putImageData(imgData, 0, 0);

  return new Promise((resolve, reject) =>
    out.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png",
      1
    )
  );
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}
