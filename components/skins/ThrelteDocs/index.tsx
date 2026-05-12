"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical, readReflection } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import type { CSSProperties } from "react";
import styles from "./ThrelteDocs.module.css";

type NavEntry = { id: string; label: string };

const NAV_GROUPS: { heading: string; entries: NavEntry[] }[] = [
  {
    heading: "Get started",
    entries: [
      { id: "intro", label: "Introduction" },
      { id: "principles", label: "Principles" },
    ],
  },
  {
    heading: "Cases",
    entries: cases.map((c) => ({ id: `case-${c.id}`, label: c.title })),
  },
  {
    heading: "Reference",
    entries: [
      { id: "toolkit", label: "Toolkit" },
      { id: "field-notes", label: "Field notes" },
    ],
  },
  {
    heading: "Community",
    entries: [{ id: "talk", label: "Get in touch" }],
  },
];

export function ThrelteDocs() {
  return (
    <div className={styles.root}>
      <TopBar />
      <div className={styles.shell}>
        <Sidebar />
        <main className={styles.main}>
          <Intro />
          <Principles />
          <Cases />
          <Toolkit />
          <FieldNotes />
          <Talk />
          <Foot />
        </main>
        <Outline />
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className={styles.topbar}>
      <a href="#intro" className={styles.brand}>
        <span className={styles.brandMark}>hassan</span>
        <span className={styles.brandDot}>.</span>
        <span className={styles.brandFunc}>cases</span>
        <span className={styles.version}>v6.0</span>
      </a>
      <div className={styles.topbarRight}>
        <input
          type="search"
          placeholder="Search the docs…   ⌘K"
          className={styles.search}
          aria-label="Search"
        />
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noreferrer"
          className={styles.iconLink}
        >
          GitHub ↗
        </a>
        <a
          href={profile.socials.pubdev}
          target="_blank"
          rel="noreferrer"
          className={styles.iconLink}
        >
          pub.dev ↗
        </a>
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Documentation navigation">
      {NAV_GROUPS.map((group) => (
        <div key={group.heading} className={styles.sideGroup}>
          <p className={styles.sideHeading}>{group.heading}</p>
          <ul>
            {group.entries.map((entry) => (
              <li key={entry.id}>
                <a href={`#${entry.id}`}>{entry.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className={styles.sideTip}>
        <p className={styles.sideTipLabel}>Tip</p>
        <p>
          This is one of fifteen skins. Press <kbd>1</kbd> for the canonical Decision
          Log.
        </p>
      </div>
    </aside>
  );
}

function Intro() {
  return (
    <article className={styles.page} id="intro">
      <p className={styles.pagePath}>get-started / introduction</p>
      <h1 className={styles.pageTitle}>{profile.name}</h1>
      <p className={styles.pageLede}>{profile.tagline}</p>
      <p className={styles.paragraph}>{profile.intro}</p>

      <CodeBlock filename="profile.ts">
        <Comment>{`// canonical profile, read by every skin`}</Comment>
        <Line>
          <Kw>export const</Kw> <Var>profile</Var> = {`{`}
        </Line>
        <Line indent={1}>
          <Prop>name</Prop>: <Str>&quot;{profile.name}&quot;</Str>,
        </Line>
        <Line indent={1}>
          <Prop>role</Prop>: <Str>&quot;{profile.currentRole}&quot;</Str>,
        </Line>
        <Line indent={1}>
          <Prop>location</Prop>: <Str>&quot;{profile.location}&quot;</Str>,
        </Line>
        <Line indent={1}>
          <Prop>availability</Prop>: <Str>&quot;{profile.availability.signal}&quot;</Str>,
        </Line>
        <Line>{`}`}</Line>
      </CodeBlock>

      <Callout tone="note" title="What this site is">
        Six case studies, one profile, fifteen visual treatments. The data lives in
        one place. Each skin is just a different lens on the same calls.
      </Callout>
    </article>
  );
}

function Principles() {
  return (
    <article className={styles.page} id="principles">
      <p className={styles.pagePath}>get-started / principles</p>
      <h2 className={styles.h2}>Operating principles</h2>
      <p className={styles.paragraph}>
        The constants underneath every decision below. Three sentences. The rest is
        application.
      </p>
      <CodeBlock filename="principles.ts">
        <Comment>{`/**`}</Comment>
        {philosophy.quote.map((line) => (
          <Comment key={line}>{` * ${line}`}</Comment>
        ))}
        <Comment>{` */`}</Comment>
        <Line>
          <Kw>export const</Kw> <Var>principles</Var> ={" "}
          <Fn>Object.freeze</Fn>([
        </Line>
        {philosophy.quote.map((line, idx) => (
          <Line key={line} indent={1}>
            <Str>{`"${line.replace(/"/g, "\\\"")}"`}</Str>
            {idx < philosophy.quote.length - 1 ? "," : ""}
          </Line>
        ))}
        <Line>{`]);`}</Line>
      </CodeBlock>
    </article>
  );
}

function Cases() {
  return (
    <>
      {cases.map((c) => (
        <CaseDoc key={c.id} caseStudy={c} />
      ))}
    </>
  );
}

function CaseDoc({ caseStudy }: Readonly<{ caseStudy: Case }>) {
  const chosen = caseStudy.options.find((option) => option.selected);
  const bet = chosen ? readOptionCanonical(chosen).label : caseStudy.summary;
  const outcomePara = caseStudy.outcome.paragraphs[0];
  const outcome = outcomePara ? readCanonical(outcomePara) : caseStudy.summary;
  const accent = caseStudy.brand?.primary ?? "#ec4899";

  return (
    <article
      className={styles.page}
      id={`case-${caseStudy.id}`}
      style={{ "--accent": accent } as CSSProperties}
    >
      <p className={styles.pagePath}>cases / {caseStudy.id}</p>
      <div className={styles.caseHead}>
        <h2 className={styles.h2}>{caseStudy.title}</h2>
        <span className={styles.statusPill}>{caseStudy.meta.status}</span>
      </div>
      <p className={styles.pageLede}>{caseStudy.summary}</p>

      <h3 className={styles.h3}>Synopsis</h3>
      <ul className={styles.specList}>
        <li>
          <span>Role</span>
          <span>{caseStudy.meta.role}</span>
        </li>
        <li>
          <span>Duration</span>
          <span>{caseStudy.meta.duration}</span>
        </li>
        <li>
          <span>Year</span>
          <span>{caseStudy.meta.year}</span>
        </li>
        <li>
          <span>Stack</span>
          <span>{caseStudy.meta.stack}</span>
        </li>
      </ul>

      <h3 className={styles.h3}>The bet</h3>
      <CodeBlock filename={`cases/${caseStudy.id}.ts`}>
        <Comment>{`// Case ${String(caseStudy.number).padStart(2, "0")} — ${caseStudy.title}`}</Comment>
        <Line>
          <Kw>const</Kw> <Var>bet</Var> = <Fn>ship</Fn>.
          <Method>{caseStudy.id}</Method>({`{`}
        </Line>
        <Line indent={1}>
          <Prop>role</Prop>: <Str>&quot;{caseStudy.meta.role}&quot;</Str>,
        </Line>
        <Line indent={1}>
          <Prop>stack</Prop>: <Str>&quot;{shorten(caseStudy.meta.stack)}&quot;</Str>,
        </Line>
        <Line indent={1}>
          <Prop>thesis</Prop>: <Str>&quot;{bet.replace(/"/g, "")}&quot;</Str>,
        </Line>
        <Line>{`});`}</Line>
        <Line> </Line>
        <Comment>{`// → ${outcome}`}</Comment>
      </CodeBlock>

      {caseStudy.outcome.metrics?.length ? (
        <>
          <h3 className={styles.h3}>Returns</h3>
          <ul className={styles.metricGrid}>
            {caseStudy.outcome.metrics.slice(0, 6).map((metric) => (
              <li key={metric.label}>
                <span className={styles.metricValue}>{metric.value}</span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h3 className={styles.h3}>Reflection</h3>
      <Callout tone="quote" title="Engineering">
        {readReflection(caseStudy.reflection, "tech")}
      </Callout>
      <Callout tone="quote" title="Product">
        {readReflection(caseStudy.reflection, "product")}
      </Callout>
    </article>
  );
}

function Toolkit() {
  const groups = toolkit.engineering.slice(0, 7);
  return (
    <article className={styles.page} id="toolkit">
      <p className={styles.pagePath}>reference / toolkit</p>
      <h2 className={styles.h2}>Toolkit</h2>
      <p className={styles.paragraph}>
        The standard library. Picked because they earned it on shipped products,
        not because they trended.
      </p>
      <CodeBlock filename="toolkit.ts">
        <Comment>{`// import what you need`}</Comment>
        <Line>
          <Kw>import</Kw> {`{`}{" "}
          {groups
            .map((g) => g.category.toLowerCase().replace(/[^a-z0-9]+/g, "_"))
            .slice(0, 4)
            .join(", ")}{" "}
          {`}`} <Kw>from</Kw> <Str>&quot;hassan/toolkit&quot;</Str>;
        </Line>
      </CodeBlock>
      <ul className={styles.toolkitList}>
        {groups.map((group) => (
          <li key={group.category}>
            <p className={styles.toolkitCat}>{group.category}</p>
            <p className={styles.toolkitItems}>
              {group.items.map((item, idx) => (
                <span key={item} className={styles.toolkitItem}>
                  {item}
                  {idx < group.items.length - 1 ? <span aria-hidden="true">  ·  </span> : null}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}

function FieldNotes() {
  return (
    <article className={styles.page} id="field-notes">
      <p className={styles.pagePath}>reference / field-notes</p>
      <h2 className={styles.h2}>Field notes</h2>
      <p className={styles.paragraph}>
        Things that didn&apos;t fit anywhere else, but kept being true.
      </p>
      <ul className={styles.notes}>
        {cases.map((c) => (
          <li key={c.id}>
            <p className={styles.noteSource}>{c.title}</p>
            <p className={styles.noteBody}>{readReflection(c.reflection, "product")}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Talk() {
  return (
    <article className={styles.page} id="talk">
      <p className={styles.pagePath}>community / get-in-touch</p>
      <h2 className={styles.h2}>Get in touch</h2>
      <p className={styles.paragraph}>{profile.availability.message}</p>
      <CodeBlock filename="contact.ts">
        <Line>
          <Kw>await</Kw> <Fn>conversation</Fn>.<Method>open</Method>({`{`}
        </Line>
        <Line indent={1}>
          <Prop>to</Prop>: <Str>&quot;{profile.email}&quot;</Str>,
        </Line>
        <Line indent={1}>
          <Prop>about</Prop>: <Str>&quot;a hard call you&apos;re weighing&quot;</Str>,
        </Line>
        <Line>{`});`}</Line>
      </CodeBlock>
      <div className={styles.talkLinks}>
        <a href={`mailto:${profile.email}`} className={styles.talkPrimary}>
          {profile.email}
        </a>
        <a
          href={profile.socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className={styles.talkQuiet}
        >
          LinkedIn ↗
        </a>
        <a
          href={profile.socials.x}
          target="_blank"
          rel="noreferrer"
          className={styles.talkQuiet}
        >
          x.com ↗
        </a>
      </div>
    </article>
  );
}

function Foot() {
  return (
    <footer className={styles.foot}>
      <p>
        Built with Next.js · Same data, fifteen skins · © {new Date().getFullYear()}{" "}
        {profile.name}
      </p>
    </footer>
  );
}

function Outline() {
  const entries = NAV_GROUPS.flatMap((g) => g.entries).slice(0, 8);
  return (
    <aside className={styles.outline} aria-label="On this page">
      <p className={styles.outlineHeading}>On this site</p>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`}>{entry.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ─────────── code-block primitives ─────────── */

function CodeBlock({
  filename,
  children,
}: Readonly<{ filename?: string; children: React.ReactNode }>) {
  return (
    <div className={styles.code}>
      {filename ? (
        <div className={styles.codeHead}>
          <span className={styles.codeDot} />
          <span className={styles.codeDot} />
          <span className={styles.codeDot} />
          <span className={styles.codeFile}>{filename}</span>
        </div>
      ) : null}
      <pre className={styles.codeBody}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Line({
  indent = 0,
  children,
}: Readonly<{ indent?: number; children: React.ReactNode }>) {
  return (
    <span className={styles.codeLine}>
      {indent > 0 ? <span className={styles.codeIndent}>{"  ".repeat(indent)}</span> : null}
      {children}
      {"\n"}
    </span>
  );
}

function Comment({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <span className={`${styles.codeLine} ${styles.codeComment}`}>
      {children}
      {"\n"}
    </span>
  );
}

function Kw({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className={styles.codeKw}>{children}</span>;
}
function Var({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className={styles.codeVar}>{children}</span>;
}
function Fn({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className={styles.codeFn}>{children}</span>;
}
function Method({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className={styles.codeMethod}>{children}</span>;
}
function Prop({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className={styles.codeProp}>{children}</span>;
}
function Str({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className={styles.codeStr}>{children}</span>;
}

function Callout({
  tone,
  title,
  children,
}: Readonly<{
  tone: "note" | "quote";
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <div className={`${styles.callout} ${tone === "quote" ? styles.calloutQuote : styles.calloutNote}`}>
      <p className={styles.calloutTitle}>{title}</p>
      <p className={styles.calloutBody}>{children}</p>
    </div>
  );
}

function shorten(text: string, max = 80): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}
