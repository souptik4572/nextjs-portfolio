/**
 * Zod schemas for all portfolio data forms.
 * TypeScript types are inferred from Zod — do not duplicate type definitions.
 */

import { z } from "zod";

const urlOrEmpty = z.string().url("Must be a valid URL").or(z.literal(""));

// ── Experience ─────────────────────────────────────────────────────────────

export const ExperienceEntrySchema = z.object({
  company: z.string().min(1, "Required"),
  companyLogo: z.string(),
  companyWebsite: urlOrEmpty,
  role: z.string().min(1, "Required"),
  period: z.string().min(1, "Required"),
  location: z.string(),
  highlights: z.array(z.string()),
});

export type ExperienceEntryForm = z.infer<typeof ExperienceEntrySchema>;

// ── Projects ───────────────────────────────────────────────────────────────

export const ProjectEntrySchema = z.object({
  title: z.string().min(1, "Required"),
  tech: z.array(z.string()),
  description: z.string().min(1, "Required"),
  github: urlOrEmpty,
  live: urlOrEmpty,
});

export type ProjectEntryForm = z.infer<typeof ProjectEntrySchema>;

// ── Achievements ───────────────────────────────────────────────────────────

export const AchievementEntrySchema = z.object({
  title: z.string().min(1, "Required"),
  date: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});

export type AchievementEntryForm = z.infer<typeof AchievementEntrySchema>;

// ── Education ──────────────────────────────────────────────────────────────

export const EducationEntrySchema = z.object({
  institution: z.string().min(1, "Required"),
  degree: z.string().min(1, "Required"),
  period: z.string().min(1, "Required"),
  gpa: z.string(),
});

export type EducationEntryForm = z.infer<typeof EducationEntrySchema>;

// ── Notable Offers ─────────────────────────────────────────────────────────

export const NotableOfferSchema = z.object({
  company: z.string().min(1, "Required"),
  companyLogo: z.string(),
  role: z.string().min(1, "Required"),
  period: z.string().min(1, "Required"),
  companyUrl: urlOrEmpty,
  visible: z.boolean(),
});

export type NotableOfferForm = z.infer<typeof NotableOfferSchema>;

// ── Personal ───────────────────────────────────────────────────────────────

export const PersonalSchema = z.object({
  name: z.string().min(1, "Required"),
  initials: z.string().min(1).max(3),
  domain: z.string().min(1, "Required"),
  role: z.string().min(1, "Required"),
  alternateRoles: z.array(z.string()),
  bio: z.string().min(1, "Required"),
  contactBlurb: z.string(),
  email: z.string().email("Must be a valid email"),
  linkedin: urlOrEmpty,
  location: z.string(),
  resume: urlOrEmpty,
});

export type PersonalForm = z.infer<typeof PersonalSchema>;

// ── Meta ───────────────────────────────────────────────────────────────────

export const MetaSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  keywords: z.array(z.string()),
  ogTitle: z.string(),
  ogDescription: z.string(),
  devTitle: z.string(),
  devDescription: z.string(),
});

export type MetaForm = z.infer<typeof MetaSchema>;

// ── Terminal ───────────────────────────────────────────────────────────────

export const TerminalSchema = z.object({
  welcomeMessage: z.string(),
  pwdPath: z.string(),
  whoamiOutput: z.string(),
  windowTitle: z.string(),
  prompt: z.string(),
});

export type TerminalForm = z.infer<typeof TerminalSchema>;

// ── Theme ──────────────────────────────────────────────────────────────────

export const ThemeSchema = z.object({
  defaultMode: z.enum(["light", "dark"]),
});

export type ThemeForm = z.infer<typeof ThemeSchema>;

// ── Skill Category ─────────────────────────────────────────────────────────

export const SkillCategorySchema = z.object({
  category: z.string().min(1, "Required"),
  items: z.array(z.string()),
});

export type SkillCategoryForm = z.infer<typeof SkillCategorySchema>;

// ── Coding Profile ─────────────────────────────────────────────────────────

export const CodingProfileSchema = z.object({
  title: z.string().min(1, "Required"),
  url: urlOrEmpty,
  image: z.string(),
});

export type CodingProfileForm = z.infer<typeof CodingProfileSchema>;
