"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Terminal } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import { getEnabledSections } from "@/lib/data";

const NAV_LABELS: Record<string, string> = {
	intro: "Home",
	experience: "Experience",
	skills: "Skills",
	projects: "Projects",
	notable_offers: "Offers",
	achievements: "Achievements",
	education: "Education",
	contact: "Contact",
};

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const portfolioData = usePortfolioData();
	const enabledSections = getEnabledSections(portfolioData.layout.section_order);
	const pathname = usePathname();
	const isHome = pathname === "/";
	const sectionHref = (section: string) => isHome ? `#${section}` : `/#${section}`;

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const handleNavClick = () => {
		setMobileMenuOpen(false);
	};

	/* Use <Link> for route changes, plain <a> for same-page hash scrolls */
	const NavAnchor = ({ href, className, onClick, children }: {
		href: string; className?: string; onClick?: () => void; children: React.ReactNode;
	}) => {
		const isHash = href.startsWith("#");
		if (isHash) return <a href={href} className={className} onClick={onClick}>{children}</a>;
		return <Link href={href} className={className} onClick={onClick}>{children}</Link>;
	};

	return (
		<motion.header
			initial={{ y: -80, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, delay: 0.2 }}
			className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
		>
			{/* Floating island navbar */}
			<nav
				className={`pointer-events-auto inline-flex items-center gap-1 mt-3 px-2 py-1.5 rounded-2xl transition-all duration-500 ${
					scrolled
						? "bg-white/60 dark:bg-slate-900/70 backdrop-blur-2xl backdrop-saturate-[1.8] border border-slate-300/50 dark:border-slate-700/40 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1),0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3),0_0_0_0.5px_rgba(255,255,255,0.04)]"
						: "bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl backdrop-saturate-150 border border-slate-200/40 dark:border-slate-700/20 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] dark:shadow-none"
				}`}
			>
				{/* Logo */}
				<NavAnchor
					href={sectionHref("intro")}
					className="font-mono text-blue-600 dark:text-indigo-400 font-bold text-sm px-3 py-1.5 rounded-xl hover:bg-blue-50/60 dark:hover:bg-indigo-500/10 transition-colors shrink-0"
				>
					{portfolioData.personal.initials}<span className="text-slate-400 dark:text-slate-500">/</span>
				</NavAnchor>

				{/* Divider */}
				<div className="hidden md:block w-px h-5 bg-slate-300/50 dark:bg-slate-600/50 mx-0.5" />

				{/* Desktop Nav Links */}
				<ul className="hidden md:flex items-center gap-0.5">
					{enabledSections.map((section) => (
						<li key={section}>
							<NavAnchor
								href={sectionHref(section)}
								className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-all text-[13px] font-medium px-2.5 py-1.5 rounded-xl block whitespace-nowrap"
							>
								{NAV_LABELS[section] ?? section}
							</NavAnchor>
						</li>
					))}
				</ul>

				{/* Divider */}
				<div className="hidden md:block w-px h-5 bg-slate-300/50 dark:bg-slate-600/50 mx-0.5" />

				{/* Theme Toggle */}
				<button
					onClick={toggleTheme}
					className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-all"
					aria-label="Toggle theme"
				>
					{theme === "dark" ? (
						<Sun size={16} />
					) : (
						<Moon size={16} />
					)}
				</button>

				{/* Developers Link */}
				<Link
					href="/dev"
					className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600/10 dark:bg-indigo-500/10 text-blue-600 dark:text-indigo-400 hover:bg-blue-600/20 dark:hover:bg-indigo-500/20 transition-all text-[13px] font-medium whitespace-nowrap"
				>
					<Terminal size={14} />
					Dev
				</Link>

				{/* Mobile Menu Button */}
				<button
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className="md:hidden text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-xl"
					aria-label="Toggle menu"
				>
					{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
				</button>
			</nav>

			{/* Mobile Menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setMobileMenuOpen(false)}
							className="fixed inset-0 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm z-40 md:hidden pointer-events-auto"
						/>

						{/* Menu Panel */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "tween", duration: 0.3 }}
							className="fixed top-0 right-0 bottom-0 w-[75vw] max-w-sm macos-glass border-l border-slate-200/50 dark:border-slate-700/30 z-40 md:hidden macos-shadow pointer-events-auto"
						>
							<nav className="flex flex-col gap-2 p-8 pt-24">
								{enabledSections.map(
									(section, i) => (
										<NavAnchor
											key={section}
											href={sectionHref(section)}
											onClick={handleNavClick}
											className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors py-3 px-4 rounded-xl hover:bg-white/40 dark:hover:bg-slate-700/40 flex items-center gap-3"
										>
											<span className="text-blue-600 dark:text-indigo-400 font-mono text-sm">
												{String(i + 1).padStart(2, "0")}
												.
											</span>
											<span className="font-medium">
												{NAV_LABELS[section] ?? section}
											</span>
										</NavAnchor>
									),
								)}

								{/* For Developers Link - Mobile */}
								<Link
									href="/dev"
									onClick={handleNavClick}
									className="mt-4 pt-4 border-t border-slate-200/30 dark:border-slate-700/30 text-blue-600 dark:text-indigo-400 hover:text-blue-500 dark:hover:text-indigo-300 transition-colors py-3 px-4 rounded-xl hover:bg-white/40 dark:hover:bg-slate-700/40 flex items-center gap-3 font-medium"
								>
									<Terminal size={16} />
									Developers
								</Link>
							</nav>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
