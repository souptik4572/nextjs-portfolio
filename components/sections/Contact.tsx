"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { SectionProps } from "@/app/page";
import ContactForm from "@/components/ContactForm";

export default function Contact({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

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
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
          I&apos;m currently open to senior engineering opportunities. Whether
          you have a question, a project idea, or just want to say hi — my inbox
          is always open.
        </p>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="max-w-xl"
        >
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-2">
              Send me a message
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Fill out the form below and I&apos;ll get back to you as soon as possible.
            </p>
          </div>

          <ContactForm idPrefix="contact" />
        </motion.div>
      </motion.div>
    </section>
  );
}
