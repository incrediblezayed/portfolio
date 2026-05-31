// ───────────────────────────────────────────
// EDIT THIS FILE — your portfolio content lives here.
// Every skin reads from this. Change once, updates six places.
// ───────────────────────────────────────────

import type { Toolkit } from "@/lib/types";

export const toolkit: Toolkit = {
  engineering: [
    {
      category: "Languages",
      items: ["Dart", "TypeScript", "JavaScript", "Kotlin", "Swift"],
    },
    {
      category: "Mobile",
      items: [
        "Flutter",
        "Native iOS",
        "Native Android",
        "Provider",
        "Riverpod",
        "BLoC",
        "GetX",
        "PowerSync",
        "Drift",
      ],
    },
    {
      category: "Backend",
      items: [
        "NestJS",
        "Node.js (Express, Hapi, Fastify)",
        "TypeORM",
        "Drizzle",
        "Prisma",
        "REST APIs",
      ],
    },
    {
      category: "Frontend (web)",
      items: ["Vue 2", "Vuetify", "Next.js", "React"],
    },
    {
      category: "Real-time / communication",
      items: [
        "XMPP",
        "ejabberd",
        "WebRTC",
        "LiveKit",
        "GetStream",
        "Janus",
        "Method channels",
        "UIKitView / PlatformViewLink",
      ],
    },
    {
      category: "Cloud / infra",
      items: [
        "Firebase",
        "Firestore",
        "Firebase Cloud Functions",
        "Supabase",
        "Postgres",
        "Redis",
        "GCP",
        "GitHub Actions",
        "CodeMagic",
      ],
    },
    {
      category: "Tooling",
      items: ["Git", "GitHub", "GitLab", "AWS CodeCommit"],
    },
    {
      category: "Testing",
      items: ["Jest", "JUnit", "Flutter Integration Testing"],
    },
    {
      category: "Notable open source",
      items: [
        "file_saver — cross-platform file saving for Flutter, multi-year maintenance",
      ],
    },
  ],
  product: [
    {
      category: "Discovery",
      headline: "Signal before process.",
      body: "Most product signals currently come through shipped behavior, team feedback, leadership context, and stakeholder conversations. Direct user research is the next area I want to make more consistent, especially while the products are still early enough to change direction cheaply.",
    },
    {
      category: "Strategy",
      headline: "Written proposals, then alignment.",
      body: "I prefer writing the direction down first: what changed, what options exist, what we are choosing, and what we expect to learn. The Decision Log format on this site is the same habit applied publicly.",
    },
    {
      category: "Analytics",
      headline: "Firebase Analytics.",
      body: "I use Firebase Analytics where it exists, but I care more about whether the funnel answers the right question. Clickked's paywall decision came from exactly that kind of signal: the event shape was basic, but the drop-off was clear.",
    },
    {
      category: "Communication",
      headline: "Slack for speed, docs for decisions.",
      body: "Slack works for momentum; written notes are where decisions become reusable. Sprint planning already has structure, and the next maturity step is turning more product calls into short decision docs.",
    },
    {
      category: "Execution",
      headline: "JIRA · two-week sprints.",
      body: "Two-week cadence, JIRA for tracking, async-first communication for everything else.",
    },
    {
      category: "Frameworks",
      headline: "Lightweight by default.",
      body: "I don't force a framework when a clear memo will do. For now, the useful shape is simple: problem, options, bet, outcome, reflection.",
    },
  ],
};
