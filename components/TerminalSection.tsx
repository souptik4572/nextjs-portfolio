"use client";
import { ReactTerminal, TerminalContextProvider } from "react-terminal";
import { portfolioData } from "@/lib/data";
import { TrafficLights } from "@/components/MacOSElements";
import { useTheme } from "@/contexts/ThemeContext";

/* ── colour palettes for terminal command output ────────────────── */
const palette = {
  dark: {
    green: "#4ade80",
    blue: "#60a5fa",
    yellow: "#facc15",
    text: "#d1d5db",
    muted: "#9ca3af",
  },
  light: {
    green: "#16a34a",
    blue: "#2563eb",
    yellow: "#a16207",
    text: "#334155",
    muted: "#64748b",
  },
} as const;

function TerminalCommands() {
  const { personal, experience, skills, projects, achievements, notable_offers } = portfolioData;
  const { theme } = useTheme();
  const c = palette[theme];

  const commands = {
    help: (
      <div className="py-2">
        <p style={{ color: c.green, fontWeight: 600, marginBottom: "8px" }}>
          Available Commands:
        </p>
        {[
          { cmd: "intro", desc: "About me & contact links" },
          { cmd: "experience", desc: "Work experience" },
          { cmd: "skills", desc: "Technical skills" },
          { cmd: "projects", desc: "Featured projects" },
          { cmd: "achievements", desc: "Achievements & awards" },
          { cmd: "offers", desc: "Notable job offers" },
          { cmd: "clear", desc: "Clear the terminal" },
        ].map(({ cmd, desc }) => (
          <div key={cmd} style={{ display: "flex", gap: "12px", padding: "2px 0" }}>
            <span style={{ color: c.blue, fontFamily: "monospace", minWidth: "140px" }}>
              {cmd}
            </span>
            <span style={{ color: c.text }}>{desc}</span>
          </div>
        ))}
      </div>
    ),

    intro: (
      <div className="py-2">
        <p style={{ color: c.green, fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>
          {personal.name} — {personal.role}
        </p>
        <p style={{ color: c.text, lineHeight: "1.6", marginBottom: "12px" }}>
          {personal.bio}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ color: c.text }}>
            <span style={{ color: c.yellow }}>📧 Email: </span>
            <a href={`mailto:${personal.email}`} style={{ color: c.blue, textDecoration: "underline" }}>
              {personal.email}
            </a>
          </span>
          <span style={{ color: c.text }}>
            <span style={{ color: c.yellow }}>🐙 GitHub: </span>
            <a href={personal.coding_profiles.github} target="_blank" rel="noopener noreferrer" style={{ color: c.blue, textDecoration: "underline" }}>
              {personal.coding_profiles.github}
            </a>
          </span>
          <span style={{ color: c.text }}>
            <span style={{ color: c.yellow }}>💼 LinkedIn: </span>
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: c.blue, textDecoration: "underline" }}>
              {personal.linkedin}
            </a>
          </span>
          <span style={{ color: c.text }}>
            <span style={{ color: c.yellow }}>📍 Location: </span>
            {personal.location}
          </span>
        </div>
      </div>
    ),

    experience: (
      <div className="py-2">
        {experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom: "16px" }}>
            <p style={{ color: c.green, fontWeight: 700, fontSize: "15px" }}>
              {exp.role}
            </p>
            <p style={{ color: c.blue }}>
              @ {exp.company}
              <span style={{ color: c.muted, marginLeft: "8px" }}>| {exp.period}</span>
            </p>
            <p style={{ color: c.muted, fontSize: "13px", marginBottom: "6px" }}>
              📍 {exp.location}
            </p>
            <div style={{ paddingLeft: "8px" }}>
              {exp.highlights.map((h, i) => (
                <p key={i} style={{ color: c.text, lineHeight: "1.5", padding: "2px 0" }}>
                  <span style={{ color: c.green, marginRight: "8px" }}>▹</span>
                  {h}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),

    skills: (
      <div className="py-2">
        {skills.map((group) => (
          <div key={group.category} style={{ marginBottom: "10px" }}>
            <span style={{ color: c.green, fontWeight: 600 }}>
              {group.category}:
            </span>{" "}
            <span style={{ color: c.text }}>
              {group.items.join(", ")}
            </span>
          </div>
        ))}
      </div>
    ),

    projects: (
      <div className="py-2">
        {projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: "16px" }}>
            <p style={{ color: c.green, fontWeight: 700, fontSize: "15px" }}>
              {proj.title}
            </p>
            <p style={{ color: c.yellow, fontSize: "13px", marginBottom: "4px" }}>
              Tech: {proj.tech.join(", ")}
            </p>
            <p style={{ color: c.text, lineHeight: "1.5", marginBottom: "4px" }}>
              {proj.description}
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              {proj.github && (
                <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{ color: c.blue, textDecoration: "underline" }}>
                  GitHub
                </a>
              )}
              {proj.live && (
                <a href={proj.live} target="_blank" rel="noopener noreferrer" style={{ color: c.blue, textDecoration: "underline" }}>
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    ),

    achievements: (
      <div className="py-2">
        {achievements.map((ach) => (
          <div key={ach.id} style={{ marginBottom: "12px" }}>
            <p style={{ color: c.green, fontWeight: 700 }}>
              🏆 {ach.title}
              <span style={{ color: c.muted, fontWeight: 400, marginLeft: "8px" }}>({ach.date})</span>
            </p>
            <p style={{ color: c.text, lineHeight: "1.5", paddingLeft: "8px" }}>
              {ach.description}
            </p>
          </div>
        ))}
      </div>
    ),

    offers: (
      <div className="py-2">
        <p style={{ color: c.green, fontWeight: 600, marginBottom: "8px" }}>
          Notable Offers Received:
        </p>
        {notable_offers.map((offer) => (
          <div key={offer.id} style={{ marginBottom: "10px", paddingLeft: "8px" }}>
            <p style={{ color: c.text }}>
              <a
                href={offer.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: c.blue, textDecoration: "underline", fontWeight: 600 }}
              >
                {offer.company}
              </a>
              <span style={{ color: c.muted }}> — {offer.role}</span>
            </p>
            <p style={{ color: c.muted, fontSize: "13px" }}>
              📅 {offer.period}
            </p>
          </div>
        ))}
      </div>
    ),
  };

  const welcomeMessage = (
    <div style={{ padding: "4px 0" }}>
      <p style={{ color: c.green, fontWeight: 700, fontSize: "16px" }}>
        Welcome to Souptik&apos;s Terminal 🚀
      </p>
      <p style={{ color: c.text, marginTop: "4px" }}>
        Type <span style={{ color: c.blue, fontWeight: 600 }}>&apos;help&apos;</span> to see all available commands.
      </p>
    </div>
  );

  const isDark = theme === "dark";

  return (
    <div className="h-[500px] md:h-[600px] flex flex-col">
      {/* macOS-style window chrome */}
      <div
        className={`flex items-center px-4 py-2.5 border-b ${
          isDark
            ? "bg-[#2d2d3f] border-slate-700/30"
            : "bg-slate-100 border-slate-300/60"
        }`}
      >
        <TrafficLights size="small" interactive />
        <span
          className={`mx-auto text-xs font-medium ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          visitor@souptik.dev — zsh
        </span>
      </div>

      {/* Terminal body */}
      <div className="flex-1 min-h-0">
        <ReactTerminal
          commands={commands}
          themes={{
            "terminal-dark": {
              themeBGColor: "#1e1e2e",
              themeToolbarColor: "#1e1e2e",
              themeColor: "#d4d4d8",
              themePromptColor: "#4ade80",
            },
            "terminal-light": {
              themeBGColor: "#f8fafc",
              themeToolbarColor: "#f8fafc",
              themeColor: "#334155",
              themePromptColor: "#16a34a",
            },
          }}
          theme={isDark ? "terminal-dark" : "terminal-light"}
          prompt="visitor@souptik.dev:~$ "
          welcomeMessage={welcomeMessage}
          errorMessage="Command not found. Type 'help' for a list of valid commands."
          showControlBar={false}
          showControlButtons={false}
        />
      </div>
    </div>
  );
}

export default function TerminalSection() {
  return (
    <TerminalContextProvider>
      <TerminalCommands />
    </TerminalContextProvider>
  );
}
