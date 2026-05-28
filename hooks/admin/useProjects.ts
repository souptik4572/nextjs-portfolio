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
    // Preserve any existing order field if the form payload doesn't carry one.
    const merged: ProjectEntry = {
      ...data,
      order: data.order ?? entries[key]?.order,
    };
    await updateEntry("projects", key, merged);
    setEntries((prev) => ({ ...prev, [key]: merged }));
  }

  async function addEntry(): Promise<string> {
    const key = nextKey(entries, "proj");
    const maxOrder = Object.values(entries).reduce(
      (max, e) => Math.max(max, e.order ?? 0),
      0,
    );
    const blank: ProjectEntry = { ...BLANK, order: maxOrder + 1 };
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

  /**
   * Write a new display order to every entry, derived from `orderedKeys`.
   * Position N (0-based) becomes `order: N + 1`. Entries missing from the
   * array are left untouched.
   */
  async function saveOrder(orderedKeys: string[]): Promise<void> {
    const updates: Array<{ key: string; entry: ProjectEntry }> = [];
    orderedKeys.forEach((key, idx) => {
      const existing = entries[key];
      if (!existing) return;
      const nextOrder = idx + 1;
      if (existing.order === nextOrder) return;
      updates.push({ key, entry: { ...existing, order: nextOrder } });
    });

    await Promise.all(updates.map((u) => updateEntry("projects", u.key, u.entry)));

    setEntries((prev) => {
      const next = { ...prev };
      for (const u of updates) next[u.key] = u.entry;
      return next;
    });
  }

  return { entries, isLoading, error, save, addEntry, deleteEntry, saveOrder };
}
