"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
      {/* Header with traffic lights */}
      <div className="px-4 pt-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.05]">
        {/* Traffic light dots */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <Link
          href="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-2.5"
        >
          <span className="w-7 h-7 rounded-[8px] bg-[#007AFF] dark:bg-[#0A84FF] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            A
          </span>
          <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 tracking-tight font-heading">
            Admin Portal
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-px">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={[
                "flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-[8px] text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-[#007AFF]/[0.13] dark:bg-[#0A84FF]/[0.18] text-[#007AFF] dark:text-[#4DB8FF]"
                  : "text-slate-600 dark:text-slate-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-slate-900 dark:hover:text-slate-100",
              ].join(" ")}
            >
              <Icon size={15} className="shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-2.5 py-2.5 border-t border-black/[0.06] dark:border-white/[0.05] pb-safe-area">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-[8px] text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:bg-[#FF3B30]/[0.08] hover:text-[#FF3B30] dark:hover:bg-[#FF453A]/[0.12] dark:hover:text-[#FF453A] transition-colors"
        >
          <LogOut size={15} className="shrink-0" strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
