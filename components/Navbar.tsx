"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Terminal } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { portfolioData } from "@/lib/data";

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

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const handleNavClick = () => {
		setMobileMenuOpen(false);
	};

	return (
		<motion.header
			initial={{ y: -80, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, delay: 0.2 }}
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? "macos-glass border-b border-slate-200/50 dark:border-slate-700/30 py-3 macos-shadow"
					: "py-5"
			}`}
		>
			<nav className="max-w-6xl mx-auto px-6 md:px-16 flex items-center justify-between">
				<a
					href="#intro"
					className="font-mono text-blue-600 dark:text-indigo-400 font-bold text-lg z-50"
				>
					SS/
				</a>

				<div className="flex items-center gap-2">
					{/* Desktop Menu - Dock-style */}
					<ul className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl px-3 py-1.5 border border-slate-200/50 dark:border-slate-700/50">
						{portfolioData.layout.section_order.map(
							(section, i) => (
								<li key={section}>
									<a
										href={`#${section}`}
										className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-700/50 transition-all text-sm font-medium px-3 py-1.5 rounded-lg block"
									>
										<span className="text-blue-600 dark:text-indigo-400 font-mono text-xs mr-1">
											{String(i + 1).padStart(2, "0")}.
										</span>
										{NAV_LABELS[section] ?? section}
									</a>
								</li>
							),
						)}
					</ul>

					{/* Theme Toggle Button */}
					<button
						onClick={toggleTheme}
						className="p-2.5 rounded-lg bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all border border-slate-200/50 dark:border-slate-700/50"
						aria-label="Toggle theme"
					>
						{theme === "dark" ? (
							<Sun size={18} />
						) : (
							<Moon size={18} />
						)}
					</button>

					{/* For Developers Link */}
					<a
						href="/dev"
						className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600/10 dark:bg-indigo-500/10 text-blue-600 dark:text-indigo-400 border border-blue-500/20 dark:border-indigo-500/20 hover:bg-blue-600/20 dark:hover:bg-indigo-500/20 hover:border-blue-500/40 dark:hover:border-indigo-500/40 transition-all text-sm font-medium"
					>
						<Terminal size={15} />
						Developers
					</a>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="md:hidden z-50 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors p-2"
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
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
							className="fixed inset-0 bg-slate-900/60 dark:bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
						/>

						{/* Menu Panel */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "tween", duration: 0.3 }}
							className="fixed top-0 right-0 bottom-0 w-[75vw] max-w-sm macos-glass border-l border-slate-200/50 dark:border-slate-700/30 z-40 md:hidden macos-shadow"
						>
							<nav className="flex flex-col gap-2 p-8 pt-24">
								{portfolioData.layout.section_order.map(
									(section, i) => (
										<a
											key={section}
											href={`#${section}`}
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
										</a>
									),
								)}

								{/* For Developers Link - Mobile */}
								<a
									href="/dev"
									onClick={handleNavClick}
									className="mt-4 pt-4 border-t border-slate-200/30 dark:border-slate-700/30 text-blue-600 dark:text-indigo-400 hover:text-blue-500 dark:hover:text-indigo-300 transition-colors py-3 px-4 rounded-xl hover:bg-white/40 dark:hover:bg-slate-700/40 flex items-center gap-3 font-medium"
								>
									<Terminal size={16} />
									Developers
								</a>
							</nav>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
