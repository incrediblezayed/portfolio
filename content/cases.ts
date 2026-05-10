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
      stack:
        "Native iOS (Swift) + Native Android (Kotlin) + raw ejabberd + LiveKit + NestJS + Drizzle",
      status: "In testing phase. Not yet shipped to end users.",
    },
    summary:
      "Real-time chat + voice/video at Enso Webworks. We shipped a Flutter + MirrorFly build, used it in production, and made the call to scrap it and rebuild native — raw ejabberd for chat, LiveKit for calls, NestJS for the rest. This case is about killing a working build before sunk cost killed the product.",
    problem: {
      intro: {
        audience: "both",
        voices: {
          tech: "The old stack had five compounding failure points: call performance, SDK opacity, blocked platform features, Flutter's iOS PiP ceiling, and native call screens routed back through method channels.",
          product:
            "The issue was not one bad bug; it was cumulative drag. Every workaround added more velocity tax, while the product still missed features users expect from a modern communication app.",
        },
      },
      items: [
        {
          label: "Performance issues across multiple surfaces",
          audience: "both",
          voices: {
            tech: "Call setup felt slow, active-call screens showed UI jank, and long sessions created memory pressure. Crashes, memory leaks, and thread issues appeared across rendering, call lifecycle, and session stability instead of one isolated module.",
            product:
              "The core product promise was real-time communication, and the old build made that promise feel unreliable. Frequent crashes and laggy calls made users distrust the entire app, even when the rest of the product worked.",
          },
        },
        {
          label: "MirrorFly SDK opacity",
          audience: "both",
          voices: {
            tech: "Connectivity was direct WebRTC + sockets, but in MirrorFly's proprietary implementation. Repeated requests for usable Kotlin/Swift integration code returned hand-waving. Vendor SDK was the only debugging path: no source access, no community fallback. Every bug was a black-box ticket.",
            product:
              "We were locked into a vendor whose code we couldn't read. Every bug routed through their support queue; basic protocol questions cost us weeks. Speed of iteration depends on access to your own stack, and we didn't have it.",
          },
        },
        {
          label: "Closed SDK = blocked features",
          audience: "both",
          voices: {
            tech: "Screen sharing, PiP, and backup/restore were not extension points we could implement around. The SDK did not expose the surfaces we needed, and we could not fork vendor internals to add them ourselves.",
            product:
              "The roadmap was being shaped by vendor support, not user needs. Features that should have been table stakes stayed blocked, creating competitive gaps we could explain internally but not justify to users.",
          },
        },
        {
          label: "Flutter ceiling at iOS PiP",
          audience: "both",
          voices: {
            tech: "iOS PiP needed native lifecycle control around the call surface, but the Flutter build was already rendering calls through UIKitView / PlatformViewLink and method-channel coordination. The integration point was too far from the platform API.",
            product:
              "PiP is expected behavior for a serious calling product in 2025. Missing it made the product feel dated, and another Flutter workaround would not have been a credible promise.",
          },
        },
        {
          label: "Wrapper-on-native architecture",
          audience: "both",
          voices: {
            tech: "Calls and video screens were already native Swift/Kotlin, then bridged back into Flutter through method channels. We were paying Flutter runtime cost and native maintenance cost at the same time.",
            product:
              "Every feature carried a double implementation tax. The team was moving slower while still not getting the benefits of a fully native product or a clean cross-platform one.",
          },
        },
      ],
    },
    options: [
      {
        letter: "A",
        audience: "both",
        selected: false,
        voices: {
          tech: {
            label: "Incremental MirrorFly + Flutter patches",
            rejection:
              "SDK bumps and custom workarounds only moved the failure point. Each fix exposed the next ceiling, and the parts we needed to change were still inside vendor code.",
          },
          product: {
            label: "Stay the course and delay the rebuild",
            rejection:
              "This would reduce short-term disruption but keep users on the same unreliable path. It was a deferment of the hard call, not a solution.",
          },
        },
      },
      {
        letter: "B",
        audience: "both",
        selected: false,
        voices: {
          tech: {
            label: "Keep Flutter and swap the calling vendor",
            rejection:
              "The Stream POC proved another SDK could work functionally, but PiP, screen share, and low-level native API access would still run into the same abstraction ceiling.",
          },
          product: {
            label: "Take a smaller rebuild with a different vendor",
            rejection:
              "It reduced migration cost but kept the product dependent on someone else's roadmap. The risk surface changed names; the ownership problem stayed.",
          },
        },
      },
      {
        letter: "C",
        audience: "both",
        selected: true,
        voices: {
          tech: {
            label:
              "Native Swift/Kotlin + raw ejabberd + LiveKit + NestJS + Drizzle",
            rejection: "Chosen.",
          },
          product: {
            label: "Full stack ownership with no platform ceiling",
            rejection: "Chosen.",
          },
        },
      },
      {
        letter: "D",
        audience: "both",
        selected: false,
        voices: {
          tech: {
            label:
              "Move to another cross-platform layer like React Native or KMP",
            rejection:
              "It stayed in the same category: another abstraction above native, with the same risk around platform-specific call features.",
          },
          product: {
            label: "Rewrite into a different cross-platform promise",
            rejection:
              "That would create migration work without changing the problem class. Different stack, same ceiling.",
          },
        },
      },
    ],
    bet: {
      intro: {
        audience: "both",
        voices: {
          tech: "Rebuild the product on native iOS and Android, raw ejabberd for chat, LiveKit for calls, and a NestJS + Drizzle backend we could inspect and operate ourselves.",
          product:
            "Choose ownership over convenience: one expensive rebuild now, instead of letting vendor opacity and platform compromises tax every future feature.",
        },
      },
      sections: [
        {
          heading: "Why this stack at all — code ownership",
          audience: "both",
          voices: {
            tech: "The old build had vendor wrapper code, vendor support latency, and our own method-channel glue. The new stack collapses that into readable integration code over open systems: ejabberd, LiveKit, and our backend.",
            product:
              "The call was operational confidence. During an incident, the team should debug by reading code and logs, not by waiting for a vendor reply.",
          },
        },
        {
          heading: "Why native specifically",
          audience: "both",
          voices: {
            tech: "Native gives direct access to PiP, CallKit, ConnectionService, background behavior, and platform-specific media lifecycle without fighting method-channel boundaries.",
            product:
              "The product should not negotiate with its framework for basic communication features. Native keeps future UX decisions open instead of pre-deciding what is impossible.",
          },
        },
        {
          heading: "Why LiveKit specifically",
          audience: "both",
          voices: {
            tech: [
              "LiveKit gave us a readable SDK, mature signaling/media primitives, and self-hosting instead of another opaque communication wrapper.",
              "The call-provider layer is designed so LiveKit can be provider #1 without making every future provider change a rewrite.",
            ],
            product: [
              "Enso already had operational knowledge from another LiveKit app, so adoption risk was lower than a cold vendor switch.",
              "Choosing LiveKit kept the door open for future provider swaps instead of betting the product on one external roadmap.",
            ],
          },
        },
        {
          heading: "Why raw ejabberd over a wrapper",
          audience: "both",
          voices: {
            tech: "Raw ejabberd keeps protocol-level access in our hands: XMPP behavior, extensions, delivery semantics, and self-hosting can be inspected instead of inferred through a wrapper.",
            product:
              "For chat, long-term stewardship mattered more than SDK convenience. The product needed a stack we could own for years, not a vendor shortcut we might outgrow again.",
          },
        },
      ],
    },
    outcome: {
      paragraphs: [
        {
          audience: "both",
          voices: {
            tech: "Native iOS and Android builds are active, with ejabberd, LiveKit, and NestJS infrastructure self-hosted. The rebuild has reached testing instead of remaining a paper architecture.",
            product:
              "The product is in testing, not shipped to end users yet. The important milestone is that the team has crossed from patching the old build to validating the new one.",
          },
        },
        {
          audience: "both",
          voices: {
            tech: "PiP, screen share, and backup/restore are now implementation problems inside our stack, not vendor-permission problems. Removing the method-channel maze made platform-specific work more direct.",
            product:
              "Features that were previously blocked are now in scope. The team can make product commitments based on capability, not vendor limitation.",
          },
        },
      ],
    },
    reflection: {
      engineering:
        "I should have forced SDK proof earlier: PiP, screen share, backup/restore, source-level debugging, and failure-mode ownership should have been week-one POC gates before the team built on top of MirrorFly.",
      product:
        "I killed the old build later than I should have. Every patch sprint made the sunk cost heavier, but the signals were already clear. I should have written the kill memo two months sooner.",
    },
    prose:
      "The Infophone codebase had been earning its keep for almost a year when the cracks added up. Calls dropped on iOS, screen sharing was always ten weeks away, and the chat layer routed through a vendor SDK whose source code we couldn't read. We had shipped what worked, used it in production, and watched the issues compound until patching no longer paid for itself.\n\nThe honest call was to throw it away.\n\nWe rebuilt from scratch. Native iOS in Swift, native Android in Kotlin, raw ejabberd for chat, LiveKit for calls, NestJS and Drizzle for everything else. The new stack has one layer of code instead of three layers of opacity — the vendor wrapper, the vendor's support latency, and the method-channel glue holding the two together. When something breaks at 2am now, we can read every line in the call stack, both ours and our dependencies'.\n\nThe rebuild is in testing as I write this. Native builds are active, ejabberd and LiveKit and NestJS are all self-hosted, and features that were impossible on the old stack — Picture-in-Picture, screen sharing, backup and restore — are now in scope. Team velocity on platform-specific work has visibly improved with the native codebase replacing the method-channel maze.\n\nThe lesson, the one I'm still chewing on, is that I should have killed the old build sooner. Each patch sprint added sunk-cost weight to the eventual decision, and the signals were clear earlier than I acted on them. The kill memo should have been written two months before it was. Most of the cost of a hard call lives in the time between recognising it and writing it down.",
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
        "Flutter user app + Flutter web consultant/admin apps + Supabase dating backend + Firebase chat/notifications + GetStream video + NestJS/TypeORM consultant backend on Supabase Postgres",
      status:
        "v1 currently live on Play Store + App Store. v2 (paywall pivot + consultant flow updates) is in development, ~2 months in, not yet shipped.",
    },
    summary:
      "Clickked is a two-sided dating + consultant marketplace. The marketplace shape was a stakeholder vision from inception, completed during 2021–2023. I joined mid-2023 as sole technical lead and have owned every product/tech call since. The product has two paywall surfaces — the dating side (the focus of this case) and the consultant side, which is always open to browse with a pay-per-session model for bookings. This case is about the v1 dating paywall placement and the v2 pivot it forced.",
    problem: {
      intro: {
        audience: "both",
        voices: {
          tech: "The v1 paywall trigger lived inside onboarding, before the user reached the match-feed loop. Payment state was firing before the core engagement state had a chance to initialize as value.",
          product:
            "The hypothesis was that early gating would prove conversion intent. In practice, it asked users to pay before they had experienced the thing they were being asked to buy.",
        },
      },
      paragraphs: [
        {
          audience: "both",
          voices: {
            tech: "The paywall appeared roughly halfway through profile setup, inside the onboarding state flow rather than after a product action like swipe, match, or consultant booking.",
            product:
              "Users were gated mid-investment. They had spent effort creating a profile, but had not yet received dating-product value.",
          },
        },
        {
          audience: "both",
          voices: {
            tech: "Firebase funnel data showed around 90% drop-off at the gate. The relevant conversion step was payment completion, and the users reaching payment were not completing at a healthy ratio.",
            product:
              "Nine out of ten users left before swiping, matching, or seeing the core loop. The paywall was collecting friction, not conversion intent.",
          },
        },
      ],
    },
    options: [
      {
        letter: "A",
        audience: "both",
        selected: false,
        voices: {
          tech: {
            label: "Keep the onboarding paywall trigger",
            rejection:
              "Firebase showed users entering the gated flow without completing payment. The drop-off was not a useful conversion signal; it was a misplaced funnel step.",
          },
          product: {
            label: "Accept the funnel cost and wait for intent to emerge",
            rejection:
              "A 90% gate-loss before value delivery is funnel breakage, not quality filtering.",
          },
        },
      },
      {
        letter: "B",
        audience: "both",
        selected: false,
        voices: {
          tech: {
            label: "Disable the dating paywall into a free-tier mode",
            rejection:
              "It removes the immediate trigger but postpones monetization logic into a later backend/state model.",
          },
          product: {
            label: "Move to a fully free dating surface",
            rejection:
              "The marketplace still needs paid users. Removing the gate entirely defers the business problem instead of solving it.",
          },
        },
      },
      {
        letter: "C",
        audience: "both",
        selected: true,
        voices: {
          tech: {
            label: "Move the paywall trigger to after the first swipe",
            rejection: "Chosen.",
          },
          product: {
            label: "Gate after the first aha-moment",
            rejection: "Chosen.",
          },
        },
      },
    ],
    bet: {
      intro: {
        audience: "both",
        voices: {
          tech: "Refactor the trigger from onboarding state to post-first-swipe state, while v2 also carries consultant flow updates across Flutter web, Supabase, Firebase chat/notifications, GetStream video sessions, and the NestJS consultant backend.",
          product:
            "Move the dating paywall from halfway through profile setup to after the first swipe. The v2 pivot is in development and not shipped yet.",
        },
      },
      sections: [
        {
          heading: 'Why "first swipe" specifically — two reasons',
          audience: "both",
          voices: {
            tech: "First swipe is the smallest reliable engagement event. It is easier to reason about than profile-progress heuristics, and the payment requirement after it can reduce bot-driven swipe inflation.",
            product:
              "Consultants already give Clickked an always-open free surface. The dating paywall can act after the user tastes the dating loop, while still filtering low-quality or bot accounts.",
          },
        },
        {
          heading: "The product instinct underneath",
          audience: "both",
          voices: {
            tech: "The state machine becomes free -> swiped -> gated -> paid. The payment boundary moves later, after engagement is observed instead of before feed value is delivered.",
            product:
              "Paywall before value feels like a toll booth. Paywall after value feels like a fair trade.",
          },
        },
      ],
    },
    outcome: {
      paragraphs: [
        {
          audience: "both",
          voices: {
            tech: "v2 is in development, bundling the paywall trigger move with consultant flow changes across Supabase, Firebase chat/notifications, GetStream calls, and the NestJS consultant backend. The next proof point should come from post-release funnel telemetry.",
            product:
              "The pivot is in-flight because v1 showed a clear drop-off pattern. It is not yet a shipped win, but it is a decision grounded in observed behavior.",
          },
        },
        {
          audience: "both",
          voices: {
            tech: "The expected telemetry change is that paywall exposure moves after an engagement event, so abandonment is measured after product contact instead of during onboarding.",
            product:
              "If users leave after the first swipe, that is a sharper signal. It means they tried the value proposition before deciding whether to pay.",
          },
        },
      ],
      metrics: [
        {
          label: "v1 drop-off at the paywall",
          value: "~90%",
          audience: "both",
        },
        { label: "v2 in development", value: "~2 months", audience: "both" },
      ],
    },
    reflection: {
      engineering:
        "I would instrument the funnel more aggressively from the first release: onboarding step exits, gate exposure, payment started, payment completed, first swipe, and retry behavior should have made the failure visible earlier.",
      product:
        "The paywall placement should have been after the first swipe from day one. The consultant surface already gave users a free entry point; dating needed to show value before asking for money.",
    },
    prose:
      "Clickked started in 2021 as a one-sided dating app. By the time I joined as sole technical lead in mid-2023, the product had grown a second side — a consultant marketplace — and was live on the Play Store and App Store. My job was to build, ship, and improve. The most consequential decision I made was about a single screen: the paywall.\n\nVersion one placed the paywall halfway through profile setup. The implicit hypothesis was that gating users early would force conversion intent before they invested time in the app. The actual signal in production was unambiguous: roughly nine of every ten users hitting that screen left without paying. They never swiped, never matched, never experienced anything we were selling. We were collecting friction at a step that came too early in the funnel.\n\nFor version two, we moved the paywall to after the user's first swipe. The product already had a free surface — consultants, always open to browse — so the paywall is no longer a user's first encounter with Clickked, just the first encounter with the dating side. That first swipe is the smallest possible unit of dating-product value: enough that the user has tasted what we are selling, not so much that we are giving the loop away. As a side effect, a small payment after the first swipe acts as a quality filter against bots. Marketplace integrity over signup-volume vanity.\n\nThe v2 release is in development as I write this — about two months in, including the consultant flow updates that ride alongside the paywall move. Not yet shipped.\n\nIn hindsight, v1's paywall placement should have been v2's from day one. The drop-off was predictable in retrospect: gating users before any aha-moment had landed was a textbook misread of where value lives in a dating app. The instrumentation should have made that visible inside a week. The call should have been mine to make before v1 left the building.",
  },
  {
    id: "file_saver",
    number: 3,
    title: "file_saver",
    meta: {
      year: "First release 11 March 2021 · v0.4.0 May 2026",
      duration: "~5 years and counting (active maintenance)",
      role: "Author and sole maintainer",
      stack: "Dart, pub.dev, cross-platform (web + mobile + desktop)",
      status:
        "Live on pub.dev — 185k+ downloads · 491 likes · 140 pub points · v0.4.0 shipped May 2026 · active maintenance",
      repoUrl: "https://github.com/incrediblezayed/file_saver",
    },
    summary:
      "file_saver is an open-source Dart package that saves files cross-platform from Flutter apps — web, mobile, and desktop. I built it in 2021 for a personal project when no existing package handled the web-vs-mobile platform fork cleanly. Five years on, it's at 185k+ monthly downloads with active maintenance — most recent release v0.4.0 (May 2026) added Swift Package Manager support, streaming writes, and Wasm-friendly conditional imports without breaking the public API. This case is about the architectural call I made on day one — how to structure the abstraction — and how it has aged.",
    problem: {
      intro: {
        audience: "both",
        voices: {
          tech: "File saving splits into unrelated platform implementations: browser APIs on web, sandbox/share flows on iOS, scoped storage on Android, and native dialogs on desktop.",
          product:
            "Flutter developers do not want to learn four save-file models for one feature. They need one mental model that works across target platforms.",
        },
      },
      items: [
        {
          label: "Web",
          audience: "both",
          voices: {
            tech: "Web saving depends on browser download behavior: Blob creation, anchor-triggered downloads, MIME handling, and dart:html constraints.",
            product:
              "A web developer expects an instant browser download, not a plugin setup story or a platform-specific detour.",
          },
        },
        {
          label: "Mobile (iOS)",
          audience: "both",
          voices: {
            tech: "iOS saving has to respect sandboxing, documents directories, and native share or document flows.",
            product:
              "iOS users expect the platform-native share/save experience. The package has to feel like the OS, not like a custom workaround.",
          },
        },
        {
          label: "Mobile (Android)",
          audience: "both",
          voices: {
            tech: "Android saving has to deal with MediaStore, SAF, scoped storage, and behavior changes across Android versions.",
            product:
              "Android fragmentation is exactly what the package should absorb. The developer should not rewrite file-saving logic for each OS version.",
          },
        },
        {
          label: "Desktop",
          audience: "both",
          voices: {
            tech: "Desktop saving depends on OS-level file dialogs and platform-channel/native implementation differences.",
            product:
              "Desktop users expect native save dialogs. A cross-platform package has to preserve that expectation while hiding the implementation split.",
          },
        },
        {
          label: "Single import to hide the fork from developers",
          audience: "both",
          voices: {
            tech: "The design constraint was one public API over multiple private implementations, using conditional imports and platform-specific files internally.",
            product:
              "The value was developer ergonomics: call FileSaver.saveAs(...) and stop thinking about which platform is underneath.",
          },
        },
      ],
      paragraphs: [
        {
          audience: "both",
          voices: {
            tech: "The implementations share almost nothing below the public API, so the architecture had to hide the fork without pretending the fork did not exist.",
            product:
              "The developer-facing promise was one import and one API. The platform complexity belongs inside the package, not in the user's app code.",
          },
        },
      ],
    },
    options: [
      {
        letter: "A",
        audience: "both",
        selected: true,
        voices: {
          tech: {
            label:
              "One package with conditional imports and internal platform files",
            rejection: "Chosen.",
          },
          product: {
            label: "One import for the developer",
            rejection: "Chosen.",
          },
        },
      },
      {
        letter: "B",
        audience: "both",
        selected: false,
        voices: {
          tech: {
            label:
              "Platform interface plus per-platform implementation packages",
            rejection:
              "This is architecturally conventional, but too heavy for a single-feature package where users do not need swappable implementations.",
          },
          product: {
            label: "Architecturally pure, but more install friction",
            rejection:
              "For this package, asking users to add multiple packages would make the solution feel bigger than the problem.",
          },
        },
      },
      {
        letter: "C",
        audience: "both",
        selected: false,
        voices: {
          tech: {
            label: "Separate platform packages with no unified abstraction",
            rejection:
              "It avoids abstraction cost but pushes every platform branch to the app developer.",
          },
          product: {
            label: "Make the developer choose the platform path manually",
            rejection:
              "That defeats the core promise: one API for saving files anywhere Flutter runs.",
          },
        },
      },
    ],
    bet: {
      intro: {
        audience: "both",
        voices: {
          tech: "Keep the package monolithic, route platform differences through internal files, and expose one stable public API.",
          product:
            "Optimize for the developer's first five minutes: add one package, call one method, ship the feature.",
        },
      },
      sections: [
        {
          heading: "The product instinct underneath",
          audience: "both",
          voices: {
            tech: "The domain was small enough that a monolithic abstraction stayed clean. There were no meaningful alternative implementations users needed to swap at runtime.",
            product:
              "The deciding question was not architectural purity; it was how many packages the user had to add for one simple job.",
          },
        },
      ],
    },
    outcome: {
      paragraphs: [
        {
          audience: "both",
          voices: {
            tech: "Five years in, the monolithic structure still holds. v0.4.0 (May 2026) added Swift Package Manager support for iOS and macOS, conditional imports that keep Web/Wasm analysis clean, streaming writes via saveAsStream and saveLinkAsStream, native file-path copying on iOS/macOS/Windows so saveAs avoids loading inputs into Dart memory, and Android path-traversal hardening — all additive, none breaking the user-facing API.",
            product:
              "The call aged well: v0.4.0 shipped in May 2026 with SPM support, streaming downloads, and security hardening — meaningful evolution that didn't ask any user to migrate or change a single import. The architectural choice from day one keeps paying.",
          },
        },
        {
          audience: "both",
          voices: {
            tech: "The monolithic structure absorbed Linux, Windows, and macOS desktop platforms; absorbed Wasm-friendly conditional imports; absorbed streaming primitives and authenticated URL downloads. Each addition slotted into the existing package model instead of forcing a public API reset. The FileSaver.saveAs(...) call signature is unchanged from the very first release.",
            product:
              "API stability became part of the product value. Five years and four major releases later, developers can still trust the package instead of relearning it. Adding new platforms and capabilities has been additive, not breaking.",
          },
        },
      ],
      metrics: [
        { label: "monthly downloads", value: "185k+", audience: "both" },
        { label: "likes on pub.dev", value: "491", audience: "both" },
        { label: "pub points", value: "140", audience: "both" },
        { label: "years active", value: "5", audience: "both" },
        { label: "current release", value: "v0.4.0", audience: "both" },
      ],
    },
    reflection: {
      engineering:
        "The architecture held, but the project needed stronger scaffolding earlier: tests, CI, contribution guidelines, and an explicit revisit when desktop support became real.",
      product:
        "As steward of a widely used package, I should have treated maintainer experience as product surface too. The API was simple for users, but the project was too dependent on one maintainer.",
    },
    prose:
      "On the eleventh of March, 2021, I published the first version of file_saver to pub.dev. It started as scratch for a project of my own. Flutter had no clean way to save a file that worked across web, iOS, Android, and desktop, and asking dev-users to add four packages for a single feature felt wrong.\n\nThe architectural call was to keep the abstraction monolithic. One package, one import — `FileSaver.saveAs(...)` — with platform-specific files inside, swapped at compile time via conditional imports: `dart:html` for web, `dart:io` for mobile, native channels for desktop. The alternative was the path_provider convention: a platform interface package and per-platform implementation packages. Architecturally cleaner, perhaps, but it would have asked every dev-user to add multiple packages for a single feature. I picked the dev ergonomic over the architectural purity.\n\nFive years on, the architecture has held. The package gets roughly 185,000 downloads a month, sits at 491 likes and 140 pub points, and is still under active maintenance. v0.4.0 shipped this May with Swift Package Manager support for iOS and macOS, streaming writes for both local files and authenticated URL downloads, Wasm-friendly conditional imports, native file-path copying that keeps large inputs out of Dart memory, and Android path-traversal hardening. Every one of those additions slotted into the existing package model. The `FileSaver.saveAs(...)` call signature is unchanged from the very first release.\n\nWhat I would do differently isn't the package — it's the scaffolding around it. Contribution guidelines and a maintainer policy should have been in place from day one; 185k monthly downloads is too much usage for a single bus factor to carry. Tests and CI should have shipped with the first commit, so updates land with confidence rather than caution. And when desktop platforms arrived, I should have explicitly revisited whether the monolithic structure still made sense, rather than letting it absorb them by default.\n\nThe architectural call was right. The discipline around it was the part that needed more from me.",
  },
];
