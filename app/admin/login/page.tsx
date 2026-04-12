"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { adminSignIn, adminSignInWithGoogle } from "@/lib/admin/auth";
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const onGoogleSignIn = async () => {
    setAuthError("");
    setIsGoogleLoading(true);
    try {
      await adminSignInWithGoogle();
      router.replace("/admin/dashboard");
    } catch (err) {
      logger.error("Google sign in failed", err);
      setAuthError("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 bg-[#f2f2f7] dark:bg-[#161618]">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Card — macOS window style */}
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.07] bg-white/95 dark:bg-[#2c2c2e]/95 backdrop-blur-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
          {/* Window titlebar */}
          <div className="flex items-center px-5 pt-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.05]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
          </div>

          <div className="px-7 py-6 space-y-5">
          {/* Logo / Initials */}
          <div className="flex flex-col items-center gap-3">
            <span className="w-11 h-11 rounded-[14px] bg-[#007AFF] dark:bg-[#0A84FF] flex items-center justify-center text-white text-lg font-bold shadow-md shadow-[#007AFF]/30">
              A
            </span>
            <div className="text-center">
              <h1 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                Admin Portal
              </h1>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                Sign in to manage your portfolio
              </p>
            </div>
          </div>

          {/* Unauthorised error banner */}
          {isUnauthorised && (
            <div className="flex items-start gap-2 p-3 bg-[#FF3B30]/[0.08] border border-[#FF3B30]/20 rounded-[8px] text-[#FF3B30] dark:text-[#FF453A] text-[13px]">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white rounded-[8px] text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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

          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-black/[0.06] dark:bg-white/[0.06]" />
            <span className="text-[11px] text-slate-400 dark:text-slate-500">or</span>
            <span className="flex-1 h-px bg-black/[0.06] dark:bg-white/[0.06]" />
          </div>

          <motion.button
            type="button"
            onClick={onGoogleSignIn}
            disabled={isGoogleLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2 bg-white dark:bg-[#3a3a3c] border border-black/[0.08] dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-[#48484a] text-slate-800 dark:text-slate-100 rounded-[8px] text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isGoogleLoading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 dark:border-slate-600 dark:border-t-slate-300 rounded-full"
                />
                Signing in…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
