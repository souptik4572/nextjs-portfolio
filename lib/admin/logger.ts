/**
 * Dev-only logger. In production, all calls are no-ops.
 * Use this instead of console.log throughout the admin portal.
 */

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log("[admin]", ...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn("[admin]", ...args);
  },
  error: (...args: unknown[]) => {
    if (isDev) console.error("[admin]", ...args);
  },
};
