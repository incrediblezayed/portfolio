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
    engineeringSummary:
      "Owned architecture-facing decisions across InfoPhone and InfoToDo: native rebuild direction, self-hosted communication infrastructure, and offline-first/productivity stack choices after taking over an initially outsourced product.",
    productSummary:
      "Managed two active product surfaces across engineering, design, and stakeholders, closing requirement gaps and balancing rebuild risk, roadmap clarity, and delivery sequencing.",
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
          "Personal task management with tasks, notes, reminders, and offline-first sync. Initially outsourced; I led the early tech architecture, then came back officially to close requirement gaps and make further product and technical decisions.",
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
    engineeringSummary:
      "Drove the InfoPhone rebuild from Flutter/vendor SDK toward native apps, raw ejabberd, LiveKit, NestJS, and Drizzle-backed ownership.",
    productSummary:
      "Made the hard product call to stop patching a working build once the vendor/platform ceiling became more expensive than a rebuild.",
  },
  {
    company: "Enso Webworks",
    title: "Senior Software Developer",
    period: "Oct 2024 – May 2025",
    location: "Mumbai, India",
    description:
      "Built InfoProfile from scratch with a 4-developer team. Owned core services — BLoC wrapper, API handler, environment flavors, Firebase integration, auth, notifications, and media flows. Helped shape the team's architectural conventions early. Built and maintained backend APIs in Node.js/TypeScript with Hapi.",
    engineeringSummary:
      "Built InfoProfile core architecture with BLoC wrappers, API handlers, flavors, Firebase integrations, media/auth flows, and Hapi backend APIs.",
    productSummary:
      "Helped turn a new product into repeatable team conventions, balancing solo ownership with a four-developer delivery model.",
  },
  {
    company: "Exceptions",
    title: "Founder & Technical Lead",
    period: "2019 – present",
    location: "Mumbai, India",
    description:
      "My independent practice, run alongside my full-time roles — started as direct freelance in 2019 and formally established as a company, Exceptions, in 2022. Delivered Flutter + Firebase products end to end for multiple clients (Fin Moto Corp, ServYou 24, MyGo, GharTak, Gochi Meat) and led the product/tech calls on my own product bets — earliest was Hungry (built on-site for Frynds & Co). Where I learned to translate vague client asks into concrete development plans.",
    engineeringSummary:
      "Founded Exceptions and shipped multiple Flutter + Firebase apps end to end — marketplace, taxi, home-service, EV, and food-delivery workflows — plus a Flutter + NestJS dating/consultant marketplace on Supabase, Firebase, and GetStream.",
    productSummary:
      "Ran my own company across multiple client products and personal product bets — owning scoping, delivery, and the product/tech calls, including Clickked's paywall-placement decision.",
    subProducts: [
      {
        product: "Clickked",
        period: "Mid-2023 – present",
        description:
          "Sole technical lead on a two-sided dating + consultant marketplace, owning every product/tech call since joining — paywall placement, consultant web app architecture, and NestJS backend design. The marketplace shape predated my involvement.",
      },
      {
        product: "Bhasusa — BAV",
        period: "2021 – 2025",
        description:
          "Technical lead on an EV marketplace and booking flow, building and owning the user and dealer Flutter apps — charging-station maps, Razorpay payments, dealer stock and test-ride management, over a Ferry GraphQL backend.",
      },
    ],
  },
  {
    company: "Trubary Technologies Pvt. Ltd.",
    title: "Full-Stack Developer",
    period: "Oct 2023 – Sep 2024",
    location: "Mumbai, India",
    description:
      "Maintained and extended Pappyon: a Flutter mobile app, Vue 2/Vuetify business portal, and Firebase Cloud Functions. Worked across Firestore, Auth, Storage, messaging, payments, QR/link preview flows, and cross-platform workflow automation.",
    engineeringSummary:
      "Worked across Flutter, Vue 2/Vuetify, Firebase Cloud Functions, Firestore, auth, storage, payments, and messaging workflows.",
    productSummary:
      "Kept mobile and business portal behavior aligned for a production product with real-time data, payments, and operational workflow needs.",
  },
  {
    company: "Pegasus InfoCorp",
    title: "Senior Software Engineer",
    period: "Sep 2022 – Jan 2023",
    location: "Mumbai, India",
    description:
      "Worked on Caratlane's internal Digital QC app in Flutter. Wrote the test suite that took coverage from 0 to 80%, enforced linting/code standards, and made one small Ruby-side dropdown value change when the workflow needed it.",
    engineeringSummary:
      "Worked on Caratlane's Flutter QC app, raised test coverage from 0 to 80%, enforced linting, and handled a small Ruby workflow change.",
    productSummary:
      "Learned quality discipline inside a larger product environment where reliability, standards, and process were the deliverable.",
  },
  {
    company: "Capgemini",
    title: "Software Associate",
    period: "Mar 2021 – Sep 2022",
    location: "Mumbai, India",
    description:
      ".NET / C# shadow project alongside senior engineers. Server operations, UAT data migrations, user-ticket triage. First exposure to enterprise-scale process — the slow, structured kind that's the opposite of startup chaos.",
    engineeringSummary:
      "Worked around .NET/C# shadow projects, server operations, UAT data migrations, and user-ticket support.",
    productSummary:
      "Gained enterprise process exposure: structured triage, slower release rhythms, and the discipline of operating inside large delivery systems.",
  },
  {
    company: "Swift Media Labs",
    title: "Senior Consultant / Software Developer",
    period: "Jan 2020 – Mar 2021",
    location: "Mumbai, India",
    description:
      "Service-based Flutter app work with a 3-developer team, run as a parallel consulting engagement alongside my early freelance work. Architected frontend/backend boundaries with the backend team. Led 2 junior developers through requirements interpretation and project planning — first taste of being responsible for someone else's output.",
    engineeringSummary:
      "Built Flutter app surfaces and coordinated frontend/backend boundaries with the backend team.",
    productSummary:
      "Led two junior developers through requirements interpretation and planning, taking responsibility for output beyond my own code.",
  },
];

export const education: Education[] = [
  {
    institution: "University of Mumbai (BNN College)",
    qualification: "BSc, Information Technology",
    period: "2017 – 2020",
  },
];
