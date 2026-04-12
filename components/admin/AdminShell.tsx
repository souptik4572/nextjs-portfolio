"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useAdminShellSetters, useAdminShellSlot } from "@/contexts/AdminShellContext";

interface AdminShellProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Thin page wrapper used by every admin page.
 *
 * Responsibilities:
 *   1. Sync the page title into AdminShellTitleCtx so AdminTopBar can display it.
 *   2. Portal action buttons (e.g. Save) directly into AdminTopBar's slot div —
 *      no context state is updated for actions, so there is no re-render loop.
 *   3. Render the desktop <h1> heading and page children.
 *
 * All existing page call-sites (<AdminShell title="…" actions={…}>) are
 * unchanged — full backward compatibility.
 */
export default function AdminShell({ title, actions, children }: AdminShellProps) {
  const { setTitle } = useAdminShellSetters();
  const actionsSlot = useAdminShellSlot();

  // Sync title — dep array ensures this only fires when title actually changes.
  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return (
    <>
      {/*
        Portal actions into the slot <div> that lives inside AdminTopBar.
        Because the portal is part of this component's React subtree, dynamic
        action state (Save button idle/saving/success) updates automatically
        via normal React re-renders — no setState calls, no loops.
      */}
      {actionsSlot && actions ? createPortal(actions, actionsSlot) : null}

      {/* Page heading — hidden on mobile (TopBar shows the title there) */}
      <h1 className="hidden lg:block text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-6 font-heading">
        {title}
      </h1>

      {children}
    </>
  );
}
