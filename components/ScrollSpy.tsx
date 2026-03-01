"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { SectionKey } from "@/lib/data";

/**
 * Watches each section element via IntersectionObserver and
 * updates the URL hash (e.g. /#projects) as the user scrolls.
 *
 * Uses `history.replaceState` so the browser history isn't polluted
 * with a new entry for every scroll tick.
 */
export default function ScrollSpy({
  sectionIds,
}: {
  sectionIds: SectionKey[];
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on the home page
    if (pathname !== "/") return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    // Track which sections are currently intersecting
    const visibleSet = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSet.add(entry.target.id);
          } else {
            visibleSet.delete(entry.target.id);
          }
        }

        // Pick the first visible section (in DOM / scroll order)
        for (const id of sectionIds) {
          if (visibleSet.has(id)) {
            const newHash = `#${id}`;
            if (window.location.hash !== newHash) {
              history.replaceState(null, "", newHash);
            }
            return;
          }
        }

        // If nothing visible (e.g. between sections at very top), clear hash
        if (visibleSet.size === 0 && window.location.hash) {
          history.replaceState(null, "", pathname);
        }
      },
      {
        // Trigger when 25% of a section is visible
        threshold: 0.25,
        // Offset for the fixed navbar
        rootMargin: "-80px 0px 0px 0px",
      },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIds, pathname]);

  return null;
}
