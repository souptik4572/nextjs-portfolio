"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import SectionCard from "@/components/admin/SectionCard";
import FormField, { inputClass } from "@/components/admin/FormField";
import TagInput from "@/components/admin/TagInput";
import SaveButton from "@/components/admin/SaveButton";
import UnsavedBanner from "@/components/admin/UnsavedBanner";
import { FieldSkeleton } from "@/components/admin/LoadingSkeleton";
import { useMeta } from "@/hooks/admin/useMeta";
import { useDiffConfirm } from "@/hooks/admin/useDiffConfirm";
import {
  MetaSchema,
  TerminalSchema,
  ThemeSchema,
  type MetaForm,
  type TerminalForm,
  type ThemeForm,
} from "@/lib/admin/validation";
import { logger } from "@/lib/admin/logger";
import type { SaveStatus } from "@/types/admin";
import DiffModal from "@/components/admin/DiffModal";

export default function MetaPage() {
  const { meta, terminal, theme, isLoading, error, saveMeta, saveTerminal, saveTheme } = useMeta();
  const metaDiff = useDiffConfirm();
  const terminalDiff = useDiffConfirm();
  const themeDiff = useDiffConfirm();

  // Meta form
  const [metaSaveStatus, setMetaSaveStatus] = useState<SaveStatus>("idle");
  const metaForm = useForm<MetaForm>({
    resolver: zodResolver(MetaSchema),
    mode: "onBlur",
  });

  // Terminal form
  const [terminalSaveStatus, setTerminalSaveStatus] = useState<SaveStatus>("idle");
  const terminalForm = useForm<TerminalForm>({
    resolver: zodResolver(TerminalSchema),
    mode: "onBlur",
  });

  // Theme form (standalone toggle — no RHF needed)
  const [themeLocal, setThemeLocal] = useState<"light" | "dark">("light");
  const [themeSaveStatus, setThemeSaveStatus] = useState<SaveStatus>("idle");
  const themeForm = useForm<ThemeForm>({
    resolver: zodResolver(ThemeSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (meta) metaForm.reset(meta);
    if (terminal) terminalForm.reset(terminal);
    if (theme) {
      themeLocal !== theme.defaultMode && setThemeLocal(theme.defaultMode);
      themeForm.reset(theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta, terminal, theme]);

  const handleMetaSave = (values: MetaForm) => {
    metaDiff.request(
      (metaForm.formState.defaultValues ?? {}) as Record<string, unknown>,
      values as Record<string, unknown>,
      "SEO Meta",
      async () => {
        setMetaSaveStatus("saving");
        try {
          await saveMeta(values);
          metaForm.reset(values);
          setMetaSaveStatus("success");
        } catch (err) {
          logger.error("Meta save failed", err);
          setMetaSaveStatus("error");
        }
      },
    );
  };

  const handleTerminalSave = (values: TerminalForm) => {
    terminalDiff.request(
      (terminalForm.formState.defaultValues ?? {}) as Record<string, unknown>,
      values as Record<string, unknown>,
      "Developer Page & Terminal",
      async () => {
        setTerminalSaveStatus("saving");
        try {
          await saveTerminal(values);
          terminalForm.reset(values);
          setTerminalSaveStatus("success");
        } catch (err) {
          logger.error("Terminal save failed", err);
          setTerminalSaveStatus("error");
        }
      },
    );
  };

  const handleThemeSave = () => {
    themeDiff.request(
      { defaultMode: theme?.defaultMode ?? "light" },
      { defaultMode: themeLocal },
      "Default Theme",
      async () => {
        setThemeSaveStatus("saving");
        try {
          await saveTheme({ defaultMode: themeLocal });
          setThemeSaveStatus("success");
        } catch (err) {
          logger.error("Theme save failed", err);
          setThemeSaveStatus("error");
        }
      },
    );
  };

  if (error) {
    return (
      <AdminShell title="Meta & SEO">
        <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-xl">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          Failed to load meta data.
        </div>
      </AdminShell>
    );
  }

  const metaErrors = metaForm.formState.errors;
  const metaIsDirty = metaForm.formState.isDirty;
  const metaIsSubmitting = metaForm.formState.isSubmitting;

  const terminalErrors = terminalForm.formState.errors;
  const terminalIsDirty = terminalForm.formState.isDirty;
  const terminalIsSubmitting = terminalForm.formState.isSubmitting;

  return (
    <AdminShell title="Meta & SEO">
      <div className="max-w-3xl space-y-5">
        {/* SEO Meta */}
        <SectionCard
          title="SEO Meta"
          description="Page title, description, and keywords"
          action={
            <SaveButton
              status={metaIsSubmitting ? "saving" : metaSaveStatus}
              onClick={metaForm.handleSubmit(handleMetaSave)}
            />
          }
        >
          {isLoading ? (
            <FieldSkeleton />
          ) : (
            <form onSubmit={metaForm.handleSubmit(handleMetaSave)} className="space-y-4">
              <FormField label="Title" htmlFor="meta-title" error={metaErrors.title?.message} required>
                <input id="meta-title" {...metaForm.register("title")} className={inputClass(!!metaErrors.title)} placeholder="John Doe — Portfolio" />
              </FormField>
              <FormField label="Description" htmlFor="meta-desc" error={metaErrors.description?.message} required>
                <textarea id="meta-desc" {...metaForm.register("description")} rows={2} className={`${inputClass(!!metaErrors.description)} resize-none`} placeholder="Short site description for search engines" />
              </FormField>
              <FormField label="Keywords" htmlFor="meta-keywords" description="Press Enter or comma to add">
                <Controller
                  name="keywords"
                  control={metaForm.control}
                  render={({ field }) => (
                    <TagInput value={field.value} onChange={field.onChange} placeholder="react, nextjs…" />
                  )}
                />
              </FormField>
            </form>
          )}
        </SectionCard>

        {/* Open Graph */}
        <SectionCard
          title="Open Graph"
          description="Social share preview title and description"
          action={
            <SaveButton
              status={metaIsSubmitting ? "saving" : metaSaveStatus}
              onClick={metaForm.handleSubmit(handleMetaSave)}
            />
          }
        >
          {isLoading ? (
            <FieldSkeleton />
          ) : (
            <form className="space-y-4">
              <FormField label="OG Title" htmlFor="og-title" error={metaErrors.ogTitle?.message}>
                <input id="og-title" {...metaForm.register("ogTitle")} className={inputClass(!!metaErrors.ogTitle)} placeholder="John Doe — Full Stack Developer" />
              </FormField>
              <FormField label="OG Description" htmlFor="og-desc" error={metaErrors.ogDescription?.message}>
                <textarea id="og-desc" {...metaForm.register("ogDescription")} rows={2} className={`${inputClass(!!metaErrors.ogDescription)} resize-none`} placeholder="Social preview description…" />
              </FormField>
            </form>
          )}
        </SectionCard>

        {/* Developer / Terminal */}
        <SectionCard
          title="Developer Page & Terminal"
          description="Content for the /dev page and terminal section"
          action={
            <SaveButton
              status={terminalIsSubmitting ? "saving" : terminalSaveStatus}
              onClick={terminalForm.handleSubmit(handleTerminalSave)}
            />
          }
        >
          {isLoading ? (
            <FieldSkeleton />
          ) : (
            <form onSubmit={terminalForm.handleSubmit(handleTerminalSave)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Dev Title" htmlFor="dev-title" error={metaErrors.devTitle?.message}>
                  <input id="dev-title" {...metaForm.register("devTitle")} className={inputClass(!!metaErrors.devTitle)} placeholder="dev.johndoe.dev" />
                </FormField>
                <FormField label="Dev Description" htmlFor="dev-desc" error={metaErrors.devDescription?.message}>
                  <input id="dev-desc" {...metaForm.register("devDescription")} className={inputClass(!!metaErrors.devDescription)} placeholder="Dev page description" />
                </FormField>
              </div>
              <FormField label="Welcome Message" htmlFor="terminal-welcome" error={terminalErrors.welcomeMessage?.message}>
                <input id="terminal-welcome" {...terminalForm.register("welcomeMessage")} className={inputClass(!!terminalErrors.welcomeMessage)} placeholder="Welcome to my terminal!" />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="pwd Path" htmlFor="terminal-pwd" error={terminalErrors.pwdPath?.message}>
                  <input id="terminal-pwd" {...terminalForm.register("pwdPath")} className={inputClass(!!terminalErrors.pwdPath)} placeholder="/home/johndoe" />
                </FormField>
                <FormField label="Prompt" htmlFor="terminal-prompt" error={terminalErrors.prompt?.message}>
                  <input id="terminal-prompt" {...terminalForm.register("prompt")} className={inputClass(!!terminalErrors.prompt)} placeholder="johndoe@portfolio:~$" />
                </FormField>
                <FormField label="Window Title" htmlFor="terminal-window" error={terminalErrors.windowTitle?.message}>
                  <input id="terminal-window" {...terminalForm.register("windowTitle")} className={inputClass(!!terminalErrors.windowTitle)} placeholder="johndoe — terminal" />
                </FormField>
                <FormField label="whoami Output" htmlFor="terminal-whoami" error={terminalErrors.whoamiOutput?.message}>
                  <input id="terminal-whoami" {...terminalForm.register("whoamiOutput")} className={inputClass(!!terminalErrors.whoamiOutput)} placeholder="johndoe" />
                </FormField>
              </div>
            </form>
          )}
        </SectionCard>

        {/* Theme */}
        <SectionCard
          title="Default Theme"
          description="Initial colour mode for first-time visitors"
          action={<SaveButton status={themeSaveStatus} onClick={handleThemeSave} />}
        >
          {isLoading ? (
            <div className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ) : (
            <div className="flex gap-3">
              {(["light", "dark"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setThemeLocal(mode)}
                  className={[
                    "flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors capitalize",
                    themeLocal === mode
                      ? "bg-blue-600 dark:bg-indigo-600 text-white border-transparent"
                      : "border-slate-300/60 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-indigo-500",
                  ].join(" ")}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <UnsavedBanner
        isDirty={metaIsDirty || terminalIsDirty}
        onSave={() => {
          if (metaIsDirty) metaForm.handleSubmit(handleMetaSave)();
          if (terminalIsDirty) terminalForm.handleSubmit(handleTerminalSave)();
        }}
        status={metaIsSubmitting || terminalIsSubmitting ? "saving" : metaSaveStatus === "error" || terminalSaveStatus === "error" ? "error" : "idle"}
        onDiscard={() => {
          metaForm.reset();
          terminalForm.reset();
        }}
      />

      <DiffModal
        isOpen={metaDiff.isOpen}
        before={metaDiff.before}
        after={metaDiff.after}
        title={metaDiff.title}
        onConfirm={metaDiff.confirm}
        onCancel={metaDiff.cancel}
      />

      <DiffModal
        isOpen={terminalDiff.isOpen}
        before={terminalDiff.before}
        after={terminalDiff.after}
        title={terminalDiff.title}
        onConfirm={terminalDiff.confirm}
        onCancel={terminalDiff.cancel}
      />

      <DiffModal
        isOpen={themeDiff.isOpen}
        before={themeDiff.before}
        after={themeDiff.after}
        title={themeDiff.title}
        onConfirm={themeDiff.confirm}
        onCancel={themeDiff.cancel}
      />
    </AdminShell>
  );
}
