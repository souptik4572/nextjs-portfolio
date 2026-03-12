"use client";

import { useState, useEffect } from "react";
import {
  getSection,
  updateEntry,
  deleteEntry as dbDeleteEntry,
  nextKey,
} from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import type { ProjectEntry } from "@/types/portfolio";

const BLANK: ProjectEntry = {
  title: "",
  tech: [],
  description: "",
  github: "",
  live: "",
};

export function useProjects() {
  const [entries, setEntries] = useState<Record<string, ProjectEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getSection("projects")
      .then(setEntries)
      .catch((err: unknown) => {
        logger.error("Failed to load projects", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function save(key: string, data: ProjectEntry): Promise<void> {
    await updateEntry("projects", key, data);
    setEntries((prev) => ({ ...prev, [key]: data }));
  }

  async function addEntry(): Promise<string> {
    const key = nextKey(entries, "proj");
    const blank = { ...BLANK };
    await updateEntry("projects", key, blank);
    setEntries((prev) => ({ ...prev, [key]: blank }));
    return key;
  }

  async function deleteEntry(key: string): Promise<void> {
    await dbDeleteEntry("projects", key);
    setEntries((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  return { entries, isLoading, error, save, addEntry, deleteEntry };
}
