"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Github, Linkedin, MapPin, Send, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import { portfolioData } from "@/lib/data";
import type { SectionProps } from "@/app/page";

export default function Contact({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { personal } = portfolioData;

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

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear submit status when user modifies form
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setSubmitMessage("");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Thank you! Your message has been sent successfully.");
        // Clear form
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="px-6 md:px-16 lg:px-32 py-16">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
          {sectionIndex !== undefined && (
            <span className="text-blue-600 dark:text-indigo-400 font-mono text-2xl mr-3">{String(sectionIndex).padStart(2, '0')}.</span>
          )}
          Get In Touch
        </h2>
        <div className="mt-2 h-px w-32 bg-blue-500/40 dark:bg-indigo-500/40" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.15 }}
        className="max-w-lg"
      >
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
          I&apos;m currently open to senior engineering opportunities. Whether
          you have a question, a project idea, or just want to say hi — my inbox
          is always open.
        </p>

        <div className="space-y-3 mb-8">
          <a
            href={`mailto:${personal.email}`}
            className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors group"
          >
            <span className="w-9 h-9 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center group-hover:border-blue-500/60 dark:group-hover:border-indigo-500/50 transition-all shrink-0">
              <Mail size={16} />
            </span>
            <span className="break-all text-sm sm:text-base">{personal.email}</span>
          </a>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors group"
          >
            <span className="w-9 h-9 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center group-hover:border-blue-500/60 dark:group-hover:border-indigo-500/50 transition-all shrink-0">
              <Github size={16} />
            </span>
            <span className="break-all text-sm sm:text-base">github.com/souptik4572</span>
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors group"
          >
            <span className="w-9 h-9 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center group-hover:border-blue-500/60 dark:group-hover:border-indigo-500/50 transition-all shrink-0">
              <Linkedin size={16} />
            </span>
            <span className="break-all text-sm sm:text-base">linkedin.com/in/souptik-sarkar</span>
          </a>
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-500">
            <span className="w-9 h-9 rounded-lg bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center shrink-0">
              <MapPin size={16} />
            </span>
            <span className="text-sm sm:text-base">{personal.location}</span>
          </div>
        </div>

        {/* Resume View Button */}
        <a
          href={personal.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 dark:shadow-indigo-500/20 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-indigo-500/30 hover:-translate-y-0.5 mb-8"
        >
          <Eye size={16} />
          View Resume
        </a>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6 max-w-xl"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-2">
              Send me a message
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Fill out the form below and I&apos;ll get back to you as soon as possible.
            </p>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border ${
                errors.name ? "border-red-500" : "border-slate-300/60 dark:border-slate-700/50"
              } rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500/60 dark:focus:border-indigo-500/60 focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-indigo-500/40 transition-all macos-shadow`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border ${
                errors.email ? "border-red-500" : "border-slate-300/60 dark:border-slate-700/50"
              } rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500/60 dark:focus:border-indigo-500/60 focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-indigo-500/40 transition-all macos-shadow`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border ${
                errors.message ? "border-red-500" : "border-slate-300/60 dark:border-slate-700/50"
              } rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500/60 dark:focus:border-indigo-500/60 focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-indigo-500/40 transition-all resize-none macos-shadow`}
              placeholder="Your message..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Message
              </>
            )}
          </button>

          {/* Success/Error Messages */}
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400"
            >
              <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0" />
              <span>{submitMessage}</span>
            </motion.div>
          )}

          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
            >
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <span>{submitMessage}</span>
            </motion.div>
          )}
        </motion.form>
      </motion.div>
    </section>
  );
}
