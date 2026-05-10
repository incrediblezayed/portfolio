import type { ThemeId, ThemeRegistryEntry } from "./types";

export const THEME_ORDER: ThemeId[] = [
  "decisionlog",
  "editorial",
  "twocolumn",
  "changelog",
  "terminal",
  "readingroom",
];

export const THEMES: Record<ThemeId, ThemeRegistryEntry> = {
  decisionlog: {
    id: "decisionlog",
    name: "Decision Log",
    description: "The hiring-signal version. Quiet structure, deep substance.",
    swatch: { background: "#fbfaf7", foreground: "#1a1a1a", accent: "#2848d4" },
    shortcut: "1",
  },
  editorial: {
    id: "editorial",
    name: "Editorial",
    description: "Magazine spread. Cream paper, vermillion ink, italic display.",
    swatch: { background: "#f1ebe1", foreground: "#1a1715", accent: "#d94a1f" },
    shortcut: "2",
  },
  twocolumn: {
    id: "twocolumn",
    name: "Two Columns, One Person",
    description: "Builder on the left, strategist on the right. Same stories.",
    swatch: { background: "#0d0d0d", foreground: "#f1ebe1", accent: "#6ce29b" },
    shortcut: "3",
  },
  changelog: {
    id: "changelog",
    name: "Live Changelog",
    description: "Reverse-chronological feed. Pills, hashes, sparse mono.",
    swatch: { background: "#ffffff", foreground: "#0a0a0a", accent: "#22c55e" },
    shortcut: "4",
  },
  terminal: {
    id: "terminal",
    name: "Brutalist Terminal",
    description: "ASCII chrome, slash commands, blinking caret.",
    swatch: { background: "#0a0a0a", foreground: "#e4e4e4", accent: "#ffaa33" },
    shortcut: "5",
  },
  readingroom: {
    id: "readingroom",
    name: "Reading Room",
    description: "Library quiet. Drop caps, single column, long-form prose.",
    swatch: { background: "#fbf7f0", foreground: "#2a2520", accent: "#8b3a1f" },
    shortcut: "6",
  },
};

export const ALL_THEME_IDS = THEME_ORDER;

export function isThemeId(value: string | null | undefined): value is ThemeId {
  if (!value) return false;
  return ALL_THEME_IDS.includes(value as ThemeId);
}
