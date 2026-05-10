// ───────────────────────────────────────────
// EDIT THIS FILE — your portfolio content lives here.
// Every skin reads from this. Change once, updates six places.
// ───────────────────────────────────────────

import type { Case } from "@/lib/types";

export const cases: Case[] = [
  {
    id: "infophone",
    number: 1,
    title: "InfoPhone",
    meta: {
      year: "2025",
      duration: "ongoing",
      role: "Product Manager (& engineer of the prior build)",
      stack: "Native iOS (Swift) + Native Android (Kotlin) + raw ejabberd + LiveKit + NestJS + Drizzle",
      status: "In testing phase. Not yet shipped to end users.",
    },
    summary:
      "Real-time chat + voice/video at Enso Webworks. We shipped a Flutter + MirrorFly build, used it in production, and made the call to scrap it and rebuild native — raw ejabberd for chat, LiveKit for calls, NestJS for the rest. This case is about killing a working build before sunk cost killed the product.",
    problem: {
      intro: "Five layered issues compounded across the original Flutter + MirrorFly stack:",
      items: [
        {
          label: "Performance issues across multiple surfaces",
          body: "Call setup latency, UI jank during active calls, memory pressure on long sessions.",
        },
        {
          label: "MirrorFly SDK opacity",
          body: "Connectivity was direct WebRTC + sockets internally, but the implementation was MirrorFly's proprietary code. We asked repeatedly for proper Kotlin/Swift integration code; what came back wasn't usable. The architectural ideas were sound; the code-level handover was a black box. No community fallback — vendor was the only debugging path.",
        },
        {
          label: "Closed SDK = blocked features",
          body: "Screen sharing, Picture-in-Picture, and backup/restore were all unsupported and could not be added without forking the vendor's stack.",
        },
        {
          label: "Flutter ceiling at iOS PiP",
          body: "Even where MirrorFly didn't block us, Flutter did — iOS PiP integration was effectively impossible because call rendering was already going through UiKitView / PlatformViewLink to native.",
        },
        {
          label: "Wrapper-on-native architecture",
          body: "Calls and video screens were already written in native Swift/Kotlin and exposed to Flutter through method channels. We were paying both Flutter overhead and maintaining native code — worst of both worlds, with no upside.",
        },
      ],
    },
    options: [
      {
        letter: "A",
        label: "Patch the existing MirrorFly + Flutter stack",
        rejection: "Each fix exposed the next failure. The SDK itself was the ceiling — patching couldn't lift it.",
      },
      {
        letter: "B",
        label: "Stay on Flutter, swap MirrorFly for an alternative calling SDK",
        rejection:
          "We built a POC with Stream. It worked functionally, but the team anticipated re-hitting the same cross-platform bottlenecks (PiP, screen share, low-level platform APIs) that MirrorFly had already taught us about. Same box, different sticker.",
      },
      {
        letter: "C",
        label: "Native (Kotlin/Swift) + raw ejabberd + LiveKit + NestJS + Drizzle",
        rejection: "Chosen.",
      },
      {
        letter: "D",
        label: "Other cross-platform — React Native, KMP",
        rejection: "Same ceiling category as Flutter. Would re-introduce the same vendor/abstraction risks.",
      },
    ],
    bet: {
      intro:
        "We bet on native iOS (Swift) and native Android (Kotlin), with raw ejabberd (no wrapper SDK) for chat and LiveKit for calls, all glued together with a NestJS + Drizzle backend.",
      sections: [
        {
          heading: "Why this stack at all — code ownership",
          body:
            "The previous build had three layers of opacity: MirrorFly's wrapper code we couldn't read, MirrorFly's vendor support latency, and our own method-channel glue holding the two together. The new stack has one layer of code — all of which we either wrote ourselves or can read. ejabberd and LiveKit are both open source with large communities; our integration on top of them is ours. When something breaks at 2am, we can read every line in the call stack — both ours and our dependencies'. That's the bet, before any of the more specific reasons below.",
        },
        {
          heading: "Why native specifically",
          body:
            '"No limitation, no compromise." We had hit enough ceilings — PiP, screen share, opaque SDK debugging — that another cross-platform stack felt like a slightly bigger box that would still have a lid. Native = unbounded platform access for the lifetime of the product. We chose to pay the cost of the rebuild once instead of paying compromise costs forever.',
        },
        {
          heading: "Why LiveKit specifically",
          body: [
            "Operational expertise already exists. Another app at Enso runs on LiveKit. Org-level knowledge of self-hosting, scaling, and observability is real, not theoretical.",
            "Multi-provider future. We expect to add more call providers over time. LiveKit is provider #1 with an abstraction layer designed to accommodate provider #2.",
          ],
        },
        {
          heading: "Why raw ejabberd over a wrapper",
          body:
            "Same logic as MirrorFly's rejection — owning the chat layer directly, with the ability to read every protocol decision and extend system-level behavior, was worth more than any wrapper's convenience.",
        },
      ],
    },
    outcome: {
      paragraphs: [
        "In testing phase as of writing. Native iOS and Android builds are active; ejabberd, LiveKit, and NestJS infrastructure are self-hosted. Not yet shipped to end users.",
        "Early signals: features that were impossible on the old stack (PiP, screen share, backup/restore) are now in scope; team velocity on platform-specific features has visibly improved with the native codebase replacing the method-channel maze.",
      ],
    },
    reflection: {
      primary:
        "Killed it later than I should have. Each patch sprint added sunk-cost weight to the eventual kill decision. The signals were there earlier than I acted on them — Flutter's UiKitView overhead, MirrorFly's opacity on debugging, the gap between SDK promises and platform realities. I needed to stop patching and start writing the kill memo two months sooner than I did.",
      secondary:
        "For technical SDKs, I'd push for dev-led POC criteria before vendor commitment — even when the call comes from leadership. Hard requirements (PiP, screen share, backup/restore) tested against the SDK in week one would have surfaced MirrorFly's gaps before we built on top of it.",
    },
  },
  {
    id: "clickked",
    number: 2,
    title: "Clickked",
    meta: {
      year: "joined mid-2023; project itself started 2021",
      duration: "mid-2023 – present (ongoing)",
      role: "Sole technical lead. Every product/tech decision since joining — paywall placement, consultant web app architecture, NestJS backend design.",
      stack:
        "Flutter user app + Flutter consultant/admin apps + Firebase/Supabase services + NestJS/TypeORM consultant backend",
      status:
        "v1 currently live on Play Store + App Store. v2 (paywall pivot + consultant flow updates) is in development, ~2 months in, not yet shipped.",
    },
    summary:
      "Clickked is a two-sided dating + consultant marketplace. The marketplace shape was a stakeholder vision from inception, completed during 2021–2023. I joined mid-2023 as sole technical lead and have owned every product/tech call since. The product has two paywall surfaces — the dating side (the focus of this case) and the consultant side, which is always open to browse with a pay-per-session model for bookings. This case is about the v1 dating paywall placement and the v2 pivot it forced.",
    problem: {
      paragraphs: [
        "v1 shipped with the paywall placed roughly halfway through profile setup, during onboarding. The implicit hypothesis: gating users early would force conversion intent before they invested time in the product.",
        "The actual signal in production: ~90% drop-off at the paywall. Nine out of ten users hitting the gate left the funnel before they had ever swiped, matched, or experienced the core product loop. The paywall was gating before any aha-moment had landed — collecting friction, not conversions.",
      ],
    },
    options: [
      {
        letter: "A",
        label: "Keep v1 placement, accept the drop-off as the cost of conversion",
        rejection:
          "Drop-off wasn't proving conversion intent — it was just losing users at the gate without monetizing them.",
      },
      {
        letter: "B",
        label: "Remove the paywall entirely",
        rejection: "Marketplace economics need paid users; this defers the monetization problem instead of solving it.",
      },
      {
        letter: "C",
        label:
          "Move paywall to after the user's first swipe — let the core product loop fire once, then gate",
        rejection: "Chosen.",
      },
    ],
    bet: {
      intro:
        "Move the paywall from halfway through profile setup to after the user's first swipe. The v2 release bundles this paywall change with consultant-side flow updates; ~2 months in development, not yet shipped.",
      sections: [
        {
          heading: 'Why "first swipe" specifically — two reasons',
          body: [
            "The product already has a free surface. Consultants are always open to browse without payment; the dating-side paywall isn't the user's first encounter with Clickked, just the first encounter with the dating feature. The first swipe is the smallest possible unit of dating-product value — enough that the user has tasted what we're selling, not so much that we're giving away the loop.",
            "Paywall as a quality filter. A small payment after the first swipe filters bot and fake accounts out of the dating marketplace. Genuine users who want to date will pay; bot operators won't bother paying for accounts they can't monetize. We chose the placement that maximizes real users on both sides of the marketplace, even at the cost of volume — marketplace integrity over signup-count vanity.",
          ],
        },
        {
          heading: "The product instinct underneath",
          body:
            "Gate after the aha-moment, not before. Paywalls placed before value has been delivered get rejected as toll booths; paywalls placed after value has been delivered get accepted as fair trade.",
        },
      ],
    },
    outcome: {
      paragraphs: [
        "v2 pivot is in-flight, decided based on observed drop-off in v1. Implementation has been roughly two months including the consultant flow updates that ride alongside the paywall move. Not yet shipped.",
        "Expected directional outcome, based on the diagnosed problem: drop-off shifts from pre-product to post-aha-moment, where it represents real conversion intent — users choosing whether to pay for something they've already experienced rather than abandoning at a toll booth.",
      ],
      metrics: [
        { label: "v1 drop-off at the paywall", value: "~90%" },
        { label: "v2 in development", value: "~2 months" },
      ],
    },
    reflection: {
      paragraphs: [
        "v1's paywall placement should have been v2's from day one. The product already had a free surface (the consultant side); gating dating before users had even swiped meant we were collecting friction at a step that came too early in the funnel. A 90% drop-off was predictable in hindsight — we put the toll booth before the aha-moment instead of after it. The two months of v2 development are correcting a call I should have pushed back on (or proposed differently) when v1 was shipping.",
      ],
    },
  },
  {
    id: "file_saver",
    number: 3,
    title: "file_saver",
    meta: {
      year: "First release 11 March 2021",
      duration: "~4 years and counting (active maintenance)",
      role: "Author and sole maintainer",
      stack: "Dart, pub.dev, cross-platform (web + mobile + desktop)",
      status: "Live on pub.dev — 185k+ downloads · 491 likes · 140 pub points · active maintenance",
      repoUrl: "https://github.com/incrediblezayed/file_saver",
    },
    summary:
      "file_saver is an open-source Dart package that saves files cross-platform from Flutter apps — web, mobile, and desktop. I built it in 2021 for a personal project when no existing package handled the web-vs-mobile platform fork cleanly. Four years on, it's at 185k+ pub.dev downloads with active maintenance — written, owned, and maintained alone. This case is about the architectural call I made on day one — how to structure the abstraction — and how it has aged.",
    problem: {
      intro: "File saving in Flutter requires fundamentally different platform implementations:",
      items: [
        { label: "Web", body: "Browser download APIs (Blob + anchor tag patterns)." },
        { label: "Mobile (iOS)", body: "Documents directory + share sheets." },
        { label: "Mobile (Android)", body: "MediaStore / SAF (Storage Access Framework)." },
        { label: "Desktop", body: "OS-level file dialogs." },
      ],
      paragraphs: [
        "These have nothing in common at the implementation layer. I needed a single import that hid this fork from the developer using the package — FileSaver.saveAs(...) and forget the platform. The decision was how to structure that unification internally.",
      ],
    },
    options: [
      {
        letter: "A",
        label:
          "Monolithic package — one import, separate platform files inside, conditional imports (dart:html for web, dart:io for mobile, channels for desktop)",
        rejection: "Chosen.",
      },
      {
        letter: "B",
        label:
          "Platform interface + per-platform implementations — file_saver_platform_interface + file_saver_web + file_saver_android etc. (path_provider-style)",
        rejection:
          '"Correct by convention" but forces users to add multiple packages for a single-feature library. The user-facing cost outweighed architectural purity.',
      },
      {
        letter: "C",
        label: "Separate packages per platform, no unification",
        rejection: "Defeats the purpose. The whole point was a single API across platforms.",
      },
    ],
    bet: {
      intro:
        "Monolithic package with internal platform-specific files. One import for the user. Conditional imports handle the platform switches inside. The repo lives at one path; web/mobile/desktop are sibling files in the same package.",
      sections: [
        {
          heading: "The product instinct underneath",
          body:
            '"How many packages does my user have to add?" is a stronger UX axis than "How architecturally pure is the abstraction?" Platform-interface splits make sense when users might want to swap or replace implementations. file_saver does one thing — save a file — and there is nothing to swap. User simplicity won, and the architectural cost of the conditional-import dance was acceptable for a domain this small.',
        },
      ],
    },
    outcome: {
      paragraphs: [
        "Four years in, the bet has aged well. The monolithic structure scaled to support web, mobile, and desktop platforms as Flutter itself expanded. No major refactor required to add platforms; new ones slot into the existing structure without breaking the user-facing API.",
        "The architectural call from day one hasn't required revisiting. Adding platforms has been additive, not breaking.",
      ],
      metrics: [
        { label: "monthly downloads", value: "185k+" },
        { label: "likes on pub.dev", value: "491" },
        { label: "pub points", value: "140" },
        { label: "years active", value: "4" },
      ],
    },
    reflection: {
      paragraphs: [
        "The architectural Bet has held up — monolithic was the right call for a single-feature package, and new platforms (web, mobile, desktop) have been additive rather than breaking. What I'd do differently is the scaffolding around the package, not the package itself:",
        "1. Contribution guidelines + a clear maintainer policy from day one. 185k+ downloads is a lot of usage depending on a single bus factor. The package wasn't structured to accept community help, so I became the bottleneck the project couldn't afford.",
        "2. Tests + CI from the first commit. Updates would ship with confidence rather than caution; \"did this regress?\" would be answered by a green check rather than by re-reading the diff.",
        "3. A more explicit revisit when desktop platforms arrived. The monolithic structure absorbed Linux/Windows/macOS without breaking, but I should have asked the question — does this still make sense? — rather than letting the answer be implicit.",
        "The Bet was right. The discipline around the Bet was the part that needed more from me.",
      ],
    },
  },
];
