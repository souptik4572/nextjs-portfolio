"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToAuthState, adminSignOut, getAllowedUid } from "@/lib/admin/auth";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { logger } from "@/lib/admin/logger";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdminShellProvider } from "@/contexts/AdminShellContext";
import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthorised, setUser, setLoading } = useAdminAuthStore();
  const isLoginPage = pathname === "/admin/login";
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToAuthState(async (user) => {
      if (user && user.uid !== getAllowedUid()) {
        logger.warn("Unauthorised UID attempted access", user.uid);
        try {
          await adminSignOut();
        } catch {
          // ignore
        }
        setUser(null);
        setLoading(false);
        router.replace("/admin/login?error=unauthorised");
        return;
      }

      setUser(user);
      setLoading(false);

      if (!user && !isLoginPage) {
        router.replace("/admin/login");
      } else if (user && isLoginPage) {
        router.replace("/admin/dashboard");
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Loading spinner ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  // ── Login page — no chrome ─────────────────────────────────────────────────
  if (isLoginPage) {
    return (
      <ThemeProvider storageKey="admin-theme">
        {children}
      </ThemeProvider>
    );
  }

  // ── Not authorised — redirect in progress ─────────────────────────────────
  if (!isAuthorised) {
    return null;
  }

  // ── Authenticated admin shell ──────────────────────────────────────────────
  return (
    <ThemeProvider storageKey="admin-theme">
      <AdminShellProvider>
        <div className="flex h-[100dvh] overflow-hidden bg-[#f2f2f7] dark:bg-[#161618] text-foreground">

          {/* Desktop sidebar — rendered once, never re-mounts */}
          <aside className="hidden lg:flex flex-col w-[220px] shrink-0 admin-sidebar-surface admin-vibrancy border-r border-black/[0.07] dark:border-white/[0.06]">
            <AdminSidebar />
          </aside>

          {/* Main area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top bar — title + actions injected by the current page via context */}
            <AdminTopBar onMenuClick={() => setDrawerOpen(true)} />

            {/* Scrollable content — pages render here */}
            <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
              {children}
              {/* Safe-area spacer for home indicator on iOS */}
              <div aria-hidden className="safe-area-bottom-spacer" />
            </main>
          </div>

          {/* Mobile / tablet drawer */}
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
      </AdminShellProvider>
    </ThemeProvider>
  );
}
