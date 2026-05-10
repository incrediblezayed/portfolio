import { cases, experience } from "@/content";
import type { Case, Role } from "./types";

export type ChangelogStatus = "shipped" | "wip" | "draft";

export interface ChangelogEntry {
  id: string;
  source: "case" | "role";
  date: string; // YYYY-MM, used for sort
  dateLabel: string; // human label e.g. "Feb 2026"
  hash: string; // 7-char faux commit hash, deterministic from id
  title: string;
  status: ChangelogStatus;
  body: string[]; // short paragraphs
  added?: string[]; // bullet adds
  removed?: string[]; // bullet removes
  stack?: string;
}

function fauxHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.codePointAt(i) ?? 0;
    h = Math.imul(h, 0x01000193);
  }
  return ((h >>> 0).toString(16) + "abcdef").slice(0, 7);
}

const MONTH_INDEX: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

const PERIOD_START_PATTERN = /^([A-Za-z]+)\s+(\d{4})/;
const YEAR_PATTERN = /(\d{4})/;

function parsePeriodStart(period: string): { yyyy_mm: string; label: string } {
  // Parse "Feb 2026 – present" or "Oct 2023 – Sep 2024" → "2026-02"
  const match = PERIOD_START_PATTERN.exec(period);
  if (!match) return { yyyy_mm: "0000-00", label: period };
  const monthRaw = match[1].toLowerCase().slice(0, 3);
  const month = MONTH_INDEX[monthRaw] ?? "01";
  const year = match[2];
  return { yyyy_mm: `${year}-${month}`, label: `${match[1]} ${year}` };
}

function isCurrentRole(period: string): boolean {
  return /present/i.test(period);
}

function caseToEntry(c: Case): ChangelogEntry {
  const isInTesting = /testing|in development|in-flight/i.test(c.meta.status);
  const status: ChangelogStatus = isInTesting ? "wip" : "shipped";

  // Pick a date — surface the most relevant release for the changelog,
  // not the original launch date.
  const yearMatch = YEAR_PATTERN.exec(c.meta.year);
  const yearByCase: Record<string, string> = {
    file_saver: "2026", // v0.4.0 release
  };
  const year = yearByCase[c.id] ?? (yearMatch ? yearMatch[1] : "2025");
  const monthByCase: Record<string, string> = {
    infophone: "05",
    clickked: "03", // v2 in dev currently
    file_saver: "05", // v0.4.0 release
  };
  const month = monthByCase[c.id] ?? "01";
  const yyyy_mm = `${year}-${month}`;
  const monthName: Record<string, string> = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };

  // Headline framing per case
  const titleByCase: Record<string, string> = {
    infophone: "InfoPhone — native rebuild in testing",
    clickked: "Clickked — v2 paywall pivot in development",
    file_saver: "file_saver — v0.4.0 ships SPM, streaming, Wasm cleanup",
  };

  // Body — take canonical product voice short paragraphs
  const summaryShort = c.summary.split(/\.\s+/).slice(0, 2).join(". ") + ".";

  // Added / removed per case
  const addedByCase: Record<string, string[]> = {
    infophone: [
      "Native iOS (Swift) shell",
      "Native Android (Kotlin) shell",
      "Self-hosted ejabberd for chat",
      "LiveKit integration for calls",
      "NestJS + Drizzle backend",
    ],
    clickked: [
      "Paywall trigger moved to post-first-swipe",
      "Consultant flow updates",
      "NestJS + TypeORM consultant backend",
    ],
    file_saver: [
      "Swift Package Manager support (iOS, macOS)",
      "Streaming writes — saveAsStream + saveLinkAsStream",
      "downloadLink for web + Android DownloadManager (no Dart memory copies)",
      "Conditional imports — clean Web/Wasm analysis",
      "Native file-path copying (iOS, macOS, Windows) — saveAs avoids loading bytes",
      "Android path-traversal hardening + writes off the main thread",
    ],
  };

  const removedByCase: Record<string, string[]> = {
    infophone: ["MirrorFly SDK", "Method-channel glue layer", "Flutter PiP workarounds"],
    clickked: ["Mid-profile paywall trigger (v1)"],
    file_saver: [],
  };

  return {
    id: `case:${c.id}`,
    source: "case",
    date: yyyy_mm,
    dateLabel: `${monthName[month]} ${year}`,
    hash: fauxHash(`case:${c.id}`),
    title: titleByCase[c.id] ?? c.title,
    status,
    body: [summaryShort],
    added: addedByCase[c.id]?.length ? addedByCase[c.id] : undefined,
    removed: removedByCase[c.id]?.length ? removedByCase[c.id] : undefined,
    stack: c.meta.stack,
  };
}

function roleToEntry(role: Role, idx: number): ChangelogEntry {
  const { yyyy_mm, label } = parsePeriodStart(role.period);
  const current = isCurrentRole(role.period);
  const status: ChangelogStatus = current ? "wip" : "shipped";
  return {
    id: `role:${idx}:${role.company}`,
    source: "role",
    date: yyyy_mm,
    dateLabel: label,
    hash: fauxHash(`role:${role.company}:${role.period}`),
    title: `${role.title} @ ${role.company}`,
    status,
    body: [role.description],
  };
}

export function buildChangelogEntries(): ChangelogEntry[] {
  const caseEntries = cases.map(caseToEntry);
  const roleEntries = experience.map(roleToEntry);
  return [...caseEntries, ...roleEntries].sort((a, b) => {
    if (a.date === b.date) {
      // case before role on tie
      if (a.source !== b.source) return a.source === "case" ? -1 : 1;
      return a.id.localeCompare(b.id);
    }
    return a.date < b.date ? 1 : -1;
  });
}

export function statusLabel(status: ChangelogStatus): string {
  return status.toUpperCase();
}

export function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
