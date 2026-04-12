"use client";

/**
 * AdminShellContext — decouples page-level title/actions from the persistent
 * chrome (sidebar + topbar) rendered once in the admin layout.
 *
 * ## Why three separate contexts?
 *
 * We need to prevent every possible re-render loop. The rule is:
 *   - A component must never trigger a state update that causes itself
 *     to re-render, forming a cycle.
 *
 * The previous "store actions as state" approach caused:
 *   setActions() → Provider state update → subtree re-render →
 *   AdminShell re-renders → useEffect fires → setActions() → ∞
 *
 * ## Solution: portal-based actions
 *
 * Instead of storing the actions ReactNode in context state, AdminTopBar
 * renders a plain <div> slot and registers it via a callback ref. AdminShell
 * uses ReactDOM.createPortal to render actions directly into that div.
 *
 * The portal is part of AdminShell's React subtree, so page state changes
 * (e.g. a Save button going idle→saving→success) reach it via normal React
 * re-renders — no context state update is ever needed for actions.
 *
 * ## Context split
 *
 * AdminShellTitleCtx   — string title.  AdminTopBar subscribes.
 * AdminShellSlotCtx    — HTMLElement | null (the actions slot div).
 *                        AdminShell subscribes; changes only once on mount.
 * AdminShellSettersCtx — { setTitle, registerActionsSlot }.
 *                        Stable useCallback refs; AdminShell + AdminTopBar
 *                        subscribe for setters only, never re-render from them.
 *
 * Cross-checking for loops:
 *  • setTitle() → TitleCtx changes → AdminTopBar re-renders (reads title).
 *    AdminShell does NOT consume TitleCtx → does not re-render. ✓
 *  • registerActionsSlot(el) called once on TopBar mount → SlotCtx changes →
 *    AdminShell re-renders → portals actions. useEffect([title]) fires but
 *    title is unchanged → setTitle guard returns prev → no state update. ✓
 *  • Page state change (e.g. saveStatus) → AdminShell re-renders →
 *    portal re-renders with new actions → zero context updates. ✓
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// ── Contexts ──────────────────────────────────────────────────────────────────

const AdminShellTitleCtx = createContext<string>("");

const AdminShellSlotCtx = createContext<HTMLElement | null>(null);

interface AdminShellSetters {
  setTitle: (t: string) => void;
  registerActionsSlot: (el: HTMLElement | null) => void;
}

const AdminShellSettersCtx = createContext<AdminShellSetters>({
  setTitle: () => {},
  registerActionsSlot: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function AdminShellProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState("");
  const [actionsSlot, setActionsSlot] = useState<HTMLElement | null>(null);

  const setTitle = useCallback((t: string) => {
    // Guard: skip setState when value hasn't changed — prevents consumers that
    // read SlotCtx from re-rendering just because title synced.
    setTitleState((prev) => (prev === t ? prev : t));
  }, []);

  const registerActionsSlot = useCallback((el: HTMLElement | null) => {
    setActionsSlot(el);
  }, []);

  // Memoize setters object so AdminShellSettersCtx value reference is stable —
  // its consumers never re-render solely because the provider re-rendered.
  const setters = useMemo(
    () => ({ setTitle, registerActionsSlot }),
    [setTitle, registerActionsSlot],
  );

  return (
    <AdminShellSettersCtx.Provider value={setters}>
      <AdminShellTitleCtx.Provider value={title}>
        <AdminShellSlotCtx.Provider value={actionsSlot}>
          {children}
        </AdminShellSlotCtx.Provider>
      </AdminShellTitleCtx.Provider>
    </AdminShellSettersCtx.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Current page title. Consumed by AdminTopBar. */
export function useAdminShellTitle() {
  return useContext(AdminShellTitleCtx);
}

/** The actions slot HTMLElement. Consumed by AdminShell to portal into. */
export function useAdminShellSlot() {
  return useContext(AdminShellSlotCtx);
}

/** Stable setter functions. Consumed by AdminShell + AdminTopBar. */
export function useAdminShellSetters() {
  return useContext(AdminShellSettersCtx);
}
