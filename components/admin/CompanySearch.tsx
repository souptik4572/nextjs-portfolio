"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import { inputClass } from "./FormField";

export interface CompanySuggestion {
  name: string;
  domain: string;
  /** Full URL to the company logo (e.g. https://cdn.brandfetch.io/<brandId>/...). */
  logo: string;
}

interface CompanySearchProps {
  /** Called when the user picks a suggestion. Receives name, domain, logo URL. */
  onSelect: (s: CompanySuggestion) => void;
  placeholder?: string;
  label?: string;
}

/** Brand Search base. Free, CORS-enabled, takes a public client ID as `?c=`. */
const ENDPOINT = "https://api.brandfetch.io/v2/search";
const CLIENT_ID = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID;

interface BrandfetchHit {
  brandId?: string;
  name?: string;
  domain?: string;
  icon?: string;
  verified?: boolean;
}

/**
 * Combobox-style company search backed by Brandfetch's Brand Search API.
 * Surfaces a debounced dropdown of suggestions with logo thumbnails; selecting
 * one calls `onSelect`. The input then clears so the parent form's fields
 * become the source of truth.
 *
 * Requires PUBLIC_BRANDFETCH_CLIENT_ID in the env (exposed as
 * NEXT_PUBLIC_BRANDFETCH_CLIENT_ID via next.config.mjs). Without it the
 * dropdown surfaces a config message and manual fields still work.
 *
 * Swapping providers later is a one-place change inside the fetch effect.
 */
export default function CompanySearch({
  onSelect,
  placeholder = "Search by company name…",
  label = "Lookup company",
}: CompanySearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Debounced fetch of suggestions whenever the query changes.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setErrorMsg(null);
      return;
    }

    if (!CLIENT_ID) {
      setErrorMsg(
        "Set PUBLIC_BRANDFETCH_CLIENT_ID in .env to enable company lookup.",
      );
      setSuggestions([]);
      return;
    }

    const handle = window.setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const url = `${ENDPOINT}/${encodeURIComponent(trimmed)}?c=${CLIENT_ID}`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
        const raw = (await res.json()) as BrandfetchHit[];
        const mapped: CompanySuggestion[] = raw
          .filter((h): h is BrandfetchHit & { name: string; domain: string } =>
            Boolean(h.name && h.domain),
          )
          .map((h) => ({
            name: h.name,
            domain: h.domain,
            logo: h.icon ?? "",
          }));
        setSuggestions(mapped);
        setIsOpen(true);
        setHighlightedIdx(mapped.length > 0 ? 0 : -1);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setErrorMsg("Lookup unavailable. Please fill the fields manually.");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(handle);
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (s: CompanySuggestion) => {
    onSelect(s);
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    setHighlightedIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Escape") setIsOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIdx(
        (i) => (i - 1 + suggestions.length) % suggestions.length,
      );
    } else if (e.key === "Enter" && highlightedIdx >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`${inputClass(false)} !pl-9 !pr-9`}
        />
        {isLoading ? (
          <Loader2
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 animate-spin"
          />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        ) : null}
      </div>

      {errorMsg && (
        <p className="mt-1.5 text-[11px] text-[#FF3B30] dark:text-[#FF453A]">
          {errorMsg}
        </p>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-72 overflow-auto rounded-lg border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-[#1c1c1e] shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li key={`${s.domain}-${i}`} role="option" aria-selected={i === highlightedIdx}>
              <button
                type="button"
                onMouseEnter={() => setHighlightedIdx(i)}
                onClick={() => handleSelect(s)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                  i === highlightedIdx
                    ? "bg-slate-100 dark:bg-slate-800"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="w-7 h-7 rounded-md overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center shrink-0">
                  {s.logo ? (
                    // Plain <img>: these are transient 28px thumbnails from a third-party domain;
                    // routing them through next/image would require allow-listing every possible host.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.logo}
                      alt=""
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {s.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {s.domain}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
