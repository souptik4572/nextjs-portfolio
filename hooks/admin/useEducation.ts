"use client";

import { useState, useEffect } from "react";
import {
  getSection,
  updateEntry,
  deleteEntry as dbDeleteEntry,
  nextKey,
} from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import type { EducationEntry } from "@/types/portfolio";

const BLANK: EducationEntry = {
  institution: "",
  degree: "",
  period: "",
  gpa: "",
};

export function useEducation() {
  const [entries, setEntries] = useState<Record<string, EducationEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getSection("education")
      .then(setEntries)
      .catch((err: unknown) => {
        logger.error("Failed to load education", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function save(key: string, data: EducationEntry): Promise<void> {
    await updateEntry("education", key, data);
    setEntries((prev) => ({ ...prev, [key]: data }));
  }

  async function addEntry(): Promise<string> {
    const key = nextKey(entries, "edu");
    const blank = { ...BLANK };
    await updateEntry("education", key, blank);
    setEntries((prev) => ({ ...prev, [key]: blank }));
    return key;
  }

  async function deleteEntry(key: string): Promise<void> {
    await dbDeleteEntry("education", key);
    setEntries((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  return { entries, isLoading, error, save, addEntry, deleteEntry };
}
