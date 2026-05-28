"use client";

import { useState, useEffect } from "react";
import {
  getSection,
  updateEntry,
  deleteEntry as dbDeleteEntry,
  nextKey,
} from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import type { NotableOffer } from "@/types/portfolio";

const BLANK: NotableOffer = {
  company: "",
  companyLogo: "",
  role: "",
  period: "",
  companyUrl: "",
  visible: true,
};

export function useNotableOffers() {
  const [entries, setEntries] = useState<Record<string, NotableOffer>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getSection("notable_offers")
      .then(setEntries)
      .catch((err: unknown) => {
        logger.error("Failed to load notable offers", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function save(key: string, data: NotableOffer): Promise<void> {
    // Preserve any existing order field if the form payload doesn't carry it
    // (the form doesn't surface the order field — ordering is managed separately).
    const merged: NotableOffer = {
      ...data,
      order: data.order ?? entries[key]?.order,
    };
    await updateEntry("notable_offers", key, merged);
    setEntries((prev) => ({ ...prev, [key]: merged }));
  }

  async function addEntry(): Promise<string> {
    const key = nextKey(entries, "offer");
    const maxOrder = Object.values(entries).reduce(
      (max, e) => Math.max(max, e.order ?? 0),
      0,
    );
    const blank: NotableOffer = { ...BLANK, order: maxOrder + 1 };
    await updateEntry("notable_offers", key, blank);
    setEntries((prev) => ({ ...prev, [key]: blank }));
    return key;
  }

  async function deleteEntry(key: string): Promise<void> {
    await dbDeleteEntry("notable_offers", key);
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
    const updates: Array<{ key: string; entry: NotableOffer }> = [];
    orderedKeys.forEach((key, idx) => {
      const existing = entries[key];
      if (!existing) return;
      const nextOrder = idx + 1;
      if (existing.order === nextOrder) return;
      updates.push({ key, entry: { ...existing, order: nextOrder } });
    });

    await Promise.all(updates.map((u) => updateEntry("notable_offers", u.key, u.entry)));

    setEntries((prev) => {
      const next = { ...prev };
      for (const u of updates) next[u.key] = u.entry;
      return next;
    });
  }

  return { entries, isLoading, error, save, addEntry, deleteEntry, saveOrder };
}
