"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readCanonicalParagraphs, readOptionCanonical } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import styles from "./Bookshelf.module.css";

interface Book {
  id: string;
  vol: string;
  title: string;
  subtitle: string;
  spineColor: string;
  inkColor: string;
  edition: string;
  pages: number;
  kind: "case" | "essay";
  case?: Case;
  essay?: { sections: { heading: string; body: string }[] };
}

const FALLBACK_COLORS = [
  { bg: "#a23b1c", ink: "#fff5e6" },
  { bg: "#2e4f3c", ink: "#fdf4dc" },
  { bg: "#1f3d63", ink: "#f0e9d2" },
  { bg: "#6b2c5c", ink: "#fbe8ec" },
  { bg: "#4a3520", ink: "#f3e8c8" },
];

function buildBooks(): Book[] {
  const caseBooks: Book[] = cases.map((c, idx) => {
    const fallback = FALLBACK_COLORS[idx % FALLBACK_COLORS.length] ?? FALLBACK_COLORS[0]!;
    const spine = c.brand?.primary ?? fallback.bg;
    return {
      id: c.id,
      vol: `Vol. ${roman(c.number)}`,
      title: c.title,
      subtitle: c.summary.split(".")[0] ?? "",
      spineColor: spine,
      inkColor: fallback.ink,
      edition: `${c.meta.year} · First edition`,
      pages: 24 + idx * 16,
      kind: "case",
      case: c,
    };
  });

  const essays: Book[] = [
    {
      id: "philosophy",
      vol: "Notebook",
      title: "On taking bets",
      subtitle: philosophy.quote[0] ?? "",
      spineColor: "#3b2f2a",
      inkColor: "#f3ecdf",
      edition: "Notebook · ongoing",
      pages: 8,
      kind: "essay",
      essay: {
        sections: philosophy.quote.map((line, idx) => ({
          heading: `§${idx + 1}`,
          body: line,
        })),
      },
    },
    {
      id: "toolkit",
      vol: "Reference",
      title: "Tools of the trade",
      subtitle: "What I reach for, and when",
      spineColor: "#4a5c3e",
      inkColor: "#f3ecdf",
      edition: "Reference · revised",
      pages: 14,
      kind: "essay",
      essay: {
        sections: toolkit.engineering.slice(0, 6).map((group) => ({
          heading: group.category,
          body: group.items.join(" · "),
        })),
      },
    },
    {
      id: "talk",
      vol: "Letters",
      title: "Open correspondence",
      subtitle: profile.availability.message,
      spineColor: "#7a4226",
      inkColor: "#fdf2e0",
      edition: "Letters · standing invitation",
      pages: 2,
      kind: "essay",
      essay: {
        sections: [
          {
            heading: "On reaching out",
            body: `${profile.availability.message} Email reaches me at ${profile.email}. LinkedIn at ${profile.socials.linkedin.replace("https://www.linkedin.com/in/", "linkedin.com/in/")}. Bring the constraint, the deadline, and the team you've got.`,
          },
        ],
      },
    },
  ];

  return [...caseBooks, ...essays];
}

function roman(n: number): string {
  const map: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  let r = n;
  for (const [val, sym] of map) {
    while (r >= val) {
      out += sym;
      r -= val;
    }
  }
  return out;
}

export function Bookshelf() {
  const books = buildBooks();
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (openId === null) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [openId]);

  const caseBooks = books.filter((b) => b.kind === "case");
  const essayBooks = books.filter((b) => b.kind === "essay");
  const openBook = books.find((b) => b.id === openId) ?? null;

  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.library}>
        <Shelf
          eyebrow="Shelf I"
          title="The Collected Cases"
          subtitle="Three calls, three outcomes. Bound separately, but they share an index."
          books={caseBooks}
          onOpen={setOpenId}
        />
        <Shelf
          eyebrow="Shelf II"
          title="Reference & Correspondence"
          subtitle="Notebooks, tools, and standing invitations. Working papers, not published."
          books={essayBooks}
          onOpen={setOpenId}
          compact
        />
        <Colophon />
      </main>
      {openBook ? <Reader book={openBook} onClose={() => setOpenId(null)} /> : null}
    </div>
  );
}

function Header() {
  return (
    <header className={styles.header}>
      <p className={styles.headerKicker}>Hassan Ansari · Private library</p>
      <h1 className={styles.headerTitle}>
        The Collected
        <br />
        <em>Cases</em>
      </h1>
      <p className={styles.headerSub}>
        Six bound volumes. Read in any order. Press <kbd>Esc</kbd> to close any book.
      </p>
    </header>
  );
}

function Shelf({
  eyebrow,
  title,
  subtitle,
  books,
  onOpen,
  compact,
}: Readonly<{
  eyebrow: string;
  title: string;
  subtitle: string;
  books: Book[];
  onOpen: (id: string) => void;
  compact?: boolean;
}>) {
  return (
    <section className={styles.shelfSection}>
      <header className={styles.shelfHead}>
        <p className={styles.shelfEyebrow}>{eyebrow}</p>
        <h2 className={styles.shelfTitle}>{title}</h2>
        <p className={styles.shelfSub}>{subtitle}</p>
      </header>
      <div className={`${styles.shelf} ${compact ? styles.shelfCompact : ""}`}>
        <ul className={styles.bookRow}>
          {books.map((book) => (
            <BookSpine key={book.id} book={book} onOpen={() => onOpen(book.id)} />
          ))}
          <li className={styles.bookend} aria-hidden="true">
            <span />
          </li>
        </ul>
        <div className={styles.shelfPlank} aria-hidden="true" />
      </div>
    </section>
  );
}

function BookSpine({
  book,
  onOpen,
}: Readonly<{ book: Book; onOpen: () => void }>) {
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className={styles.spine}
        style={{
          "--spine": book.spineColor,
          "--ink": book.inkColor,
          "--height": `${280 + Math.min(60, book.pages * 1.2)}px`,
        } as CSSProperties}
        aria-label={`Open ${book.title}`}
      >
        <div className={styles.spineInner}>
          <span className={styles.spineVol}>{book.vol}</span>
          <span className={styles.spineTitle}>{book.title}</span>
          <span className={styles.spineAuthor}>H. Ansari</span>
        </div>
        <span className={styles.spineRibbon} aria-hidden="true" />
      </button>
    </li>
  );
}

function Reader({ book, onClose }: Readonly<{ book: Book; onClose: () => void }>) {
  return (
    <div className={styles.reader} role="dialog" aria-label={book.title}>
      <button type="button" className={styles.readerClose} onClick={onClose}>
        ← Back to the shelf
      </button>
      <div
        className={styles.bookOpen}
        style={{ "--spine": book.spineColor, "--ink": book.inkColor } as CSSProperties}
      >
        <article className={styles.bookPageLeft}>
          <p className={styles.runningHead}>{book.vol} · {book.edition}</p>
          <h2 className={styles.bookFrontTitle}>{book.title}</h2>
          <p className={styles.bookFrontSub}>{book.subtitle}</p>
          <hr className={styles.frontRule} />
          <p className={styles.frontImprint}>
            From the workshop of<br />
            <strong>{profile.name}</strong>
          </p>
          <p className={styles.frontStanza}>
            {book.kind === "case" && book.case
              ? `Pages composed during ${book.case.meta.duration}. Originally drafted as a working document; here arranged for the curious reader.`
              : `An ongoing document. New paragraphs appear when the work demands them.`}
          </p>
          <p className={styles.pageFolio}>i</p>
        </article>
        <article className={styles.bookPageRight}>
          {book.kind === "case" && book.case ? <CasePages caseStudy={book.case} /> : null}
          {book.kind === "essay" && book.essay ? <EssayPages book={book} /> : null}
        </article>
      </div>
    </div>
  );
}

function CasePages({ caseStudy }: Readonly<{ caseStudy: Case }>) {
  const chosen = caseStudy.options.find((option) => option.selected);
  const bet = chosen ? readOptionCanonical(chosen).label : caseStudy.summary;
  const intro = readCanonicalParagraphs(
    caseStudy.problem.intro ?? {
      audience: "both",
      voices: { tech: caseStudy.summary, product: caseStudy.summary },
    },
  )[0] ?? caseStudy.summary;
  const firstOutcome = caseStudy.outcome.paragraphs[0];
  const outcome = firstOutcome ? readCanonical(firstOutcome) : caseStudy.summary;

  return (
    <>
      <p className={styles.runningHead}>
        Chapter {caseStudy.number} · {caseStudy.title}
      </p>
      <h3 className={styles.chapterTitle}>{caseStudy.title}</h3>
      <p className={styles.chapterEpigraph}>
        <em>{caseStudy.meta.year} · {caseStudy.meta.role}</em>
      </p>
      <p className={styles.prose}>
        <span className={styles.dropCap}>{intro.charAt(0)}</span>
        {intro.slice(1)}
      </p>
      <h4 className={styles.proseHead}>The bet</h4>
      <p className={styles.prose}>{bet}</p>
      <h4 className={styles.proseHead}>What followed</h4>
      <p className={styles.prose}>{outcome}</p>
      {caseStudy.outcome.metrics?.length ? (
        <aside className={styles.marginalia}>
          {caseStudy.outcome.metrics.slice(0, 4).map((metric) => (
            <p key={metric.label}>
              <span>{metric.value}</span> — <em>{metric.label}</em>
            </p>
          ))}
        </aside>
      ) : null}
      <p className={styles.pageFolio}>ii</p>
    </>
  );
}

function EssayPages({ book }: Readonly<{ book: Book }>) {
  if (!book.essay) return null;
  return (
    <>
      <p className={styles.runningHead}>{book.vol} · {book.title}</p>
      <h3 className={styles.chapterTitle}>{book.title}</h3>
      {book.essay.sections.map((section) => (
        <div key={section.heading} className={styles.essaySection}>
          <h4 className={styles.proseHead}>{section.heading}</h4>
          <p className={styles.prose}>{section.body}</p>
        </div>
      ))}
      <p className={styles.pageFolio}>ii</p>
    </>
  );
}

function Colophon() {
  return (
    <footer className={styles.colophon}>
      <p>
        Set in <em>Fraunces</em> and <em>Geist</em>. Issued from Mumbai.
      </p>
      <p>
        © {new Date().getFullYear()} {profile.name}. The library accepts new
        correspondents at{" "}
        <a href={`mailto:${profile.email}`}>{profile.email}</a>.
      </p>
    </footer>
  );
}
