import { portfolioData } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-8 px-6 text-center border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
      <p className="text-slate-500 dark:text-slate-500 text-xs sm:text-sm font-mono">
        Built with Next.js · Tailwind · Framer Motion
      </p>
      <p className="text-slate-400 dark:text-slate-600 text-xs mt-1">
        © {new Date().getFullYear()} {portfolioData.personal.name}
      </p>
    </footer>
  );
}
