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
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
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
}
