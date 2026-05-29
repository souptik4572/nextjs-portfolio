/**
 * Full typed data model for the portfolio, matching Firebase Realtime Database structure.
 * Admin editors derive all their types from here.
 */

export interface SectionOrder {
  enabled: boolean;
  order: number;
}

export interface LayoutConfig {
  section_order: Record<string, SectionOrder>;
}

export interface ThemeConfig {
  defaultMode: "light" | "dark";
}

export interface MetaConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  devTitle: string;
  devDescription: string;
}

export interface TerminalConfig {
  welcomeMessage: string;
  pwdPath: string;
  whoamiOutput: string;
  windowTitle: string;
  prompt: string;
}

export interface CodingProfile {
  title: string;
  url: string;
  image: string;
}

/** One cell of the hero meta bar (e.g. Role / Experience / Based in / Stack). */
export interface HeroMetaCell {
  /** Small uppercase mono label (e.g. "Role"). */
  label: string;
  /** Headline value (e.g. "SDE-2"). */
  value: string;
  /** Secondary detail line under the value (e.g. "Seamless Distribution Systems"). */
  detail: string;
}

export interface PersonalConfig {
  name: string;
  initials: string;
  domain: string;
  role: string;
  alternateRoles: string[];
  bio: string;
  contactBlurb: string;
  email: string;
  linkedin: string;
  location: string;
  resume: string;
  coding_profiles: Record<string, CodingProfile>;
  /** Hero meta bar cells. Optional — absent on portfolios created before this feature. */
  heroMeta?: HeroMetaCell[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface SkillsConfig {
  languages: SkillCategory;
  libraries_frameworks: SkillCategory;
  databases: SkillCategory;
  infrastructure: SkillCategory;
  others: SkillCategory;
}

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
  tech: string[];
  description: string;
  github: string;
  live: string;
  /** 1-based display order. Optional for backwards compatibility. */
  order?: number;
}

export interface AchievementEntry {
  title: string;
  date: string;
  description: string;
}

export interface NotableOffer {
  company: string;
  companyLogo: string;
  role: string;
  period: string;
  companyUrl: string;
  visible: boolean;
  /** 1-based display order. Optional for backwards compatibility with entries written before ordering existed. */
  order?: number;
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

export interface PortfolioData {
  layout: LayoutConfig;
  theme: ThemeConfig;
  meta: MetaConfig;
  terminal: TerminalConfig;
  personal: PersonalConfig;
  skills: SkillsConfig;
  experience: Record<string, ExperienceEntry>;
  projects: Record<string, ProjectEntry>;
  achievements: Record<string, AchievementEntry>;
  notable_offers: Record<string, NotableOffer>;
  education: Record<string, EducationEntry>;
  /** Selected-impact counters shown under the hero. Optional — absent on portfolios created before this feature. */
  impact?: Record<string, ImpactStat>;
}
