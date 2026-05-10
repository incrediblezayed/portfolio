// ───────────────────────────────────────────
// EDIT THIS FILE — your portfolio content lives here.
// Every skin reads from this. Change once, updates six places.
// ───────────────────────────────────────────

import type { Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Hassan Ansari",
  tagline: "Flutter engineer turned product manager, still close to the stack.",
  intro:
    "I'm Hassan. I spent six years building Flutter, Firebase, and Node products before moving into product management. At Enso Webworks, I work on InfoPhone and InfoToDo: one is a real-time communication rebuild, the other is an offline-first productivity product. I still stay close to architecture because most of the product calls I care about have technical consequences.",
  location: "Mumbai, India",
  currentRole: "Senior Product Manager (InfoPhone + InfoToDo), Enso Webworks",
  email: "hassanansari222@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/incrediblezayed/",
    github: "https://github.com/IncredibleZayed",
    x: "https://x.com/incrediblezayed",
    pubdev: "https://pub.dev/packages/file_saver",
  },
  availability: {
    signal: "open",
    message: "Open to product conversations.",
  },
  defaultTheme: "decisionlog",

  // Engineering voice — read by Two Columns Builder column
  engineeringCurrentRole:
    "Senior Product Manager, still close to the stack — InfoPhone + InfoToDo at Enso Webworks",
  engineeringTagline:
    "I started as the person shipping the code. These days I care just as much about the bet behind it.",
  engineeringIntro:
    "I'm Hassan. I spent six years building Flutter and Node products, with Firebase, native mobile, and backend work mixed in. At Enso, I'm now PM on InfoPhone and InfoToDo, but I still stay close to architecture: InfoPhone's native rebuild, raw ejabberd/LiveKit/NestJS stack, and InfoToDo's offline-first sync. The common thread is simple: I like product work where the architecture matters.",
  engineeringAvailabilityMessage:
    "Open to architecture-heavy product conversations.",
};
