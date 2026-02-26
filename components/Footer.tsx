import { portfolioData } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-8 px-6 text-center border-t border-slate-800">
      <p className="text-slate-500 text-sm font-mono">
        Built with Next.js · Tailwind · Framer Motion
      </p>
      <p className="text-slate-600 text-xs mt-1">
        © {new Date().getFullYear()} {portfolioData.personal.name}
      </p>
    </footer>
  );
}
