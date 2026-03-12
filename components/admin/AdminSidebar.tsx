"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Zap,
  FolderOpen,
  Trophy,
  GraduationCap,
  Star,
  Settings2,
  FileText,
  LogOut,
} from "lucide-react";
import { adminSignOut } from "@/lib/admin/auth";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/admin/logger";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: LayoutDashboard },
  { label: "Intro", href: "/admin/intro", Icon: User },
  { label: "Experience", href: "/admin/experience", Icon: Briefcase },
  { label: "Skills", href: "/admin/skills", Icon: Zap },
  { label: "Projects", href: "/admin/projects", Icon: FolderOpen },
  { label: "Achievements", href: "/admin/achievements", Icon: Trophy },
  { label: "Education", href: "/admin/education", Icon: GraduationCap },
  { label: "Notable Offers", href: "/admin/notable-offers", Icon: Star },
  { label: "Layout", href: "/admin/layout-manager", Icon: Settings2 },
  { label: "Meta & SEO", href: "/admin/meta", Icon: FileText },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, setLoading } = useAdminAuthStore();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await adminSignOut();
      setUser(null);
      router.replace("/admin/login");
    } catch (err) {
      logger.error("Sign out failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200/40 dark:border-slate-700/30">
        <Link
          href="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-indigo-600 flex items-center justify-center text-white text-sm font-bold font-heading">
            A
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Admin Portal
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-500/15 dark:bg-indigo-500/20 text-blue-700 dark:text-indigo-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200",
              ].join(" ")}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 w-0.5 h-6 rounded-r-full bg-blue-600 dark:bg-indigo-500"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Icon size={17} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-3 py-3 border-t border-slate-200/40 dark:border-slate-700/30">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut size={17} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
