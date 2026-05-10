export type ThemeId =
  | "editorial"
  | "changelog"
  | "twocolumn"
  | "decisionlog"
  | "terminal"
  | "readingroom";

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
  tagline: string;
  intro: string;
  location: string;
  currentRole: string;
  email: string;
  socials: Socials;
  availability: Availability;
  defaultTheme: ThemeId;
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
  subProducts?: RoleSubProduct[];
  closingNote?: string;
}

export interface Education {
  institution: string;
  qualification: string;
  period: string;
}

export type CaseAudienceTag = "tech" | "product" | "both";

export interface OptionRow {
  letter: string;
  label: string;
  rejection: string;
  audience?: CaseAudienceTag;
}

export interface ProblemItem {
  label: string;
  body: string;
  audience?: CaseAudienceTag;
}

export interface BetSection {
  heading: string;
  body: string | string[];
  audience?: CaseAudienceTag;
}

export interface OutcomeMetric {
  label: string;
  value: string;
  audience?: CaseAudienceTag;
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
  intro?: string;
  items?: ProblemItem[];
  paragraphs?: string[];
}

export interface CaseBet {
  intro?: string;
  sections?: BetSection[];
}

export interface CaseOutcome {
  paragraphs: string[];
  metrics?: OutcomeMetric[];
}

export interface CaseReflection {
  paragraphs?: string[];
  primary?: string;
  secondary?: string;
  primaryAudience?: CaseAudienceTag;
  secondaryAudience?: CaseAudienceTag;
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
  quote: string[];
}

export type Marquee = string[];

export interface Project {
  name: string;
  tagline: string;
  description: string;
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
