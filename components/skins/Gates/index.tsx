"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical, readReflection } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import { animate, createTimeline, stagger } from "animejs";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./Gates.module.css";

interface Gate {
  id: string;
  kind: "case" | "principle" | "loadout" | "talk";
  title: string;
  subtitle: string;
  accent: string;
  caseStudy?: Case;
}

function buildGates(): Gate[] {
  const caseGates: Gate[] = cases.map((c) => {
    const chosen = c.options.find((o) => o.selected);
    const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
    return {
      id: c.id,
      kind: "case",
      title: c.title,
      subtitle: bet,
      accent: c.brand?.primary ?? "#e8a93b",
      caseStudy: c,
    };
  });

  const utility: Gate[] = [
    {
      id: "principle",
      kind: "principle",
      title: "Principle",
      subtitle: philosophy.quote[0] ?? "",
      accent: "#c87a3a",
    },
    {
      id: "loadout",
      kind: "loadout",
      title: "Loadout",
      subtitle: "Six years of tools, sharpened against shipped products.",
      accent: "#8a5a2a",
    },
    {
      id: "talk",
      kind: "talk",
      title: "Talk",
      subtitle: profile.availability.message,
      accent: "#e8a93b",
    },
  ];

  return [...caseGates, ...utility];
}

const GATES = buildGates();

export function Gates() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = GATES.find((g) => g.id === openId) ?? null;
  const introRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = introRef.current;
    if (!el || globalThis.window === undefined) return;
    const targets = el.querySelectorAll(`.${styles.gateCard}`);
    if (targets.length === 0) return;
    const tl = createTimeline({ defaults: { duration: 720, ease: "out(3)" } });
    tl.add(
      targets,
      {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.92, 1],
        delay: stagger(110),
      },
    );
    return () => {
      tl.cancel();
    };
  }, []);

  useEffect(() => {
    if (!openId || globalThis.window === undefined) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [openId]);

  return (
    <main className={styles.root}>
      <Intro />
      <section ref={introRef} className={styles.courtyard}>
        {GATES.map((gate) => (
          <GateCard key={gate.id} gate={gate} onEnter={() => setOpenId(gate.id)} />
        ))}
      </section>
      <Footer />
      {open ? <Chamber gate={open} onClose={() => setOpenId(null)} /> : null}
    </main>
  );
}

function Intro() {
  return (
    <header className={styles.intro}>
      <p className={styles.kicker}>Hassan Ansari · {profile.location}</p>
      <h1 className={styles.invitation}>
        <em>Welcome.</em> Click on the gates
        <br />
        and step inside.
      </h1>
      <p className={styles.subInvitation}>
        Seven doors. Three cases, the operating principle, the loadout, and a
        standing invitation to talk. Hover to crack the door open.
      </p>
    </header>
  );
}

function GateCard({
  gate,
  onEnter,
}: Readonly<{ gate: Gate; onEnter: () => void }>) {
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const onHover = () => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;
    animate(left, { rotateY: -28, duration: 520, ease: "out(2)" });
    animate(right, { rotateY: 28, duration: 520, ease: "out(2)" });
  };

  const onLeave = () => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;
    animate(left, { rotateY: 0, duration: 540, ease: "out(2)" });
    animate(right, { rotateY: 0, duration: 540, ease: "out(2)" });
  };

  const onClick = () => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (left && right) {
      animate(left, { rotateY: -88, duration: 460, ease: "out(2)" });
      animate(right, { rotateY: 88, duration: 460, ease: "out(2)" });
    }
    globalThis.setTimeout(onEnter, 220);
  };

  return (
    <button
      ref={cardRef}
      type="button"
      className={styles.gateCard}
      style={{ "--gate-accent": gate.accent } as CSSProperties}
      onPointerEnter={onHover}
      onPointerLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onClick={onClick}
    >
      <p className={styles.gateLabel}>
        {gate.kind === "case" ? "Case" : gate.kind === "principle" ? "Principle" : gate.kind === "loadout" ? "Loadout" : "Talk"}
      </p>
      <h2 className={styles.gateTitle}>{gate.title}</h2>
      <p className={styles.gateSubtitle}>{gate.subtitle}</p>
      <div className={styles.gateFrame} aria-hidden="true">
        <div className={styles.lintel}>
          <span>{gate.title.slice(0, 16).toUpperCase()}</span>
        </div>
        <div className={styles.archway}>
          <div className={styles.doorPair}>
            <div ref={leftRef} className={`${styles.doorLeaf} ${styles.doorLeft}`}>
              <span className={styles.handle} />
            </div>
            <div ref={rightRef} className={`${styles.doorLeaf} ${styles.doorRight}`}>
              <span className={styles.handle} />
            </div>
          </div>
          <div className={styles.threshold} />
        </div>
      </div>
      <p className={styles.enter}>Enter →</p>
    </button>
  );
}

function Chamber({
  gate,
  onClose,
}: Readonly<{ gate: Gate; onClose: () => void }>) {
  const chamberRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = chamberRef.current;
    if (!el) return;
    const tl = createTimeline({ defaults: { duration: 540, ease: "out(3)" } });
    tl.add(el, { opacity: [0, 1], scale: [0.96, 1] });
    const lines = el.querySelectorAll(`.${styles.chamberReveal}`);
    if (lines.length > 0) {
      tl.add(
        lines,
        { opacity: [0, 1], translateY: [18, 0], delay: stagger(80) },
        180,
      );
    }
    return () => {
      tl.cancel();
    };
  }, [gate.id]);

  return (
    <div
      ref={chamberRef}
      className={styles.chamber}
      style={{ "--gate-accent": gate.accent } as CSSProperties}
      role="dialog"
      aria-label={gate.title}
    >
      <button type="button" className={styles.close} onClick={onClose}>
        ← Back to the courtyard
      </button>
      <article className={styles.chamberBody}>
        <p className={styles.chamberLabel + " " + styles.chamberReveal}>
          {gate.kind.toUpperCase()}
        </p>
        <h2 className={styles.chamberTitle + " " + styles.chamberReveal}>
          {gate.title}
        </h2>
        {gate.kind === "case" && gate.caseStudy ? (
          <CaseContents caseStudy={gate.caseStudy} />
        ) : null}
        {gate.kind === "principle" ? <PrincipleContents /> : null}
        {gate.kind === "loadout" ? <LoadoutContents /> : null}
        {gate.kind === "talk" ? <TalkContents /> : null}
      </article>
    </div>
  );
}

function CaseContents({ caseStudy }: Readonly<{ caseStudy: Case }>) {
  const chosen = caseStudy.options.find((o) => o.selected);
  const bet = chosen ? readOptionCanonical(chosen).label : caseStudy.summary;
  const outcomePara = caseStudy.outcome.paragraphs[0];
  const outcome = outcomePara ? readCanonical(outcomePara) : caseStudy.summary;
  const metrics = caseStudy.outcome.metrics?.slice(0, 4) ?? [];

  return (
    <>
      <p className={styles.chamberSummary + " " + styles.chamberReveal}>
        {caseStudy.summary}
      </p>
      <div className={styles.chamberGrid}>
        <article className={styles.chamberReveal}>
          <p className={styles.fieldLabel}>The bet</p>
          <p className={styles.fieldBody}>{bet}</p>
        </article>
        <article className={styles.chamberReveal}>
          <p className={styles.fieldLabel}>Outcome</p>
          <p className={styles.fieldBody}>{outcome}</p>
        </article>
        <article className={styles.chamberReveal}>
          <p className={styles.fieldLabel}>Stack</p>
          <p className={styles.fieldBody}>{caseStudy.meta.stack}</p>
        </article>
      </div>
      {metrics.length > 0 ? (
        <ul className={styles.chamberMetrics + " " + styles.chamberReveal}>
          {metrics.map((metric) => (
            <li key={metric.label}>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className={styles.chamberGrid}>
        <article className={styles.chamberReveal}>
          <p className={styles.fieldLabel}>Engineering reflection</p>
          <p className={styles.fieldBody}>
            {readReflection(caseStudy.reflection, "tech")}
          </p>
        </article>
        <article className={styles.chamberReveal}>
          <p className={styles.fieldLabel}>Product reflection</p>
          <p className={styles.fieldBody}>
            {readReflection(caseStudy.reflection, "product")}
          </p>
        </article>
      </div>
    </>
  );
}

function PrincipleContents() {
  return (
    <ol className={styles.principleList}>
      {philosophy.quote.map((line, idx) => (
        <li key={line} className={styles.chamberReveal}>
          <span className={styles.principleNum}>P{idx + 1}</span>
          <span className={styles.principleLine}>{line}</span>
        </li>
      ))}
    </ol>
  );
}

function LoadoutContents() {
  const groups = toolkit.engineering.slice(0, 7);
  return (
    <ul className={styles.loadoutList}>
      {groups.map((group) => (
        <li key={group.category} className={styles.chamberReveal}>
          <p className={styles.fieldLabel}>{group.category}</p>
          <p className={styles.fieldBody}>{group.items.join(" · ")}</p>
        </li>
      ))}
    </ul>
  );
}

function TalkContents() {
  return (
    <div className={styles.talkBody}>
      <p className={styles.chamberSummary + " " + styles.chamberReveal}>
        {profile.availability.message} Bring the constraint, the deadline, and the
        team you&apos;ve got. I&apos;ll write down the options with you.
      </p>
      <div className={styles.chamberReveal + " " + styles.talkLinks}>
        <a className={styles.talkCta} href={`mailto:${profile.email}`}>
          {profile.email} →
        </a>
        <a className={styles.talkQuiet} href={profile.socials.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a className={styles.talkQuiet} href={profile.socials.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className={styles.talkQuiet} href={profile.socials.pubdev} target="_blank" rel="noreferrer">
          pub.dev
        </a>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className={styles.foot}>
      <p>{profile.name} · {profile.location}</p>
      <p>Gates · same content, different threshold</p>
    </footer>
  );
}
