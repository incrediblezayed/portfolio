"use client";

import { useCallback, useState } from "react";
import { cases, profile } from "@/content";
import { readCanonical, readCanonicalParagraphs } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import styles from "./AIPromptbox.module.css";

type Lens = "summary" | "problem" | "bet" | "outcome";

const LENS_PRESETS: { id: Lens; label: string; hint: string; prefix?: string }[] = [
  { id: "summary", label: "Overview", hint: "the headline of each case" },
  { id: "problem", label: "Problem", hint: "what was breaking", prefix: "[Search:" },
  { id: "bet", label: "Bet", hint: "the call I made", prefix: "[Think:" },
  { id: "outcome", label: "Outcome", hint: "what shipped, what moved", prefix: "[Canvas:" },
];

export function AIPromptbox() {
  const [lens, setLens] = useState<Lens>("summary");
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  const handleSend = useCallback((message: string) => {
    // The prompt-box prefixes the message with [Search: / [Think: / [Canvas:
    // when a toggle is active. Map those onto the case lens so the toggles
    // actually filter the view below.
    const matched = LENS_PRESETS.find(
      (p) => p.prefix && message.startsWith(p.prefix),
    );
    setLens(matched ? matched.id : "summary");
    setLastQuery(message.replace(/^\[(Search|Think|Canvas):\s?/, "").replace(/\]$/, "").trim() || null);
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.aurora} aria-hidden="true" />

      <main className={styles.main}>
        <Hero />

        <section className={styles.composer} aria-label="Ask the portfolio">
          <PromptInputBox
            onSend={handleSend}
            placeholder="Ask about Infophone, Clickked, or file_saver…"
          />

          <ul className={styles.lensRow} role="tablist" aria-label="Case lens">
            {LENS_PRESETS.map((preset) => (
              <li key={preset.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={lens === preset.id}
                  className={styles.lensChip}
                  data-active={lens === preset.id}
                  onClick={() => setLens(preset.id)}
                >
                  <span className={styles.lensLabel}>{preset.label}</span>
                  <span className={styles.lensHint}>{preset.hint}</span>
                </button>
              </li>
            ))}
          </ul>

          {lastQuery ? (
            <p className={styles.queryEcho}>
              <span className={styles.queryEchoTag}>last query</span>
              <span className={styles.queryEchoText}>{lastQuery}</span>
            </p>
          ) : (
            <p className={styles.hint}>
              The toggles map to the lens below: <code>Search</code> → Problem,{" "}
              <code>Think</code> → Bet, <code>Canvas</code> → Outcome.
            </p>
          )}
        </section>

        <section className={styles.cases} aria-label="Case studies">
          <header className={styles.casesHead}>
            <h2 className={styles.casesTitle}>Three calls, written down.</h2>
            <p className={styles.casesSub}>
              Showing <strong>{LENS_PRESETS.find((p) => p.id === lens)?.label}</strong>
              {" — "}
              {LENS_PRESETS.find((p) => p.id === lens)?.hint}.
            </p>
          </header>

          <div className={styles.caseList}>
            {cases.map((c) => (
              <CaseCard key={c.id} caseStudy={c} lens={lens} />
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <header className={styles.hero}>
      <p className={styles.eyebrow}>
        {profile.location} · {profile.currentRole}
      </p>
      <h1 className={styles.heroName}>{profile.name}</h1>
      <p className={styles.tagline}>{profile.tagline}</p>
      <p className={styles.intro}>{profile.intro}</p>
    </header>
  );
}

function CaseCard({ caseStudy: c, lens }: Readonly<{ caseStudy: Case; lens: Lens }>) {
  return (
    <article className={styles.case} id={c.id}>
      <header className={styles.caseHead}>
        <p className={styles.caseNumber}>case {String(c.number).padStart(2, "0")}</p>
        <h3 className={styles.caseTitle}>{c.title}</h3>
        <ul className={styles.caseMeta}>
          <li>
            <span className={styles.metaKey}>year</span> {c.meta.year}
          </li>
          <li>
            <span className={styles.metaKey}>role</span> {c.meta.role}
          </li>
          <li>
            <span className={styles.metaKey}>status</span> {c.meta.status}
          </li>
        </ul>
        <p className={styles.caseSummary}>{c.summary}</p>
      </header>

      <CaseLensBody caseStudy={c} lens={lens} />
    </article>
  );
}

function CaseLensBody({ caseStudy: c, lens }: Readonly<{ caseStudy: Case; lens: Lens }>) {
  if (lens === "summary") return null;

  if (lens === "problem") {
    const intro = c.problem.intro ? readCanonical(c.problem.intro) : null;
    const top = c.problem.items?.slice(0, 3) ?? [];
    return (
      <Section label="Problem">
        {intro ? <p>{intro}</p> : null}
        {top.length > 0 ? (
          <ul className={styles.bullets}>
            {top.map((item) => (
              <li key={item.label}>
                <strong>{item.label}.</strong> {readCanonical(item)}
              </li>
            ))}
          </ul>
        ) : null}
      </Section>
    );
  }

  if (lens === "bet") {
    const intro = c.bet.intro ? readCanonical(c.bet.intro) : null;
    const firstSection = c.bet.sections?.[0];
    return (
      <Section label="Bet">
        {intro ? <p className={styles.betIntro}>{intro}</p> : null}
        {firstSection ? (
          <>
            <h4 className={styles.betHead}>{firstSection.heading}</h4>
            {readCanonicalParagraphs(firstSection).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </>
        ) : null}
      </Section>
    );
  }

  // lens === "outcome"
  const metrics = c.outcome.metrics ?? [];
  const firstPara = c.outcome.paragraphs[0]
    ? readCanonicalParagraphs(c.outcome.paragraphs[0])[0]
    : null;
  return (
    <Section label="Outcome">
      {metrics.length > 0 ? (
        <ul className={styles.metrics}>
          {metrics.slice(0, 4).map((m) => (
            <li key={m.label}>
              <span className={styles.metricValue}>{m.value}</span>
              <span className={styles.metricLabel}>{m.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {firstPara ? <p>{firstPara}</p> : null}
    </Section>
  );
}

function Section({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className={styles.section}>
      <p className={styles.sectionLabel}>{label}</p>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Reach me at{" "}
        <a className={styles.link} href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        {" · "}
        <a className={styles.link} href={profile.socials.linkedin} target="_blank" rel="noreferrer">
          linkedin
        </a>
        {" · "}
        <a className={styles.link} href={profile.socials.github} target="_blank" rel="noreferrer">
          github
        </a>
        {" · "}
        <a className={styles.link} href={profile.socials.pubdev} target="_blank" rel="noreferrer">
          pub.dev
        </a>
      </p>
      <p className={styles.availability}>{profile.availability.message}</p>
    </footer>
  );
}
