import { useEffect, useMemo, useState } from "react";
import { AvatarContainer } from "@/components/AvatarContainer";
import type { ClothingCategory } from "@/types/clothing";
import type { WardrobeItem } from "@/data/wardrobeData";
import { trimTransparentPng } from "@/lib/trimTransparentPng";

interface AvatarContainerTrimmedProps {
  selectedItems: Partial<Record<ClothingCategory, WardrobeItem | null>>;
  className?: string;
}

export function AvatarContainerTrimmed({ selectedItems, className }: AvatarContainerTrimmedProps) {
  const [trimmedSrcById, setTrimmedSrcById] = useState<Record<string, string>>({});

  const items = useMemo(() => {
    return Object.values(selectedItems).filter(Boolean) as WardrobeItem[];
  }, [selectedItems]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Only process currently visible layers (max 3)
      const updates: Record<string, string> = {};
      await Promise.all(
        items.map(async (it) => {
          try {
            const trimmed = await trimTransparentPng(it.src, { alphaThreshold: 12, padPct: 0.035, maxDim: 1024 });
            updates[it.id] = trimmed;
          } catch {
            // ignore; fall back to original
          }
        })
      );

      if (!cancelled && Object.keys(updates).length) {
        setTrimmedSrcById((prev) => ({ ...prev, ...updates }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [items]);

  const patchedSelectedItems = useMemo(() => {
    const next: Partial<Record<ClothingCategory, WardrobeItem | null>> = {};
    (Object.keys(selectedItems) as ClothingCategory[]).forEach((cat) => {
      const item = selectedItems[cat];
      if (!item) {
        next[cat] = item;
        return;
      }

      next[cat] = {
        ...item,
        src: trimmedSrcById[item.id] ?? item.src,
      };
    });
    return next;
  }, [selectedItems, trimmedSrcById]);

  return <AvatarContainer selectedItems={patchedSelectedItems} className={className} />;
}
