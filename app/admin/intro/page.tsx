"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SectionCard from "@/components/admin/SectionCard";
import FormField, { inputClass } from "@/components/admin/FormField";
import ArrayEditor from "@/components/admin/ArrayEditor";
import SaveButton from "@/components/admin/SaveButton";
import UnsavedBanner from "@/components/admin/UnsavedBanner";
import { FieldSkeleton } from "@/components/admin/LoadingSkeleton";
import { usePersonal } from "@/hooks/admin/usePersonal";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import { PersonalSchema, type PersonalForm } from "@/lib/admin/validation";
import { logger } from "@/lib/admin/logger";
import type { SaveStatus } from "@/types/admin";
import type { PersonalConfig } from "@/types/portfolio";
import { updateEntry } from "@/lib/admin/db";
import DiffModal from "@/components/admin/DiffModal";

const CODING_PROFILE_KEYS = ["github", "leetcode", "takeuforward", "hackerrank"] as const;

export default function IntroPage() {
  const { data, isLoading, error, save } = usePersonal();
  const diff = useDiffConfirm();
  const profileDiff = useDiffConfirm();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, isSubmitting, defaultValues: originalValues },
  } = useForm<PersonalForm>({
    resolver: zodResolver(PersonalSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name ?? "",
        initials: data.initials ?? "",
        domain: data.domain ?? "",
        role: data.role ?? "",
        alternateRoles: data.alternateRoles ?? [],
        bio: data.bio ?? "",
        contactBlurb: data.contactBlurb ?? "",
        email: data.email ?? "",
        linkedin: data.linkedin ?? "",
        location: data.location ?? "",
        resume: data.resume ?? "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: PersonalForm) => {
    diff.request(
      (originalValues ?? {}) as Record<string, unknown>,
      values as Record<string, unknown>,
      values.name || "Personal Info",
      async () => {
        setSaveStatus("saving");
        try {
          const updated: PersonalConfig = {
            ...values,
            coding_profiles: data?.coding_profiles ?? {},
          };
          await save(updated);
          reset(values);
          setSaveStatus("success");
        } catch (err) {
          logger.error("Intro save failed", err);
          setSaveStatus("error");
        }
      },
    );
  };

  // Coding profiles — managed separately (not in RHF form to keep schema simple)
  const [codingProfiles, setCodingProfiles] = useState<
    Record<string, { title: string; url: string; image: string }>
  >({});
  const [profileSaveStatus, setProfileSaveStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    if (data?.coding_profiles) setCodingProfiles(data.coding_profiles);
  }, [data]);

  const saveCodingProfiles = () => {
    const before = data?.coding_profiles ?? {};
    profileDiff.request(
      before as Record<string, unknown>,
      codingProfiles as Record<string, unknown>,
      "Coding Profiles",
      async () => {
        setProfileSaveStatus("saving");
        try {
          await updateEntry("personal", "coding_profiles", codingProfiles);
          setProfileSaveStatus("success");
        } catch (err) {
          logger.error("Coding profiles save failed", err);
          setProfileSaveStatus("error");
        }
      },
    );
  };

  if (error) {
    return (
      <AdminShell title="Intro">
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-xl">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Failed to load personal data. Check your Firebase connection.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Intro"
      actions={<SaveButton status={isSubmitting ? "saving" : saveStatus} type="submit" onClick={handleSubmit(onSubmit)} />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-5">
        {/* Identity */}
        <SectionCard title="Identity" description="Basic personal information">
          {isLoading ? (
            <FieldSkeleton />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name" htmlFor="name" error={errors.name?.message} required>
                  <input id="name" {...register("name")} className={inputClass(!!errors.name)} placeholder="John Doe" />
                </FormField>
                <FormField label="Initials" htmlFor="initials" error={errors.initials?.message} required description="2–3 characters shown in avatars">
                  <input id="initials" {...register("initials")} className={inputClass(!!errors.initials)} placeholder="JD" maxLength={3} />
                </FormField>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Domain / Website" htmlFor="domain" error={errors.domain?.message} required>
                  <input id="domain" {...register("domain")} className={inputClass(!!errors.domain)} placeholder="johndoe.dev" />
                </FormField>
                <FormField label="Location" htmlFor="location" error={errors.location?.message}>
                  <input id="location" {...register("location")} className={inputClass(!!errors.location)} placeholder="San Francisco, CA" />
                </FormField>
              </div>
              <FormField label="Primary Role" htmlFor="role" error={errors.role?.message} required>
                <input id="role" {...register("role")} className={inputClass(!!errors.role)} placeholder="Full Stack Developer" />
              </FormField>
            </div>
          )}
        </SectionCard>

        {/* Alternate Roles */}
        <SectionCard title="Alternate Roles" description="Rotating roles shown in the hero section">
          {isLoading ? (
            <FieldSkeleton />
          ) : (
            <Controller
              name="alternateRoles"
              control={control}
              render={({ field }) => (
                <ArrayEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="e.g. Backend Engineer"
                  addLabel="Add role"
                />
              )}
            />
          )}
        </SectionCard>

        {/* Bio & Contact */}
        <SectionCard title="Bio & Contact" description="Text shown in the about and contact sections">
          {isLoading ? (
            <FieldSkeleton />
          ) : (
            <div className="space-y-4">
              <FormField label="Bio" htmlFor="bio" error={errors.bio?.message} required>
                <textarea id="bio" {...register("bio")} rows={4} className={`${inputClass(!!errors.bio)} resize-none`} placeholder="Short biography…" />
              </FormField>
              <FormField label="Contact Blurb" htmlFor="contactBlurb" error={errors.contactBlurb?.message}>
                <textarea id="contactBlurb" {...register("contactBlurb")} rows={3} className={`${inputClass(!!errors.contactBlurb)} resize-none`} placeholder="Text shown above the contact form…" />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
                  <input id="email" type="email" {...register("email")} className={inputClass(!!errors.email)} placeholder="you@example.com" />
                </FormField>
                <FormField label="LinkedIn URL" htmlFor="linkedin" error={errors.linkedin?.message}>
                  <input id="linkedin" type="url" {...register("linkedin")} className={inputClass(!!errors.linkedin)} placeholder="https://linkedin.com/in/…" />
                </FormField>
              </div>
              <FormField label="Resume URL" htmlFor="resume" error={errors.resume?.message}>
                <input id="resume" type="url" {...register("resume")} className={inputClass(!!errors.resume)} placeholder="https://…/resume.pdf" />
              </FormField>
            </div>
          )}
        </SectionCard>

        {/* Coding Profiles */}
        <SectionCard
          title="Coding Profiles"
          description="Links shown in the coding profiles section"
          action={<SaveButton status={profileSaveStatus} onClick={saveCodingProfiles} />}
        >
          {isLoading ? (
            <FieldSkeleton />
          ) : (
            <div className="space-y-4">
              {CODING_PROFILE_KEYS.map((key) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-slate-200/40 dark:border-slate-700/30 last:border-0 last:pb-0">
                  <p className="col-span-full text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {key}
                  </p>
                  <div>
                    <label htmlFor={`cp-title-${key}`} className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Title</label>
                    <input
                      id={`cp-title-${key}`}
                      value={codingProfiles[key]?.title ?? ""}
                      onChange={(e) =>
                        setCodingProfiles((p) => ({
                          ...p,
                          [key]: { ...p[key], title: e.target.value },
                        }))
                      }
                      className={inputClass()}
                      placeholder={`${key} title`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`cp-url-${key}`} className="block text-xs text-slate-600 dark:text-slate-400 mb-1">URL</label>
                    <input
                      id={`cp-url-${key}`}
                      type="url"
                      value={codingProfiles[key]?.url ?? ""}
                      onChange={(e) =>
                        setCodingProfiles((p) => ({
                          ...p,
                          [key]: { ...p[key], url: e.target.value },
                        }))
                      }
                      className={inputClass()}
                      placeholder="https://…"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </form>

      <UnsavedBanner
        isDirty={isDirty}
        onSave={handleSubmit(onSubmit)}
        status={isSubmitting ? "saving" : saveStatus}
        onDiscard={() => {
          reset();
          if (data?.coding_profiles) setCodingProfiles(data.coding_profiles);
        }}
      />

      <DiffModal
        isOpen={diff.isOpen}
        before={diff.before}
        after={diff.after}
        title={diff.title}
        onConfirm={diff.confirm}
        onCancel={diff.cancel}
      />

      <DiffModal
        isOpen={profileDiff.isOpen}
        before={profileDiff.before}
        after={profileDiff.after}
        title={profileDiff.title}
        onConfirm={profileDiff.confirm}
        onCancel={profileDiff.cancel}
      />
    </AdminShell>
  );
}
