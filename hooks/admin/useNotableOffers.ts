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
    await updateEntry("notable_offers", key, data);
    setEntries((prev) => ({ ...prev, [key]: data }));
  }

  async function addEntry(): Promise<string> {
    const key = nextKey(entries, "offer");
    const blank = { ...BLANK };
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

  return { entries, isLoading, error, save, addEntry, deleteEntry };
}
