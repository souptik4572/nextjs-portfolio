"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { adminSignIn } from "@/lib/admin/auth";
import { logger } from "@/lib/admin/logger";
import FormField, { inputClass } from "@/components/admin/FormField";

const LoginSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(1, "Required"),
});
type LoginForm = z.infer<typeof LoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUnauthorised = searchParams.get("error") === "unauthorised";

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginForm) => {
    setAuthError("");
    try {
      await adminSignIn(data.email, data.password);
      router.replace("/admin/dashboard");
    } catch (err) {
      logger.error("Sign in failed", err);
      setAuthError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl macos-shadow px-7 py-8 space-y-6">
          {/* Logo / Initials */}
          <div className="flex flex-col items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-indigo-600 flex items-center justify-center text-white text-xl font-bold font-heading">
              A
            </span>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Admin Portal
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-heading">
                Sign in to manage your portfolio
              </p>
            </div>
          </div>

          {/* Unauthorised error banner */}
          {isUnauthorised && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              Access denied — this account is not authorised.
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                {...register("email")}
                className={inputClass(!!errors.email)}
              />
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password?.message} required>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`${inputClass(!!errors.password)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            {authError && (
              <p className="flex items-center gap-1.5 text-sm text-red-400">
                <AlertCircle size={14} />
                {authError}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
