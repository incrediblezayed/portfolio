import type { ThemeId, ThemeRegistryEntry } from "./types";

export interface ThemeGroup {
  id: string;
  label: string;
  blurb: string;
  themes: ThemeId[];
}

export const THEME_GROUPS: ThemeGroup[] = [
  {
    id: "editorial",
    label: "Editorial",
    blurb: "Words-first. Quiet structure, deep typography.",
    themes: ["decisionlog", "editorial", "readingroom", "prose", "atelier", "threltedocs"],
  },
  {
    id: "system",
    label: "System & data",
    blurb: "Console and dashboard feels. Where the work shows.",
    themes: ["twocolumn", "changelog", "terminal", "issueboard", "fieldreport"],
  },
  {
    id: "cinematic",
    label: "Cinematic",
    blurb: "Pin-scroll narratives. One moment per section.",
    themes: ["reel", "horizontalreel", "keynote"],
  },
  {
    id: "interactive",
    label: "Interactive & motion",
    blurb: "Cursor- and scroll-driven. Designed to be played with.",
    themes: ["interactlab", "magnetictype", "glitchreel"],
  },
  {
    id: "spatial",
    label: "3D & shaders",
    blurb: "Real WebGL. Heavy lifting.",
    themes: ["scene", "aurora"],
  },
  {
    id: "experimental",
    label: "Experimental",
    blurb: "Shaders, holograms, shockwaves. Hardware permitting.",
    themes: ["holowire", "shockwave", "aipromptbox"],
  },
];

export const THEME_ORDER: ThemeId[] = THEME_GROUPS.flatMap((group) => group.themes);

// Hidden skins — wired in <Portfolio> switch + THEMES registry, but absent from
// THEME_ORDER so they don't appear in the picker or respond to shortcuts. Still
// reachable via ?theme=<id> URL param for archival / easter-egg access.
// Currently hidden: constellation, orbitlab, peachstudio, gates, bookshelf, inkflow.

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
  reel: {
    id: "reel",
    name: "The Reel",
    description: "Cinematic pin-scroll. Chapters morph between palettes.",
    swatch: { background: "#0e0e10", foreground: "#f5f1ea", accent: "#d94a1f" },
    shortcut: "7",
  },
  horizontalreel: {
    id: "horizontalreel",
    name: "Horizontal Reel",
    description: "Vertical scroll pans the camera sideways. Filmstrip showreel.",
    swatch: { background: "#0a0a0a", foreground: "#fafafa", accent: "#ff8c42" },
    shortcut: "8",
  },
  scene: {
    id: "scene",
    name: "Scene",
    description: "Real WebGL 3D. Camera glides through floating panels in space.",
    swatch: { background: "#06061a", foreground: "#f5f5fa", accent: "#a78bfa" },
    shortcut: "9",
  },
  constellation: {
    id: "constellation",
    name: "Signal Deck",
    description: "Tilted glass prisms on a grid floor. One case lifts as you scroll.",
    swatch: { background: "#080a10", foreground: "#f4f4f8", accent: "#f3d36b" },
    shortcut: "0",
  },
  orbitlab: {
    id: "orbitlab",
    name: "Orbit Lab",
    description: "Planets on rings. Camera circles the system as each case takes focus.",
    swatch: { background: "#05070d", foreground: "#f6f7ea", accent: "#e8ff6a" },
    shortcut: "q",
  },
  atelier: {
    id: "atelier",
    name: "Atelier",
    description: "Studio manifesto. Big serif statements, no cards, edge HUD chrome.",
    swatch: { background: "#0c0c0c", foreground: "#f3efe7", accent: "#d94a1f" },
    shortcut: "w",
  },
  peachstudio: {
    id: "peachstudio",
    name: "Peach Studio",
    description: "Dark violet hero with a live WebGL case preview. Plan / Build / Ship.",
    swatch: { background: "#0b0915", foreground: "#f0ecff", accent: "#a78bfa" },
    shortcut: "e",
  },
  threltedocs: {
    id: "threltedocs",
    name: "Docs Site",
    description: "Devtool documentation. Sidebar, code blocks, syntax-highlighted bets.",
    swatch: { background: "#fafaf9", foreground: "#0f172a", accent: "#ec4899" },
    shortcut: "r",
  },
  issueboard: {
    id: "issueboard",
    name: "Issue Board",
    description: "SaaS console. Sidebar, status pills, sub-tasks, Cmd+K palette.",
    swatch: { background: "#0e0f15", foreground: "#e8e8f0", accent: "#5e6ad2" },
    shortcut: "y",
  },
  bookshelf: {
    id: "bookshelf",
    name: "Bookshelf",
    description: "Cases as books on a shelf. Hover the spine, open the cover.",
    swatch: { background: "#f3ecdf", foreground: "#1f1a14", accent: "#a23b1c" },
    shortcut: "u",
  },
  keynote: {
    id: "keynote",
    name: "Keynote",
    description: "Product-launch pin-scroll. One headline per moment, lots of whitespace.",
    swatch: { background: "#f5f5f7", foreground: "#1d1d1f", accent: "#0071e3" },
    shortcut: "i",
  },
  interactlab: {
    id: "interactlab",
    name: "Interaction Lab",
    description: "Magnetic cursor, springy reveals, every element responds to touch.",
    swatch: { background: "#fafaf6", foreground: "#0f0f12", accent: "#ff5d3b" },
    shortcut: "o",
  },
  magnetictype: {
    id: "magnetictype",
    name: "Magnetic Type",
    description: "3D letters floating in space. Cursor pulls them in; click scatters them out.",
    swatch: { background: "#0b0c12", foreground: "#fafaf2", accent: "#ffd84a" },
    shortcut: "s",
  },
  glitchreel: {
    id: "glitchreel",
    name: "Glitch Showreel",
    description: "RGB-split type, scanlines, datamosh transitions. CRT-meets-VHS aesthetic.",
    swatch: { background: "#0a0a12", foreground: "#f5f5fa", accent: "#ff2e63" },
    shortcut: "d",
  },
  fieldreport: {
    id: "fieldreport",
    name: "Field Report",
    description: "Operations console. Numbered ops, before/after, live data ribbon at the foot.",
    swatch: { background: "#0a1424", foreground: "#e6ecf5", accent: "#7ad9ff" },
    shortcut: "f",
  },
  prose: {
    id: "prose",
    name: "Prose Letter",
    description: "One letter. No cards, no images. Project names live inline in the sentences.",
    swatch: { background: "#fcfaf5", foreground: "#1c1a16", accent: "#2848d4" },
    shortcut: "g",
  },
  gates: {
    id: "gates",
    name: "Gates",
    description: "Cases as doorways. Hover cracks them open. Click and walk through.",
    swatch: { background: "#1a1308", foreground: "#f3e6c8", accent: "#e8a93b" },
    shortcut: "h",
  },
  inkflow: {
    id: "inkflow",
    name: "Ink Flow",
    description: "SVG ink that pours and morphs between cases. Cursor leaves drops, scroll spills.",
    swatch: { background: "#f6f3eb", foreground: "#161412", accent: "#1a1a1a" },
    shortcut: "j",
  },
  aurora: {
    id: "aurora",
    name: "Aurora Drift",
    description: "WebGL aurora curtains and drifting particle dust. Content fades through the lights.",
    swatch: { background: "#04060f", foreground: "#eef5ff", accent: "#7df9ff" },
    shortcut: "k",
  },
  holowire: {
    id: "holowire",
    name: "Holo Wireframe",
    description: "Holographic blueprint UI. Wireframe models, scanlines, typewriter readouts.",
    swatch: { background: "#03110d", foreground: "#d8ffe9", accent: "#42ffb4" },
    shortcut: "z",
  },
  shockwave: {
    id: "shockwave",
    name: "Shockwave Type",
    description: "Giant typography. Cursor magnetises letters, click sends a shockwave outward.",
    swatch: { background: "#0a0a0d", foreground: "#fff7ec", accent: "#ff3d3d" },
    shortcut: "x",
  },
  aipromptbox: {
    id: "aipromptbox",
    name: "AI Promptbox",
    description: "Ask-the-portfolio composer. Toggles filter the case stack by lens — problem, bet, outcome.",
    swatch: { background: "#0b0b10", foreground: "#f3f3f6", accent: "#9b87f5" },
    shortcut: "c",
  },
};

export const ALL_THEME_IDS = THEME_ORDER;

export function isThemeId(value: string | null | undefined): value is ThemeId {
  if (!value) return false;
  return ALL_THEME_IDS.includes(value as ThemeId);
}
