"use client";

import { useState, useEffect } from "react";
import {
  getSection,
  updateEntry,
  deleteEntry as dbDeleteEntry,
  nextKey,
} from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import { DEFAULT_IMPACT_STATS } from "@/lib/data";
import type { ImpactStat } from "@/types/portfolio";

const BLANK: ImpactStat = {
  value: "",
  suffix: "",
  label: "",
};

export function useImpact() {
  const [entries, setEntries] = useState<Record<string, ImpactStat>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getSection("impact")
      .then((raw) => setEntries((raw as Record<string, ImpactStat>) ?? {}))
      .catch((err: unknown) => {
        // The `impact` node is new and may not exist yet — that's an empty
        // editor, not an error. Only surface unexpected failures.
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes("not found")) {
          setEntries({});
        } else {
          logger.error("Failed to load impact", err);
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function save(key: string, data: ImpactStat): Promise<void> {
    await updateEntry("impact", key, data);
    setEntries((prev) => ({ ...prev, [key]: data }));
  }

  async function addEntry(stat: ImpactStat = BLANK): Promise<string> {
    const key = nextKey(entries, "impact");
    const next: ImpactStat = { ...stat };
    await updateEntry("impact", key, next);
    setEntries((prev) => ({ ...prev, [key]: next }));
    return key;
  }

  /** Seed the four design-default stats in one go (used from the empty state). */
  async function seedDefaults(): Promise<void> {
    let existing = { ...entries };
    for (const stat of DEFAULT_IMPACT_STATS) {
      const key = nextKey(existing, "impact");
      await updateEntry("impact", key, stat);
      existing = { ...existing, [key]: stat };
    }
    setEntries(existing);
  }

  async function deleteEntry(key: string): Promise<void> {
    await dbDeleteEntry("impact", key);
    setEntries((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  return { entries, isLoading, error, save, addEntry, seedDefaults, deleteEntry };
}
