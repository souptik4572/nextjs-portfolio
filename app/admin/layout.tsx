"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { subscribeToAuthState, adminSignOut, getAllowedUid } from "@/lib/admin/auth";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { logger } from "@/lib/admin/logger";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthorised, setUser, setLoading } = useAdminAuthStore();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToAuthState(async (user) => {
      if (user && user.uid !== getAllowedUid()) {
        // Wrong UID — sign out immediately
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

  // Full-screen loading state while auth resolves — never flash the dashboard
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

  // On the login page, render children without the auth shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authorised and not on login, show nothing (redirect in progress)
  if (!isAuthorised) {
    return null;
  }

  return <>{children}</>;
}
