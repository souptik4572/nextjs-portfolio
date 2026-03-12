/**
 * Admin-specific UI types.
 * These types are only used by the admin portal, never by portfolio pages.
 */

export type SaveStatus = "idle" | "saving" | "success" | "error";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string; // Lucide icon name
}

export interface EntryMeta {
  key: string;
  isDirty: boolean;
  isExpanded: boolean;
}
