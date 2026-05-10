import {
  cases,
  education,
  experience,
  marquee,
  philosophy,
  profile,
  projects,
  toolkit,
} from "@/content";
import type { Case, OptionRow, ProblemItem, Role } from "@/lib/types";
import styles from "./DecisionLog.module.css";

export function DecisionLog() {
  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <Hero />
        <Philosophy />
        <Cases />
        <Experience />
        <Toolkit />
        <Projects />
        <Marquee />
        <Footer />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <header className={styles.hero}>
      <p className={styles.eyebrow}>{profile.location} · {profile.currentRole}</p>
      <h1 className={styles.heroName}>{profile.name}</h1>
      <p className={styles.tagline}>{profile.tagline}</p>
      <p className={styles.intro}>{profile.intro}</p>
      <p className={styles.availability}>
        <span aria-hidden="true">{"//"}</span> {profile.availability.message.toLowerCase()}
      </p>
      <SocialBar />
    </header>
  );
}

function SocialBar() {
  const { socials, email } = profile;
  const links: { label: string; url: string }[] = [
    { label: "email", url: `mailto:${email}` },
    { label: "linkedin", url: socials.linkedin },
    { label: "github", url: socials.github },
    { label: "x", url: socials.x },
    { label: "pub.dev", url: socials.pubdev },
  ];
  return (
    <ul className={styles.socials}>
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.url} className={styles.socialLink} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Philosophy() {
  return (
    <section className={styles.philosophy} aria-label="Operating philosophy">
      <hr className={styles.divider} />
      <blockquote className={styles.philosophyQuote}>
        {philosophy.quote.map((line, idx) => (
          <p key={idx} className={styles.philosophyLine}>
            {line}
          </p>
        ))}
      </blockquote>
    </section>
  );
}

function Cases() {
  return (
    <section className={styles.cases} aria-label="Case studies">
      <SectionHeading
        eyebrow="Case Studies"
        title="Three decisions, written down."
        kicker="Each case centers on one pivotal Bet. Supporting decisions live inside Outcome and Reflection."
      />
      <div className={styles.casesList}>
        {cases.map((c) => (
          <CaseStudy key={c.id} caseStudy={c} />
        ))}
      </div>
    </section>
  );
}

function CaseStudy({ caseStudy: c }: { caseStudy: Case }) {
  return (
    <article className={styles.case} id={c.id}>
      <header className={styles.caseHeader}>
        <p className={styles.caseNumber}>Case {String(c.number).padStart(2, "0")}</p>
        <h3 className={styles.caseTitle}>{c.title}</h3>
        <ul className={styles.caseMeta}>
          <li>
            <span className={styles.metaKey}>year</span> {c.meta.year}
          </li>
          <li>
            <span className={styles.metaKey}>duration</span> {c.meta.duration}
          </li>
          <li>
            <span className={styles.metaKey}>role</span> {c.meta.role}
          </li>
          <li>
            <span className={styles.metaKey}>stack</span> {c.meta.stack}
          </li>
          <li>
            <span className={styles.metaKey}>status</span> {c.meta.status}
          </li>
          {c.meta.repoUrl ? (
            <li>
              <span className={styles.metaKey}>repo</span>{" "}
              <a href={c.meta.repoUrl} target="_blank" rel="noreferrer" className={styles.repoLink}>
                {c.meta.repoUrl.replace("https://", "")}
              </a>
            </li>
          ) : null}
        </ul>
      </header>

      {c.reframeNote ? (
        <aside className={styles.reframe} role="note">
          <p className={styles.reframeLabel}>Reframe note</p>
          <p>{c.reframeNote}</p>
        </aside>
      ) : null}

      <p className={styles.summary}>{c.summary}</p>

      <CaseSection label="Problem">
        <ProblemBlock problem={c.problem} />
      </CaseSection>

      <CaseSection label="Options">
        <OptionsTable options={c.options} />
      </CaseSection>

      <CaseSection label="Bet">
        <BetBlock bet={c.bet} />
      </CaseSection>

      <CaseSection label="Outcome">
        <OutcomeBlock outcome={c.outcome} />
      </CaseSection>

      <CaseSection label="Reflection">
        <ReflectionBlock reflection={c.reflection} />
      </CaseSection>
    </article>
  );
}

function CaseSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.caseSection}>
      <h4 className={styles.caseSectionLabel}>{label}</h4>
      <div className={styles.caseSectionBody}>{children}</div>
    </div>
  );
}

function ProblemBlock({ problem }: { problem: Case["problem"] }) {
  return (
    <>
      {problem.intro ? <p>{problem.intro}</p> : null}
      {problem.items?.length ? (
        <ol className={styles.problemList}>
          {problem.items.map((item: ProblemItem, idx: number) => (
            <li key={idx}>
              <strong>{item.label}.</strong> {item.body}
            </li>
          ))}
        </ol>
      ) : null}
      {problem.paragraphs?.map((p, idx) => (
        <p key={`p-${idx}`}>{p}</p>
      ))}
    </>
  );
}

function OptionsTable({ options }: { options: OptionRow[] }) {
  return (
    <div className={styles.optionsWrap}>
      <table className={styles.optionsTable}>
        <thead>
          <tr>
            <th scope="col" className={styles.optionsHeadLetter}>
              {""}
            </th>
            <th scope="col">Option</th>
            <th scope="col">Why we rejected (or didn&apos;t)</th>
          </tr>
        </thead>
        <tbody>
          {options.map((opt) => {
            const chosen = /chosen/i.test(opt.rejection);
            return (
              <tr key={opt.letter} className={chosen ? styles.optionChosen : undefined}>
                <th scope="row" className={styles.optionLetter}>
                  {opt.letter}
                </th>
                <td className={styles.optionLabel}>{opt.label}</td>
                <td className={styles.optionRejection}>{opt.rejection}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BetBlock({ bet }: { bet: Case["bet"] }) {
  return (
    <>
      {bet.intro ? <p className={styles.betIntro}>{bet.intro}</p> : null}
      {bet.sections?.map((section, idx) => (
        <div key={idx} className={styles.betSection}>
          <h5 className={styles.betSectionHeading}>{section.heading}</h5>
          {Array.isArray(section.body) ? (
            <ul className={styles.betSectionList}>
              {section.body.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{section.body}</p>
          )}
        </div>
      ))}
    </>
  );
}

function OutcomeBlock({ outcome }: { outcome: Case["outcome"] }) {
  return (
    <>
      {outcome.metrics?.length ? (
        <ul className={styles.metrics}>
          {outcome.metrics.map((m, idx) => (
            <li key={idx}>
              <span className={styles.metricValue}>{m.value}</span>
              <span className={styles.metricLabel}>{m.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {outcome.paragraphs.map((p, idx) => (
        <p key={idx}>{p}</p>
      ))}
    </>
  );
}

function ReflectionBlock({ reflection }: { reflection: Case["reflection"] }) {
  if (reflection.primary || reflection.secondary) {
    return (
      <div className={styles.reflectionTier}>
        {reflection.primary ? (
          <blockquote className={styles.reflectionPrimary}>
            <p className={styles.reflectionLabel}>primary — ownership</p>
            <p>{reflection.primary}</p>
          </blockquote>
        ) : null}
        {reflection.secondary ? (
          <blockquote className={styles.reflectionSecondary}>
            <p className={styles.reflectionLabel}>secondary — process learning</p>
            <p>{reflection.secondary}</p>
          </blockquote>
        ) : null}
      </div>
    );
  }
  return (
    <blockquote className={styles.reflectionPrimary}>
      {reflection.paragraphs?.map((p, idx) => (
        <p key={idx}>{p}</p>
      ))}
    </blockquote>
  );
}

function Experience() {
  return (
    <section className={styles.section} aria-label="Experience">
      <SectionHeading
        eyebrow="Experience"
        title="Six years across startup chaos and enterprise structure."
      />
      <ul className={styles.experienceList}>
        {experience.map((role, idx) => (
          <ExperienceRow key={`${role.company}-${idx}`} role={role} />
        ))}
      </ul>
      <div className={styles.education}>
        <h4 className={styles.educationHeading}>Education</h4>
        {education.map((ed) => (
          <p key={ed.institution} className={styles.educationRow}>
            <span>{ed.qualification}</span>
            <span aria-hidden="true">·</span>
            <span>{ed.institution}</span>
            <span aria-hidden="true">·</span>
            <span>{ed.period}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

function ExperienceRow({ role }: { role: Role }) {
  return (
    <li className={styles.experienceItem}>
      <header className={styles.experienceHeader}>
        <p className={styles.experienceTitle}>
          <strong>{role.company}</strong> · {role.title}
        </p>
        <p className={styles.experienceMeta}>
          <span>{role.period}</span>
          <span aria-hidden="true">·</span>
          <span>{role.location}</span>
        </p>
      </header>
      <p className={styles.experienceDescription}>{role.description}</p>
      {role.subProducts?.length ? (
        <ul className={styles.subProductList}>
          {role.subProducts.map((sub) => (
            <li key={sub.product}>
              <span className={styles.subProductHeading}>
                <strong>{sub.product}</strong>{" "}
                <span className={styles.subProductPeriod}>({sub.period})</span>
              </span>
              <span className={styles.subProductBody}>{sub.description}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {role.closingNote ? <p className={styles.closingNote}>{role.closingNote}</p> : null}
    </li>
  );
}

function Toolkit() {
  return (
    <section className={styles.section} aria-label="Toolkit">
      <SectionHeading
        eyebrow="Toolkit"
        title="What I actually use, not what I aspire to claim."
      />
      <div className={styles.toolkitGrid}>
        <div>
          <h4 className={styles.toolkitColumnHeading}>Engineering</h4>
          <dl className={styles.engineeringList}>
            {toolkit.engineering.map((group) => (
              <div key={group.category} className={styles.engineeringRow}>
                <dt className={styles.engineeringCategory}>{group.category}</dt>
                <dd className={styles.engineeringItems}>{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h4 className={styles.toolkitColumnHeading}>Product</h4>
          <ul className={styles.productList}>
            {toolkit.product.map((entry) => (
              <li key={entry.category} className={styles.productRow}>
                <p className={styles.productCategory}>{entry.category}</p>
                <p className={styles.productHeadline}>{entry.headline}</p>
                <p className={styles.productBody}>{entry.body}</p>
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
    <section className={styles.section} aria-label="Other projects">
      <SectionHeading
        eyebrow="Selected ships"
        title="The breadth that doesn't make the case study cut."
        kicker="One line each. No Decision Log structure — just what shipped, where to find it."
      />
      <div className={styles.projectsGroups}>
        {projects.map((group) => (
          <div key={group.heading} className={styles.projectsGroup}>
            <h4 className={styles.projectsGroupHeading}>{group.heading}</h4>
            <ul className={styles.projectList}>
              {group.projects.map((p) => (
                <li key={p.name} className={styles.projectItem}>
                  <p className={styles.projectName}>
                    <strong>{p.name}</strong> — <em>{p.tagline}</em>
                  </p>
                  <p className={styles.projectDescription}>{p.description}</p>
                  <p className={styles.projectMeta}>
                    <span>{p.stack}</span>
                    <span aria-hidden="true">·</span>
                    <span className={styles.projectStatus}>{p.status}</span>
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

function Marquee() {
  return (
    <section className={styles.marquee} aria-label="Stack and identity markers">
      <p className={styles.marqueeText}>{marquee.join(" · ")}</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} {profile.name}. Six skins, same content. Try the others.
      </p>
    </footer>
  );
}

function SectionHeading({
  eyebrow,
  title,
  kicker,
}: {
  eyebrow: string;
  title: string;
  kicker?: string;
}) {
  return (
    <header className={styles.sectionHeading}>
      <p className={styles.sectionEyebrow}>{eyebrow}</p>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {kicker ? <p className={styles.sectionKicker}>{kicker}</p> : null}
    </header>
  );
}
