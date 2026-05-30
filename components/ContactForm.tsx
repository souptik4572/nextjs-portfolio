"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";

interface ContactFormProps {
  /** Optional id-prefix to avoid duplicate ids when the form appears in multiple places */
  idPrefix?: string;
}

/** Editorial mono field label — uppercase, tracked, muted. Mirrors the design's `.field label`. */
const LABEL_CLASS =
  "block font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 mb-2";

/** Shared input styling — accent border + soft glow on focus (design's `:focus` glow). */
const FIELD_BASE =
  "w-full px-4 py-3 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500/70 dark:focus:border-indigo-400/70 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-indigo-400/25 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)] dark:focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-all";

export default function ContactForm({ idPrefix = "" }: ContactFormProps) {
  const pfx = idPrefix ? `${idPrefix}-` : "";
  const { personal } = usePortfolioData();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  // mailto fallback so a message is never lost even if the API hiccups
  const [mailtoFallback, setMailtoFallback] = useState("");

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setSubmitMessage("");
      setMailtoFallback("");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = { name: "", email: "", message: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Build a mailto: fallback link from the submitted payload
  const buildMailto = (data: typeof formData) =>
    `mailto:${personal.email}?subject=${encodeURIComponent(
      `Portfolio enquiry from ${data.name}`,
    )}&body=${encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`)}`;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { ...formData };
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");
    setMailtoFallback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Thanks — your message is on its way. I'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Failed to send message. Please try again.");
        setMailtoFallback(buildMailto(payload));
      }
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("An error occurred. Please try again later.");
      setMailtoFallback(buildMailto(payload));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor={`${pfx}name`} className={LABEL_CLASS}>
          Your name
        </label>
        <input
          type="text"
          id={`${pfx}name`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`${FIELD_BASE} border ${
            errors.name ? "border-red-500" : "border-slate-300/60 dark:border-slate-700/50"
          }`}
          placeholder="Jane Recruiter"
          maxLength={100}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor={`${pfx}email`} className={LABEL_CLASS}>
          Email
        </label>
        <input
          type="email"
          id={`${pfx}email`}
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`${FIELD_BASE} border ${
            errors.email ? "border-red-500" : "border-slate-300/60 dark:border-slate-700/50"
          }`}
          placeholder="jane@company.com"
          maxLength={254}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.email}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor={`${pfx}message`} className={LABEL_CLASS}>
          Message
        </label>
        <textarea
          id={`${pfx}message`}
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`${FIELD_BASE} resize-y min-h-[110px] border ${
            errors.message ? "border-red-500" : "border-slate-300/60 dark:border-slate-700/50"
          }`}
          placeholder="We're hiring a senior backend engineer and your profile caught my eye…"
          maxLength={5000}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex w-full items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 dark:shadow-indigo-500/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {submitStatus === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400"
          >
            <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0" />
            <span>{submitMessage}</span>
          </motion.div>
        )}

        {submitStatus === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-1.5 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
          >
            <span className="flex items-start gap-2">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              {submitMessage}
            </span>
            {mailtoFallback && (
              <a
                href={mailtoFallback}
                className="ml-7 font-mono text-xs text-blue-500 dark:text-indigo-300 hover:underline"
              >
                Open in your mail app →
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alt contact — design's `.modal-alt` */}
      <div className="mt-2 pt-5 border-t border-slate-200/60 dark:border-slate-700/50 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs text-slate-500 dark:text-slate-400">
        <a
          href={`mailto:${personal.email}`}
          className="hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
        >
          {personal.email}
        </a>
        {personal.linkedin && (
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
          >
            LinkedIn ↗
          </a>
        )}
      </div>
    </form>
  );
}
