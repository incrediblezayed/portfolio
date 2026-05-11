import { profile } from "@/content";
import { buildChangelogEntries, statusLabel, type ChangelogEntry } from "@/lib/changelog";
import styles from "./Changelog.module.css";

export function Changelog() {
  const entries = buildChangelogEntries();
  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <Header />
        <Feed entries={entries} />
        <Footer />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>{profile.name} / changelog</p>
      <h1 className={styles.title}>What&apos;s shipped, what&apos;s in flight.</h1>
      <p className={styles.lede}>
        Reverse-chronological feed of releases — each case study and role becomes a versioned
        entry. The vendor SDK got removed; the kill memo got written; the rebuild moved to
        testing.
      </p>
      <div className={styles.headerMeta}>
        <a className={styles.rssLink} href="/feed.xml" target="_blank" rel="noreferrer">
          [Subscribe to RSS]
        </a>
        <span className={styles.statusBlock}>
          <span className={styles.statusKey}>status:</span>{" "}
          <span className={`${styles.pill} ${styles.pillShipped}`}>OPEN</span>
        </span>
      </div>
    </header>
  );
}

function Feed({ entries }: Readonly<{ entries: ChangelogEntry[] }>) {
  return (
    <ol className={styles.feed} aria-label="Changelog entries">
      {entries.map((entry) => (
        <li key={entry.id} className={styles.entryWrap}>
          <Entry entry={entry} />
        </li>
      ))}
    </ol>
  );
}

function Entry({ entry }: Readonly<{ entry: ChangelogEntry }>) {
  const brandAccentStyle = entry.brand
    ? ({ "--entry-accent": entry.brand.primary } as React.CSSProperties)
    : undefined;
  return (
    <article className={styles.entry} style={brandAccentStyle}>
      <header className={styles.entryMeta}>
        <span className={styles.entryDate}>{entry.dateLabel}</span>
        <span className={styles.entryHash}>{entry.hash}</span>
        <StatusPill status={entry.status} />
        <span className={styles.entrySource}>{entry.source}</span>
      </header>
      <h2 className={styles.entryTitle}>{entry.title}</h2>
      <div className={styles.entryBody}>
        {entry.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {entry.added?.length || entry.removed?.length ? (
        <ul className={styles.entryDiff}>
          {entry.added?.map((a) => (
            <li key={`+${a}`} className={styles.diffAdded}>
              <span className={styles.diffSign}>+</span> {a}
            </li>
          ))}
          {entry.removed?.map((r) => (
            <li key={`-${r}`} className={styles.diffRemoved}>
              <span className={styles.diffSign}>-</span> {r}
            </li>
          ))}
        </ul>
      ) : null}
      {entry.stack ? (
        <p className={styles.entryStack}>
          <span className={styles.stackKey}>stack:</span> {entry.stack}
        </p>
      ) : null}
    </article>
  );
}

function StatusPill({ status }: Readonly<{ status: ChangelogEntry["status"] }>) {
  const cls =
    status === "shipped"
      ? styles.pillShipped
      : status === "wip"
        ? styles.pillWip
        : styles.pillDraft;
  return <span className={`${styles.pill} ${cls}`}>{statusLabel(status)}</span>;
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        — End of feed. © {new Date().getFullYear()} {profile.name}. Press <kbd>1</kbd> for the
        canonical Decision Log.
      </p>
    </footer>
  );
}
