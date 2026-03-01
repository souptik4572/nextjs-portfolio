import portfolioDataJson from "./portfolioData.json";

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

/**
 * Static portfolio data imported from the JSON file.
 * Cast to include the stricter SectionKey and theme types.
 */
export const portfolioData = portfolioDataJson as PortfolioData;

/** Full portfolio data shape, derived from the JSON with refined type overrides */
export type PortfolioData = Omit<typeof portfolioDataJson, "layout" | "theme"> & {
	layout: { section_order: SectionOrder | LegacySectionOrder };
	theme: { defaultMode: "light" | "dark" };
};

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

/** Convenience types for individual record entries */
export type ExperienceEntry = PortfolioData["experience"][keyof PortfolioData["experience"]];
export type ProjectEntry = PortfolioData["projects"][keyof PortfolioData["projects"]];
export type OfferEntry = PortfolioData["notable_offers"][keyof PortfolioData["notable_offers"]];
export type SkillGroup = PortfolioData["skills"][keyof PortfolioData["skills"]];
export type AchievementEntry = PortfolioData["achievements"][keyof PortfolioData["achievements"]];
export type EducationEntry = PortfolioData["education"][keyof PortfolioData["education"]];
