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
 * Desktop: fixed 220px sidebar + full-width top bar.
 * Mobile: hamburger drawer.
 */
export default function AdminShell({
  title,
  actions,
  children,
}: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f2f2f7] dark:bg-[#161618] text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] shrink-0 admin-sidebar-surface admin-vibrancy border-r border-black/[0.07] dark:border-white/[0.06]">
        <AdminSidebar />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopBar
          title={title}
          onMenuClick={() => setDrawerOpen(true)}
          actions={actions}
        />
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-6 font-heading">
            {title}
          </h1>
          {children}
        </main>
      </div>

      {/* Mobile / Tablet Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
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
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 38 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[220px] flex flex-col admin-sidebar-surface admin-vibrancy border-r border-black/[0.07] dark:border-white/[0.06] lg:hidden"
            >
              <AdminSidebar onClose={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
