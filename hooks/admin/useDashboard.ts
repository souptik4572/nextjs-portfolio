"use client";

import { useState, useEffect } from "react";
import { getPortfolioData } from "@/lib/admin/db";
import { logger } from "@/lib/admin/logger";
import type { PortfolioData } from "@/types/portfolio";

export interface DashboardStats {
  experience: number;
  projects: number;
  achievements: number;
  education: number;
  notableOffers: number;
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getPortfolioData()
      .then((data: PortfolioData) => {
        setStats({
          experience: Object.keys(data.experience ?? {}).length,
          projects: Object.keys(data.projects ?? {}).length,
          achievements: Object.keys(data.achievements ?? {}).length,
          education: Object.keys(data.education ?? {}).length,
          notableOffers: Object.keys(data.notable_offers ?? {}).length,
        });
      })
      .catch((err: unknown) => {
        logger.error("Failed to load dashboard data", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading, error };
}
