"use client";

import { useState, useEffect } from "react";
import { getSection, updateSection } from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import type { PersonalConfig } from "@/types/portfolio";

export function usePersonal() {
  const [data, setData] = useState<PersonalConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getSection("personal")
      .then(setData)
      .catch((err: unknown) => {
        logger.error("Failed to load personal", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function save(updated: PersonalConfig): Promise<void> {
    await updateSection("personal", updated);
    setData(updated);
  }

  return { data, isLoading, error, save };
}
