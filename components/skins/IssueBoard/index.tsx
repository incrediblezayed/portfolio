"use client";

import { cases, philosophy, profile, toolkit } from "@/content";
import { readCanonical, readOptionCanonical, readReflection } from "@/lib/caseVoice";
import type { Case } from "@/lib/types";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./IssueBoard.module.css";

type SideAction =
  | { kind: "focus-search" }
  | { kind: "scroll-group"; group: "active" | "shipped" | "ongoing" }
  | { kind: "expand"; issueId: string }
  | { kind: "clear" };

type SideKey =
  | "inbox"
  | "my-issues"
  | "cases"
  | "backlog"
  | "roadmap"
  | "toolkit"
  | "philosophy"
  | "talk";

type IssueStatus = "in-progress" | "shipped" | "maintained" | "open";
type IssuePriority = "P0" | "P1" | "P2";

interface Issue {
  id: string;
  key: string;
  title: string;
  body: string;
  status: IssueStatus;
  priority: IssuePriority;
  voices: ("eng" | "pm" | "ops")[];
  group: "active" | "shipped" | "ongoing";
  case?: Case;
}

const STATUS_LABEL: Record<IssueStatus, string> = {
  "in-progress": "In Progress",
  shipped: "Shipped",
  maintained: "Maintained",
  open: "Open",
};

const STATUS_COLOR: Record<IssueStatus, string> = {
  "in-progress": "#f5b800",
  shipped: "#26d07c",
  maintained: "#5e6ad2",
  open: "#9aa1c5",
};

const VOICE_LABEL: Record<"eng" | "pm" | "ops", string> = {
  eng: "Hassan · Engineering",
  pm: "Hassan · Product",
  ops: "Hassan · Open Source",
};

function buildIssues(): Issue[] {
  const caseIssues: Issue[] = cases.map((c, idx) => {
    const status: IssueStatus =
      c.meta.status.toLowerCase().includes("ship") ||
      c.meta.status.toLowerCase().includes("running") ||
      c.meta.status.toLowerCase().includes("active")
        ? "shipped"
        : c.meta.status.toLowerCase().includes("test")
          ? "in-progress"
          : c.meta.status.toLowerCase().includes("maintain")
            ? "maintained"
            : "in-progress";
    const priority: IssuePriority = idx === 0 ? "P0" : idx === 1 ? "P1" : "P2";
    return {
      id: c.id,
      key: `CASE-${String(c.number).padStart(2, "0")}`,
      title: c.title,
      body: c.summary,
      status,
      priority,
      voices: ["eng", "pm"],
      group: status === "shipped" ? "shipped" : status === "maintained" ? "ongoing" : "active",
      case: c,
    };
  });

  const utility: Issue[] = [
    {
      id: "philosophy",
      key: "OPS-01",
      title: "Operating principle",
      body: philosophy.quote.join(" "),
      status: "maintained",
      priority: "P1",
      voices: ["pm", "eng"],
      group: "ongoing",
    },
    {
      id: "toolkit",
      key: "TOOL-01",
      title: "Toolkit · the standard library",
      body: toolkit.engineering.slice(0, 6).map((g) => g.category).join(", "),
      status: "maintained",
      priority: "P2",
      voices: ["eng"],
      group: "ongoing",
    },
    {
      id: "talk",
      key: "TALK-01",
      title: "Let's talk",
      body: profile.availability.message,
      status: "open",
      priority: "P0",
      voices: ["pm"],
      group: "active",
    },
  ];

  return [...caseIssues, ...utility];
}

export function IssueBoard() {
  const issues = buildIssues();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [activeSide, setActiveSide] = useState<SideKey>("cases");
  const searchRef = useRef<HTMLInputElement | null>(null);

  const scrollToGroup = useCallback((group: "active" | "shipped" | "ongoing") => {
    globalThis.document
      .getElementById(`group-${group}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const expandAndScroll = useCallback((issueId: string) => {
    setExpanded(issueId);
    globalThis.requestAnimationFrame(() => {
      globalThis.document
        .getElementById(`issue-${issueId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  const handleSide = useCallback(
    (key: SideKey, action: SideAction) => {
      setActiveSide(key);
      if (action.kind === "focus-search") {
        searchRef.current?.focus();
        globalThis.scrollTo({ top: 0, behavior: "smooth" });
      } else if (action.kind === "clear") {
        setFilter("");
        setExpanded(null);
        globalThis.scrollTo({ top: 0, behavior: "smooth" });
      } else if (action.kind === "scroll-group") {
        setFilter("");
        scrollToGroup(action.group);
      } else if (action.kind === "expand") {
        setFilter("");
        expandAndScroll(action.issueId);
      }
    },
    [scrollToGroup, expandAndScroll],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") {
          if (event.key === "Escape") setPaletteOpen(false);
          return;
        }
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
      } else if (event.key === "Escape") {
        setPaletteOpen(false);
        setExpanded(null);
      }
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, []);

  const groups: { id: Issue["group"]; label: string; issues: Issue[] }[] = [
    {
      id: "active",
      label: "Active",
      issues: issues.filter((i) => i.group === "active"),
    },
    {
      id: "shipped",
      label: "Shipped",
      issues: issues.filter((i) => i.group === "shipped"),
    },
    {
      id: "ongoing",
      label: "Maintained",
      issues: issues.filter((i) => i.group === "ongoing"),
    },
  ];

  const visibleGroups = filter
    ? groups
        .map((g) => ({
          ...g,
          issues: g.issues.filter((i) =>
            (i.title + i.body + i.key).toLowerCase().includes(filter.toLowerCase()),
          ),
        }))
        .filter((g) => g.issues.length > 0)
    : groups;

  return (
    <div className={styles.root}>
      <TopBar
        onPaletteOpen={() => setPaletteOpen(true)}
        filter={filter}
        setFilter={setFilter}
        searchRef={searchRef}
      />
      <div className={styles.shell}>
        <Sidebar activeKey={activeSide} onAction={handleSide} />
        <main className={styles.main}>
          <header className={styles.mainHead}>
            <div>
              <p className={styles.crumb}>Hassan&apos;s Workspace · Cases</p>
              <h1 className={styles.mainTitle}>Active issues</h1>
            </div>
            <div className={styles.mainMeta}>
              <span className={styles.metaChip}>{issues.length} issues</span>
              <span className={styles.metaChip}>Sorted by priority</span>
            </div>
          </header>
          {visibleGroups.map((group) => (
            <section key={group.id} id={`group-${group.id}`} className={styles.group}>
              <header className={styles.groupHead}>
                <span
                  className={styles.groupCaret}
                  aria-hidden="true"
                >
                  ▾
                </span>
                <h2 className={styles.groupTitle}>{group.label}</h2>
                <span className={styles.groupCount}>{group.issues.length}</span>
              </header>
              <ul className={styles.issueList}>
                {group.issues.map((issue) => (
                  <IssueRow
                    key={issue.id}
                    issue={issue}
                    isExpanded={expanded === issue.id}
                    onToggle={() =>
                      setExpanded((prev) => (prev === issue.id ? null : issue.id))
                    }
                  />
                ))}
              </ul>
            </section>
          ))}
          {visibleGroups.length === 0 ? (
            <p className={styles.empty}>
              No issues match &quot;{filter}&quot;. Try a different query.
            </p>
          ) : null}
        </main>
      </div>
      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onPick={(id) => {
            setPaletteOpen(false);
            setExpanded(id);
            globalThis.document.getElementById(`issue-${id}`)?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
          issues={issues}
        />
      ) : null}
    </div>
  );
}

function TopBar({
  onPaletteOpen,
  filter,
  setFilter,
  searchRef,
}: Readonly<{
  onPaletteOpen: () => void;
  filter: string;
  setFilter: (value: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}>) {
  return (
    <header className={styles.topbar}>
      <div className={styles.workspace}>
        <span className={styles.workspaceLogo}>H</span>
        <div>
          <p className={styles.workspaceName}>{profile.name}</p>
          <p className={styles.workspaceRole}>{profile.currentRole.split(",")[0]}</p>
        </div>
      </div>
      <div className={styles.topbarSearch}>
        <input
          ref={searchRef}
          type="search"
          placeholder="Filter by title, key, or body…"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className={styles.search}
        />
        <button type="button" className={styles.paletteBtn} onClick={onPaletteOpen}>
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </button>
      </div>
      <a className={styles.signal} href={`mailto:${profile.email}`}>
        <span className={styles.signalDot} />
        {profile.availability.signal}
      </a>
    </header>
  );
}

function Sidebar({
  activeKey,
  onAction,
}: Readonly<{
  activeKey: SideKey;
  onAction: (key: SideKey, action: SideAction) => void;
}>) {
  const workspace: { key: SideKey; label: string; action: SideAction }[] = [
    { key: "inbox", label: "Inbox", action: { kind: "focus-search" } },
    { key: "my-issues", label: "My issues", action: { kind: "clear" } },
    { key: "cases", label: "Cases", action: { kind: "scroll-group", group: "active" } },
    { key: "backlog", label: "Backlog", action: { kind: "scroll-group", group: "ongoing" } },
    { key: "roadmap", label: "Roadmap", action: { kind: "scroll-group", group: "shipped" } },
  ];

  const reference: { key: SideKey; label: string; action: SideAction }[] = [
    { key: "toolkit", label: "Toolkit", action: { kind: "expand", issueId: "toolkit" } },
    { key: "philosophy", label: "Philosophy", action: { kind: "expand", issueId: "philosophy" } },
    { key: "talk", label: "Talk", action: { kind: "expand", issueId: "talk" } },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav>
        <SideGroup heading="Workspace">
          {workspace.map((item) => (
            <SideLink
              key={item.key}
              active={activeKey === item.key}
              onClick={() => onAction(item.key, item.action)}
            >
              {item.label}
            </SideLink>
          ))}
        </SideGroup>
        <SideGroup heading="Reference">
          {reference.map((item) => (
            <SideLink
              key={item.key}
              active={activeKey === item.key}
              onClick={() => onAction(item.key, item.action)}
            >
              {item.label}
            </SideLink>
          ))}
        </SideGroup>
        <SideGroup heading="Teams">
          <SideTeam color="#5e6ad2" href={profile.socials.github} label="Engineering · GitHub">
            Engineering
          </SideTeam>
          <SideTeam color="#f5b800" href={profile.socials.linkedin} label="Product · LinkedIn">
            Product
          </SideTeam>
          <SideTeam color="#26d07c" href={profile.socials.pubdev} label="Open Source · pub.dev">
            Open Source
          </SideTeam>
        </SideGroup>
      </nav>
      <div className={styles.sideFoot}>
        <p>v6.0 · Issue Board</p>
        <p>One workspace, fifteen views</p>
      </div>
    </aside>
  );
}

function SideGroup({
  heading,
  children,
}: Readonly<{ heading: string; children: React.ReactNode }>) {
  return (
    <div className={styles.sideGroup}>
      <p className={styles.sideHeading}>{heading}</p>
      <ul>{children}</ul>
    </div>
  );
}

function SideLink({
  active,
  onClick,
  children,
}: Readonly<{
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}>) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`${styles.sideLink} ${active ? styles.sideLinkActive : ""}`}
      >
        {children}
      </button>
    </li>
  );
}

function SideTeam({
  color,
  href,
  label,
  children,
}: Readonly<{
  color: string;
  href: string;
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className={styles.sideTeam}
      >
        <span
          className={styles.sideTeamDot}
          style={{ background: color } as CSSProperties}
        />
        {children}
      </a>
    </li>
  );
}

function IssueRow({
  issue,
  isExpanded,
  onToggle,
}: Readonly<{ issue: Issue; isExpanded: boolean; onToggle: () => void }>) {
  return (
    <li
      id={`issue-${issue.id}`}
      className={`${styles.issue} ${isExpanded ? styles.issueExpanded : ""}`}
    >
      <button type="button" className={styles.issueRow} onClick={onToggle}>
        <span className={styles.priorityChip} data-priority={issue.priority}>
          {issue.priority}
        </span>
        <span className={styles.issueKey}>{issue.key}</span>
        <span
          className={styles.statusChip}
          style={{ "--status-color": STATUS_COLOR[issue.status] } as CSSProperties}
        >
          <span className={styles.statusDot} />
          {STATUS_LABEL[issue.status]}
        </span>
        <span className={styles.issueTitle}>{issue.title}</span>
        <span className={styles.issueAssignees}>
          {issue.voices.map((voice) => (
            <span key={voice} className={styles.avatar} title={VOICE_LABEL[voice]}>
              {voice === "eng" ? "E" : voice === "pm" ? "P" : "O"}
            </span>
          ))}
        </span>
      </button>
      {isExpanded ? <IssueDetail issue={issue} /> : null}
    </li>
  );
}

function IssueDetail({ issue }: Readonly<{ issue: Issue }>) {
  if (!issue.case) {
    return (
      <div className={styles.detail}>
        <p className={styles.detailBody}>{issue.body}</p>
        {issue.id === "talk" ? (
          <a className={styles.detailCta} href={`mailto:${profile.email}`}>
            {profile.email} →
          </a>
        ) : null}
      </div>
    );
  }

  const c = issue.case;
  const chosen = c.options.find((option) => option.selected);
  const bet = chosen ? readOptionCanonical(chosen).label : c.summary;
  const outcomePara = c.outcome.paragraphs[0];
  const outcome = outcomePara ? readCanonical(outcomePara) : c.summary;
  const accent = c.brand?.primary ?? "#5e6ad2";

  return (
    <div className={styles.detail} style={{ "--accent": accent } as CSSProperties}>
      <div className={styles.detailHead}>
        <div>
          <p className={styles.detailLabel}>Summary</p>
          <p className={styles.detailBody}>{c.summary}</p>
        </div>
        <ul className={styles.detailMeta}>
          <li>
            <span>Role</span>
            <span>{c.meta.role}</span>
          </li>
          <li>
            <span>Duration</span>
            <span>{c.meta.duration}</span>
          </li>
          <li>
            <span>Stack</span>
            <span>{c.meta.stack}</span>
          </li>
        </ul>
      </div>
      <div className={styles.detailSplit}>
        <article>
          <p className={styles.detailLabel}>The bet</p>
          <p className={styles.detailBody}>{bet}</p>
        </article>
        <article>
          <p className={styles.detailLabel}>Outcome</p>
          <p className={styles.detailBody}>{outcome}</p>
        </article>
      </div>
      {c.outcome.metrics?.length ? (
        <ul className={styles.detailMetrics}>
          {c.outcome.metrics.slice(0, 4).map((metric) => (
            <li key={metric.label}>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className={styles.detailSplit}>
        <article>
          <p className={styles.detailLabel}>Engineering reflection</p>
          <p className={styles.detailBody}>{readReflection(c.reflection, "tech")}</p>
        </article>
        <article>
          <p className={styles.detailLabel}>Product reflection</p>
          <p className={styles.detailBody}>{readReflection(c.reflection, "product")}</p>
        </article>
      </div>
    </div>
  );
}

function CommandPalette({
  onClose,
  onPick,
  issues,
}: Readonly<{
  onClose: () => void;
  onPick: (id: string) => void;
  issues: Issue[];
}>) {
  const [query, setQuery] = useState("");
  const matches = issues.filter((issue) =>
    (issue.title + issue.key + issue.body).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className={styles.paletteBackdrop} onClick={onClose} role="presentation">
      <div
        className={styles.palette}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
      >
        <input
          autoFocus
          type="text"
          placeholder="Jump to an issue, or type a command…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={styles.paletteInput}
        />
        <ul className={styles.paletteList}>
          {matches.length === 0 ? (
            <li className={styles.paletteEmpty}>No matches.</li>
          ) : (
            matches.map((issue) => (
              <li key={issue.id}>
                <button
                  type="button"
                  className={styles.paletteItem}
                  onClick={() => onPick(issue.id)}
                >
                  <span
                    className={styles.paletteStatus}
                    style={{ background: STATUS_COLOR[issue.status] } as CSSProperties}
                  />
                  <span className={styles.paletteKey}>{issue.key}</span>
                  <span className={styles.paletteTitle}>{issue.title}</span>
                </button>
              </li>
            ))
          )}
        </ul>
        <footer className={styles.paletteFoot}>
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
          <span>
            <kbd>esc</kbd> to close
          </span>
        </footer>
      </div>
    </div>
  );
}
