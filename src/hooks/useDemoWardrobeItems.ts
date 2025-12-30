import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ClothingCategory } from "@/types/clothing";
import type { WardrobeItem } from "@/data/wardrobeData";
import { removeBackgroundBrowser, loadImageFromUrl } from "@/lib/removeBackgroundBrowser";

const LS_KEY = "demo-cutouts-v5"; // bumped for in-browser segmenter

type CutoutMap = Record<string, string>; // id -> public URL

const DEMO_SOURCES: Array<{ id: string; category: ClothingCategory; sourceSrc: string }> = [
  { id: "top-1", category: "tops", sourceSrc: "/demo-items/tops/top1-cut.png" },
  { id: "top-2", category: "tops", sourceSrc: "/demo-items/tops/top2-cut.png" },
  { id: "top-3", category: "tops", sourceSrc: "/demo-items/tops/top3-cut.png" },
  { id: "top-4", category: "tops", sourceSrc: "/demo-items/tops/top4-cut.png" },

  { id: "bottom-1", category: "bottoms", sourceSrc: "/demo-items/bottoms/bottom1-cut.png" },
  { id: "bottom-2", category: "bottoms", sourceSrc: "/demo-items/bottoms/bottom2-cut.png" },
  { id: "bottom-3", category: "bottoms", sourceSrc: "/demo-items/bottoms/bottom3-cut.png" },
  { id: "bottom-4", category: "bottoms", sourceSrc: "/demo-items/bottoms/bottom4-cut.png" },

  { id: "bag-1", category: "bags", sourceSrc: "/demo-items/bags/bag1-cut.png" },
  { id: "bag-2", category: "bags", sourceSrc: "/demo-items/bags/bag2-cut.png" },
  { id: "bag-3", category: "bags", sourceSrc: "/demo-items/bags/bag3-cut.png" },
  { id: "bag-4", category: "bags", sourceSrc: "/demo-items/bags/bag4-cut.png" },
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

async function ensureOneCutout(it: (typeof DEMO_SOURCES)[number], existingUrl?: string): Promise<string> {
  if (existingUrl) return existingUrl;

  // 1) Fetch source image from public folder
  const img = await loadImageFromUrl(it.sourceSrc);

  // 2) Remove background in browser (real alpha)
  const blob = await removeBackgroundBrowser(img);

  // 3) Upload to public storage
  const filePath = `demo/${it.id}.png`;
  const { error: upErr } = await supabase.storage
    .from("clothing-items")
    .upload(filePath, blob, { contentType: "image/png", upsert: true, cacheControl: "3600" });
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
      const missing = DEMO_SOURCES.filter((s) => !map[s.id]);
      if (!missing.length) return;

      setIsProcessing(true);
      try {
        const next = { ...map };
        // Sequential on purpose to avoid overloading.
        for (const src of missing) {
          if (cancelled) break;
          console.log("[DemoCutouts] Processing", src.id);
          const url = await ensureOneCutout(src, next[src.id]);
          next[src.id] = url;
          setMap({ ...next });
          writeMap(next);
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
