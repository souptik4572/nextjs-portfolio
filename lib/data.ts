import type { HeroMetaCell } from "@/types/portfolio";

/** All possible section keys that can appear in section_order */
export type SectionKey =
	| "intro"
	| "experience"
	| "skills"
	| "projects"
	| "achievements"
	| "notable_offers"
	| "education"
	| "contact";

/** Each section entry has an enabled flag and an explicit display order */
export type SectionEntry = { enabled: boolean; order: number };

/** section_order maps each section key to its entry */
export type SectionOrder = Record<SectionKey, SectionEntry>;

/** Legacy formats that may still exist in Firebase */
type LegacySectionOrder = Record<SectionKey, boolean> | SectionKey[];

export interface ExperienceEntry {
	company: string;
	companyLogo: string;
	companyWebsite: string;
	role: string;
	period: string;
	location: string;
	highlights: string[];
}

export interface ProjectEntry {
	title: string;
	description: string;
	tech: string[];
	github?: string;
	live?: string;
	order?: number;
}

export interface OfferEntry {
	company: string;
	companyLogo: string;
	companyUrl: string;
	role: string;
	period: string;
	visible?: boolean;
	order?: number;
}

export interface SkillGroup {
	category: string;
	items: string[];
}

export interface AchievementEntry {
	title: string;
	date: string;
	description: string;
}

export interface EducationEntry {
	institution: string;
	degree: string;
	period: string;
	gpa: string;
}

export interface ImpactStat {
	/** Headline metric — the numeric part is animated as a count-up (e.g. "1000", "70", "10K"). */
	value: string;
	/** Small accent text rendered after the number (e.g. "ms+", "%", "+"). */
	suffix: string;
	/** Short description below the number. */
	label: string;
	/** 1-based display order. Optional for backwards compatibility. */
	order?: number;
}

/**
 * Fallback "selected impact" counters rendered under the hero when no `impact`
 * data exists in Firebase yet. These mirror the design mockup's placeholder
 * metrics — verify/replace them via the Admin → Impact editor before relying on them.
 */
export const DEFAULT_IMPACT_STATS: ImpactStat[] = [
	{ value: "1000", suffix: "ms+", label: "p99 latency shaved off core services", order: 1 },
	{ value: "70", suffix: "%", label: "Faster processing on critical paths", order: 2 },
	{ value: "10K", suffix: "+", label: "Users served in production", order: 3 },
	{ value: "10", suffix: "+", label: "Microservices shipped & owned", order: 4 },
];

/** Full portfolio data shape matching the Firebase Realtime Database structure */
export interface PortfolioData {
	layout: { section_order: SectionOrder | LegacySectionOrder };
	theme: { defaultMode: "light" | "dark" };
	meta: {
		title: string;
		description: string;
		keywords: string[];
		ogTitle: string;
		ogDescription: string;
		devTitle: string;
		devDescription: string;
	};
	terminal: {
		welcomeMessage: string;
		pwdPath: string;
		whoamiOutput: string;
		windowTitle: string;
		prompt: string;
	};
	personal: {
		name: string;
		initials: string;
		domain: string;
		role: string;
		alternateRoles: string[];
		bio: string;
		contactBlurb: string;
		email: string;
		linkedin: string;
		coding_profiles: Record<string, { title: string; url: string; image: string }>;
		location: string;
		resume: string;
		heroMeta?: HeroMetaCell[];
	};
	skills: Record<string, SkillGroup>;
	experience: Record<string, ExperienceEntry>;
	projects: Record<string, ProjectEntry>;
	achievements: Record<string, AchievementEntry>;
	notable_offers: Record<string, OfferEntry>;
	education: Record<string, EducationEntry>;
	/** Selected-impact counters shown under the hero. Optional — absent on portfolios created before this feature. */
	impact?: Record<string, ImpactStat>;
}

/**
 * Default hero-meta cells used when a portfolio has no `heroMeta` saved in
 * Firebase yet. The "Based in" cell's value is always resolved from the
 * configurable `personal.location` (Firestore) — it is never hardcoded here.
 */
export function buildDefaultHeroMeta(location: string): HeroMetaCell[] {
	return [
		{
			label: "Role",
			value: "Software Engineer",
			detail: "Backend systems and product engineering",
		},
		{
			label: "Experience",
			value: "4+ Years",
			detail: "Scalable microservices and APIs",
		},
		{
			label: "Based in",
			value: location,
			detail: "Open to remote and hybrid roles",
		},
		{
			label: "Stack",
			value: "Java · Go · Python",
			detail: "TypeScript, React, Spring Boot",
		},
	];
}

/**
 * Pseudo-section key for the under-hero impact strip. It participates in
 * `section_order` purely for its visibility toggle — it is NOT a flow section,
 * so `getEnabledSections` filters it out (the strip renders separately under the
 * hero in `app/page.tsx`).
 */
export const IMPACT_SECTION_KEY = "impact";

/** Helper: derive an ordered array of enabled section keys.
 *  Handles the current { enabled, order } format, the legacy boolean-map,
 *  and the original plain-array format. The `impact` pseudo-section is always
 *  excluded — it is rendered under the hero, not in the section flow.
 */
export function getEnabledSections(
	order: SectionOrder | LegacySectionOrder,
): SectionKey[] {
	const notImpact = (key: SectionKey) => (key as string) !== IMPACT_SECTION_KEY;

	// Legacy: plain array of section keys
	if (Array.isArray(order)) {
		return order.filter(notImpact);
	}

	const entries = Object.entries(order) as [SectionKey, SectionEntry | boolean][];

	// Detect format by inspecting the first value
	const first = entries[0]?.[1];

	if (typeof first === "boolean") {
		// Legacy boolean-map: { intro: true, ... }
		return (entries as [SectionKey, boolean][])
			.filter(([, enabled]) => enabled)
			.map(([key]) => key)
			.filter(notImpact);
	}

	// Current format: { intro: { enabled: true, order: 1 }, ... }
	return (entries as [SectionKey, SectionEntry][])
		.filter(([, entry]) => entry.enabled)
		.sort(([, a], [, b]) => a.order - b.order)
		.map(([key]) => key)
		.filter(notImpact);
}

/**
 * Whether the under-hero impact strip should render. Reads the `impact` entry
 * from `section_order` across all supported formats. Defaults to `true` when no
 * explicit entry exists, so portfolios created before this feature keep showing it.
 */
export function isImpactEnabled(order: SectionOrder | LegacySectionOrder): boolean {
	if (!order) return true;
	// Legacy array format can't represent a disabled impact strip → default on.
	if (Array.isArray(order)) return true;

	const entry = (order as Record<string, SectionEntry | boolean>)[IMPACT_SECTION_KEY];
	if (entry === undefined) return true;
	return typeof entry === "boolean" ? entry : entry.enabled;
}
