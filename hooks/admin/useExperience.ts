"use client";

import { useState, useEffect } from "react";
import {
  getSection,
  updateEntry,
  deleteEntry as dbDeleteEntry,
  nextKey,
} from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import type { ExperienceEntry } from "@/types/portfolio";

const BLANK: ExperienceEntry = {
  company: "",
  companyLogo: "",
  companyWebsite: "",
  role: "",
  period: "",
  location: "",
  highlights: [],
};

export function useExperience() {
  const [entries, setEntries] = useState<Record<string, ExperienceEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getSection("experience")
      .then(setEntries)
      .catch((err: unknown) => {
        logger.error("Failed to load experience", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function save(key: string, data: ExperienceEntry): Promise<void> {
    await updateEntry("experience", key, data);
    setEntries((prev) => ({ ...prev, [key]: data }));
  }

  async function addEntry(): Promise<string> {
    const key = nextKey(entries, "exp");
    const blank = { ...BLANK };
    await updateEntry("experience", key, blank);
    setEntries((prev) => ({ ...prev, [key]: blank }));
    return key;
  }

  async function deleteEntry(key: string): Promise<void> {
    await dbDeleteEntry("experience", key);
    setEntries((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  return { entries, isLoading, error, save, addEntry, deleteEntry };
}
