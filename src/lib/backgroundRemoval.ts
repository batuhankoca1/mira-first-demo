import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 512;
const AVATAR_ASSET_SIZE = 400; // Standard size for avatar wearables

let segmenterInstance: any = null;

async function getSegmenter() {
  if (!segmenterInstance) {
    console.log('Loading segmentation model...');
    segmenterInstance = await pipeline(
      'image-segmentation',
      'Xenova/segformer-b0-finetuned-ade-512-512',
      { device: 'webgpu' }
    );
    console.log('Segmentation model loaded');
  }
  return segmenterInstance;
}

function resizeImageIfNeeded(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement
) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
}

function trimTransparentPixels(canvas: HTMLCanvasElement): { 
  trimmedCanvas: HTMLCanvasElement; 
  bounds: { x: number; y: number; width: number; height: number } 
} {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > 10) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  
  const padding = 10;
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(canvas.width - 1, maxX + padding);
  maxY = Math.min(canvas.height - 1, maxY + padding);
  
  const trimmedWidth = maxX - minX + 1;
  const trimmedHeight = maxY - minY + 1;
  
  const trimmedCanvas = document.createElement('canvas');
  trimmedCanvas.width = trimmedWidth;
  trimmedCanvas.height = trimmedHeight;
  const trimmedCtx = trimmedCanvas.getContext('2d')!;
  
  trimmedCtx.drawImage(
    canvas,
    minX, minY, trimmedWidth, trimmedHeight,
    0, 0, trimmedWidth, trimmedHeight
  );
  
  return { 
    trimmedCanvas, 
    bounds: { x: minX, y: minY, width: trimmedWidth, height: trimmedHeight } 
  };
}

function centerAndResizeForAvatar(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const { trimmedCanvas } = trimTransparentPixels(canvas);
  
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = AVATAR_ASSET_SIZE;
  outputCanvas.height = AVATAR_ASSET_SIZE;
  const outputCtx = outputCanvas.getContext('2d')!;
  
  // Calculate scale to fit within avatar asset size with padding
  const maxSize = AVATAR_ASSET_SIZE * 0.9;
  const scale = Math.min(
    maxSize / trimmedCanvas.width,
    maxSize / trimmedCanvas.height
  );
  
  const scaledWidth = trimmedCanvas.width * scale;
  const scaledHeight = trimmedCanvas.height * scale;
  
  // Center the item
  const x = (AVATAR_ASSET_SIZE - scaledWidth) / 2;
  const y = (AVATAR_ASSET_SIZE - scaledHeight) / 2;
  
  outputCtx.drawImage(trimmedCanvas, x, y, scaledWidth, scaledHeight);
  
  return outputCanvas;
}

export async function processClothingImage(
  imageElement: HTMLImageElement,
  onProgress?: (status: string) => void
): Promise<Blob> {
  try {
    onProgress?.('Model yükleniyor...');
    const segmenter = await getSegmenter();
    
    // Create canvas from image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    resizeImageIfNeeded(canvas, ctx, imageElement);
    
    onProgress?.('Arka plan temizleniyor...');
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    const result = await segmenter(imageData);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Segmentation failed');
    }
    
    // Apply mask
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    outputCtx.drawImage(canvas, 0, 0);
    
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    // Invert mask to keep subject
    for (let i = 0; i < result[0].mask.data.length; i++) {
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
    onProgress?.('Avatar için hazırlanıyor...');
    
    // Center and resize for avatar use
    const avatarReadyCanvas = centerAndResizeForAvatar(outputCanvas);
    
    return new Promise((resolve, reject) => {
      avatarReadyCanvas.toBlob(
        (blob) => {
          if (blob) {
            onProgress?.('Hazır!');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error processing clothing image:', error);
    throw error;
  }
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
