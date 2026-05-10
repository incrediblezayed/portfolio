// ───────────────────────────────────────────
// EDIT THIS FILE — your portfolio content lives here.
// Every skin reads from this. Change once, updates six places.
// ───────────────────────────────────────────

import type { ProjectGroup } from "@/lib/types";

export const projects: ProjectGroup[] = [
  {
    heading: "Live / in production",
    projects: [
      {
        name: "BAV",
        tagline: "Buy A Vehicle, Book A Vehicle",
        description:
          "Peer-to-peer ride-sharing + virtual EV showroom + 25 charging stations across Hyderabad. Doorstep delivery for EV purchases.",
        stack: "Flutter · Node.js · GraphQL",
        status: "Live · Play Store + App Store",
      },
      {
        name: "InfoProfile",
        tagline: "Profile-first mobile app",
        description: "Built from scratch in a 4-developer team at Enso Webworks.",
        stack: "Flutter · Hapi · Firebase",
        status: "Production",
      },
      {
        name: "MyGo",
        tagline: "Local-first taxi booking",
        description: "Cabs, autos, mini-trucks. Pricing tied to local market rates.",
        stack: "Flutter · Firebase",
        status: "Live · Play Store",
      },
      {
        name: "ServYou 24",
        tagline: "Home services platform",
        description: "Expanding across districts. Mobile app + a Next.js marketing site.",
        stack: "Flutter · Firebase · Next.js",
        status: "Live · Play Store + App Store",
      },
      {
        name: "Gochi Meat",
        tagline: "Online raw-meat delivery",
        description: "End-to-end ordering and delivery flow.",
        stack: "Flutter · Firebase",
        status: "Live · Play Store + App Store",
      },
      {
        name: "Fin Moto Corp",
        tagline: "Used-bike marketplace + financing",
        description: "OLX-style flow for second-hand two-wheelers, with a mobile-responsive web companion.",
        stack: "Flutter · Firebase",
        status: "Production",
      },
    ],
  },
  {
    heading: "Beta / pre-launch",
    projects: [
      {
        name: "GharTak",
        tagline: "Online food delivery",
        description: "Zomato/Swiggy-style delivery system.",
        stack: "Flutter · Firebase",
        status: "Beta — pending store deployment",
      },
      {
        name: "Hungry",
        tagline: "Food delivery system",
        description: "Built on-site at Frynds & Co (2020).",
        stack: "Flutter",
        status: "Earlier work",
      },
    ],
  },
];
