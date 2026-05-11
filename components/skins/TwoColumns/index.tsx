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
  isForVoice,
  readReflection,
  readVoice,
  readVoiceParagraphs,
  readOptionVoice,
} from "@/lib/caseVoice";
import type { Case, CaseVoice, Role } from "@/lib/types";
import styles from "./TwoColumns.module.css";

export function TwoColumns() {
  return (
    <div className={styles.root}>
      <div className={styles.split}>
        <BuilderColumn />
        <StrategistColumn />
      </div>
      <Footer />
    </div>
  );
}

/* ─────────── BUILDER (left, dark, mono, technical) ─────────── */

function BuilderColumn() {
  return (
    <aside
      className={styles.builderColumn}
      aria-label="The builder — technical perspective"
    >
      <BuilderHero />
      <BuilderPhilosophy />
      <BuilderCases />
      <BuilderExperience />
      <BuilderToolkit />
      <BuilderProjects />
      <BuilderMarquee />
    </aside>
  );
}

function BuilderHero() {
  const role = profile.engineeringCurrentRole ?? profile.currentRole;
  const tagline = profile.engineeringTagline ?? profile.tagline;
  const intro = profile.engineeringIntro ?? profile.intro;
  const availabilityMessage =
    profile.engineeringAvailabilityMessage ?? profile.availability.message;
  return (
    <header className={styles.builderSection}>
      <p className={styles.builderEyebrow}>{"// the_builder.md"}</p>
      <h1 className={styles.builderName}>{profile.name}</h1>
      <p className={styles.builderRole}>{role}</p>
      <p className={styles.builderTagline}>{tagline}</p>
      <pre className={styles.builderIntro}>{intro}</pre>
      <p className={styles.builderAvailability}>
        <span className={styles.builderAccent}>{">"}</span> status:{" "}
        {profile.availability.signal} — {availabilityMessage}
      </p>
      <ul className={styles.builderSocials}>
        <li>
          <a href={`mailto:${profile.email}`}>email</a>
        </li>
        <li>
          <a href={profile.socials.github} target="_blank" rel="noreferrer">
            github
          </a>
        </li>
        <li>
          <a href={profile.socials.pubdev} target="_blank" rel="noreferrer">
            pub.dev
          </a>
        </li>
        <li>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
        </li>
      </ul>
    </header>
  );
}

function BuilderPhilosophy() {
  const quote = philosophy.engineeringQuote ?? philosophy.quote;
  return (
    <section className={styles.builderSection}>
      <p className={styles.builderEyebrow}>{"// philosophy.txt"}</p>
      <pre className={styles.builderQuoteBlock}>
        {quote.map((line) => `> ${line}`).join("\n")}
      </pre>
    </section>
  );
}

function BuilderCases() {
  return (
    <section className={styles.builderSection}>
      <p className={styles.builderEyebrow}>{"// cases/"}</p>
      <h2 className={styles.builderSectionTitle}>
        Architecture decisions, in code-comment voice.
      </h2>
      {cases.map((c) => (
        <BuilderCase key={c.id} caseStudy={c} />
      ))}
    </section>
  );
}

function BuilderCase({ caseStudy: c }: Readonly<{ caseStudy: Case }>) {
  const voice: CaseVoice = "tech";
  const problemItems =
    c.problem.items?.filter((item) => isForVoice(item, voice)) ?? [];
  const problemParagraphs =
    c.problem.paragraphs?.filter((p) => isForVoice(p, voice)) ?? [];
  const options = c.options.filter((opt) => isForVoice(opt, voice));
  const betSections =
    c.bet.sections?.filter((section) => isForVoice(section, voice)) ?? [];
  const outcomeParagraphs = c.outcome.paragraphs.filter((p) =>
    isForVoice(p, voice),
  );
  const metrics = c.outcome.metrics?.filter((m) => isForVoice(m, voice)) ?? [];
  const brandAccentStyle = c.brand
    ? ({ "--case-accent": c.brand.primary } as React.CSSProperties)
    : undefined;

  return (
    <article className={styles.builderCase} style={brandAccentStyle}>
      <header className={styles.builderCaseHeader}>
        <p className={styles.builderCaseNum}>
          case_{String(c.number).padStart(2, "0")}
        </p>
        <h3 className={styles.builderCaseTitle}>{c.title.toLowerCase()}</h3>
        <dl className={styles.builderMeta}>
          <div>
            <dt>stack</dt>
            <dd>{c.meta.stack}</dd>
          </div>
          <div>
            <dt>year</dt>
            <dd>{c.meta.year}</dd>
          </div>
          <div>
            <dt>status</dt>
            <dd>{c.meta.status}</dd>
          </div>
          {c.meta.repoUrl ? (
            <div>
              <dt>repo</dt>
              <dd>
                <a href={c.meta.repoUrl} target="_blank" rel="noreferrer">
                  {c.meta.repoUrl.replace("https://", "")}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </header>

      {c.problem.intro || problemItems.length || problemParagraphs.length ? (
        <div className={styles.builderBlock}>
          <p className={styles.builderBlockLabel}>{"// problem"}</p>
          {c.problem.intro ? <p>{readVoice(c.problem.intro, voice)}</p> : null}
          {problemItems.length ? (
            <ul className={styles.builderProblemList}>
              {problemItems.map((item) => (
                <li key={item.label}>
                  <span className={styles.builderAccent}>×</span>{" "}
                  <strong>{item.label}.</strong> {readVoice(item, voice)}
                </li>
              ))}
            </ul>
          ) : null}
          {problemParagraphs
            .flatMap((p) => readVoiceParagraphs(p, voice))
            .map((p) => (
              <p key={p}>{p}</p>
            ))}
        </div>
      ) : null}

      {options.length ? (
        <div className={styles.builderBlock}>
          <p className={styles.builderBlockLabel}>{"// options"}</p>
          <table className={styles.builderOptionsTable}>
            <tbody>
              {options.map((opt) => {
                const chosen = opt.selected ?? false;
                const option = readOptionVoice(opt, voice);
                return (
                  <tr
                    key={opt.letter}
                    className={chosen ? styles.builderChosen : undefined}
                  >
                    <th scope="row">{opt.letter}</th>
                    <td>{option.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {c.bet.intro || betSections.length ? (
        <div className={styles.builderBlock}>
          <p className={styles.builderBlockLabel}>
            {"// bet — why this stack"}
          </p>
          {c.bet.intro ? <p>{readVoice(c.bet.intro, voice)}</p> : null}
          {betSections.map((section) => (
            <div key={section.heading} className={styles.builderBetSection}>
              <p
                className={styles.builderBetHeading}
              >{`// ${section.heading.toLowerCase()}`}</p>
              {Array.isArray(readVoice(section, voice)) ? (
                <ul className={styles.builderBetList}>
                  {readVoiceParagraphs(section, voice).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{readVoice(section, voice)}</p>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {metrics.length || outcomeParagraphs.length ? (
        <div className={styles.builderBlock}>
          <p className={styles.builderBlockLabel}>{"// metrics"}</p>
          {metrics.length ? (
            <ul className={styles.builderMetrics}>
              {metrics.map((m) => (
                <li key={m.label}>
                  <span className={styles.builderAccent}>{m.value}</span>{" "}
                  {m.label}
                </li>
              ))}
            </ul>
          ) : null}
          {outcomeParagraphs
            .flatMap((p) => readVoiceParagraphs(p, voice))
            .map((p) => (
              <p key={p}>{p}</p>
            ))}
        </div>
      ) : null}

      <div className={styles.builderBlock}>
        <p className={styles.builderBlockLabel}>
          {"// reflection — engineering"}
        </p>
        <p className={styles.builderReflection}>
          {readReflection(c.reflection, voice)}
        </p>
      </div>
    </article>
  );
}

function BuilderExperience() {
  return (
    <section className={styles.builderSection}>
      <p className={styles.builderEyebrow}>{"// experience.log"}</p>
      <ul className={styles.builderExperienceList}>
        {experience.map((role) => (
          <BuilderRole key={`${role.company}-${role.period}`} role={role} />
        ))}
      </ul>
    </section>
  );
}

function BuilderRole({ role }: Readonly<{ role: Role }>) {
  return (
    <li className={styles.builderRole}>
      <p className={styles.builderRoleHead}>
        <span className={styles.builderAccent}>•</span> {role.period} —{" "}
        {role.company} :: {role.title}
      </p>
      <p className={styles.builderRoleDesc}>{role.engineeringSummary}</p>
      {role.subProducts?.length ? (
        <ul className={styles.builderSubList}>
          {role.subProducts.map((sub) => (
            <li key={sub.product}>
              <span className={styles.builderAccent}>↳</span> {sub.product}{" "}
              <span className={styles.builderRolePeriod}>({sub.period})</span> —{" "}
              {sub.description}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function BuilderToolkit() {
  return (
    <section className={styles.builderSection}>
      <p className={styles.builderEyebrow}>{"// engineering.toolkit"}</p>
      <dl className={styles.builderToolkit}>
        {toolkit.engineering.map((group) => (
          <div key={group.category} className={styles.builderToolkitRow}>
            <dt>{group.category.toLowerCase()}</dt>
            <dd>{group.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function BuilderProjects() {
  return (
    <section className={styles.builderSection}>
      <p className={styles.builderEyebrow}>{"// other_ships/"}</p>
      {projects.map((group) => (
        <div key={group.heading} className={styles.builderProjectGroup}>
          <p className={styles.builderProjectHeading}>
            {group.heading.toLowerCase()}/
          </p>
          <ul className={styles.builderProjectList}>
            {group.projects.map((p) => (
              <li key={p.name}>
                <span className={styles.builderAccent}>›</span>{" "}
                <strong>{p.name}</strong> — <span>{p.engineeringSummary}</span>{" "}
                <span className={styles.builderProjectStatus}>
                  · {p.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function BuilderMarquee() {
  return (
    <section className={styles.builderSection}>
      <p className={styles.builderEyebrow}>{"// stack.identity"}</p>
      <p className={styles.builderMarqueeText}>
        {marquee.map((label) => `[${label}]`).join(" ")}
      </p>
    </section>
  );
}

/* ─────────── STRATEGIST (right, light, serif, prose) ─────────── */

function StrategistColumn() {
  return (
    <aside
      className={styles.strategistColumn}
      aria-label="The strategist — product perspective"
    >
      <StrategistHero />
      <StrategistPhilosophy />
      <StrategistCases />
      <StrategistExperience />
      <StrategistToolkit />
      <StrategistProjects />
      <StrategistMarquee />
    </aside>
  );
}

function StrategistHero() {
  return (
    <header className={styles.strategistSection}>
      <p className={styles.strategistEyebrow}>The Strategist</p>
      <h1 className={styles.strategistName}>{profile.name}</h1>
      <p className={styles.strategistRole}>
        <em>{profile.currentRole}</em>
      </p>
      <p className={styles.strategistTagline}>{profile.tagline}</p>
      <p className={styles.strategistIntro}>{profile.intro}</p>
      <p className={styles.strategistAvailability}>
        <em>{profile.availability.message}</em>
      </p>
    </header>
  );
}

function StrategistPhilosophy() {
  return (
    <section className={styles.strategistSection}>
      <p className={styles.strategistEyebrow}>Philosophy</p>
      <blockquote className={styles.strategistQuote}>
        {philosophy.quote.map((line) => (
          <p key={line}>
            <em>{line}</em>
          </p>
        ))}
      </blockquote>
    </section>
  );
}

function StrategistCases() {
  return (
    <section className={styles.strategistSection}>
      <p className={styles.strategistEyebrow}>Case Studies</p>
      <h2 className={styles.strategistSectionTitle}>
        The bets, in narrative voice.
      </h2>
      {cases.map((c) => (
        <StrategistCase key={c.id} caseStudy={c} />
      ))}
    </section>
  );
}

function StrategistCase({ caseStudy: c }: Readonly<{ caseStudy: Case }>) {
  const voice: CaseVoice = "product";
  const problemItems =
    c.problem.items?.filter((item) => isForVoice(item, voice)) ?? [];
  const problemParagraphs =
    c.problem.paragraphs?.filter((p) => isForVoice(p, voice)) ?? [];
  const betSections =
    c.bet.sections?.filter((section) => isForVoice(section, voice)) ?? [];
  const outcomeParagraphs = c.outcome.paragraphs.filter((p) =>
    isForVoice(p, voice),
  );
  const metrics = c.outcome.metrics?.filter((m) => isForVoice(m, voice)) ?? [];
  const brandAccentStyle = c.brand
    ? ({ "--case-accent": c.brand.primary } as React.CSSProperties)
    : undefined;

  return (
    <article className={styles.strategistCase} style={brandAccentStyle}>
      <header className={styles.strategistCaseHeader}>
        <p className={styles.strategistCaseNum}>
          Case {String(c.number).padStart(2, "0")} · {c.meta.year}
        </p>
        <h3 className={styles.strategistCaseTitle}>{c.title}</h3>
        <p className={styles.strategistCaseRole}>{c.meta.role}</p>
      </header>

      <p className={styles.strategistLede}>{c.summary}</p>

      {c.problem.intro || problemItems.length || problemParagraphs.length ? (
        <div className={styles.strategistBlock}>
          <p className={styles.strategistBlockLabel}>The problem.</p>
          {c.problem.intro ? <p>{readVoice(c.problem.intro, voice)}</p> : null}
          {problemItems.map((item) => (
            <p key={item.label}>
              <strong>{item.label}.</strong> {readVoice(item, voice)}
            </p>
          ))}
          {problemParagraphs
            .flatMap((p) => readVoiceParagraphs(p, voice))
            .map((p) => (
              <p key={p}>{p}</p>
            ))}
        </div>
      ) : null}

      {c.bet.intro || betSections.length ? (
        <div className={styles.strategistBlock}>
          <p className={styles.strategistBlockLabel}>The bet.</p>
          {c.bet.intro ? <p>{readVoice(c.bet.intro, voice)}</p> : null}
          {betSections
            .flatMap((section) => readVoiceParagraphs(section, voice))
            .map((p) => (
              <p key={p}>{p}</p>
            ))}
        </div>
      ) : null}

      <div className={styles.strategistBlock}>
        <p className={styles.strategistBlockLabel}>What happened.</p>
        {metrics.length ? (
          <p>{metrics.map((m) => `${m.value} ${m.label}`).join(" · ")}</p>
        ) : null}
        {outcomeParagraphs
          .flatMap((p) => readVoiceParagraphs(p, voice))
          .map((p) => (
            <p key={p}>{p}</p>
          ))}
      </div>

      <blockquote className={styles.strategistReflection}>
        <p>
          <em>“{readReflection(c.reflection, voice)}”</em>
        </p>
        <footer>Reflection</footer>
      </blockquote>
    </article>
  );
}

function StrategistExperience() {
  return (
    <section className={styles.strategistSection}>
      <p className={styles.strategistEyebrow}>Curriculum</p>
      <ul className={styles.strategistExperienceList}>
        {experience.map((role) => (
          <li
            key={`${role.company}-${role.period}`}
            className={styles.strategistRole}
          >
            <p className={styles.strategistRoleHead}>
              <strong>{role.company}</strong>{" "}
              <em className={styles.strategistRoleTitle}>· {role.title}</em>
            </p>
            <p className={styles.strategistRolePeriod}>{role.period}</p>
            <p className={styles.strategistRoleDesc}>{role.productSummary}</p>
            {role.subProducts?.length ? (
              <ul className={styles.strategistSubList}>
                {role.subProducts.map((sub) => (
                  <li key={sub.product}>
                    <em>{sub.product}</em> — {sub.description}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function StrategistToolkit() {
  return (
    <section className={styles.strategistSection}>
      <p className={styles.strategistEyebrow}>Product toolkit</p>
      <ul className={styles.strategistProductList}>
        {toolkit.product.map((entry) => (
          <li key={entry.category} className={styles.strategistProductRow}>
            <p className={styles.strategistProductCategory}>{entry.category}</p>
            <p className={styles.strategistProductHeadline}>
              <em>{entry.headline}</em>
            </p>
            <p className={styles.strategistProductBody}>{entry.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StrategistProjects() {
  return (
    <section className={styles.strategistSection}>
      <p className={styles.strategistEyebrow}>Selected ships</p>
      {projects.map((group) => (
        <div key={group.heading} className={styles.strategistProjectGroup}>
          <p className={styles.strategistProjectHeading}>{group.heading}</p>
          <ul className={styles.strategistProjectList}>
            {group.projects.map((p) => (
              <li key={p.name}>
                <p className={styles.strategistProjectName}>
                  <strong>{p.name}</strong>{" "}
                  <em className={styles.strategistProjectTagline}>
                    — {p.tagline}
                  </em>
                </p>
                <p className={styles.strategistProjectMeta}>
                  {p.productSummary}{" "}
                  <span className={styles.strategistProjectStatus}>
                    · {p.status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function StrategistMarquee() {
  return (
    <section className={styles.strategistSection}>
      <p className={styles.strategistEyebrow}>Stack</p>
      <p className={styles.strategistMarqueeText}>{marquee.join(" · ")}</p>
    </section>
  );
}

/* ─────────── FOOTER ─────────── */

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} {profile.name} · Two columns, one person.
        Press <kbd>1</kbd> for the canonical Decision Log.
      </p>
    </footer>
  );
}
