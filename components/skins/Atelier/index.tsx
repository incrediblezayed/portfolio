"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import type { CSSProperties } from "react";
import styles from "./Atelier.module.css";

export function Atelier() {
  return (
    <main className={styles.root}>
      <Frame />
      <Hero />
      <Manifesto />
      <Capabilities />
      <Works />
      <Practice />
      <Contact />
      <Foot />
    </main>
  );
}

function Frame() {
  return (
    <div className={styles.frame} aria-hidden="true">
      <span className={`${styles.bracket} ${styles.bracketTL}`} />
      <span className={`${styles.bracket} ${styles.bracketTR}`} />
      <span className={`${styles.bracket} ${styles.bracketBL}`} />
      <span className={`${styles.bracket} ${styles.bracketBR}`} />
    </div>
  );
}

function Hero() {
  return (
    <section className={styles.section} aria-labelledby="atelier-hero">
      <header className={styles.heroHead}>
        <p className={styles.kicker}>
          <span className={styles.dot} /> {profile.location}
          <span className={styles.divider}>·</span>
          {profile.availability.message}
        </p>
        <p className={styles.kickerRight}>
          Atelier <span className={styles.divider}>/</span> 01
        </p>
      </header>
      <h1 id="atelier-hero" className={styles.headline}>
        We build <em>products</em>
        <br />
        that <span className={styles.markered}>earn</span> the
        <br />
        decisions behind them.
      </h1>
      <p className={styles.lede}>{profile.intro}</p>
      <div className={styles.ctaRow}>
        <a href={`mailto:${profile.email}`} className={styles.ctaPrimary}>
          Book a call <span aria-hidden="true">→</span>
        </a>
        <a href="#works" className={styles.ctaQuiet}>
          See the work
        </a>
      </div>
      <p className={styles.signOff}>— {profile.currentRole}</p>
    </section>
  );
}

function Manifesto() {
  const lines = philosophy.quote;
  return (
    <section className={styles.section} aria-labelledby="atelier-manifesto">
      <p className={styles.eyebrow}>02 — Operating principle</p>
      <h2 id="atelier-manifesto" className={styles.manifesto}>
        {lines.map((line, idx) => (
          <span key={line} className={styles.manifestoLine} data-index={idx}>
            {line}
          </span>
        ))}
      </h2>
    </section>
  );
}

const CAPABILITY_DISCIPLINES = [
  {
    label: "Product",
    body: "Written proposals before alignment. Decision logs over decks.",
  },
  {
    label: "Engineering",
    body: "Native mobile, real-time, offline-first. Architecture that survives scale.",
  },
  {
    label: "Strategy",
    body: "Bets you don't take. Killing working builds before sunk cost kills the product.",
  },
  {
    label: "Open source",
    body: "file_saver on pub.dev. Multi-year maintenance, cross-platform Flutter.",
  },
];

function Capabilities() {
  return (
    <section className={styles.section} aria-labelledby="atelier-cap">
      <p className={styles.eyebrow}>03 — Capabilities</p>
      <h2 id="atelier-cap" className={styles.sectionHead}>
        Four disciplines,
        <br />
        one signature.
      </h2>
      <ol className={styles.capList}>
        {CAPABILITY_DISCIPLINES.map((discipline, idx) => (
          <li key={discipline.label} className={styles.capItem}>
            <span className={styles.capIndex}>
              0{idx + 1}
            </span>
            <span className={styles.capLabel}>{discipline.label}</span>
            <span className={styles.capBody}>{discipline.body}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Works() {
  return (
    <section className={styles.section} id="works" aria-labelledby="atelier-works">
      <p className={styles.eyebrow}>04 — Selected bets</p>
      <h2 id="atelier-works" className={styles.sectionHead}>
        Three calls,
        <br />
        three outcomes.
      </h2>
      <div className={styles.workList}>
        {cases.map((c, idx) => (
          <WorkEntry key={c.id} caseStudy={c} index={idx} />
        ))}
      </div>
    </section>
  );
}

function WorkEntry({
  caseStudy,
  index,
}: Readonly<{ caseStudy: Case; index: number }>) {
  const chosen = caseStudy.options.find((option) => option.selected);
  const bet = chosen ? readOptionCanonical(chosen).label : caseStudy.summary;
  const outcomePara = caseStudy.outcome.paragraphs[0];
  const outcome = outcomePara ? readCanonical(outcomePara) : caseStudy.summary;
  const accent = caseStudy.brand?.primary ?? "#d94a1f";

  return (
    <article
      className={styles.work}
      style={{ "--accent": accent } as CSSProperties}
    >
      <div className={styles.workMeta}>
        <p className={styles.workNumber}>
          Case {String(caseStudy.number).padStart(2, "0")}
        </p>
        <p className={styles.workYear}>{caseStudy.meta.year}</p>
      </div>
      <div className={styles.workBody}>
        <h3 className={styles.workTitle}>{caseStudy.title}</h3>
        <p className={styles.workSummary}>{caseStudy.summary}</p>
        <dl className={styles.workSpec}>
          <div>
            <dt>The bet</dt>
            <dd>{bet}</dd>
          </div>
          <div>
            <dt>The outcome</dt>
            <dd>{outcome}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{caseStudy.meta.stack}</dd>
          </div>
        </dl>
        {caseStudy.outcome.metrics?.length ? (
          <ul className={styles.workMetrics}>
            {caseStudy.outcome.metrics.slice(0, 4).map((metric) => (
              <li key={metric.label}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className={styles.workTail}>
        <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      </div>
    </article>
  );
}

function Practice() {
  const groups = toolkit.engineering.slice(0, 6);
  return (
    <section className={styles.section} aria-labelledby="atelier-practice">
      <p className={styles.eyebrow}>05 — Tools we reach for</p>
      <h2 id="atelier-practice" className={styles.sectionHead}>
        Listed for the curious.
      </h2>
      <div className={styles.practiceGrid}>
        {groups.map((group) => (
          <div key={group.category} className={styles.practiceRow}>
            <p className={styles.practiceLabel}>{group.category}</p>
            <p className={styles.practiceItems}>{group.items.join(" · ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className={styles.section} aria-labelledby="atelier-contact">
      <p className={styles.eyebrow}>06 — Talk</p>
      <h2 id="atelier-contact" className={styles.contactHead}>
        Have a hard call
        <br />
        on the table?
      </h2>
      <p className={styles.contactBody}>
        {profile.availability.message} Bring the constraint, the deadline, and the
        team you&apos;ve got. We&apos;ll write down the options together.
      </p>
      <div className={styles.ctaRow}>
        <a href={`mailto:${profile.email}`} className={styles.ctaPrimary}>
          {profile.email} <span aria-hidden="true">→</span>
        </a>
        <a
          href={profile.socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className={styles.ctaQuiet}
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}

function Foot() {
  return (
    <footer className={styles.foot}>
      <p>
        {profile.name} <span className={styles.divider}>·</span> {new Date().getFullYear()}
      </p>
      <p>
        Atelier <span className={styles.divider}>/</span> Press <kbd>1</kbd> for the
        canonical decision log
      </p>
    </footer>
  );
}
