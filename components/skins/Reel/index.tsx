"use client";

import {
  cases,
  experience,
  philosophy,
  profile,
  projects,
  toolkit,
} from "@/content";
import {
  readCanonical,
  readCanonicalParagraphs,
  readOptionCanonical,
} from "@/lib/caseVoice";
import type { Case, ProjectGroup, Role } from "@/lib/types";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { brandStyle } from "@/lib/brand";
import { useTheme } from "../../ThemeProvider";
import type { CSSProperties } from "react";
import styles from "./Reel.module.css";

export function Reel() {
  return (
    <div className={styles.root}>
      <Hero />
      {cases.map((c, i) => (
        <Chapter key={c.id} caseStudy={c} index={i} />
      ))}
      <PhilosophyChapter />
      <ExperienceSection />
      <ToolkitSection />
      <ProjectsSection />
      <Footer />
    </div>
  );
}

/* ─────────── Panel cross-fade math ─────────── */
/**
 * Given chapter progress (0-1), returns inline style for a panel based on its
 * fade-in/fade-out range. Used to drive opacity + translateY for cross-fade.
 */
interface PanelRange {
  in1: number;
  in2: number;
  out1: number;
  out2: number;
}

function panelStyle(p: number, range: PanelRange): CSSProperties {
  if (p < range.in1) return { opacity: 0, transform: "translateY(28px)" };
  if (p < range.in2) {
    const t = (p - range.in1) / (range.in2 - range.in1);
    return { opacity: t, transform: `translateY(${28 * (1 - t)}px)` };
  }
  if (p < range.out1) return { opacity: 1, transform: "translateY(0)" };
  if (p < range.out2) {
    const t = (p - range.out1) / (range.out2 - range.out1);
    return { opacity: 1 - t, transform: `translateY(${-28 * t}px)` };
  }
  return { opacity: 0, transform: "translateY(-28px)" };
}

const FOUR_PANEL_RANGES: readonly PanelRange[] = [
  { in1: 0, in2: 0.06, out1: 0.24, out2: 0.3 },
  { in1: 0.26, in2: 0.32, out1: 0.5, out2: 0.56 },
  { in1: 0.52, in2: 0.58, out1: 0.76, out2: 0.82 },
  { in1: 0.78, in2: 0.84, out1: 1, out2: 1 },
];

const THREE_PANEL_RANGES: readonly PanelRange[] = [
  { in1: 0, in2: 0.06, out1: 0.3, out2: 0.38 },
  { in1: 0.34, in2: 0.42, out1: 0.64, out2: 0.72 },
  { in1: 0.68, in2: 0.76, out1: 1, out2: 1 },
];

/* ─────────── Pin counter (small bottom-left progress chip during chapter pin) ─────────── */

function PinCounter({
  step,
  total,
  label,
}: Readonly<{ step: number; total: number; label: string }>) {
  return (
    <div className={styles.pinCounter} aria-hidden="true">
      <span className={styles.pinCounterIndex}>
        {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span className={styles.pinCounterLabel}>{label}</span>
    </div>
  );
}

function Hero() {
  return (
    <header className={styles.hero}>
      <p className={styles.eyebrow}>
        <span>{profile.location}</span>
        <span aria-hidden="true">·</span>
        <span>{profile.currentRole}</span>
      </p>
      <h1 className={styles.heroName}>{profile.name}</h1>
      <p className={styles.heroTagline}>{profile.tagline}</p>
      <p className={styles.heroIntro}>{profile.intro}</p>
      <p className={styles.heroAvailability}>
        {profile.availability.message.toLowerCase()}
      </p>
      <ul className={styles.socials}>
        <li>
          <a href={`mailto:${profile.email}`}>email</a>
        </li>
        <li>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
        </li>
        <li>
          <a href={profile.socials.github} target="_blank" rel="noreferrer">
            github
          </a>
        </li>
        <li>
          <a href={profile.socials.x} target="_blank" rel="noreferrer">
            x
          </a>
        </li>
      </ul>
      <p className={styles.heroScrollHint} aria-hidden="true">
        scroll to enter ↓
      </p>
    </header>
  );
}

function Chapter({
  caseStudy,
  index,
}: Readonly<{ caseStudy: Case; index: number }>) {
  const number = String(caseStudy.number).padStart(2, "0");
  const indexKey = `chapter${index}`;
  const chapterClass = `${styles.chapter} ${styles[indexKey] ?? ""}`;
  const [chapterRef, progress] = useScrollProgress<HTMLElement>("pin");
  const { colorMode } = useTheme();

  const panelStyles = FOUR_PANEL_RANGES.map((r) => panelStyle(progress, r));
  const stepLabels = ["Problem", "Options", "The Bet", "Outcome"];
  const activeIndex = Math.min(
    panelStyles.length - 1,
    Math.floor(progress * panelStyles.length),
  );

  // Brand-driven styling from content/cases.ts. Falls back to .chapterN CSS
  // if a case has no brand (none currently, but the type allows it).
  const brandSection: CSSProperties | undefined = caseStudy.brand
    ? (() => {
        const s = brandStyle(caseStudy.brand, colorMode);
        return {
          "--chapter-bg": caseStudy.brand.primary,
          "--chapter-ink": s.ink,
          "--chapter-accent": s.accent,
          background: s.background,
          color: s.ink,
        } as CSSProperties;
      })()
    : undefined;

  return (
    <section
      ref={chapterRef}
      className={chapterClass}
      style={brandSection}
      aria-label={caseStudy.title}
    >
      <div className={styles.stage}>
        <ProblemPanel
          caseStudy={caseStudy}
          number={number}
          style={panelStyles[0]}
        />
        <OptionsPanel
          caseStudy={caseStudy}
          number={number}
          style={panelStyles[1]}
        />
        <BetPanel
          caseStudy={caseStudy}
          number={number}
          style={panelStyles[2]}
        />
        <OutcomePanel
          caseStudy={caseStudy}
          number={number}
          style={panelStyles[3]}
        />
        <PinCounter
          step={activeIndex + 1}
          total={panelStyles.length}
          label={`${number} · ${stepLabels[activeIndex] ?? ""}`}
        />
      </div>
    </section>
  );
}

function PanelHeader({
  number,
  label,
}: Readonly<{ number: string; label: string }>) {
  return (
    <p className={styles.panelEyebrow}>
      <span className={styles.panelNumber}>{number}</span>
      <span className={styles.panelDivider} aria-hidden="true">
        /
      </span>
      <span className={styles.panelLabel}>{label}</span>
    </p>
  );
}

type PanelProps = Readonly<{
  caseStudy: Case;
  number: string;
  style?: CSSProperties;
}>;

function ProblemPanel({ caseStudy, number, style }: PanelProps) {
  const intro = caseStudy.problem.intro
    ? readCanonical(caseStudy.problem.intro)
    : caseStudy.summary;
  const items = caseStudy.problem.items ?? [];
  return (
    <article
      className={`${styles.panel} ${styles.panelProblem}`}
      style={style}
    >
      <PanelHeader number={number} label="Problem" />
      <h2 className={styles.panelTitle}>{caseStudy.title}</h2>
      <p className={styles.panelBody}>{intro}</p>
      {items.length > 0 ? (
        <ul className={styles.problemList}>
          {items.slice(0, 5).map((item) => (
            <li key={item.label}>{item.label}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function OptionsPanel({ caseStudy, number, style }: PanelProps) {
  return (
    <article
      className={`${styles.panel} ${styles.panelOptions}`}
      style={style}
    >
      <PanelHeader number={number} label="Options" />
      <h2 className={styles.panelTitle}>What we weighed</h2>
      <ol className={styles.optionsList}>
        {caseStudy.options.map((option) => {
          const voice = readOptionCanonical(option);
          const isChosen = option.selected;
          return (
            <li
              key={option.letter}
              className={`${styles.option} ${isChosen ? styles.optionChosen : ""}`}
            >
              <span className={styles.optionLetter}>{option.letter}</span>
              <span className={styles.optionLabel}>
                {voice.label}
                {isChosen ? (
                  <span className={styles.optionTag} aria-label="chosen">
                    chosen
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </article>
  );
}

function BetPanel({ caseStudy, number, style }: PanelProps) {
  const intro = caseStudy.bet.intro
    ? readCanonical(caseStudy.bet.intro)
    : caseStudy.summary;
  return (
    <article className={`${styles.panel} ${styles.panelBet}`} style={style}>
      <PanelHeader number={number} label="The Bet" />
      <p className={styles.betLede}>{intro}</p>
      <p className={styles.betReflection}>
        <span className={styles.betReflectionTag}>In hindsight —</span>{" "}
        {caseStudy.reflection.product}
      </p>
    </article>
  );
}

function OutcomePanel({ caseStudy, number, style }: PanelProps) {
  const firstParagraph = caseStudy.outcome.paragraphs[0];
  const lead = firstParagraph
    ? (readCanonicalParagraphs(firstParagraph)[0] ?? "")
    : "";
  const metrics = caseStudy.outcome.metrics ?? [];
  return (
    <article
      className={`${styles.panel} ${styles.panelOutcome}`}
      style={style}
    >
      <PanelHeader number={number} label="Outcome" />
      <p className={styles.outcomeLede}>{lead}</p>
      {metrics.length > 0 ? (
        <ul className={styles.metricsRow}>
          {metrics.map((m) => (
            <li key={m.label}>
              <span className={styles.metricValue}>{m.value}</span>
              <span className={styles.metricLabel}>{m.label}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.outcomeStatus}>{caseStudy.meta.status}</p>
      )}
      <p className={styles.outcomeMeta}>{caseStudy.meta.stack}</p>
    </article>
  );
}

/* ─────────── Philosophy chapter (pinned, big quote) ─────────── */

function PhilosophyChapter() {
  const [chapterRef, progress] = useScrollProgress<HTMLElement>("pin");
  const styles3 = THREE_PANEL_RANGES.map((r) => panelStyle(progress, r));
  const activeIndex = Math.min(2, Math.floor(progress * 3));
  return (
    <section
      ref={chapterRef}
      className={`${styles.chapter} ${styles.chapterPhilosophy}`}
      aria-label="Philosophy"
    >
      <div className={styles.stage}>
        <article
          className={`${styles.panel} ${styles.panelPhilosophy0}`}
          style={styles3[0]}
        >
          <p className={styles.panelEyebrow}>
            <span className={styles.panelLabel}>Philosophy</span>
          </p>
          <p className={styles.philosophyLine}>{philosophy.quote[0]}</p>
        </article>
        <article
          className={`${styles.panel} ${styles.panelPhilosophy1}`}
          style={styles3[1]}
        >
          <p className={styles.philosophyLine}>{philosophy.quote[1]}</p>
        </article>
        <article
          className={`${styles.panel} ${styles.panelPhilosophy2}`}
          style={styles3[2]}
        >
          <p className={styles.philosophyLine}>{philosophy.quote[2]}</p>
          <p className={styles.philosophyAttribution}>— {profile.name}</p>
        </article>
        <PinCounter
          step={activeIndex + 1}
          total={3}
          label={`Philosophy · line ${activeIndex + 1}`}
        />
      </div>
    </section>
  );
}

/* ─────────── Experience section (regular scroll, fade-up cards) ─────────── */

function ExperienceSection() {
  return (
    <section className={styles.flatSection} aria-label="Experience">
      <header className={styles.flatHeader}>
        <p className={styles.flatEyebrow}>Experience</p>
        <h2 className={styles.flatTitle}>Career so far</h2>
      </header>
      <ol className={styles.experienceList}>
        {experience.map((role, i) => (
          <ExperienceCard key={`${role.company}-${i}`} role={role} />
        ))}
      </ol>
    </section>
  );
}

function ExperienceCard({ role }: Readonly<{ role: Role }>) {
  return (
    <li className={styles.experienceCard}>
      <div className={styles.experienceMeta}>
        <p className={styles.experiencePeriod}>{role.period}</p>
        <p className={styles.experienceLocation}>{role.location}</p>
      </div>
      <div className={styles.experienceBody}>
        <h3 className={styles.experienceTitle}>{role.title}</h3>
        <p className={styles.experienceCompany}>{role.company}</p>
        <p className={styles.experienceDescription}>{role.description}</p>
      </div>
    </li>
  );
}

/* ─────────── Toolkit section ─────────── */

function ToolkitSection() {
  return (
    <section className={styles.flatSection} aria-label="Toolkit">
      <header className={styles.flatHeader}>
        <p className={styles.flatEyebrow}>Toolkit</p>
        <h2 className={styles.flatTitle}>Engineering · Product</h2>
      </header>
      <div className={styles.toolkitGrid}>
        <div>
          <h3 className={styles.toolkitColHead}>Engineering</h3>
          <ul className={styles.engineeringList}>
            {toolkit.engineering.map((g) => (
              <li key={g.category} className={styles.engineeringGroup}>
                <p className={styles.engineeringCategory}>{g.category}</p>
                <p className={styles.engineeringItems}>{g.items.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={styles.toolkitColHead}>Product</h3>
          <ul className={styles.productList}>
            {toolkit.product.map((p) => (
              <li key={p.category} className={styles.productEntry}>
                <p className={styles.productHead}>
                  <span className={styles.productCategory}>{p.category}</span>{" "}
                  · {p.headline}
                </p>
                <p className={styles.productBody}>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Projects section ─────────── */

function ProjectsSection() {
  return (
    <section className={styles.flatSection} aria-label="Projects">
      <header className={styles.flatHeader}>
        <p className={styles.flatEyebrow}>Projects</p>
        <h2 className={styles.flatTitle}>Shipped, scaffolded, sunsetted</h2>
      </header>
      <div className={styles.projectGroups}>
        {projects.map((g) => (
          <ProjectGroupBlock key={g.heading} group={g} />
        ))}
      </div>
    </section>
  );
}

function ProjectGroupBlock({ group }: Readonly<{ group: ProjectGroup }>) {
  return (
    <div className={styles.projectGroup}>
      <h3 className={styles.projectGroupHead}>{group.heading}</h3>
      <ul className={styles.projectList}>
        {group.projects.map((p) => (
          <li key={p.name} className={styles.projectCard}>
            <p className={styles.projectName}>{p.name}</p>
            <p className={styles.projectTagline}>{p.tagline}</p>
            <p className={styles.projectStack}>{p.stack}</p>
            <p className={styles.projectStatus}>{p.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerLine}>
        Six skins, same content. You scrolled the cinematic one.
      </p>
      <ul className={styles.socials}>
        <li>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </li>
        <li>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
        </li>
        <li>
          <a href={profile.socials.github} target="_blank" rel="noreferrer">
            github
          </a>
        </li>
        <li>
          <a href={profile.socials.x} target="_blank" rel="noreferrer">
            x
          </a>
        </li>
      </ul>
    </footer>
  );
}
