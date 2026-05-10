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
      items: ["Flutter", "Native iOS", "Native Android", "Provider", "Riverpod", "BLoC", "GetX", "PowerSync", "Drift"],
    },
    {
      category: "Backend",
      items: ["NestJS", "Node.js (Express, Hapi, Fastify)", "TypeORM", "Drizzle", "Prisma", "REST APIs"],
    },
    {
      category: "Frontend (web)",
      items: ["Vue 2", "Vuetify", "Next.js", "React"],
    },
    {
      category: "Real-time / communication",
      items: ["XMPP", "ejabberd", "WebRTC", "LiveKit", "Janus", "Method channels", "UIKitView / PlatformViewLink"],
    },
    {
      category: "Cloud / infra",
      items: ["Firebase", "Firestore", "Firebase Cloud Functions", "Supabase", "Postgres", "Redis", "GCP", "GitHub Actions", "CodeMagic"],
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
      items: ["file_saver — cross-platform file saving for Flutter, multi-year maintenance"],
    },
  ],
  product: [
    {
      category: "Discovery",
      headline: "Currently inbound-driven.",
      body:
        "Product signals come through the team, leadership, and internal stakeholders. Direct user research is the next gap I'm closing — both products are early-stage enough that the cost of guessing wrong is still small, but that window narrows quarterly.",
    },
    {
      category: "Strategy",
      headline: "Roadmap proposal, written.",
      body:
        "I draft direction and propose; alignment lands through team review and adjustment. No formal prioritization framework yet — calls are instinct + experience. The discipline forms through writing decisions down (the case studies on this site are the artifact of that habit forming).",
    },
    {
      category: "Analytics",
      headline: "Firebase Analytics.",
      body:
        "Both products are early in their production lifecycle, so the dashboard is sparse by design — instrumenting properly is a roadmap item, not a backfill.",
    },
    {
      category: "Communication",
      headline: "Slack-first, documents-second.",
      body:
        "Sprint planning has dedicated docs; everything else lives in Slack threads. Proper PRDs are not yet in the workflow — case studies on this site are proof-of-concept for that habit forming.",
    },
    {
      category: "Execution",
      headline: "JIRA · two-week sprints.",
      body: "Two-week cadence, JIRA for tracking, async-first communication for everything else.",
    },
    {
      category: "Frameworks",
      headline: "No formal frameworks yet.",
      body:
        "Decisions on instinct + experience. The Decision Log format used in the case studies on this site is my attempt to give that instinct a structure I can show, critique, and improve.",
    },
  ],
};
