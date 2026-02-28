"use client";
import dynamic from "next/dynamic";

const TerminalSection = dynamic(() => import("@/components/TerminalSection"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] md:h-[600px] flex items-center justify-center bg-[#1e1e2e] rounded-xl">
      <p className="text-slate-400 font-mono text-sm animate-pulse">Loading terminal...</p>
    </div>
  ),
});

export default function TerminalWrapper() {
  return <TerminalSection />;
}
