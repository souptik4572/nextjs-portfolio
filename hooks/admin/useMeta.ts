"use client";

import { useState, useEffect } from "react";
import { getSection, updateSection } from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import type { MetaConfig, TerminalConfig, ThemeConfig } from "@/types/portfolio";

export function useMeta() {
  const [meta, setMeta] = useState<MetaConfig | null>(null);
  const [terminal, setTerminal] = useState<TerminalConfig | null>(null);
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getSection("meta"),
      getSection("terminal"),
      getSection("theme"),
    ])
      .then(([m, t, th]) => {
        setMeta(m);
        setTerminal(t);
        setTheme(th);
      })
      .catch((err: unknown) => {
        logger.error("Failed to load meta/terminal/theme", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function saveMeta(updated: MetaConfig): Promise<void> {
    await updateSection("meta", updated);
    setMeta(updated);
  }

  async function saveTerminal(updated: TerminalConfig): Promise<void> {
    await updateSection("terminal", updated);
    setTerminal(updated);
  }

  async function saveTheme(updated: ThemeConfig): Promise<void> {
    await updateSection("theme", updated);
    setTheme(updated);
  }

  return { meta, terminal, theme, isLoading, error, saveMeta, saveTerminal, saveTheme };
}
