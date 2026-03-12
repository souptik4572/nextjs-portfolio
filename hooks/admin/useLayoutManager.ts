"use client";

import { useState, useEffect } from "react";
import { getSection, updateSection } from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import type { LayoutConfig, SectionOrder } from "@/types/portfolio";

export function useLayoutManager() {
  const [data, setData] = useState<LayoutConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getSection("layout")
      .then((raw) => {
        // Normalise legacy formats: ensure section_order is Record<string, SectionOrder>
        const rawOrder = (raw as LayoutConfig).section_order;
        if (!rawOrder || Array.isArray(rawOrder)) {
          setData({ section_order: {} });
          return;
        }
        const firstVal = Object.values(rawOrder)[0];
        if (typeof firstVal === "boolean") {
          // Legacy boolean map
          const normalised: Record<string, SectionOrder> = {};
          let order = 1;
          for (const [k, v] of Object.entries(rawOrder)) {
            normalised[k] = { enabled: Boolean(v), order: order++ };
          }
          setData({ section_order: normalised });
        } else {
          setData(raw as LayoutConfig);
        }
      })
      .catch((err: unknown) => {
        logger.error("Failed to load layout", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function save(updated: LayoutConfig): Promise<void> {
    await updateSection("layout", updated);
    setData(updated);
  }

  return { data, isLoading, error, save };
}
