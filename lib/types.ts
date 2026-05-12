export type ThemeId =
  | "editorial"
  | "changelog"
  | "twocolumn"
  | "decisionlog"
  | "terminal"
  | "readingroom"
  | "reel"
  | "horizontalreel"
  | "scene"
  | "constellation"
  | "orbitlab"
  | "atelier"
  | "peachstudio"
  | "threltedocs"
  | "starmap"
  | "issueboard"
  | "bookshelf"
  | "keynote"
  | "interactlab"
  | "origami"
  | "magnetictype"
  | "glitchreel"
  | "fieldreport"
  | "prose"
  | "gates"
  | "inkflow"
  | "aurora"
  | "wormhole"
  | "holowire"
  | "shockwave";

export type AvailabilitySignal = "open" | "selective" | "closed";

export interface Availability {
  signal: AvailabilitySignal;
  message: string;
}

export interface Socials {
  linkedin: string;
  github: string;
  x: string;
  pubdev: string;
  personalSite?: string;
}

export interface Profile {
  name: string;
  tagline: string;        // canonical (DecisionLog, Editorial, Reading Room, Changelog, Terminal)
  intro: string;          // canonical
  location: string;
  currentRole: string;    // canonical
  email: string;
  socials: Socials;
  availability: Availability;
  defaultTheme: ThemeId;

  // Optional engineering-voice overrides (read by Two Columns Builder column)
  engineeringTagline?: string;
  engineeringIntro?: string;
  engineeringCurrentRole?: string;
  engineeringAvailabilityMessage?: string;
}

export interface RoleSubProduct {
  product: string;
  period: string;
  description: string;
}

export interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  description: string;
  engineeringSummary: string;
  productSummary: string;
  subProducts?: RoleSubProduct[];
  closingNote?: string;
}

export interface Education {
  institution: string;
  qualification: string;
  period: string;
}

export type CaseAudienceTag = "tech" | "product" | "both";

export type CaseVoice = Exclude<CaseAudienceTag, "both">;

export type AudienceText<T = string> =
  | { audience: "tech"; voices: { tech: T } }
  | { audience: "product"; voices: { product: T } }
  | { audience: "both"; voices: { tech: T; product: T } };

export type AudienceBlock = AudienceText<string | string[]>;

export type OptionRow =
  | {
      letter: string;
      selected?: boolean;
      audience: "tech";
      voices: { tech: { label: string; rejection: string } };
    }
  | {
      letter: string;
      selected?: boolean;
      audience: "product";
      voices: { product: { label: string; rejection: string } };
    }
  | {
      letter: string;
      selected?: boolean;
      audience: "both";
      voices: {
        tech: { label: string; rejection: string };
        product: { label: string; rejection: string };
      };
    };

export type ProblemItem = AudienceText & { label: string };

export type BetSection = AudienceBlock & { heading: string };

export interface OutcomeMetric {
  label: string;
  value: string;
  audience: CaseAudienceTag;
}

export interface CaseMeta {
  year: string;
  duration: string;
  role: string;
  stack: string;
  status: string;
  repoUrl?: string;
}

export interface CaseProblem {
  intro?: AudienceText;
  items?: ProblemItem[];
  paragraphs?: AudienceText[];
}

export interface CaseBet {
  intro?: AudienceText;
  sections?: BetSection[];
}

export interface CaseOutcome {
  paragraphs: AudienceText[];
  metrics?: OutcomeMetric[];
}

export interface CaseReflection {
  engineering: string;
  product: string;
}

export interface BrandGradientStop {
  color: string;
  /** Position 0-100 (percentage) */
  offset: number;
}

export interface BrandGradient {
  /** CSS gradient angle in degrees (90 = left→right, 165 = top-left→bottom-right) */
  direction: number;
  stops: BrandGradientStop[];
}

export interface BrandScale {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
}

export interface BrandColor {
  /** The single solid brand color — always present. */
  primary: string;
  /** Optional multi-stop gradient (some brands have one, others don't). */
  gradient?: BrandGradient;
  /** Optional lightest→darkest scale (100 light → 500 dark, brand at 500). */
  scale?: BrandScale;
  /** Optional secondary palette (e.g., Clickked's lavender Secondary 100-500). */
  secondary?: BrandScale;
}

export interface Case {
  id: string;
  number: number;
  title: string;
  meta: CaseMeta;
  summary: string;
  problem: CaseProblem;
  options: OptionRow[];
  bet: CaseBet;
  outcome: CaseOutcome;
  reflection: CaseReflection;
  prose?: string;
  /** Optional brand color spec. Used by skins to tint per-case accents. */
  brand?: BrandColor;
}

export interface ToolkitEngineeringGroup {
  category: string;
  items: string[];
}

export interface ToolkitProductEntry {
  category: string;
  headline: string;
  body: string;
}

export interface Toolkit {
  engineering: ToolkitEngineeringGroup[];
  product: ToolkitProductEntry[];
}

export interface Philosophy {
  quote: string[];                   // canonical
  engineeringQuote?: string[];       // optional engineering voice (Two Columns Builder)
}

export type Marquee = string[];

export interface Project {
  name: string;
  tagline: string;
  description: string;
  engineeringSummary: string;
  productSummary: string;
  stack: string;
  status: string;
}

export interface ProjectGroup {
  heading: string;
  projects: Project[];
}

export interface ThemeRegistryEntry {
  id: ThemeId;
  name: string;
  description: string;
  swatch: { background: string; foreground: string; accent: string };
  shortcut: string;
}
