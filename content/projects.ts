// ───────────────────────────────────────────
// EDIT THIS FILE — your portfolio content lives here.
// Every skin reads from this. Change once, updates six places.
// ───────────────────────────────────────────

import type { ProjectGroup } from "@/lib/types";

export const projects: ProjectGroup[] = [
  {
    heading: "Enso Webworks",
    projects: [
      {
        name: "InfoProfile",
        tagline: "Profile-first mobile app",
        description:
          "Built from scratch in a 4-developer team: auth, profile flows, media, notifications, maps, QR, subscriptions, and backend API work.",
        engineeringSummary:
          "Flutter + BLoC app with Firebase integrations, Hapi/MongoDB APIs, auth, media, notifications, maps, QR, and subscriptions.",
        productSummary:
          "Profile-first social product where identity, media, discovery, and subscription flows had to feel coherent.",
        stack: "Flutter · BLoC · Firebase · Hapi · MongoDB",
        status: "Production",
      },
      {
        name: "InfoToDo",
        tagline: "Tasks, notes, reminders",
        description:
          "Offline-first productivity product with mobile app, admin surface, local sync, and backend APIs.",
        engineeringSummary:
          "Offline-first Flutter app using PowerSync/Drift, with NestJS, TypeORM, Postgres, and a Next.js admin surface; early architecture choices were mine even while the build was outsourced.",
        productSummary:
          "Task, notes, and reminders product where I later closed team requirement gaps and shaped both product and technical decisions after taking it back officially.",
        stack:
          "Flutter · PowerSync · Drift · NestJS · TypeORM · Postgres · Next.js",
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
        engineeringSummary:
          "Production Flutter app plus Vue 2/Vuetify business portal backed by Firebase, Firestore, and Cloud Functions.",
        productSummary:
          "Consumer and business workflows kept in sync across mobile and portal surfaces.",
        stack:
          "Flutter · Firebase · Firestore · Vue 2 · Vuetify · Cloud Functions",
        status: "Production",
      },
    ],
  },
  {
    heading: "Exceptions",
    projects: [
      {
        name: "BAV (Bhasusa)",
        tagline: "Buy A Vehicle, Book A Vehicle",
        description:
          "EV marketplace and booking flow for Bhasusa across user and dealer apps, with charging-station maps, payments, dealer stock/test-ride management, and GraphQL-backed data access.",
        engineeringSummary:
          "Two Flutter apps for users and dealers, built with Riverpod, Ferry GraphQL, Firebase, Razorpay payments, charging-station maps, stock management, and test-ride management.",
        productSummary:
          "EV marketplace for user bookings and dealer operations, with charging-station discovery and payment-backed booking flows.",
        stack: "Flutter · Riverpod · Ferry GraphQL · Firebase · Razorpay",
        status: "Live · Play Store + App Store",
      },
      {
        name: "ServYou 24",
        tagline: "Home services platform",
        description: "Mobile app for home-services workflows across districts.",
        engineeringSummary:
          "Flutter + Firebase implementation for home-service workflows across districts.",
        productSummary:
          "Service-booking product focused on making local home-services easier to request and manage.",
        stack: "Flutter · Firebase",
        status: "Live · Play Store + App Store",
      },
      {
        name: "MyGo",
        tagline: "Local-first taxi booking",
        description:
          "Cabs, autos, and partner/admin workflows with Firebase-backed location and workflow automation.",
        engineeringSummary:
          "Flutter + Firebase/Firestore app with TypeScript Cloud Functions for cab, auto, partner, and admin workflows.",
        productSummary:
          "Local taxi-booking product connecting riders, vehicle categories, and operational partners.",
        stack: "Flutter · Firebase · Firestore · TypeScript Cloud Functions",
        status: "Live · Play Store",
      },
      {
        name: "Fin Moto Corp",
        tagline: "Used-bike marketplace + financing",
        description:
          "OLX-style flow for second-hand two-wheelers and financing discovery.",
        engineeringSummary:
          "Flutter + Firebase marketplace implementation for used-bike listings and financing discovery.",
        productSummary:
          "Second-hand two-wheeler discovery product with 10k+ downloads and financing-oriented browsing.",
        stack: "Flutter · Firebase",
        status: "Live · Play Store · 10k+ downloads",
      },
      {
        name: "GharTak",
        tagline: "Online food delivery",
        description:
          "Zomato/Swiggy-style delivery system with separate customer, restaurant partner, and delivery partner apps.",
        engineeringSummary:
          "Flutter + Firebase food-delivery implementation with separate customer, restaurant partner, and delivery partner apps, taken to beta/pre-launch.",
        productSummary:
          "Local food-delivery product modeled around ordering, restaurant discovery, and delivery flow.",
        stack: "Flutter · Firebase",
        status: "Beta / pre-launch",
      },
      {
        name: "Gochi Meat",
        tagline: "Online raw-meat delivery",
        description:
          "End-to-end meat ordering product with separate customer, shop partner, and delivery partner workflows built on Flutter + Firebase.",
        engineeringSummary:
          "Flutter + Firebase meat-ordering product with separate customer, shop partner, and delivery partner workflows.",
        productSummary:
          "End-to-end meat ordering experience; useful as delivery-domain work even though it is no longer live.",
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
        description:
          "Food-delivery product with separate customer, restaurant partner, and delivery partner workflows, built on-site at Frynds & Co with direct client review on every change.",
        engineeringSummary:
          "Flutter + Firebase + TypeScript Cloud Functions food-delivery system with separate customer, restaurant partner, and delivery partner workflows, built from scratch.",
        productSummary:
          "On-site client delivery project where product feedback, implementation, and deployment happened in a tight loop.",
        stack: "Flutter · Firebase · TypeScript Cloud Functions",
        status: "No longer live · taken down",
      },
    ],
  },
];
