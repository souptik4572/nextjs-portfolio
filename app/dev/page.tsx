import type { Metadata } from "next";
import Link from "next/link";
import TerminalWrapper from "@/components/TerminalWrapper";

export const metadata: Metadata = {
  title: "👨‍💻 Souptik Sarkar | Developer Terminal",
  description: "Explore Souptik Sarkar's portfolio via an interactive terminal interface.",
};

export default function DevPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-5xl mx-auto px-6 md:px-16 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="font-mono text-indigo-400 font-bold text-lg hover:text-indigo-300 transition-colors"
          >
            SS/
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            ← Back to Portfolio
          </Link>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100">
            <span className="text-indigo-400 font-mono text-xl mr-2">~/</span>
            Developer Terminal
          </h1>
          <p className="mt-2 text-slate-400 text-sm md:text-base">
            Explore my portfolio the hacker way. Type <code className="text-indigo-400 bg-slate-800 px-1.5 py-0.5 rounded text-xs">help</code> to get started.
          </p>
        </div>

        {/* Terminal */}
        <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/40">
          <TerminalWrapper />
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-center text-xs text-slate-500">
          Tip: Try commands like <code className="text-slate-400">intro</code>, <code className="text-slate-400">experience</code>, <code className="text-slate-400">skills</code>, <code className="text-slate-400">projects</code>
        </p>
      </div>
    </div>
  );
}
