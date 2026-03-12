"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  FolderOpen,
  Trophy,
  GraduationCap,
  Star,
  User,
  Zap,
  Settings2,
  FileText,
  AlertCircle,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { useDashboard } from "@/hooks/admin/useDashboard";

const QUICK_LINKS = [
  { label: "Intro", href: "/admin/intro", Icon: User, desc: "Personal info & bio" },
  { label: "Experience", href: "/admin/experience", Icon: Briefcase, desc: "Work history" },
  { label: "Skills", href: "/admin/skills", Icon: Zap, desc: "Tech skills" },
  { label: "Projects", href: "/admin/projects", Icon: FolderOpen, desc: "Portfolio projects" },
  { label: "Achievements", href: "/admin/achievements", Icon: Trophy, desc: "Awards & wins" },
  { label: "Education", href: "/admin/education", Icon: GraduationCap, desc: "Academic history" },
  { label: "Notable Offers", href: "/admin/notable-offers", Icon: Star, desc: "Job offers" },
  { label: "Layout", href: "/admin/layout-manager", Icon: Settings2, desc: "Section order" },
  { label: "Meta & SEO", href: "/admin/meta", Icon: FileText, desc: "SEO & terminal config" },
];

export default function DashboardPage() {
  const { stats, isLoading, error } = useDashboard();

  const statCards = stats
    ? [
        { label: "Experience", value: stats.experience, Icon: Briefcase },
        { label: "Projects", value: stats.projects, Icon: FolderOpen },
        { label: "Achievements", value: stats.achievements, Icon: Trophy },
        { label: "Education", value: stats.education, Icon: GraduationCap },
        { label: "Notable Offers", value: stats.notableOffers, Icon: Star },
      ]
    : [];

  return (
    <AdminShell title="Dashboard">
      <div className="max-w-5xl space-y-8">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            Failed to load portfolio data. Check your Firebase connection.
          </div>
        )}

        {/* Stats */}
        <section>
          <h2 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl admin-card-surface border border-black/[0.07] dark:border-white/[0.06] p-4 animate-pulse"
                  >
                    <div className="w-8 h-8 rounded-[10px] bg-black/[0.06] dark:bg-white/[0.06] mb-3" />
                    <div className="h-7 w-8 rounded bg-black/[0.06] dark:bg-white/[0.06] mb-1" />
                    <div className="h-3 w-20 rounded bg-black/[0.04] dark:bg-white/[0.04]" />
                  </div>
                ))
              : statCards.map(({ label, value, Icon }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
                    className="rounded-2xl admin-card-surface border border-black/[0.07] dark:border-white/[0.06] p-4"
                  >
                    <div className="w-8 h-8 rounded-[10px] bg-[#007AFF]/[0.10] dark:bg-[#0A84FF]/[0.15] flex items-center justify-center text-[#007AFF] dark:text-[#4DB8FF] mb-3">
                      <Icon size={16} />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                      {value}
                    </p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {label}
                    </p>
                  </motion.div>
                ))}
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {QUICK_LINKS.map(({ label, href, Icon, desc }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
              >
                <Link
                  href={href}
                  className="flex items-center gap-3 p-3.5 rounded-2xl admin-card-surface border border-black/[0.07] dark:border-white/[0.06] hover:border-[#007AFF]/30 dark:hover:border-[#0A84FF]/30 hover:bg-[#007AFF]/[0.03] dark:hover:bg-[#0A84FF]/[0.05] transition-all group"
                >
                  <div className="w-9 h-9 rounded-[10px] bg-[#007AFF]/[0.08] dark:bg-[#0A84FF]/[0.12] flex items-center justify-center text-[#007AFF] dark:text-[#4DB8FF] group-hover:bg-[#007AFF]/[0.15] dark:group-hover:bg-[#0A84FF]/[0.2] transition-colors shrink-0">
                    <Icon size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate tracking-tight">
                      {label}
                    </p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate">
                      {desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
