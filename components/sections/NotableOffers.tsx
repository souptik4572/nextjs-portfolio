"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Briefcase, ExternalLink } from "lucide-react";
import { usePortfolioData } from "@/contexts/PortfolioDataContext";
import type { OfferEntry } from "@/lib/data";
import Image from "next/image";
import type { SectionProps } from "@/app/page";

const ROW_HEIGHT = 340;

interface Slot {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PackTemplate {
  id: string;
  width: number;
  slots: Slot[];
}

/**
 * Pack templates — each defines a Pinterest-style packed arrangement of slots
 * within a fixed-width column the height of the marquee row. Slot rectangles
 * are hand-tuned so they pack tightly without overlap; internal gap is 12px,
 * matching the inter-pack gap, so the whole chain reads as one continuous
 * masonry grid rather than discrete clusters.
 */
const PACK_TEMPLATES: PackTemplate[] = [
  // A — Hero left + 2-stack right
  {
    id: "A",
    width: 472,
    slots: [
      { x: 0,   y: 0,   w: 280, h: 340 },
      { x: 292, y: 0,   w: 180, h: 164 },
      { x: 292, y: 176, w: 180, h: 164 },
    ],
  },
  // B — 2×2 mosaic
  {
    id: "B",
    width: 380,
    slots: [
      { x: 0,   y: 0,   w: 184, h: 164 },
      { x: 196, y: 0,   w: 184, h: 164 },
      { x: 0,   y: 176, w: 184, h: 164 },
      { x: 196, y: 176, w: 184, h: 164 },
    ],
  },
  // C — Tall portrait + square + wide
  {
    id: "C",
    width: 452,
    slots: [
      { x: 0,   y: 0,   w: 200, h: 340 },
      { x: 212, y: 0,   w: 240, h: 220 },
      { x: 212, y: 232, w: 240, h: 108 },
    ],
  },
  // D — Wide banner top + 3-stack below
  {
    id: "D",
    width: 440,
    slots: [
      { x: 0,   y: 0,   w: 440, h: 130 },
      { x: 0,   y: 142, w: 140, h: 198 },
      { x: 152, y: 142, w: 136, h: 198 },
      { x: 300, y: 142, w: 140, h: 198 },
    ],
  },
  // E — Big square left + 3 minis stacked right
  {
    id: "E",
    width: 440,
    slots: [
      { x: 0,   y: 0,   w: 240, h: 340 },
      { x: 252, y: 0,   w: 188, h: 104 },
      { x: 252, y: 116, w: 188, h: 104 },
      { x: 252, y: 228, w: 188, h: 112 },
    ],
  },
];

const TILE_BASE =
  "group/card relative block w-full h-full rounded-2xl overflow-hidden bg-white/60 dark:bg-slate-800/40 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/40 macos-shadow hover:border-blue-400/60 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300";

interface TileSizing {
  layout: "horizontal" | "vertical" | "centered";
  showRole: boolean;
  showPeriod: boolean;
  logoPx: number;
  /** Inner padding inside the tile. */
  pad: number;
  /** Gap between logo block and text block. */
  innerGap: number;
  /** Max width (px) for the text column so truncation has something to bound against. */
  textMaxW: number;
  /** Font size (px) for the company name. */
  nameSize: number;
  roleSize: number;
  periodSize: number;
  /** Whether the role string should wrap to a 2nd line (when single-line would truncate AND 2 lines fit). */
  roleLines: 1 | 2;
}

/**
 * Compute logo + text sizes that try to fill the slot without overflowing,
 * given the slot's dimensions AND the company name's character count.
 *
 * Strategy:
 *  - Pick a layout from aspect ratio.
 *  - Gate role/period by area so smaller slots stay logo+name-only.
 *  - First-pass-estimate text height, give the rest to the logo.
 *  - Second-pass: actually fit nameSize against both the available width
 *    (chars × char-ratio × fontSize ≤ width) and the available vertical
 *    budget (after the logo is placed).
 *  - Role and period scale proportionally (0.5× and 0.4× of nameSize) so the
 *    hierarchy stays consistent across very different tile sizes.
 */
function computeSizing(offer: OfferEntry, width: number, height: number): TileSizing {
  const pad = width < 140 || height < 140 ? 10 : 14;
  const innerGap = width < 160 ? 6 : 10;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const area = width * height;
  const ratio = width / height;

  const layout: TileSizing["layout"] =
    ratio > 1.5 ? "horizontal" : ratio < 0.85 ? "vertical" : "centered";

  // Bias toward giving the logo+name room: only show role/period when there's space.
  const showRole = area > 18000;
  const showPeriod = area > 42000;
  const lines = 1 + (showRole ? 1 : 0) + (showPeriod ? 1 : 0);

  // Approximate proportion of the text stack height each line contributes.
  const REL_PER_LINE = 1 + (showRole ? 0.5 : 0) + (showPeriod ? 0.4 : 0);
  const LINE_H = 1.2;
  const TEXT_GAP = 4;
  const CHAR_RATIO = 0.58;

  // Caps so a hero tile's text doesn't dominate the layout.
  const NAME_MIN = 13;
  const NAME_MAX = 22;
  const ROLE_MIN = 10;
  const ROLE_MAX = 14;
  const PERIOD_MIN = 9;
  const PERIOD_MAX = 12;
  const LOGO_MAX = 110;
  const LOGO_MIN = 30;

  // Pass 1: rough name estimate from width only, used to budget logo size.
  const charCount = Math.max(offer.company.length, 4);
  const textWidthBudget1 =
    layout === "horizontal" ? Math.max(40, innerW - 64 - innerGap) : innerW;
  const nameEst = Math.min(NAME_MAX, Math.max(NAME_MIN, textWidthBudget1 / (charCount * CHAR_RATIO)));
  const roleEst = showRole ? Math.max(ROLE_MIN, nameEst * 0.65) : 0;
  const periodEst = showPeriod ? Math.max(PERIOD_MIN, nameEst * 0.5) : 0;
  const estTextH =
    nameEst * LINE_H +
    (showRole ? roleEst * LINE_H + TEXT_GAP : 0) +
    (showPeriod ? periodEst * LINE_H + TEXT_GAP : 0);

  // Pass 1: logo gets whatever space remains, capped so it never dominates.
  let logoPx: number;
  if (layout === "horizontal") {
    logoPx = Math.min(innerH * 0.85, innerW * 0.4);
  } else if (layout === "vertical") {
    logoPx = Math.min(innerW * 0.7, innerH - estTextH - innerGap);
  } else {
    logoPx = Math.min(innerW * 0.55, innerH - estTextH - innerGap);
  }
  logoPx = Math.max(LOGO_MIN, Math.min(logoPx, LOGO_MAX));

  // Pass 2: now that logo is fixed, fit nameSize against actual width + height budgets.
  const textAvailW = layout === "horizontal" ? innerW - logoPx - innerGap : innerW;
  const vBudget = layout === "horizontal" ? innerH : innerH - logoPx - innerGap;
  const gaps = Math.max(0, lines - 1) * TEXT_GAP;
  const maxNameByHeight = (vBudget - gaps) / (REL_PER_LINE * LINE_H);
  const maxNameByWidth = textAvailW / (charCount * CHAR_RATIO);
  let nameSize = Math.min(maxNameByWidth, maxNameByHeight);
  nameSize = Math.max(NAME_MIN, Math.min(nameSize, NAME_MAX));
  nameSize = Math.round(nameSize);

  const roleSize = Math.max(ROLE_MIN, Math.min(Math.round(nameSize * 0.65), ROLE_MAX));
  const periodSize = Math.max(PERIOD_MIN, Math.min(Math.round(nameSize * 0.5), PERIOD_MAX));

  // Wrap role to 2 lines when single-line would truncate AND we have vertical room for the 2nd line.
  let roleLines: 1 | 2 = 1;
  if (showRole) {
    const roleChars = Math.max(offer.role.length, 4);
    const roleIconAndGap = roleSize + 6; // briefcase icon (~roleSize) + 6px gap
    const roleSingleLineW = roleChars * CHAR_RATIO * roleSize + roleIconAndGap;
    const wouldTruncate = roleSingleLineW > textAvailW;
    if (wouldTruncate) {
      const stack2LineH =
        nameSize * LINE_H +
        2 * roleSize * LINE_H +
        TEXT_GAP +
        (showPeriod ? periodSize * LINE_H + TEXT_GAP : 0);
      if (stack2LineH <= vBudget) {
        roleLines = 2;
      }
    }
  }

  return {
    layout,
    showRole,
    showPeriod,
    logoPx: Math.round(logoPx),
    pad,
    innerGap,
    textMaxW: Math.round(textAvailW),
    nameSize,
    roleSize,
    periodSize,
    roleLines,
  };
}

function DynamicLogo({ offer, px }: { offer: OfferEntry; px: number }) {
  const logoPad = Math.max(4, Math.round(px * 0.12));
  return (
    <div
      className="rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center shrink-0"
      style={{ width: `${px}px`, height: `${px}px`, padding: `${logoPad}px` }}
    >
      <Image
        src={offer.companyLogo}
        alt={`${offer.company} logo`}
        width={px}
        height={px}
        className="object-contain w-full h-full"
      />
    </div>
  );
}

/**
 * Auto-picks layout, content density, and dynamic font + logo sizes so that
 * the logo and company name fill as much of the slot as possible regardless
 * of the slot's dimensions.
 */
function AutoTile({
  offer,
  width,
  height,
}: {
  offer: OfferEntry;
  width: number;
  height: number;
}) {
  const s = computeSizing(offer, width, height);

  const extIcon = (
    <ExternalLink
      size={Math.max(10, Math.round(s.nameSize * 0.55))}
      className="text-slate-400 dark:text-slate-500 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0"
    />
  );
  const nameNode = (
    <div className="flex items-center gap-1 min-w-0 justify-center max-w-full">
      <h3
        className="font-bold text-slate-900 dark:text-slate-100 truncate min-w-0 leading-tight"
        style={{ fontSize: `${s.nameSize}px` }}
      >
        {offer.company}
      </h3>
      {extIcon}
    </div>
  );
  const roleNode = (
    <p
      className="text-blue-600 dark:text-indigo-400 font-semibold flex items-center justify-center gap-1 min-w-0 leading-tight max-w-full"
      style={{ fontSize: `${s.roleSize}px` }}
    >
      <Briefcase size={Math.max(10, Math.round(s.roleSize * 0.95))} className="shrink-0" />
      <span
        className={`${s.roleLines === 2 ? "line-clamp-2" : "truncate"} min-w-0 text-center`}
      >
        {offer.role}
      </span>
    </p>
  );
  const periodNode = (
    <p
      className="text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1 min-w-0 leading-tight max-w-full"
      style={{ fontSize: `${s.periodSize}px` }}
    >
      <Calendar size={Math.max(9, Math.round(s.periodSize * 0.95))} className="shrink-0" />
      <span className="truncate min-w-0">{offer.period}</span>
    </p>
  );

  // Center the logo + text group in both axes regardless of layout direction.
  // "horizontal" puts them side-by-side; the other layouts stack them.
  const groupDirection = s.layout === "horizontal" ? "flex-row" : "flex-col";

  const inner = (
    <div
      className={`h-full flex ${groupDirection} items-center justify-center text-center`}
      style={{ padding: `${s.pad}px`, gap: `${s.innerGap}px` }}
    >
      <DynamicLogo offer={offer} px={s.logoPx} />
      <div
        className="flex flex-col items-center min-w-0"
        style={{ gap: "3px", maxWidth: `${s.textMaxW}px` }}
      >
        {nameNode}
        {s.showRole && roleNode}
        {s.showPeriod && periodNode}
      </div>
    </div>
  );

  return (
    <a
      href={offer.companyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={TILE_BASE}
    >
      {inner}
    </a>
  );
}

interface PackInstance {
  template: PackTemplate;
  offers: OfferEntry[];
  key: string;
}

/**
 * Renders one packed bento "column" — a fixed-width container with the marquee
 * row's height, holding absolutely-positioned tiles in the template's layout.
 */
function Pack({ instance }: { instance: PackInstance }) {
  const { template, offers } = instance;
  return (
    <div
      className="relative shrink-0"
      style={{ width: `${template.width}px`, height: `${ROW_HEIGHT}px` }}
    >
      {template.slots.map((slot, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${slot.x}px`,
            top: `${slot.y}px`,
            width: `${slot.w}px`,
            height: `${slot.h}px`,
          }}
        >
          <AutoTile offer={offers[i]} width={slot.w} height={slot.h} />
        </div>
      ))}
    </div>
  );
}

/**
 * Chain packs into a long track. Each cycle rotates the pack ordering so the
 * arrangement keeps evolving across the unit — by the time the loop wraps,
 * the same offer has appeared multiple times in different slot positions and
 * different pack contexts.
 */
function buildTrack(offers: OfferEntry[], minRepeatPerOffer = 3): PackInstance[] {
  if (offers.length === 0) return [];
  const slotsPerCycle = PACK_TEMPLATES.reduce((s, t) => s + t.slots.length, 0);
  const cyclesNeeded = Math.max(
    2,
    Math.ceil((offers.length * minRepeatPerOffer) / slotsPerCycle)
  );
  const packs: PackInstance[] = [];
  let offerIdx = 0;
  for (let c = 0; c < cyclesNeeded; c++) {
    const rotate = c % PACK_TEMPLATES.length;
    const order = [
      ...PACK_TEMPLATES.slice(rotate),
      ...PACK_TEMPLATES.slice(0, rotate),
    ];
    for (let p = 0; p < order.length; p++) {
      const template = order[p];
      const packOffers: OfferEntry[] = [];
      for (let s = 0; s < template.slots.length; s++) {
        packOffers.push(offers[offerIdx % offers.length]);
        offerIdx += 1;
      }
      packs.push({ template, offers: packOffers, key: `${c}-${p}-${template.id}` });
    }
  }
  return packs;
}

function BentoMarquee({
  track,
  durationSeconds,
}: {
  track: PackInstance[];
  durationSeconds: number;
}) {
  if (track.length === 0) return null;
  // Duplicate so a -50% translateX lands on the next copy → seamless loop.
  const doubled = [...track, ...track];
  return (
    <div
      className="group relative overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
      }}
    >
      <div
        className="flex items-stretch gap-3 w-max py-4 group-hover:[animation-play-state:paused]"
        style={{
          animation: `notable-offers-marquee-left ${durationSeconds}s linear infinite`,
          willChange: "transform",
        }}
      >
        {doubled.map((p, i) => (
          <Pack key={`${p.key}-${i}`} instance={p} />
        ))}
      </div>
    </div>
  );
}

export default function NotableOffers({ sectionIndex }: SectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const portfolioData = usePortfolioData();
  const reduceMotion = useReducedMotion();

  // Sort by the admin-configured `order` field; entries without one go to the
  // end. Key is a stable tiebreaker. Filter to visible after sorting so the
  // index→shape mapping in `buildTrack` stays stable across visibility toggles.
  const offers = Object.entries(portfolioData.notable_offers)
    .sort(([keyA, a], [keyB, b]) => {
      const oa = a.order ?? Number.POSITIVE_INFINITY;
      const ob = b.order ?? Number.POSITIVE_INFINITY;
      if (oa !== ob) return oa - ob;
      return keyA.localeCompare(keyB);
    })
    .filter(([, offer]) => offer.visible !== false)
    .map(([, offer]) => offer);

  const track = buildTrack(offers);

  return (
    <section id="notable_offers" className="px-6 md:px-16 lg:px-32 py-16 overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
          {sectionIndex !== undefined && (
            <span className="text-blue-600 dark:text-indigo-400 font-mono text-2xl mr-3">
              {String(sectionIndex).padStart(2, "0")}.
            </span>
          )}
          Notable Offers
        </h2>
        <div className="mt-2 h-px w-32 bg-blue-500/40 dark:bg-indigo-500/40" />
      </motion.div>

      {reduceMotion ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-stretch gap-3"
        >
          {track.map((p, i) => (
            <Pack key={`static-${p.key}-${i}`} instance={p} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="-mx-6 md:-mx-16 lg:-mx-32"
        >
          <BentoMarquee track={track} durationSeconds={90} />
        </motion.div>
      )}
    </section>
  );
}
