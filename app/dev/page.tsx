import type { Metadata } from "next";
import TerminalWrapper from "@/components/TerminalWrapper";
import Navbar from "@/components/Navbar";
import { portfolioData } from "@/lib/data";

export const metadata: Metadata = {
  title: portfolioData.meta.devTitle,
  description: portfolioData.meta.devDescription,
};

export default function DevPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 md:px-16 pt-20 pb-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-base mr-2">~/</span>
            Developer Terminal
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Explore my portfolio the hacker way. Type <code className="text-indigo-600 dark:text-indigo-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">help</code> to get started.
          </p>
        </div>

        {/* Terminal */}
        <div className="rounded-xl overflow-hidden border border-slate-300/60 dark:border-slate-700/50 shadow-xl shadow-black/10 dark:shadow-2xl dark:shadow-black/40">
          <TerminalWrapper />
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          Tip: Try commands like <code className="text-slate-500 dark:text-slate-400">intro</code>, <code className="text-slate-500 dark:text-slate-400">experience</code>, <code className="text-slate-500 dark:text-slate-400">skills</code>, <code className="text-slate-500 dark:text-slate-400">projects</code>
        </p>
      </div>
    </div>
  );
}
