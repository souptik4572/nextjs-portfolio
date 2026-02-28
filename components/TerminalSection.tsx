"use client";
import { ReactTerminal, TerminalContextProvider } from "react-terminal";
import { portfolioData } from "@/lib/data";
import { TrafficLights } from "@/components/MacOSElements";

function TerminalCommands() {
  const { personal, experience, skills, projects, achievements, notable_offers } = portfolioData;

  const commands = {
    help: (
      <div className="py-2">
        <p style={{ color: "#4ade80", fontWeight: 600, marginBottom: "8px" }}>
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
            <span style={{ color: "#60a5fa", fontFamily: "monospace", minWidth: "140px" }}>
              {cmd}
            </span>
            <span style={{ color: "#d1d5db" }}>{desc}</span>
          </div>
        ))}
      </div>
    ),

    intro: (
      <div className="py-2">
        <p style={{ color: "#4ade80", fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>
          {personal.name} — {personal.role}
        </p>
        <p style={{ color: "#d1d5db", lineHeight: "1.6", marginBottom: "12px" }}>
          {personal.bio}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ color: "#d1d5db" }}>
            <span style={{ color: "#facc15" }}>📧 Email: </span>
            <a href={`mailto:${personal.email}`} style={{ color: "#60a5fa", textDecoration: "underline" }}>
              {personal.email}
            </a>
          </span>
          <span style={{ color: "#d1d5db" }}>
            <span style={{ color: "#facc15" }}>🐙 GitHub: </span>
            <a href={personal.github} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "underline" }}>
              {personal.github}
            </a>
          </span>
          <span style={{ color: "#d1d5db" }}>
            <span style={{ color: "#facc15" }}>💼 LinkedIn: </span>
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "underline" }}>
              {personal.linkedin}
            </a>
          </span>
          <span style={{ color: "#d1d5db" }}>
            <span style={{ color: "#facc15" }}>📍 Location: </span>
            {personal.location}
          </span>
        </div>
      </div>
    ),

    experience: (
      <div className="py-2">
        {experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom: "16px" }}>
            <p style={{ color: "#4ade80", fontWeight: 700, fontSize: "15px" }}>
              {exp.role}
            </p>
            <p style={{ color: "#60a5fa" }}>
              @ {exp.company}
              <span style={{ color: "#9ca3af", marginLeft: "8px" }}>| {exp.period}</span>
            </p>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "6px" }}>
              📍 {exp.location}
            </p>
            <div style={{ paddingLeft: "8px" }}>
              {exp.highlights.map((h, i) => (
                <p key={i} style={{ color: "#d1d5db", lineHeight: "1.5", padding: "2px 0" }}>
                  <span style={{ color: "#4ade80", marginRight: "8px" }}>▹</span>
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
            <span style={{ color: "#4ade80", fontWeight: 600 }}>
              {group.category}:
            </span>{" "}
            <span style={{ color: "#d1d5db" }}>
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
            <p style={{ color: "#4ade80", fontWeight: 700, fontSize: "15px" }}>
              {proj.title}
            </p>
            <p style={{ color: "#facc15", fontSize: "13px", marginBottom: "4px" }}>
              Tech: {proj.tech.join(", ")}
            </p>
            <p style={{ color: "#d1d5db", lineHeight: "1.5", marginBottom: "4px" }}>
              {proj.description}
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              {proj.github && (
                <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "underline" }}>
                  GitHub
                </a>
              )}
              {proj.live && (
                <a href={proj.live} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "underline" }}>
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
            <p style={{ color: "#4ade80", fontWeight: 700 }}>
              🏆 {ach.title}
              <span style={{ color: "#9ca3af", fontWeight: 400, marginLeft: "8px" }}>({ach.date})</span>
            </p>
            <p style={{ color: "#d1d5db", lineHeight: "1.5", paddingLeft: "8px" }}>
              {ach.description}
            </p>
          </div>
        ))}
      </div>
    ),

    offers: (
      <div className="py-2">
        <p style={{ color: "#4ade80", fontWeight: 600, marginBottom: "8px" }}>
          Notable Offers Received:
        </p>
        {notable_offers.map((offer) => (
          <div key={offer.id} style={{ marginBottom: "10px", paddingLeft: "8px" }}>
            <p style={{ color: "#d1d5db" }}>
              <a
                href={offer.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#60a5fa", textDecoration: "underline", fontWeight: 600 }}
              >
                {offer.company}
              </a>
              <span style={{ color: "#9ca3af" }}> — {offer.role}</span>
            </p>
            <p style={{ color: "#9ca3af", fontSize: "13px" }}>
              📅 {offer.period}
            </p>
          </div>
        ))}
      </div>
    ),
  };

  const welcomeMessage = (
    <div style={{ padding: "4px 0" }}>
      <p style={{ color: "#4ade80", fontWeight: 700, fontSize: "16px" }}>
        Welcome to Souptik&apos;s Terminal 🚀
      </p>
      <p style={{ color: "#d1d5db", marginTop: "4px" }}>
        Type <span style={{ color: "#60a5fa", fontWeight: 600 }}>&apos;help&apos;</span> to see all available commands.
      </p>
    </div>
  );

  return (
    <div className="h-[500px] md:h-[600px] flex flex-col">
      {/* macOS-style window chrome */}
      <div className="flex items-center px-4 py-2.5 bg-[#2d2d3f] border-b border-slate-700/30">
        <TrafficLights size="small" interactive />
        <span className="mx-auto text-xs font-medium text-slate-400">
          visitor@souptik.dev — zsh
        </span>
      </div>

      {/* Terminal body */}
      <div className="flex-1 min-h-0">
        <ReactTerminal
          commands={commands}
          themes={{
            "material-dark": {
              themeBGColor: "#1e1e2e",
              themeToolbarColor: "#1e1e2e",
              themeColor: "#d4d4d8",
              themePromptColor: "#4ade80",
            },
          }}
          theme="material-dark"
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
