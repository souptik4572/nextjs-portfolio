/**
 * Firebase Realtime Database helpers for the admin portal.
 * All RTDB read/write must go through this module.
 * No page, component, or hook may import from the Firebase SDK directly.
 */

import { ref, get, set, remove, update } from "firebase/database";
import { db } from "./firebase";
import type { PortfolioData } from "@/types/portfolio";

export async function getPortfolioData(): Promise<PortfolioData> {
  const snap = await get(ref(db, "/"));
  if (!snap.exists()) throw new Error("No portfolio data found in RTDB");
  return snap.val() as PortfolioData;
}

export async function getSection<K extends keyof PortfolioData>(
  section: K,
): Promise<PortfolioData[K]> {
  const snap = await get(ref(db, `/${String(section)}`));
  if (!snap.exists()) throw new Error(`Section "${String(section)}" not found`);
  return snap.val() as PortfolioData[K];
}

export async function updateSection<K extends keyof PortfolioData>(
  section: K,
  data: PortfolioData[K],
): Promise<void> {
  await set(ref(db, `/${String(section)}`), data);
}

export async function updateEntry(
  section: string,
  key: string,
  data: unknown,
): Promise<void> {
  await set(ref(db, `/${section}/${key}`), data);
}

export async function deleteEntry(section: string, key: string): Promise<void> {
  await remove(ref(db, `/${section}/${key}`));
}

export async function updatePath(path: string, data: unknown): Promise<void> {
  await update(ref(db, "/"), { [path]: data });
}

/** Generate a key like "exp-3" given existing keys and a prefix. */
export function nextKey(
  existing: Record<string, unknown>,
  prefix: string,
): string {
  const nums = Object.keys(existing)
    .map((k) => parseInt(k.replace(`${prefix}-`, ""), 10))
    .filter((n) => !isNaN(n) && n > 0);
  const next = nums.length === 0 ? 1 : Math.max(...nums) + 1;
  return `${prefix}-${next}`;
}
