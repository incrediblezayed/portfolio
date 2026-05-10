import {
  cases,
  experience,
  marquee,
  philosophy,
  profile,
  projects,
  toolkit,
} from "@/content";
import { readCanonical, readCanonicalParagraphs } from "@/lib/caseVoice";
import type { Case, Role } from "@/lib/types";
import styles from "./Editorial.module.css";

export function Editorial() {
  return (
    <div className={styles.root}>
      <PaperOverlay />
      <main className={styles.main}>
        <Hero />
        <MarqueeTicker />
        <Philosophy />
        <Cases />
        <Experience />
        <Toolkit />
        <Projects />
        <Footer />
      </main>
    </div>
  );
}

function PaperOverlay() {
  return <div className={styles.paperOverlay} aria-hidden="true" />;
}

function Hero() {
  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");
  return (
    <header className={`${styles.hero} ${styles.stagger0}`}>
      <p className={styles.eyebrow}>
        <span>{profile.location}</span>
        <span aria-hidden="true">·</span>
        <span>{profile.currentRole}</span>
      </p>
      <h1 className={styles.heroName} aria-label={profile.name}>
        <span className={styles.heroNameStrong}>{firstName}</span>{" "}
        <span className={styles.heroNameItalic}>{lastName}</span>
      </h1>
      <p className={styles.tagline}>
        <em>{profile.tagline}</em>
      </p>
      <div className={styles.heroBody}>
        <p className={styles.intro}>{profile.intro}</p>
        <aside className={styles.heroAside}>
          <p className={styles.availability}>
            <em>{profile.availability.message}</em>
          </p>
          <ul className={styles.socials}>
            <li>
              <a href={`mailto:${profile.email}`}>email</a>
            </li>
            <li>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
              >
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
            <li>
              <a href={profile.socials.pubdev} target="_blank" rel="noreferrer">
                pub.dev
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </header>
  );
}

function MarqueeTicker() {
  const reel = [...marquee, ...marquee];
  return (
    <section
      className={`${styles.marquee} ${styles.stagger1}`}
      aria-label="Stack and identity markers"
    >
      <div className={styles.marqueeTrack}>
        {reel.map((label, idx) => (
          <span key={`${label}-${idx}`} className={styles.marqueeItem}>
            {label}
            <span aria-hidden="true" className={styles.marqueeDot}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section
      className={`${styles.philosophy} ${styles.stagger2}`}
      aria-label="Operating philosophy"
    >
      <blockquote className={styles.philosophyQuote}>
        {philosophy.quote.map((line) => (
          <p key={line} className={styles.philosophyLine}>
            <em>{line}</em>
          </p>
        ))}
      </blockquote>
      <p className={styles.philosophyAttribution}>
        — {profile.name.split(" ")[0]}
      </p>
    </section>
  );
}

function Cases() {
  return (
    <section
      className={`${styles.cases} ${styles.stagger3}`}
      aria-label="Case studies"
    >
      <SectionHeading
        eyebrow="Three Decisions"
        title="The bets, in print."
        kicker="The full Decision Log lives in another skin. Here, the gist."
      />
      <div className={styles.caseList}>
        {cases.map((c) => (
          <CaseEssay key={c.id} caseStudy={c} />
        ))}
      </div>
    </section>
  );
}

function pickFirstBetBody(c: Case): string | null {
  const section = c.bet.sections?.[0];
  if (!section) return null;
  return readCanonicalParagraphs(section)[0] ?? null;
}

function CaseEssay({ caseStudy: c }: Readonly<{ caseStudy: Case }>) {
  const firstBetBody = pickFirstBetBody(c);

  return (
    <article className={styles.case} id={`editorial-${c.id}`}>
      <header className={styles.caseHeader}>
        <p className={styles.caseEyebrow}>
          Case {String(c.number).padStart(2, "0")} · {c.meta.year}
        </p>
        <h3 className={styles.caseTitle}>
          <em>{c.title}</em>
        </h3>
        <p className={styles.caseMeta}>
          {c.meta.role} · {c.meta.status}
        </p>
      </header>

      <div className={styles.caseFlow}>
        <p className={styles.lede}>{c.summary}</p>

        {c.bet.intro ? (
          <p>
            <InlineLabel>Bet.</InlineLabel> {readCanonical(c.bet.intro)}
          </p>
        ) : null}

        {firstBetBody ? <p>{firstBetBody}</p> : null}

        {c.outcome.metrics?.length ? (
          <ul className={styles.metrics}>
            {c.outcome.metrics.slice(0, 4).map((metric) => (
              <li key={metric.label} className={styles.metric}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <p>
          <InlineLabel>Outcome.</InlineLabel>{" "}
          {c.outcome.paragraphs[0]
            ? readCanonicalParagraphs(c.outcome.paragraphs[0])[0]
            : null}
        </p>
      </div>

      <ReflectionPullQuote caseStudy={c} />
    </article>
  );
}

function InlineLabel({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className={styles.inlineLabel}>{children}</span>;
}

function ReflectionPullQuote({ caseStudy: c }: Readonly<{ caseStudy: Case }>) {
  const text = c.reflection.product;
  if (!text) return null;
  return (
    <blockquote className={styles.pullquote}>
      <p>
        <em>“{text}”</em>
      </p>
      <footer>Reflection</footer>
    </blockquote>
  );
}

function Experience() {
  return (
    <section
      className={`${styles.experience} ${styles.stagger4}`}
      aria-label="Experience"
    >
      <SectionHeading eyebrow="Curriculum" title="Six years on the floor." />
      <ul className={styles.experienceList}>
        {experience.map((role) => (
          <ExperienceRow key={`${role.company}-${role.period}`} role={role} />
        ))}
      </ul>
    </section>
  );
}

function ExperienceRow({ role }: Readonly<{ role: Role }>) {
  return (
    <li className={styles.experienceItem}>
      <p className={styles.experiencePeriod}>{role.period}</p>
      <div className={styles.experienceBody}>
        <p className={styles.experienceTitle}>
          <strong>{role.company}</strong>{" "}
          <span className={styles.experienceRoleTitle}>· {role.title}</span>
        </p>
        <p className={styles.experienceDescription}>{role.description}</p>
        {role.subProducts?.length ? (
          <ul className={styles.subProductList}>
            {role.subProducts.map((sub) => (
              <li key={sub.product}>
                <em>{sub.product}</em> — {sub.description}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

function Toolkit() {
  return (
    <section
      className={`${styles.toolkit} ${styles.stagger5}`}
      aria-label="Toolkit"
    >
      <SectionHeading eyebrow="Toolkit" title="What stays in the kit." />
      <div className={styles.toolkitGrid}>
        <div className={styles.toolkitColumn}>
          <p className={styles.toolkitColumnEyebrow}>Engineering</p>
          <dl className={styles.engineeringList}>
            {toolkit.engineering.map((group) => (
              <div key={group.category} className={styles.engineeringRow}>
                <dt>{group.category}</dt>
                <dd>{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.toolkitColumn}>
          <p className={styles.toolkitColumnEyebrow}>Product</p>
          <ul className={styles.productList}>
            {toolkit.product.map((entry) => (
              <li key={entry.category}>
                <p className={styles.productCategory}>{entry.category}</p>
                <p className={styles.productHeadline}>
                  <em>{entry.headline}</em>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section
      className={`${styles.projects} ${styles.stagger6}`}
      aria-label="Other work"
    >
      <SectionHeading
        eyebrow="Selected ships"
        title="What didn't make the case study cut."
      />
      <div className={styles.projectsGroups}>
        {projects.map((group) => (
          <div key={group.heading} className={styles.projectsGroup}>
            <p className={styles.projectsGroupHeading}>{group.heading}</p>
            <ul className={styles.projectList}>
              {group.projects.map((p) => (
                <li key={p.name} className={styles.projectItem}>
                  <p className={styles.projectName}>
                    <strong>{p.name}</strong>{" "}
                    <em className={styles.projectTagline}>— {p.tagline}</em>
                  </p>
                  <p className={styles.projectMeta}>
                    {p.stack} · {p.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={`${styles.footer} ${styles.stagger7}`}>
      <p className={styles.footerLine}>
        <em>End of issue.</em>
      </p>
      <p className={styles.footerLineMeta}>
        © {new Date().getFullYear()} {profile.name} · Six skins, same content.
        Press <kbd>1</kbd> for the canonical Decision Log.
      </p>
    </footer>
  );
}

function SectionHeading({
  eyebrow,
  title,
  kicker,
}: Readonly<{
  eyebrow: string;
  title: string;
  kicker?: string;
}>) {
  return (
    <header className={styles.sectionHeading}>
      <p className={styles.sectionEyebrow}>{eyebrow}</p>
      <h2 className={styles.sectionTitle}>
        <em>{title}</em>
      </h2>
      {kicker ? <p className={styles.sectionKicker}>{kicker}</p> : null}
    </header>
  );
}
