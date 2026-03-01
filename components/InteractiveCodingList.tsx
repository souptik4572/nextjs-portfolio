"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const palette = {
  dark: {
    green: "#4ade80",
    blue: "#60a5fa",
    text: "#d1d5db",
    muted: "#9ca3af",
    selectedBg: "#1e293b",
  },
  light: {
    green: "#16a34a",
    blue: "#2563eb",
    text: "#334155",
    muted: "#64748b",
    selectedBg: "#e2e8f0",
  },
} as const;

interface CodingProfile {
  title: string;
  url: string;
  image: string;
}

interface InteractiveCodingListProps {
  profiles: Record<string, CodingProfile>;
  onComplete: (result: React.ReactNode) => void;
}

export default function InteractiveCodingList({
  profiles,
  onComplete,
}: InteractiveCodingListProps) {
  const keys = Object.keys(profiles);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const readyRef = useRef(false);
  const selectedIndexRef = useRef(0);
  const { theme } = useTheme();
  const c = palette[theme];

  // Keep ref in sync so the capture handler always reads the latest index
  selectedIndexRef.current = selectedIndex;

  // Short delay so the Enter that submitted the terminal command
  // doesn't immediately trigger a selection.
  useEffect(() => {
    const timer = setTimeout(() => {
      readyRef.current = true;
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive || !readyRef.current) return;

      const handled = ["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key);
      if (!handled) return;

      // Stop the event from reaching react-terminal’s listener on document
      e.stopPropagation();
      e.preventDefault();

      switch (e.key) {
        case "ArrowDown":
          setSelectedIndex((prev) => (prev + 1) % keys.length);
          break;
        case "ArrowUp":
          setSelectedIndex((prev) => (prev - 1 + keys.length) % keys.length);
          break;
        case "Enter": {
          const idx = selectedIndexRef.current;
          const key = keys[idx];
          window.open(profiles[key].url, "_blank");
          setIsActive(false);
          onComplete(
            <span style={{ color: c.muted, fontSize: "13px" }}>
              Opened <span style={{ color: c.blue, fontWeight: 600 }}>{profiles[key].title}</span> in a new tab.
            </span>,
          );
          break;
        }
        case "Escape":
          setIsActive(false);
          onComplete(
            <span style={{ color: c.muted, fontSize: "13px" }}>Cancelled.</span>,
          );
          break;
      }
    },
    [isActive, keys, profiles, onComplete, c],
  );

  // Capture-phase listener on window fires BEFORE react-terminal’s
  // bubble-phase listener on document, so stopPropagation prevents
  // the terminal from seeing arrow / enter / escape keys.
  useEffect(() => {
    if (!isActive) return;
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isActive, handleKeyDown]);

  return (
    <div className="py-2" style={{ fontFamily: "monospace" }}>
      <p style={{ color: c.green, fontWeight: 600, marginBottom: "8px" }}>
        Coding Profiles — select one:
      </p>

      {keys.map((key, i) => {
        const profile = profiles[key];
        const selected = i === selectedIndex;

        return (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "3px 8px",
              borderRadius: "4px",
              backgroundColor: selected ? c.selectedBg : "transparent",
              color: selected ? c.green : c.text,
              fontWeight: selected ? 700 : 400,
              transition: "all 120ms ease",
            }}
          >
            <span style={{ width: "16px", textAlign: "center" }}>
              {selected ? "❯" : " "}
            </span>
            <img
              src={profile.image}
              alt={profile.title}
              style={{
                width: "18px",
                height: "18px",
                objectFit: "contain",
                filter: theme === "dark" ? "brightness(0) invert(1)" : "none",
              }}
            />
            <span>{profile.title}</span>
            <span style={{ color: c.muted, fontSize: "12px", marginLeft: "4px" }}>
              {profile.url}
            </span>
          </div>
        );
      })}

      <p style={{ color: c.muted, fontSize: "12px", marginTop: "10px" }}>
        [↑/↓] Navigate &nbsp;|&nbsp; [Enter] Open &nbsp;|&nbsp; [Esc] Cancel
      </p>
    </div>
  );
}
