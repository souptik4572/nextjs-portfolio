"use client";

import { useState, useEffect } from "react";
import {
  getSection,
  updateEntry,
  deleteEntry as dbDeleteEntry,
  nextKey,
} from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import type { AchievementEntry } from "@/types/portfolio";

const BLANK: AchievementEntry = {
  title: "",
  date: "",
  description: "",
};

export function useAchievements() {
  const [entries, setEntries] = useState<Record<string, AchievementEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getSection("achievements")
      .then(setEntries)
      .catch((err: unknown) => {
        logger.error("Failed to load achievements", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function save(key: string, data: AchievementEntry): Promise<void> {
    await updateEntry("achievements", key, data);
    setEntries((prev) => ({ ...prev, [key]: data }));
  }

  async function addEntry(): Promise<string> {
    const key = nextKey(entries, "ach");
    const blank = { ...BLANK };
    await updateEntry("achievements", key, blank);
    setEntries((prev) => ({ ...prev, [key]: blank }));
    return key;
  }

  async function deleteEntry(key: string): Promise<void> {
    await dbDeleteEntry("achievements", key);
    setEntries((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  return { entries, isLoading, error, save, addEntry, deleteEntry };
}
