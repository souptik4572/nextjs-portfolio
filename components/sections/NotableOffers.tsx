"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Briefcase, ExternalLink } from "lucide-react";
import { portfolioData } from "@/lib/data";
import type { OfferEntry } from "@/lib/data";
import Image from "next/image";
import type { SectionProps } from "@/app/page";

function OfferCard({
  offer,
  index,
}: {
  offer: OfferEntry;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
    >
      <a
        href={offer.companyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full rounded-xl overflow-hidden bg-white/60 dark:bg-slate-800/40 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/40 macos-shadow hover:border-blue-400/60 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 group"
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 p-1.5 flex items-center justify-center shrink-0">
              <Image
                src={offer.companyLogo}
                alt={`${offer.company} logo`}
                width={48}
                height={48}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
                  {offer.company}
                </h3>
                <ExternalLink size={14} className="text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-blue-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5 text-sm sm:text-base">
                <Briefcase size={14} />
                {offer.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <Calendar size={14} />
            <span>{offer.period}</span>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function NotableOffers({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="notable_offers" className="px-6 md:px-16 lg:px-32 py-16">
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
          Notable Offers
        </h2>
        <div className="mt-2 h-px w-32 bg-blue-500/40 dark:bg-indigo-500/40" />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6 max-w-4xl">
        {Object.entries(portfolioData.notable_offers)
          .filter(([, offer]) => offer.visible !== false)
          .map(([id, offer], i) => (
            <OfferCard key={id} offer={offer} index={i} />
          ))}
      </div>
    </section>
  );
}
