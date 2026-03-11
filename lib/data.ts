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
}

export interface OfferEntry {
	company: string;
	companyLogo: string;
	companyUrl: string;
	role: string;
	period: string;
	visible?: boolean;
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
	};
	skills: Record<string, SkillGroup>;
	experience: Record<string, ExperienceEntry>;
	projects: Record<string, ProjectEntry>;
	achievements: Record<string, AchievementEntry>;
	notable_offers: Record<string, OfferEntry>;
	education: Record<string, EducationEntry>;
}

/** Helper: derive an ordered array of enabled section keys.
 *  Handles the current { enabled, order } format, the legacy boolean-map,
 *  and the original plain-array format.
 */
export function getEnabledSections(
	order: SectionOrder | LegacySectionOrder,
): SectionKey[] {
	// Legacy: plain array of section keys
	if (Array.isArray(order)) {
		return order;
	}

	const entries = Object.entries(order) as [SectionKey, SectionEntry | boolean][];

	// Detect format by inspecting the first value
	const first = entries[0]?.[1];

	if (typeof first === "boolean") {
		// Legacy boolean-map: { intro: true, ... }
		return (entries as [SectionKey, boolean][])
			.filter(([, enabled]) => enabled)
			.map(([key]) => key);
	}

	// Current format: { intro: { enabled: true, order: 1 }, ... }
	return (entries as [SectionKey, SectionEntry][])
		.filter(([, entry]) => entry.enabled)
		.sort(([, a], [, b]) => a.order - b.order)
		.map(([key]) => key);
}
