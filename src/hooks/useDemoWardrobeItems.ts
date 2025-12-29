import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ClothingCategory } from "@/types/clothing";
import type { WardrobeItem } from "@/data/wardrobeData";

const LS_KEY = "demo-cutouts-v3"; // bumped after RLS policy fix

type CutoutMap = Record<string, string>; // id -> public URL

const DEMO_SOURCES: Array<{ id: string; category: ClothingCategory; sourceSrc: string }> = [
  { id: "top-1", category: "tops", sourceSrc: "/demo-items/tops/top1-v2.png" },
  { id: "top-2", category: "tops", sourceSrc: "/demo-items/tops/top2-v2.png" },
  { id: "top-3", category: "tops", sourceSrc: "/demo-items/tops/top3-v2.png" },
  { id: "top-4", category: "tops", sourceSrc: "/demo-items/tops/top4-v2.png" },

  { id: "bottom-1", category: "bottoms", sourceSrc: "/demo-items/bottoms/bottom1-v2.png" },
  { id: "bottom-2", category: "bottoms", sourceSrc: "/demo-items/bottoms/bottom2-v2.png" },
  { id: "bottom-3", category: "bottoms", sourceSrc: "/demo-items/bottoms/bottom3-v2.png" },
  { id: "bottom-4", category: "bottoms", sourceSrc: "/demo-items/bottoms/bottom4-v2.png" },

  { id: "bag-1", category: "bags", sourceSrc: "/demo-items/bags/bag1-v2.png" },
  { id: "bag-2", category: "bags", sourceSrc: "/demo-items/bags/bag2-v2.png" },
  { id: "bag-3", category: "bags", sourceSrc: "/demo-items/bags/bag3-v2.png" },
  { id: "bag-4", category: "bags", sourceSrc: "/demo-items/bags/bag4-v2.png" },
];

function readMap(): CutoutMap {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as CutoutMap) : {};
  } catch {
    return {};
  }
}

function writeMap(next: CutoutMap) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, b64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] ?? "image/png";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function ensureOneCutout(it: (typeof DEMO_SOURCES)[number], existingUrl?: string): Promise<string> {
  if (existingUrl) return existingUrl;

  // 1) Fetch source image from public
  const res = await fetch(it.sourceSrc, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch source: ${it.sourceSrc}`);
  const blob = await res.blob();
  const imageBase64 = await blobToBase64(blob);

  // 2) Remove background (backend function)
  const { data, error } = await supabase.functions.invoke("remove-background", {
    body: { imageBase64, mimeType: blob.type || "image/jpeg" },
  });
  if (error) throw error;
  const processedDataUrl = (data as any)?.imageDataUrl as string | undefined;
  if (!processedDataUrl?.startsWith("data:image")) throw new Error("Invalid remove-background response");

  // 3) Upload to public storage
  const outBlob = dataUrlToBlob(processedDataUrl);
  const filePath = `demo/${it.id}.png`;
  const { error: upErr } = await supabase.storage
    .from("clothing-items")
    .upload(filePath, outBlob, { contentType: "image/png", upsert: true, cacheControl: "3600" });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from("clothing-items").getPublicUrl(filePath);
  if (!pub?.publicUrl) throw new Error("Failed to get public URL");
  return pub.publicUrl;
}

export function useDemoWardrobeItems(baseItems: WardrobeItem[]) {
  const [map, setMap] = useState<CutoutMap>(() => (typeof window === "undefined" ? {} : readMap()));
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Process lazily and only once per browser (cached in localStorage + storage bucket).
      const missing = DEMO_SOURCES.filter((s) => !map[s.id]);
      if (!missing.length) return;

      setIsProcessing(true);
      try {
        const next = { ...map };
        // Sequential on purpose to avoid overloading.
        for (const src of missing) {
          const url = await ensureOneCutout(src, next[src.id]);
          next[src.id] = url;
          if (!cancelled) {
            setMap({ ...next });
            writeMap(next);
          }
        }
      } catch (e) {
        console.warn("[DemoCutouts] Processing failed", e);
      } finally {
        if (!cancelled) setIsProcessing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolvedItems = useMemo(() => {
    return baseItems.map((it) => ({ ...it, src: map[it.id] ?? it.src }));
  }, [baseItems, map]);

  const getItemsByCategory = useMemo(() => {
    return (category: ClothingCategory) => resolvedItems.filter((i) => i.category === category);
  }, [resolvedItems]);

  return { items: resolvedItems, getItemsByCategory, isProcessing };
}
