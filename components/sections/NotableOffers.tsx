"use client";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import type { OfferEntry } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import type { SectionProps } from "@/app/page";

/**
 * One marquee card. Mirrors the design's `.offer-card`: a fixed 280px tile with
 * the company logo + name up top and role / date pinned to the bottom. Hover
 * lifts the card and lights its border with the accent.
 */
function OfferCard({ offer }: { offer: OfferEntry }) {
  return (
    <a
      href={offer.companyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card flex-none w-[280px] min-h-[140px] flex flex-col justify-between p-6 rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm hover:border-blue-500/70 dark:hover:border-indigo-400/60 hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* .offer-top — logo + company name */}
      <div className="flex items-center gap-3 mb-5">
        {offer.companyLogo ? (
          <span className="grid place-items-center w-9 h-9 shrink-0 rounded-md bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 overflow-hidden p-1">
            <Image
              src={offer.companyLogo}
              alt={`${offer.company} logo`}
              width={36}
              height={36}
              className="object-contain w-full h-full"
            />
          </span>
        ) : (
          <span className="grid place-items-center w-9 h-9 shrink-0 rounded-md bg-blue-600 dark:bg-indigo-500 font-heading font-bold text-[15px] text-white">
            {offer.company.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="font-heading font-medium text-[17px] tracking-tight text-slate-900 dark:text-slate-100 truncate">
          {offer.company}
        </span>
      </div>

      {/* role + date */}
      <div>
        <div className="text-[13.5px] leading-snug text-slate-600 dark:text-slate-400 mb-1.5 truncate">
          {offer.role}
        </div>
        <div
          className={`font-mono text-[11.5px] tracking-wide text-slate-500 dark:text-slate-500 ${
            offer.period ? "" : "opacity-0"
          }`}
        >
          {offer.period || "·"}
        </div>
      </div>
    </a>
  );
}

export default function NotableOffers({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const portfolioData = usePortfolioData();
  const reduceMotion = useReducedMotion();

  // Sort by admin-configured `order` (entries without one fall to the end,
  // key breaks ties), then keep only visible offers. Each company appears once.
  const offers = Object.entries(portfolioData.notable_offers)
    .sort(([keyA, a], [keyB, b]) => {
      const oa = a.order ?? Number.POSITIVE_INFINITY;
      const ob = b.order ?? Number.POSITIVE_INFINITY;
      if (oa !== ob) return oa - ob;
      return keyA.localeCompare(keyB);
    })
    .filter(([, offer]) => offer.visible !== false)
    .map(([, offer]) => offer);

  if (offers.length === 0) return null;

  
  const leadInOffer = offers.find((offer) => offer.order === 6);
  const displayOrder = leadInOffer ? [leadInOffer, ...offers] : offers;

  // Scale the loop duration to the card count so the scroll speed stays
  // roughly constant no matter how many offers there are (design: ~36s / 8).
  const durationSeconds = Math.max(24, displayOrder.length * 5);

  // Duplicate the list so a -50% translateX lands on the second copy → seamless.
  const looped = [...displayOrder, ...displayOrder];

  return (
    <section ref={ref} id="notable_offers" className="px-6 md:px-16 lg:px-32 py-16 overflow-hidden">
      <SectionHeading
        index={sectionIndex}
        title="Notable Offers"
        blurb="Companies that have extended offers across multiple cycles — a snapshot of how the market has valued my work."
      />

      {reduceMotion ? (
        // Reduced motion: lay the cards out statically, no animation.
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-5"
        >
          {offers.map((offer, i) => (
            <OfferCard key={`offer-${i}`} offer={offer} />
          ))}
        </motion.div>
      ) : (
        // Full-bleed marquee with edge fade-out (design's `.offers-wrap`).
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="group relative -mx-6 md:-mx-16 lg:-mx-32 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <div
            className={`flex w-max gap-5 [animation:notable-offers-marquee-left_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none] ${
              // Park on the top-ranked offers (orders 1–4 lead the sorted list)
              // until the section scrolls into view, then resume from the start.
              inView ? "" : "[animation-play-state:paused]"
            }`}
            style={{ "--marquee-duration": `${durationSeconds}s` } as React.CSSProperties}
          >
            {looped.map((offer, i) => (
              <OfferCard key={`offer-${i}`} offer={offer} />
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
