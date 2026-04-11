"use client";

import { useState, useEffect } from "react";
import { getSection, updateSection } from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import type { SkillsConfig } from "@/types/portfolio";

export function useSkills() {
  const [data, setData] = useState<SkillsConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getSection("skills")
      .then((raw) => {
        // Firebase may return skills as Record<string, SkillGroup> — cast accordingly
        setData(raw as SkillsConfig);
      })
      .catch((err: unknown) => {
        logger.error("Failed to load skills", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function save(updated: SkillsConfig): Promise<void> {
    await updateSection("skills", updated as SkillsConfig);
    setData(updated);
  }

  return { data, isLoading, error, save };
}
