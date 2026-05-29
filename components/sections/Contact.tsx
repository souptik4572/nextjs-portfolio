"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { SectionProps } from "@/app/page";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";

export default function Contact({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const portfolioData = usePortfolioData();

  return (
    <section id="contact" className="px-6 md:px-16 lg:px-32 py-16">
      <SectionHeading index={sectionIndex} title="Get In Touch" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.15 }}
        className="max-w-lg"
      >
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
          {portfolioData.personal.contactBlurb}
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
