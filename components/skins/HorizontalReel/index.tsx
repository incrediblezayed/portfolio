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
  readOptionCanonical,
} from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { useMediaQuery, useScrollProgress } from "@/lib/useScrollProgress";
import type { CSSProperties } from "react";
import styles from "./HorizontalReel.module.css";

const PANEL_COUNT = 7; // 3 cases + Philosophy + Toolkit + Experience + Projects

export function HorizontalReel() {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [outerRef, progress] = useScrollProgress<HTMLDivElement>({
    mode: "pin",
    enabled: !isMobile,
  });

  const maxTranslateVw = (PANEL_COUNT - 1) * 100;
  const translateX = isMobile ? 0 : -progress * maxTranslateVw;

  const activeIndex = Math.min(
    PANEL_COUNT - 1,
    Math.round(progress * (PANEL_COUNT - 1)),
  );

  return (
    <div className={styles.root}>
      <PageHero />
      <div ref={outerRef} className={styles.outer}>
        <div className={styles.sticky}>
          <div
            className={styles.strip}
            style={{ transform: `translateX(${translateX}vw)` }}
          >
            {cases.map((c) => (
              <CasePanel key={c.id} caseStudy={c} />
            ))}
            <PhilosophyPanel />
            <ToolkitPanel />
            <ExperiencePanel />
            <ProjectsPanel />
          </div>
          {isMobile ? null : (
            <PinCounter
              current={activeIndex + 1}
              total={PANEL_COUNT}
              progress={progress}
            />
          )}
        </div>
      </div>
      <PageFooter />
    </div>
  );
}

function PinCounter({
  current,
  total,
  progress,
}: Readonly<{ current: number; total: number; progress: number }>) {
  return (
    <div className={styles.pinCounter} aria-hidden="true">
      <span className={styles.pinCounterIndex}>
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <div
        className={styles.pinCounterTrack}
        style={{ "--p": `${progress * 100}%` } as CSSProperties}
      />
    </div>
  );
}

/* ─────────── Page hero (regular flow, before .outer so view-timeline activates on entry) ─────────── */

function PageHero() {
  return (
    <header className={styles.pageHero}>
      <p className={styles.panelEyebrow}>
        {profile.location} · {profile.currentRole}
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
      <p className={styles.scrollHint} aria-hidden="true">
        scroll ↓ — camera pans →
      </p>
    </header>
  );
}

function PageFooter() {
  return (
    <footer className={styles.pageFooter}>
      <p className={styles.footerEyebrow}>End reel.</p>
      <h2 className={styles.footerTitle}>Let&apos;s talk.</h2>
      <p className={styles.footerEmail}>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      <ul className={styles.socials}>
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

/* ─────────── Strip-internal panels ─────────── */

function CasePanel({ caseStudy }: Readonly<{ caseStudy: Case }>) {
  const number = String(caseStudy.number).padStart(2, "0");
  const chosen = caseStudy.options.find((o) => o.selected);
  const chosenLabel = chosen ? readOptionCanonical(chosen).label : null;
  const betIntro = caseStudy.bet.intro
    ? readCanonical(caseStudy.bet.intro)
    : caseStudy.summary;
  const firstOutcome = caseStudy.outcome.paragraphs[0];
  const outcomeLede = firstOutcome ? readCanonical(firstOutcome) : "";
  const metrics = caseStudy.outcome.metrics ?? [];
  const brandAccentStyle = caseStudy.brand
    ? ({ "--case-accent": caseStudy.brand.primary } as React.CSSProperties)
    : undefined;
  return (
    <section
      className={`${styles.panel} ${styles.casePanel}`}
      style={brandAccentStyle}
    >
      <header className={styles.caseHead}>
        <p className={styles.caseNumber}>Case {number}</p>
        <h2 className={styles.caseTitle}>{caseStudy.title}</h2>
        <p className={styles.caseStatus}>{caseStudy.meta.status}</p>
      </header>
      <div className={styles.caseGrid}>
        <div className={styles.caseLeft}>
          <p className={styles.caseSummary}>{caseStudy.summary}</p>
          <p className={styles.caseStack}>
            <span className={styles.metaTag}>Stack</span> {caseStudy.meta.stack}
          </p>
        </div>
        <div className={styles.caseRight}>
          {chosenLabel ? (
            <div className={styles.betBlock}>
              <p className={styles.betEyebrow}>The Bet</p>
              <p className={styles.betLabel}>{chosenLabel}</p>
              <p className={styles.betIntro}>{betIntro}</p>
            </div>
          ) : null}
          <div className={styles.outcomeBlock}>
            <p className={styles.outcomeEyebrow}>Outcome</p>
            <p className={styles.outcomeLede}>{outcomeLede}</p>
            {metrics.length > 0 ? (
              <ul className={styles.metricsRow}>
                {metrics.map((m) => (
                  <li key={m.label}>
                    <span className={styles.metricValue}>{m.value}</span>
                    <span className={styles.metricLabel}>{m.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhilosophyPanel() {
  return (
    <section className={`${styles.panel} ${styles.philosophyPanel}`}>
      <p className={styles.panelEyebrow}>Philosophy</p>
      <div className={styles.philosophyLines}>
        {philosophy.quote.map((line, i) => (
          <p
            key={line}
            className={
              i === 1 ? styles.philosophyLineAccent : styles.philosophyLine
            }
          >
            {line}
          </p>
        ))}
      </div>
      <p className={styles.philosophyAttribution}>— {profile.name}</p>
    </section>
  );
}

function ToolkitPanel() {
  return (
    <section className={`${styles.panel} ${styles.toolkitPanel}`}>
      <header className={styles.panelHead}>
        <p className={styles.panelEyebrow}>Toolkit</p>
        <h2 className={styles.panelTitle}>What I reach for</h2>
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ExperiencePanel() {
  return (
    <section className={`${styles.panel} ${styles.experiencePanel}`}>
      <header className={styles.panelHead}>
        <p className={styles.panelEyebrow}>Experience</p>
        <h2 className={styles.panelTitle}>Career so far</h2>
      </header>
      <ol className={styles.experienceList}>
        {experience.map((role, i) => (
          <li key={`${role.company}-${i}`} className={styles.experienceRow}>
            <p className={styles.experiencePeriod}>{role.period}</p>
            <p className={styles.experienceTitle}>{role.title}</p>
            <p className={styles.experienceCompany}>{role.company}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ProjectsPanel() {
  return (
    <section className={`${styles.panel} ${styles.projectsPanel}`}>
      <header className={styles.panelHead}>
        <p className={styles.panelEyebrow}>Projects</p>
        <h2 className={styles.panelTitle}>Shipped, scaffolded, sunsetted</h2>
      </header>
      <div className={styles.projectGroups}>
        {projects.map((g) => (
          <div key={g.heading} className={styles.projectGroup}>
            <h3 className={styles.projectGroupHead}>{g.heading}</h3>
            <ul className={styles.projectList}>
              {g.projects.map((p) => (
                <li key={p.name} className={styles.projectChip}>
                  <span className={styles.projectName}>{p.name}</span>
                  <span className={styles.projectTagline}>{p.tagline}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

