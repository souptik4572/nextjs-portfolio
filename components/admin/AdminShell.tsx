"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

interface AdminShellProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Full admin shell: sidebar + topbar + scrollable content area.
 * Desktop: fixed 240px sidebar + full-width top bar.
 * Mobile: bottom-tab-style nav replaced by hamburger drawer.
 */
export default function AdminShell({
  title,
  actions,
  children,
}: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-slate-200/40 dark:border-slate-700/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <AdminSidebar />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopBar
          title={title}
          onMenuClick={() => setDrawerOpen(true)}
          actions={actions}
        />
        <main className="flex-1 overflow-y-auto px-4 lg:px-6 py-5">
          {children}
        </main>
      </div>

      {/* Mobile / Tablet Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col border-r border-slate-200/40 dark:border-slate-700/30 bg-white dark:bg-slate-900 lg:hidden"
            >
              <AdminSidebar onClose={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
