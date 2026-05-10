"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  cases,
  experience,
  marquee,
  philosophy,
  profile,
  projects,
  toolkit,
} from "@/content";
import {
  readCanonical,
  readCanonicalParagraphs,
  readReflection,
} from "@/lib/caseVoice";
import type { Case, ThemeId } from "@/lib/types";
import { THEMES, isThemeId } from "@/lib/themes";
import { COLOR_MODES, useTheme } from "../../ThemeProvider";
import type { ColorMode } from "../../ThemeProvider";
import styles from "./Terminal.module.css";

function isColorMode(value: string): value is ColorMode {
  return (COLOR_MODES as readonly string[]).includes(value);
}

const NAV_COMMANDS = [
  "/about",
  "/work",
  "/experience",
  "/toolkit",
  "/projects",
  "/contact",
] as const;

const OUTPUT_COMMANDS = [
  "/help",
  "/whoami",
  "/sudo hire",
  "/cv",
  "/resume",
  "/source",
  "ls",
  "vim",
  "emacs",
] as const;

const ACTION_COMMANDS = ["/clear", "/skin", "/mode", "exit"] as const;

const PRIMARY_HINTS = ["/help", "/about", "/work", "/contact"];

const ALL_AUTOCOMPLETE: string[] = [
  ...NAV_COMMANDS,
  ...OUTPUT_COMMANDS,
  ...ACTION_COMMANDS,
  "cat ",
  "/skin ",
  "/mode ",
];

type HistoryEntry = { id: string; command: string; output: ReactNode; isError?: boolean };

type CommandResult =
  | { kind: "navigate"; target: string }
  | { kind: "output"; node: ReactNode; isError?: boolean }
  | { kind: "clear" }
  | { kind: "switchSkin"; theme: ThemeId }
  | { kind: "switchMode"; mode: ColorMode }
  | { kind: "exit" };

export function Terminal() {
  return (
    <div className={styles.root}>
      <div className={styles.scanlines} aria-hidden="true" />
      <main className={styles.main}>
        <Banner />
        <PromptBlock />
        <AboutSection />
        <WorkSection />
        <ExperienceSection />
        <ToolkitSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}

/* ─────────── BANNER ─────────── */

function Banner() {
  return (
    <header className={`${styles.section} ${styles.banner} ${styles.bootLine0}`}>
      <pre className={styles.asciiBanner} aria-hidden="true">
        {`  ╔═══════════════════════════════════════════════════════════╗
  ║  hassan@portfolio:~$ ./run --skin=terminal                  ║
  ╚═══════════════════════════════════════════════════════════╝`}
      </pre>
      <p className={styles.bannerSub}>
        terminal v1.1 · {profile.location} · status:{" "}
        <span className={styles.amber}>{profile.availability.signal}</span> · type{" "}
        <code>/help</code> for commands
      </p>
    </header>
  );
}

/* ─────────── PROMPT BLOCK (input + history) ─────────── */

function PromptBlock() {
  const { setTheme, setColorMode } = useTheme();
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [exiting, setExiting] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState("");
  const idGen = useId();
  const counterRef = useRef(0);
  const historyEndRef = useRef<HTMLDivElement>(null);

  const ghost = useMemo(() => {
    if (!value) return "";
    const lower = value.toLowerCase();
    const match = ALL_AUTOCOMPLETE.find(
      (cmd) => cmd.startsWith(lower) && cmd !== lower,
    );
    return match ? match.slice(value.length) : "";
  }, [value]);

  const pushHistory = useCallback(
    (command: string, output: ReactNode, isError = false) => {
      counterRef.current += 1;
      setHistory((prev) => [
        ...prev,
        { id: `${idGen}-${counterRef.current}`, command, output, isError },
      ]);
    },
    [idGen],
  );

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const result = parseCommand(trimmed);
      if (result.kind === "clear") {
        setHistory([]);
        return;
      }
      if (result.kind === "navigate") {
        const target = globalThis.document?.getElementById(result.target);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
        pushHistory(trimmed, `> jumped to /${result.target}`);
        return;
      }
      if (result.kind === "switchSkin") {
        pushHistory(
          trimmed,
          <span>
            switching skin to <span className={styles.amber}>{result.theme}</span>...
          </span>,
        );
        globalThis.setTimeout(() => setTheme(result.theme), 300);
        return;
      }
      if (result.kind === "switchMode") {
        pushHistory(
          trimmed,
          <span>
            color mode → <span className={styles.amber}>{result.mode}</span>
          </span>,
        );
        setColorMode(result.mode);
        return;
      }
      if (result.kind === "exit") {
        pushHistory(trimmed, <ExitFarewell />);
        setExiting(true);
        globalThis.setTimeout(() => setTheme(profile.defaultTheme), 1800);
        return;
      }
      pushHistory(trimmed, result.node, result.isError);
    },
    [pushHistory, setTheme, setColorMode],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab" && ghost) {
        e.preventDefault();
        setValue((prev) => prev + ghost);
        return;
      }
      if (e.key === "ArrowUp") {
        if (history.length === 0) return;
        e.preventDefault();
        if (historyIndex === -1) setDraft(value);
        const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(next);
        setValue(history[next].command);
        return;
      }
      if (e.key === "ArrowDown") {
        if (historyIndex === -1) return;
        e.preventDefault();
        const next = historyIndex + 1;
        if (next >= history.length) {
          setHistoryIndex(-1);
          setValue(draft);
        } else {
          setHistoryIndex(next);
          setValue(history[next].command);
        }
      }
    },
    [ghost, history, historyIndex, value, draft],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (exiting) return;
      runCommand(value);
      setValue("");
      setHistoryIndex(-1);
      setDraft("");
    },
    [value, runCommand, exiting],
  );

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [history.length]);

  return (
    <section
      className={`${styles.section} ${styles.bootLine1}`}
      aria-label="Command prompt"
    >
      <div className={styles.promptShell}>
        {history.length > 0 ? (
          <ol className={styles.history}>
            {history.map((entry) => (
              <li key={entry.id} className={styles.historyEntry}>
                <p className={styles.historyCommand}>
                  <span className={styles.amber} aria-hidden="true">
                    $
                  </span>{" "}
                  {entry.command}
                </p>
                <div
                  className={
                    entry.isError ? styles.historyOutputError : styles.historyOutput
                  }
                >
                  {entry.output}
                </div>
              </li>
            ))}
            <div ref={historyEndRef} />
          </ol>
        ) : null}
        <form onSubmit={handleSubmit} className={styles.promptForm}>
          <label className={styles.commandLine}>
            <span className={styles.promptPrefix} aria-hidden="true">
              $
            </span>
            <span className={styles.typed}>{value}</span>
            {ghost ? (
              <span className={styles.suggestionGhost} aria-hidden="true">
                {ghost}
              </span>
            ) : null}
            <span
              className={`${styles.blockCaret} ${exiting ? styles.caretSolid : ""}`}
              aria-hidden="true"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={exiting}
              aria-label="Terminal command input"
              className={styles.invisibleInput}
            />
          </label>
        </form>
      </div>
      <p className={styles.hint}>
        <span className={styles.hintLabel}>tab</span> to autocomplete ·{" "}
        <span className={styles.hintLabel}>↑↓</span> history ·{" "}
        <span className={styles.hintLabel}>enter</span> to run · try:{" "}
        {PRIMARY_HINTS.map((cmd, idx) => (
          <span key={cmd}>
            {idx > 0 ? " · " : null}
            <code>{cmd}</code>
          </span>
        ))}
      </p>
    </section>
  );
}

/* ─────────── COMMAND PARSER ─────────── */

const SIMPLE_COMMANDS: Record<string, () => CommandResult> = {
  "/help": () => ({ kind: "output", node: <HelpOutput /> }),
  "/whoami": () => ({ kind: "output", node: <WhoamiOutput /> }),
  "/sudo hire": () => ({ kind: "output", node: <HireOutput /> }),
  "/cv": () => ({ kind: "output", node: <CvOutput /> }),
  "/resume": () => ({ kind: "output", node: <CvOutput /> }),
  "/source": () => ({ kind: "output", node: <SourceOutput /> }),
  ls: () => ({ kind: "output", node: <LsOutput /> }),
  vim: () => ({
    kind: "output",
    node: <span>nice try. you can&apos;t escape that easily.</span>,
  }),
  emacs: () => ({
    kind: "output",
    node: <span>nice try. (also: emacs.)</span>,
  }),
  "/clear": () => ({ kind: "clear" }),
  exit: () => ({ kind: "exit" }),
  "/exit": () => ({ kind: "exit" }),
};

function parseCatCommand(trimmed: string): CommandResult {
  const id = trimmed.slice(4).trim().toLowerCase();
  const found = cases.find((c) => c.id === id || c.title.toLowerCase() === id);
  if (!found) {
    return {
      kind: "output",
      node: <span>cat: {id}: no such case_id (try `ls`)</span>,
      isError: true,
    };
  }
  return { kind: "output", node: <CatOutput caseStudy={found} /> };
}

function parseSkinCommand(trimmed: string): CommandResult {
  const skinName = trimmed.slice(6).trim().toLowerCase();
  if (isThemeId(skinName)) return { kind: "switchSkin", theme: skinName };
  return {
    kind: "output",
    node: (
      <span>
        unknown skin: <span className={styles.amber}>{skinName}</span>. try one of:{" "}
        {Object.keys(THEMES).join(", ")}
      </span>
    ),
    isError: true,
  };
}

function parseModeCommand(trimmed: string): CommandResult {
  const modeName = trimmed.slice(6).trim().toLowerCase();
  if (isColorMode(modeName)) return { kind: "switchMode", mode: modeName };
  return {
    kind: "output",
    node: (
      <span>
        unknown mode: <span className={styles.amber}>{modeName}</span>. try one of:{" "}
        {COLOR_MODES.join(", ")}
      </span>
    ),
    isError: true,
  };
}

function parseCommand(input: string): CommandResult {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if ((NAV_COMMANDS as readonly string[]).includes(lower)) {
    return { kind: "navigate", target: lower.slice(1) };
  }

  const simple = SIMPLE_COMMANDS[lower];
  if (simple) return simple();

  if (lower.startsWith("cat ")) return parseCatCommand(trimmed);
  if (lower.startsWith("/skin ")) return parseSkinCommand(trimmed);
  if (lower.startsWith("/mode ")) return parseModeCommand(trimmed);

  return {
    kind: "output",
    node: <span>command not found: {trimmed} (try `/help`)</span>,
    isError: true,
  };
}

/* ─────────── EASTER EGG OUTPUTS ─────────── */

function HelpOutput() {
  return (
    <div className={styles.outputGrid}>
      <p>
        <span className={styles.amber}>navigation</span> — scroll to a section
      </p>
      <p className={styles.outputDim}>
        /about · /work · /experience · /toolkit · /projects · /contact
      </p>
      <p>
        <span className={styles.amber}>commands</span>
      </p>
      <ul className={styles.helpList}>
        <li>
          <code>/help</code> — show this list
        </li>
        <li>
          <code>/whoami</code> — short bio
        </li>
        <li>
          <code>/sudo hire</code> — permission granted
        </li>
        <li>
          <code>/cv</code> · <code>/resume</code> — open CV
        </li>
        <li>
          <code>/source</code> — github repo of this portfolio
        </li>
        <li>
          <code>/skin &lt;name&gt;</code> — switch skin (decisionlog · editorial · twocolumn ·
          changelog · terminal · readingroom)
        </li>
        <li>
          <code>/mode &lt;name&gt;</code> — color mode (default · light · dark)
        </li>
        <li>
          <code>ls</code> — list case studies
        </li>
        <li>
          <code>cat &lt;case_id&gt;</code> — print a case
        </li>
        <li>
          <code>/clear</code> — clear output
        </li>
        <li>
          <code>exit</code> — return to canonical Decision Log
        </li>
      </ul>
    </div>
  );
}

function WhoamiOutput() {
  return (
    <div className={styles.outputGrid}>
      <p>
        <span className={styles.amber}>hassan</span>
      </p>
      <p className={styles.outputDim}>
        full-stack mobile dev who became a product manager. flutter, native swift/kotlin,
        node, nestjs. currently shipping infophone and infotodo at enso webworks.
      </p>
      <p className={styles.outputDim}>
        author of file_saver on pub.dev — 4 years live, 185k+ monthly downloads. still
        learning when not to write the next layer.
      </p>
    </div>
  );
}

function HireOutput() {
  return (
    <div className={styles.outputGrid}>
      <pre className={styles.asciiInline} aria-hidden="true">
        {`  [sudo] password for hire:
  ✓ permission granted.`}
      </pre>
      <p className={styles.outputDim}>fastest way in:</p>
      <p>
        <span className={styles.outputDim}>email </span>
        <a className={styles.link} href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </p>
      <p>
        <span className={styles.outputDim}>linkedin </span>
        <a className={styles.link} href={profile.socials.linkedin} target="_blank" rel="noreferrer">
          {profile.socials.linkedin}
        </a>
      </p>
      <p className={styles.outputDim}>{profile.availability.message}</p>
    </div>
  );
}

function CvOutput() {
  return (
    <div className={styles.outputGrid}>
      <p>
        opening cv at{" "}
        <a className={styles.link} href={profile.socials.linkedin} target="_blank" rel="noreferrer">
          {profile.socials.linkedin}
        </a>
      </p>
      <p className={styles.outputDim}>
        (full pdf coming to /resume.pdf — for now linkedin is the canonical source)
      </p>
    </div>
  );
}

function SourceOutput() {
  return (
    <div className={styles.outputGrid}>
      <p>
        portfolio source:{" "}
        <a
          className={styles.link}
          href="https://github.com/IncredibleZayed/portfolio"
          target="_blank"
          rel="noreferrer"
        >
          github.com/IncredibleZayed/portfolio
        </a>
      </p>
      <p className={styles.outputDim}>built with Next.js 16, React 19, six skins.</p>
    </div>
  );
}

function LsOutput() {
  return (
    <ul className={styles.lsList}>
      {cases.map((c) => {
        const wip = /testing|in development|in-flight/i.test(c.meta.status);
        return (
          <li key={c.id}>
            <span className={styles.lsId}>case_{String(c.number).padStart(2, "0")}</span>
            <span className={styles.lsName}>{c.id}</span>
            <span className={wip ? styles.statusWip : styles.statusShipped}>
              [{wip ? "WIP" : "SHIPPED"}]
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function CatOutput({ caseStudy: c }: Readonly<{ caseStudy: Case }>) {
  return (
    <div className={styles.outputGrid}>
      <p>
        <span className={styles.amber}>{c.title}</span> — {c.meta.role}
      </p>
      <p className={styles.outputDim}>
        <span className={styles.dimKey}>stack</span> {c.meta.stack}
      </p>
      <p className={styles.outputDim}>
        <span className={styles.dimKey}>status</span> {c.meta.status}
      </p>
      <p>
        <span className={styles.amber}>{">"}</span> bet
      </p>
      <p className={styles.outputDim}>
        {c.bet.intro ? readCanonical(c.bet.intro, "tech") : ""}
      </p>
      <p>
        <span className={styles.amber}>{">"}</span> outcome
      </p>
      <p className={styles.outputDim}>
        {readCanonicalParagraphs(c.outcome.paragraphs[0], "tech")[0]}
      </p>
      <p>
        <span className={styles.amber}>{">"}</span> reflection [engineering]
      </p>
      <p className={styles.outputDim}>{readReflection(c.reflection, "tech")}</p>
      <p>
        <span className={styles.amber}>{">"}</span> reflection [product]
      </p>
      <p className={styles.outputDim}>{readReflection(c.reflection, "product")}</p>
    </div>
  );
}

function ExitFarewell() {
  return (
    <div className={styles.outputGrid}>
      <pre className={styles.asciiInline} aria-hidden="true">
        {`  ┌─────────────────────────────────────┐
  │  process exited (0).                │
  │  thanks for poking around.          │
  │  returning to canonical view...     │
  └─────────────────────────────────────┘`}
      </pre>
    </div>
  );
}

/* ─────────── SECTION HEADER (ASCII) ─────────── */

function SectionHeader({ id, label }: Readonly<{ id: string; label: string }>) {
  return (
    <header className={styles.sectionHeader} id={id}>
      <span className={styles.sectionRule} aria-hidden="true">
        ─── {label} {"─".repeat(Math.max(4, 60 - label.length))}
      </span>
    </header>
  );
}

/* ─────────── ABOUT ─────────── */

function AboutSection() {
  return (
    <section className={`${styles.section} ${styles.bootLine2}`} aria-labelledby="about">
      <SectionHeader id="about" label="/about" />
      <dl className={styles.kvList}>
        <Row k="name" v={profile.name} />
        <Row k="role" v={profile.currentRole} />
        <Row k="location" v={profile.location} />
        <Row k="email" v={profile.email} link={`mailto:${profile.email}`} />
        <Row
          k="status"
          v={`${profile.availability.signal} — ${profile.availability.message}`}
          accent
        />
      </dl>
      <Block label="intro">
        <p className={styles.proseLine}>{profile.intro}</p>
      </Block>
      <Block label="philosophy">
        <ul className={styles.bulletList}>
          {philosophy.quote.map((line) => (
            <li key={line}>
              <span className={styles.bulletMark} aria-hidden="true">
                *
              </span>{" "}
              {line}
            </li>
          ))}
        </ul>
      </Block>
    </section>
  );
}

/* ─────────── WORK (CASES) ─────────── */

function WorkSection() {
  return (
    <section className={`${styles.section} ${styles.bootLine3}`} aria-labelledby="work">
      <SectionHeader id="work" label="/work" />
      <p className={styles.intro}>
        Three case studies. Each is one pivotal Bet. Full Decision Log lives in skin 1.
      </p>
      <div className={styles.caseList}>
        {cases.map((c) => (
          <CaseBlock key={c.id} caseStudy={c} />
        ))}
      </div>
    </section>
  );
}

function CaseBlock({ caseStudy: c }: Readonly<{ caseStudy: Case }>) {
  const summaryShort = c.summary.split(/\.\s+/).slice(0, 2).join(". ") + ".";
  const isWip = /testing|in development|in-flight/i.test(c.meta.status);

  return (
    <article className={styles.caseBlock}>
      <header className={styles.caseHead}>
        <span className={styles.caseId} aria-hidden="true">
          [case_{String(c.number).padStart(2, "0")}]
        </span>
        <span className={styles.caseTitle}>{c.title.toLowerCase()}</span>
        <span className={isWip ? styles.statusWip : styles.statusShipped}>
          [{isWip ? "WIP" : "SHIPPED"}]
        </span>
      </header>
      <dl className={styles.kvList}>
        <Row k="year" v={c.meta.year} />
        <Row k="role" v={c.meta.role} />
        <Row k="stack" v={c.meta.stack} />
        <Row k="status" v={c.meta.status} />
      </dl>
      <Block label="problem">
        <p className={styles.proseLine}>
          {c.problem.intro ? readCanonical(c.problem.intro, "tech") : ""}
        </p>
        {c.problem.items?.length ? (
          <ul className={styles.bulletList}>
            {c.problem.items.map((item) => (
              <li key={item.label}>
                <span className={styles.bulletMark} aria-hidden="true">
                  ×
                </span>{" "}
                <strong>{item.label}.</strong> {readCanonical(item, "tech")}
              </li>
            ))}
          </ul>
        ) : null}
      </Block>
      <Block label="bet">
        <p className={styles.proseLine}>
          {c.bet.intro ? readCanonical(c.bet.intro, "tech") : ""}
        </p>
      </Block>
      <Block label="outcome">
        {c.outcome.metrics?.length ? (
          <ul className={styles.metricList}>
            {c.outcome.metrics.map((m) => (
              <li key={m.label}>
                <span className={styles.amber}>{m.value}</span>{" "}
                <span className={styles.metricLabel}>{m.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <p className={styles.proseLine}>
          {readCanonicalParagraphs(c.outcome.paragraphs[0], "tech")[0]}
        </p>
      </Block>
      <Block label="reflection">
        <p className={styles.proseLine}>
          <span className={styles.amber}>[engineering]</span>{" "}
          {readReflection(c.reflection, "tech")}
        </p>
        <p className={styles.proseLine}>
          <span className={styles.amber}>[product]</span>{" "}
          {readReflection(c.reflection, "product")}
        </p>
      </Block>
      <p className={styles.summaryLine}>
        <span className={styles.summaryKey}>summary:</span> {summaryShort}
      </p>
    </article>
  );
}

/* ─────────── EXPERIENCE ─────────── */

function ExperienceSection() {
  return (
    <section className={`${styles.section} ${styles.bootLine4}`} aria-labelledby="experience">
      <SectionHeader id="experience" label="/experience" />
      <p className={styles.intro}>Reverse-chronological log. Most recent first.</p>
      <ul className={styles.experienceList}>
        {experience.map((role) => (
          <li key={`${role.company}-${role.period}`} className={styles.experienceItem}>
            <p className={styles.experiencePeriod}>{role.period}</p>
            <p className={styles.experienceTitle}>
              <span className={styles.amber}>{role.company}</span> ::{" "}
              {role.title.toLowerCase()}
            </p>
            <p className={styles.proseLine}>{role.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────── TOOLKIT ─────────── */

function ToolkitSection() {
  return (
    <section className={`${styles.section} ${styles.bootLine5}`} aria-labelledby="toolkit">
      <SectionHeader id="toolkit" label="/toolkit" />
      <Block label="engineering">
        <dl className={styles.kvList}>
          {toolkit.engineering.map((group) => (
            <Row key={group.category} k={group.category.toLowerCase()} v={group.items.join(" · ")} />
          ))}
        </dl>
      </Block>
      <Block label="product">
        <ul className={styles.bulletList}>
          {toolkit.product.map((entry) => (
            <li key={entry.category}>
              <span className={styles.bulletMark} aria-hidden="true">
                *
              </span>{" "}
              <strong>{entry.category}:</strong> {entry.headline}
            </li>
          ))}
        </ul>
      </Block>
      <Block label="marquee">
        <p className={styles.tagline}>{marquee.join(" · ")}</p>
      </Block>
    </section>
  );
}

/* ─────────── PROJECTS ─────────── */

function ProjectsSection() {
  return (
    <section className={`${styles.section} ${styles.bootLine6}`} aria-labelledby="projects">
      <SectionHeader id="projects" label="/projects" />
      {projects.map((group) => (
        <div key={group.heading} className={styles.projectGroup}>
          <p className={styles.projectGroupHeading}>{group.heading.toLowerCase()}/</p>
          <ul className={styles.projectList}>
            {group.projects.map((p) => (
              <li key={p.name} className={styles.projectItem}>
                <p className={styles.projectName}>
                  <span className={styles.amber}>{p.name}</span> — {p.tagline}
                </p>
                <p className={styles.projectMeta}>
                  <span className={styles.metricLabel}>stack:</span> {p.stack}
                </p>
                <p className={styles.projectMeta}>
                  <span className={styles.metricLabel}>status:</span> {p.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

/* ─────────── CONTACT ─────────── */

function ContactSection() {
  return (
    <section className={`${styles.section} ${styles.bootLine7}`} aria-labelledby="contact">
      <SectionHeader id="contact" label="/contact" />
      <dl className={styles.kvList}>
        <Row k="email" v={profile.email} link={`mailto:${profile.email}`} />
        <Row k="linkedin" v={profile.socials.linkedin} link={profile.socials.linkedin} />
        <Row k="github" v={profile.socials.github} link={profile.socials.github} />
        <Row k="x" v={profile.socials.x} link={profile.socials.x} />
        <Row k="pub.dev" v={profile.socials.pubdev} link={profile.socials.pubdev} />
      </dl>
      <p className={styles.proseLine}>
        <span className={styles.amber}>{">"}</span> {profile.availability.message}
      </p>
    </section>
  );
}

/* ─────────── FOOTER ─────────── */

function Footer() {
  return (
    <footer className={`${styles.section} ${styles.bootLine8} ${styles.footer}`}>
      <pre className={styles.asciiFooter} aria-hidden="true">
        {`  ╔═══════════════════════════════════════════════════════════╗
  ║  end of stream · type /help, or press 1 for Decision Log    ║
  ╚═══════════════════════════════════════════════════════════╝`}
      </pre>
      <p className={styles.footerLine}>
        © {new Date().getFullYear()} {profile.name} · six skins, same content
      </p>
    </footer>
  );
}

/* ─────────── PRIMITIVES ─────────── */

function Row({
  k,
  v,
  link,
  accent,
}: Readonly<{ k: string; v: string; link?: string; accent?: boolean }>) {
  const value = link ? (
    <a href={link} target="_blank" rel="noreferrer" className={styles.link}>
      {v}
    </a>
  ) : (
    v
  );
  return (
    <div className={styles.row}>
      <dt>{k}</dt>
      <dd className={accent ? styles.amber : undefined}>{value}</dd>
    </div>
  );
}

function Block({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className={styles.block}>
      <p className={styles.blockLabel}>
        <span className={styles.amber}>{">"}</span> {label}
      </p>
      <div className={styles.blockBody}>{children}</div>
    </div>
  );
}
