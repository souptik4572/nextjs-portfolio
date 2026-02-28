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

/**
 * Static portfolio data imported from the JSON file.
 * Cast to include the stricter SectionKey and theme types.
 */
export const portfolioData = portfolioDataJson as PortfolioData;

/** Full portfolio data shape, derived from the JSON with refined type overrides */
export type PortfolioData = Omit<typeof portfolioDataJson, "layout" | "theme"> & {
	layout: { section_order: SectionKey[] };
	theme: { defaultMode: "light" | "dark" };
};

/** Convenience types for individual record entries */
export type ExperienceEntry = PortfolioData["experience"][keyof PortfolioData["experience"]];
export type ProjectEntry = PortfolioData["projects"][keyof PortfolioData["projects"]];
export type OfferEntry = PortfolioData["notable_offers"][keyof PortfolioData["notable_offers"]];
export type SkillGroup = PortfolioData["skills"][keyof PortfolioData["skills"]];
export type AchievementEntry = PortfolioData["achievements"][keyof PortfolioData["achievements"]];
export type EducationEntry = PortfolioData["education"][keyof PortfolioData["education"]];
