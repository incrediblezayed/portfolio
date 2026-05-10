// ───────────────────────────────────────────
// EDIT THIS FILE — your portfolio content lives here.
// Every skin reads from this. Change once, updates six places.
// ───────────────────────────────────────────

import type { Education, Role } from "@/lib/types";

export const experience: Role[] = [
  {
    company: "Enso Webworks",
    title: "Senior Product Manager",
    period: "Feb 2026 – present",
    location: "Mumbai, India",
    description:
      "Senior Product Manager on two Enso products. Cross-functional across both — engineering, design, and stakeholder communication.",
    subProducts: [
      {
        product: "InfoPhone",
        period: "May 2025 – present",
        description:
          "Real-time chat + voice/video. Owning the architectural rebuild from a wrapped-vendor SDK to native iOS/Android + raw ejabberd + LiveKit + NestJS.",
      },
      {
        product: "InfoToDo",
        period: "Feb 2026 – present",
        description:
          "Personal task management with tasks, notes, reminders, and offline-first sync. Flutter app with PowerSync/Drift locally, Next.js admin, and a NestJS + TypeORM/Postgres backend.",
      },
    ],
  },
  {
    company: "Enso Webworks",
    title: "Product Manager",
    period: "May 2025 – Feb 2026",
    location: "Mumbai, India",
    description:
      "Product Manager on InfoPhone — owning the architectural rebuild from a wrapped-vendor SDK to native iOS/Android + raw ejabberd + LiveKit + NestJS. Promoted to Senior Product Manager in Feb 2026 when InfoToDo was added to my portfolio.",
  },
  {
    company: "Enso Webworks",
    title: "Senior Software Developer",
    period: "Oct 2024 – May 2025",
    location: "Mumbai, India",
    description:
      "Built InfoProfile from scratch with a 4-developer team. Owned core services — BLoC wrapper, API handler, environment flavors, Firebase integration, auth, notifications, and media flows. Helped shape the team's architectural conventions early. Built and maintained backend APIs in Node.js/TypeScript with Hapi.",
  },
  {
    company: "Trubary Technologies Pvt. Ltd.",
    title: "Full-Stack Developer",
    period: "Oct 2023 – Sep 2024",
    location: "Mumbai, India",
    description:
      "Maintained and extended Pappyon: a Flutter mobile app, Vue 2/Vuetify business portal, and Firebase Cloud Functions. Worked across Firestore, Auth, Storage, messaging, payments, QR/link preview flows, and cross-platform workflow automation.",
  },
  {
    company: "Exceptions",
    title: "Senior Software Engineer",
    period: "Jan 2023 – Oct 2023",
    location: "Mumbai, India",
    description:
      "End-to-end ownership across Flutter + Firebase client projects including Fin Moto Corp, ServYou 24, and GharTak. Client-facing on requirements, team-facing on code review and delivery quality. Where I learned to translate vague client asks into concrete development plans.",
  },
  {
    company: "Pegasus InfoCorp",
    title: "Senior Software Engineer",
    period: "Sep 2022 – Jan 2023",
    location: "Mumbai, India",
    description:
      "Worked on Caratlane's internal Digital QC app in Flutter. Wrote the test suite that took coverage from 0 to 80%, enforced linting/code standards, and made one small Ruby-side dropdown value change when the workflow needed it.",
  },
  {
    company: "Capgemini",
    title: "Software Associate",
    period: "Mar 2021 – Sep 2022",
    location: "Mumbai, India",
    description:
      ".NET / C# shadow project alongside senior engineers. Server operations, UAT data migrations, user-ticket triage. First exposure to enterprise-scale process — the slow, structured kind that's the opposite of startup chaos.",
  },
  {
    company: "Swift Media Labs",
    title: "Senior Consultant / Software Developer",
    period: "Jan 2020 – Mar 2021",
    location: "Mumbai, India",
    description:
      "Service-based Flutter app work with a 3-developer team. Architected frontend/backend boundaries with the backend team. Led 2 junior developers through requirements interpretation and project planning — first taste of being responsible for someone else's output.",
  },
  {
    company: "Frynds & Co",
    title: "Lead Software Developer",
    period: "Dec 2019 – Sep 2020",
    location: "Mumbai, India",
    description:
      "Built Hungry, a food delivery system, from scratch — Flutter app, Firebase backend services, and TypeScript/Node.js Cloud Functions. On-site at the client's office, with every change reviewed in person. End-to-end ownership of architecture, build, and deployment.",
  },
];

export const education: Education[] = [
  {
    institution: "University of Mumbai (BNN College)",
    qualification: "BSc, Information Technology",
    period: "2017 – 2020",
  },
];
