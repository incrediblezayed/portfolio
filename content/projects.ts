// ───────────────────────────────────────────
// EDIT THIS FILE — your portfolio content lives here.
// Every skin reads from this. Change once, updates six places.
// ───────────────────────────────────────────

import type { ProjectGroup } from "@/lib/types";

export const projects: ProjectGroup[] = [
  {
    heading: "Bhasusa",
    projects: [
      {
        name: "BAV",
        tagline: "Buy A Vehicle, Book A Vehicle",
        description:
          "EV marketplace and booking flow across user and dealer apps, with maps, payments, messaging, and GraphQL-backed data access.",
        stack: "Flutter · Riverpod · Ferry GraphQL · Firebase · Razorpay",
        status: "Live · Play Store + App Store",
      },
    ],
  },
  {
    heading: "Enso Webworks",
    projects: [
      {
        name: "InfoProfile",
        tagline: "Profile-first mobile app",
        description:
          "Built from scratch in a 4-developer team: auth, profile flows, media, notifications, maps, QR, subscriptions, and backend API work.",
        stack: "Flutter · BLoC · Firebase · Hapi · MongoDB",
        status: "Production",
      },
      {
        name: "InfoToDo",
        tagline: "Tasks, notes, reminders",
        description:
          "Offline-first productivity product with mobile app, admin surface, local sync, and backend APIs.",
        stack: "Flutter · PowerSync · Drift · NestJS · TypeORM · Postgres · Next.js",
        status: "Active product",
      },
    ],
  },
  {
    heading: "Trubary",
    projects: [
      {
        name: "Pappyon",
        tagline: "Mobile app + business portal",
        description:
          "Maintained and extended a production Flutter app and Vue business portal with Firebase-backed workflows.",
        stack: "Flutter · Firebase · Firestore · Vue 2 · Vuetify · Cloud Functions",
        status: "Production",
      },
    ],
  },
  {
    heading: "Exceptions",
    projects: [
      {
        name: "ServYou 24",
        tagline: "Home services platform",
        description: "Mobile app for home-services workflows across districts.",
        stack: "Flutter · Firebase",
        status: "Live · Play Store + App Store",
      },
      {
        name: "MyGo",
        tagline: "Local-first taxi booking",
        description:
          "Cabs, autos, and partner/admin workflows with Firebase-backed location and workflow automation.",
        stack: "Flutter · Firebase · Firestore · TypeScript Cloud Functions",
        status: "Live · Play Store",
      },
      {
        name: "Fin Moto Corp",
        tagline: "Used-bike marketplace + financing",
        description: "OLX-style flow for second-hand two-wheelers and financing discovery.",
        stack: "Flutter · Firebase",
        status: "Live · Play Store · 10k+ downloads",
      },
      {
        name: "GharTak",
        tagline: "Online food delivery",
        description: "Zomato/Swiggy-style delivery system.",
        stack: "Flutter · Firebase",
        status: "Beta / pre-launch",
      },
      {
        name: "Gochi Meat",
        tagline: "Online raw-meat delivery",
        description: "End-to-end ordering and delivery flow built on Flutter + Firebase.",
        stack: "Flutter · Firebase",
        status: "No longer live · taken down",
      },
    ],
  },
  {
    heading: "Earlier work",
    projects: [
      {
        name: "Hungry",
        tagline: "Food delivery system",
        description: "Built on-site at Frynds & Co with direct client review on every change.",
        stack: "Flutter · Firebase · TypeScript Cloud Functions",
        status: "No longer live · taken down",
      },
    ],
  },
];
