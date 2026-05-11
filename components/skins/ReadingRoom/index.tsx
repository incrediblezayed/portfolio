import {
  cases,
  experience,
  philosophy,
  profile,
  projects,
  toolkit,
} from "@/content";
import type { Case } from "@/lib/types";
import styles from "./ReadingRoom.module.css";

export function ReadingRoom() {
  return (
    <div className={styles.root}>
      <article className={styles.book}>
        <TitlePage />
        <Preface />
        <Epigraph />
        <Chapters />
        <Curriculum />
        <Toolkit />
        <Appendix />
        <Colophon />
      </article>
    </div>
  );
}

/* ─────────── TITLE PAGE ─────────── */

function TitlePage() {
  return (
    <header className={styles.titlePage}>
      <p className={styles.titleEyebrow}>{profile.location}</p>
      <h1 className={styles.titleName}>{profile.name}</h1>
      <p className={styles.titleSub}>
        <em>A portfolio in six skins. This one reads like a book.</em>
      </p>
    </header>
  );
}

/* ─────────── PREFACE ─────────── */

function Preface() {
  return (
    <section className={styles.section} aria-labelledby="preface">
      <h2 id="preface" className={styles.sectionTitle}>
        Preface
      </h2>
      <p className={`${styles.prose} ${styles.firstPara}`}>{profile.intro}</p>
      <p className={styles.proseAside}>
        — {profile.currentRole}. <em>{profile.availability.message}</em>
      </p>
    </section>
  );
}

/* ─────────── EPIGRAPH ─────────── */

function Epigraph() {
  return (
    <section className={styles.epigraph} aria-labelledby="epigraph">
      <h2 id="epigraph" className={styles.srOnly}>
        Epigraph
      </h2>
      <blockquote className={styles.epigraphQuote}>
        {philosophy.quote.map((line) => (
          <p key={line}>
            <em>{line}</em>
          </p>
        ))}
      </blockquote>
      <p className={styles.epigraphAttribution}>— H.A.</p>
    </section>
  );
}

/* ─────────── CHAPTERS ─────────── */

function Chapters() {
  return (
    <section className={styles.section} aria-labelledby="chapters">
      <h2 id="chapters" className={styles.sectionTitle}>
        Three chapters, three decisions.
      </h2>
      <p className={styles.proseLede}>
        Each chapter centers on a single bet — the kind of call that earns its keep over a long
        time horizon, or doesn&apos;t. Stack notes and figures live in the margins.
      </p>
      <div className={styles.chapterList}>
        {cases.map((c, idx) => (
          <Chapter key={c.id} caseStudy={c} number={idx + 1} />
        ))}
      </div>
    </section>
  );
}

function Chapter({
  caseStudy: c,
  number,
}: Readonly<{ caseStudy: Case; number: number }>) {
  const paragraphs = readChapterProse(c);
  const brandAccentStyle = c.brand
    ? ({ "--case-accent": c.brand.primary } as React.CSSProperties)
    : undefined;
  return (
    <article className={styles.chapter} style={brandAccentStyle}>
      <header className={styles.chapterHeader}>
        <p className={styles.chapterNumber}>
          Chapter {number.toString().padStart(2, "0")}
        </p>
        <h3 className={styles.chapterTitle}>{c.title}</h3>
        <p className={styles.chapterMeta}>
          <em>{c.meta.year}</em> · {c.meta.role}
        </p>
      </header>
      {paragraphs.map((p, idx) => (
        <p
          key={p.slice(0, 40)}
          className={`${styles.prose} ${idx === 0 ? styles.firstPara : ""}`}
        >
          {p}
        </p>
      ))}
      {c.outcome.metrics?.length ? (
        <aside className={styles.marginalia}>
          {c.outcome.metrics.map((m) => (
            <p key={m.label} className={styles.marginNote}>
              <span className={styles.marginValue}>{m.value}</span>
              <span className={styles.marginLabel}>{m.label}</span>
            </p>
          ))}
        </aside>
      ) : null}
      <p className={styles.chapterStack}>
        <em>Stack:</em> {c.meta.stack}
      </p>
    </article>
  );
}

function readChapterProse(c: Case): string[] {
  if (c.prose) return c.prose.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  // Fallback: stitch summary + reflection.product if no chapter prose authored
  return [c.summary, c.reflection.product];
}

/* ─────────── CURRICULUM ─────────── */

function Curriculum() {
  return (
    <section className={styles.section} aria-labelledby="curriculum">
      <h2 id="curriculum" className={styles.sectionTitle}>
        Curriculum
      </h2>
      <p className={styles.proseLede}>Roles, in reverse chronological order.</p>
      <ul className={styles.curriculumList}>
        {experience.map((role) => (
          <li key={`${role.company}-${role.period}`} className={styles.curriculumItem}>
            <p className={styles.curriculumTitle}>
              <strong>{role.company}</strong>{" "}
              <em className={styles.curriculumRole}>· {role.title}</em>
            </p>
            <p className={styles.curriculumPeriod}>
              <em>{role.period}</em>
            </p>
            <p className={styles.curriculumDesc}>{role.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────── TOOLKIT ─────────── */

function Toolkit() {
  return (
    <section className={styles.section} aria-labelledby="toolkit">
      <h2 id="toolkit" className={styles.sectionTitle}>
        Tools of the trade
      </h2>
      <p className={styles.proseLede}>
        Listed for the curious. The portfolio doesn&apos;t turn on these — it turns on the
        decisions made with them.
      </p>
      <dl className={styles.toolkitList}>
        {toolkit.engineering.map((group) => (
          <div key={group.category} className={styles.toolkitRow}>
            <dt>
              <em>{group.category}</em>
            </dt>
            <dd>{group.items.join(", ")}.</dd>
          </div>
        ))}
      </dl>
      <h3 className={styles.subSectionTitle}>Product practice</h3>
      <ul className={styles.productList}>
        {toolkit.product.map((entry) => (
          <li key={entry.category}>
            <strong>{entry.category}.</strong>{" "}
            <em>{entry.headline}</em> {entry.body}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────── APPENDIX (PROJECTS) ─────────── */

function Appendix() {
  return (
    <section className={styles.section} aria-labelledby="appendix">
      <h2 id="appendix" className={styles.sectionTitle}>
        Appendix · selected ships
      </h2>
      <p className={styles.proseLede}>
        Other things shipped. Listed without ranking, grouped by where they were built.
      </p>
      {projects.map((group) => (
        <div key={group.heading} className={styles.appendixGroup}>
          <h3 className={styles.subSectionTitle}>{group.heading}</h3>
          <ul className={styles.appendixList}>
            {group.projects.map((p) => (
              <li key={p.name} className={styles.appendixItem}>
                <p>
                  <strong>{p.name}</strong>{" "}
                  <em className={styles.appendixTagline}>· {p.tagline}.</em>{" "}
                  {p.description}
                </p>
                <p className={styles.appendixMeta}>
                  <em>{p.stack} — {p.status}.</em>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

/* ─────────── COLOPHON ─────────── */

function Colophon() {
  return (
    <footer className={styles.colophon}>
      <hr className={styles.colophonRule} />
      <p className={styles.colophonLine}>
        <em>Set in Fraunces.</em> Built with Next.js 16. © {new Date().getFullYear()}{" "}
        {profile.name}.
      </p>
      <p className={styles.colophonLine}>
        <em>For the canonical Decision Log, press</em> <kbd>1</kbd>.
      </p>
    </footer>
  );
}
