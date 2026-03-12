/**
 * Diff computation for the admin portal's save-review flow.
 * Compares two plain objects and returns a flat list of changed fields.
 */

export type DiffType = "changed" | "added" | "removed";

export interface DiffEntry {
  /** Dot-separated path, e.g. "highlights.2" */
  path: string;
  /** Human-readable label derived from the path */
  label: string;
  before: unknown;
  after: unknown;
  type: DiffType;
}

/** Convert camelCase / snake_case key to a readable label. */
export function toLabel(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

/** Render a single value for display in the diff modal. */
export function renderValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    if (value.length === 0) return "( empty )";
    const preview = value.slice(0, 3).map(String).join(", ");
    return value.length > 3 ? `${preview} … +${value.length - 3} more` : preview;
  }
  const str = String(value).trim();
  if (str.length === 0) return "( empty )";
  return str.length > 90 ? str.slice(0, 90) + "…" : str;
}

/** Returns added items in `after` that are not in `before`. */
function arrayDelta(before: string[], after: string[]): { added: string[]; removed: string[] } {
  const bSet = new Set(before);
  const aSet = new Set(after);
  return {
    added: after.filter((x) => !bSet.has(x)),
    removed: before.filter((x) => !aSet.has(x)),
  };
}

/** Deep equality check (handles primitives, arrays of primitives, plain objects). */
function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => isEqual(v, b[i]));
  }
  if (typeof a === "object" && typeof b === "object" && a !== null && b !== null) {
    const ka = Object.keys(a as object);
    const kb = Object.keys(b as object);
    if (ka.length !== kb.length) return false;
    return ka.every((k) =>
      isEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
    );
  }
  return false;
}

/**
 * Compute a flat diff between two plain objects (one level deep).
 * Arrays of strings get special treatment to show added/removed items.
 */
export function computeDiff(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): DiffEntry[] {
  const entries: DiffEntry[] = [];

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    const bVal = before[key];
    const aVal = after[key];

    if (isEqual(bVal, aVal)) continue;

    const label = toLabel(key);

    if (
      Array.isArray(bVal) &&
      Array.isArray(aVal) &&
      bVal.every((v) => typeof v === "string") &&
      aVal.every((v) => typeof v === "string")
    ) {
      // For string arrays, emit one top-level entry summarising the change
      entries.push({ path: key, label, before: bVal, after: aVal, type: "changed" });
    } else if (bVal === undefined) {
      entries.push({ path: key, label, before: bVal, after: aVal, type: "added" });
    } else if (aVal === undefined) {
      entries.push({ path: key, label, before: bVal, after: aVal, type: "removed" });
    } else {
      entries.push({ path: key, label, before: bVal, after: aVal, type: "changed" });
    }
  }

  return entries;
}

/** For string-array fields, compute the item-level delta for display. */
export function getArrayDelta(
  before: unknown,
  after: unknown,
): { added: string[]; removed: string[] } | null {
  if (
    Array.isArray(before) &&
    Array.isArray(after) &&
    before.every((v) => typeof v === "string") &&
    after.every((v) => typeof v === "string")
  ) {
    return arrayDelta(before as string[], after as string[]);
  }
  return null;
}
