import { portfolioData } from "@/lib/data";
import { Mail, Github, Linkedin, FileText } from "lucide-react";

export default function Footer() {
  const { personal } = portfolioData;

  const socialLinks = [
    {
      label: "Email",
      href: `mailto:${personal.email}`,
      icon: Mail,
      external: false,
    },
    {
      label: "GitHub",
      href: personal.coding_profiles.github.url,
      icon: Github,
      external: true,
    },
    {
      label: "LinkedIn",
      href: personal.linkedin,
      icon: Linkedin,
      external: true,
    },
    {
      label: "Resume",
      href: personal.resume,
      icon: FileText,
      external: true,
    },
  ];

  return (
    <footer className="py-10 px-6 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-5">
        {/* Social icons */}
        <div className="flex items-center gap-4">
          {socialLinks.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={label}
              title={label}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-slate-700/60 border border-slate-200/60 dark:border-slate-700/50 hover:border-blue-500/40 dark:hover:border-indigo-500/40 transition-all"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Built with */}
        <p className="text-slate-500 dark:text-slate-500 text-xs sm:text-sm font-mono">
          Built with Next.js · Tailwind · Framer Motion
        </p>

        {/* Copyright */}
        <p className="text-slate-400 dark:text-slate-600 text-xs">
          © {new Date().getFullYear()} {personal.name}
        </p>
      </div>
    </footer>
  );
}
