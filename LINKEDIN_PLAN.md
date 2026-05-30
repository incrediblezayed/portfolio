# LinkedIn Plan (Locked) — Hassan Ansari

**Goal:** Become known among senior mobile engineers, technical PMs, founders, and product teams as someone who understands the product cost of architectural decisions.

**Timeline:** 90 days. First review checkpoint: Thursday June 18, 2026, after roughly 30 days of profile activity and posting.

**Start date:** Sunday May 17, 2026 (profile surgery). First post: Tuesday May 19, 2026.

---

## 1. Identity

**Positioning:** Technical Product Manager for mobile infrastructure, realtime systems, and offline-first apps.

**Headline:**

> Senior Product Manager | Realtime & offline-first mobile products | Maintainer of file_saver for Flutter

**About section:**

> I work on mobile products where product decisions have technical consequences.
>
> Currently Senior Product Manager at Enso Webworks, working across realtime communication and offline-first productivity products. Before product, I spent 6 years building Flutter, Firebase, backend, and cross-platform systems as an engineer.
>
> My public work includes file_saver, a Flutter package for saving files across Android, iOS, web, Windows, macOS, and Linux. Maintaining it has shaped how I think about API design, platform edge cases, developer experience, backward compatibility, and boring reliability — the parts of product work that users only notice when they break.
>
> I write about:
>
> - mobile product trade-offs
> - rebuild vs patch decisions
> - realtime and offline-first architecture
> - open-source maintenance
> - moving from engineering to product without losing technical depth
>
> Based in Mumbai. Open to conversations around technical product roles, mobile product consulting, Flutter infrastructure, realtime systems, and developer-facing products.
>
> hassanansari222@gmail.com
> github.com/IncredibleZayed
> pub.dev/packages/file_saver

**Banner text:**

> Mobile product decisions. Technical consequences.

---

## 2. Sunday Profile Surgery — May 17, 2026 (75 min)

- [ ] Replace headline
- [ ] Replace About section
- [ ] Update Senior Product Manager role description
- [ ] Fix Senior Software Developer end date to May 2025
- [ ] Featured section (pinned, in this order):
  1. file_saver 0.4.0 launch/story post
  2. pub.dev link — title: _"file_saver — Flutter package, 0.4.0 shipped"_
  3. GitHub repo — title: _"Source — open issues, PRs welcome"_
- [ ] Top skills:
  - **Remove:** Android, iOS Development, Android Development
  - **Add:** Flutter, WebRTC, Real-time Communication, Offline-first Architecture, Open Source
- [ ] Verify email — pick one (gmail OR icloud), keep consistent across LinkedIn + portfolio
- [ ] Profile photo: plain background, head-and-shoulders, clear face, no sunglasses
- [ ] Update banner with text above

### Role description rewrites

**Senior Product Manager (Feb 2026 – Present):**

> Owning product on two consumer apps at Enso.
>
> InfoPhone — real-time chat, voice, and video. Led the decision to move away from a wrapped-vendor Flutter SDK once product requirements started hitting vendor ceilings. The rebuild moved core communication closer to native iOS/Android, ejabberd/XMPP for chat, LiveKit/WebRTC for calls, and a NestJS + Drizzle + Postgres backend.
>
> InfoToDo — offline-first tasks, notes, and reminders. Owning product and technical direction for a Flutter app built around local-first sync with PowerSync + Drift, backed by NestJS + TypeORM + Postgres and a Next.js admin surface. Initially outsourced; came back to close requirement gaps and reduce handoff ambiguity.
>
> I stay close to the stack. Most product calls I care about have technical consequences.

**Senior Software Developer (Oct 2024 – May 2025):**

> Built InfoProfile from the ground up with a four-developer team. Owned the BLoC wrapper, API handler, environment flavors, Firebase integrations, auth, notifications, and media flows. Backend on Node.js (Hapi) and MongoDB.

---

## 3. Cadence

- **2 posts/week** for 12 weeks
- **Tuesday + Thursday, 6:30 PM IST** (1:00 PM UTC — hits 9 AM US East, 2 PM CET, 6 AM US West)
- **Reasoning:** Full-time PM + active OSS + side projects. Daily would force filler; 2x/week protects depth.

---

## 4. Pillars

| Pillar                                               | Weight | Source material                                                                            |
| ---------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| **A. Open-source maintenance as product judgment**   | 45%    | file_saver — public, no confidentiality risk                                               |
| **B. Product calls with architectural consequences** | 40%    | InfoPhone rebuild, vendor SDK ceilings, offline-first decisions (public-safe framing only) |
| **C. Engineer-to-PM translation**                    | 15%    | Career narrative — glue, never the main niche                                              |

**Optional seasoning:** logistics/operations origin (verify factual specifics first) — max 1 post/quarter.

---

## 5. First 8 posts (Weeks 1-4)

| #   | Date       | Pillar | Hook                                                                                                                                                    |
| --- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Tue May 19 | A      | _"A file-saving package taught me a product lesson: boring reliability is only boring until it breaks."_                                                |
| 2   | Thu May 21 | B      | _"We had a working chat + voice + video build for InfoPhone. We still tore it out. Here's why."_                                                        |
| 3   | Tue May 26 | A      | _"file_saver used to load the payload into Dart memory before saving. That's fine for small files. It is not fine for an 800 MB export."_               |
| 4   | Thu May 28 | C      | _"I didn't move from engineering to PM because I wanted to stop building. I moved because the product decisions I cared about were already technical."_ |
| 5   | Tue Jun 2  | A      | _"Android scoped storage almost made me drop API < 30 support in file_saver. Here's the MediaStore quirk that ate two evenings."_                       |
| 6   | Thu Jun 4  | B      | _"Vendor SDKs are great until your roadmap starts asking permission."_                                                                                  |
| 7   | Tue Jun 9  | A      | _"file_saver is a file IO library. Nobody thinks of it as a security surface. Here's the path traversal vector 0.4.0 closes."_                          |
| 8   | Thu Jun 11 | B      | _"InfoPhone was a rebuild. It was the right call. Here's the version of the decision where patching would have been right instead."_                    |

**Post structure rule for all 8:**

1. What looked okay from outside
2. What broke under real use
3. What decision had to be made
4. What trade-off you accepted
5. What this taught you about mobile product work

No pure technical explainers. Every post must show decision pressure.

---

## 6. Posts 9-24 menu (Weeks 5-12 — pick weekly, don't pre-schedule)

- Off-main-thread Android writes
- LiveKit vs Janus decision
- SPM support for Flutter plugins
- Cross-platform file IO mental model (long-form reference piece)
- XMPP vs Matrix vs SaaS for chat
- Wasm-clean conditional imports
- NestJS + Drizzle for chat backend
- Group calling architecture (P2P vs SFU)
- macOS save cancellation bug
- Push notifications in XMPP
- WebRTC in Flutter, production gotchas
- Multi-year package versioning heuristics
- The engineering call that's actually a product call
- Vendor lock-in as PM problem
- Why I came back to InfoToDo (outsource handoff observation)
- Cross-platform file IO in 2026 (synthesis)

Treat as **menu, not syllabus.** Pick based on what feels alive each week.

---

## 7. Engagement strategy

**Cadence:** 8 comments/week. 4 after Tuesday post, 4 after Thursday post. **Zero daily grinding.**

**Core 8 accounts** (search by name on LinkedIn):

| Creator         | Why                                                                                 |
| --------------- | ----------------------------------------------------------------------------------- |
| Andrea Bizzotto | Code With Andrea, production Flutter, senior dev audience                           |
| Remi Rousselet  | Riverpod creator, sharp engineering crowd                                           |
| Felix Angelov   | bloc creator, maintainer-to-maintainer credibility                                  |
| Filip Hracek    | Ex-Google Flutter, signal into Google Flutter network                               |
| Majid Hajian    | Flutter Vikings organizer — register name before CFP 2027                           |
| Russ d'Sa       | CEO of LiveKit — almost nobody is doing Flutter + LiveKit at scale                  |
| Sean DuBois     | Pion / LiveKit, most active WebRTC engineer on LinkedIn                             |
| Shreyas Doshi   | Only on posts where you can add technical-decision-with-product-consequence example |

**Comment formula (2 sentences):**

1. Specific observation from your experience
2. Product/engineering implication or open question

**Rules:**

- Never "Great post!"
- Never link your own work in comments unless directly asked
- No emoji
- If creator replies, reply within 4 hours
- Reply to every meaningful comment on your own posts within 1 hour
- Skip audience loops where the majority of attention comes from junior career-switchers, unless the post directly overlaps with mobile architecture, open source, or technical product decisions

---

## 8. Weekly time budget

| Day     | Time   | Task                                   |
| ------- | ------ | -------------------------------------- |
| Mon     | 45 min | Draft Tuesday post                     |
| Tue     | 30 min | Edit + post 6:30 PM IST                |
| Tue     | 30 min | Reply to comments + 4 creator comments |
| Wed     | 45 min | Draft Thursday post                    |
| Thu     | 30 min | Edit + post 6:30 PM IST                |
| Thu     | 30 min | Reply + 4 creator comments             |
| Fri-Sun | —      | Off                                    |

**Total: 3 hours/week.**

---

## 9. Format mix

- **70% text posts** — your subject matter is decision-heavy, text is best for tension and judgment
- **20% carousels** — only when the idea has visual structure (decision checklists, before/after architecture, risk maps)
- **10% long-form articles** — one per month, durable reference pieces
- **0% polls** — first 60 days
- **0% video** — first 60 days; reassess after Day 60 signal review

**Carousel topics that work:**

- Patch vs Rebuild decision checklist
- Offline-first product risks PMs miss
- Vendor SDK risk map
- Realtime product promises (presence, delivery, recovery)

---

## 10. Face strategy

**Mostly faceless, lightly face-forward.**

- Strong, clear profile photo (already required)
- Posts text-first / code-screenshot-first / diagram-first
- Face appears occasionally for milestones, talks, events, transition posts
- No forced selfie content
- Reassess at Day 60 based on engagement data

---

## 11. First review checkpoint — Thursday June 18, 2026

Review after roughly 30 days of profile activity and posting.

Three questions only:

1. Did any senior engineer from the 8-account list comment on or react to any post?
2. Any DMs from technical founders, PMs, or hiring managers referencing a specific post?
3. Did profile views from director-level+ titles measurably increase?

**Decision rule:**

- **2+ yes** → continue as planned
- **0-1 yes** → don't redo strategy. Read top 3 vs bottom 3 hooks side-by-side, diagnose hook quality, adjust hooks only

Day 60 + Day 90: same three questions. **No replanning before Day 90.**

---

## 12. Metrics that matter

Track these, in order of importance:

1. **High-signal DMs** — tag mentally by source (file_saver, Flutter, PM role, consulting, speaking)
2. **Profile views from target titles** — CTOs, VPs of Engineering, Directors of Product, Senior PMs
3. **Comments from the right people** — 20-like post with senior comments > 300-like generic post
4. **Saves and reposts** — saves signal "I may need this later" — strong for technical content
5. **GitHub/pub.dev traffic correlation** — do deep-dive posts drive measurable spikes to file_saver?
6. **Repeat commenters** — same people returning = real audience forming

---

## 13. What to ignore

- ❌ Follower count targets
- ❌ Impression numbers as primary metric
- ❌ Daily posting pressure
- ❌ Adding video/face content before Day 60
- ❌ Polls in first 60 days
- ❌ Generic PM content ("stakeholder management is key", "5 lessons", "consistency beats motivation")
- ❌ Morning routines, productivity hacks, motivational content
- ❌ More AI strategy consultations
- ❌ Optimizing post time by ±15 minutes
- ❌ Naming direct reports publicly (Kishor, Shubham, Akash, Pratik) without their consent
- ❌ Vendor-bashing (describe constraint patterns, not vendor names)
- ❌ Internal company metrics or confidential numbers
- ❌ Pure technical explainers with no product decision attached

---

## 14. Tools

| Task             | Tool                                                                       |
| ---------------- | -------------------------------------------------------------------------- |
| Drafting         | Claude (best natural tone) or Gemini 3.1 Pro |
| Scheduling       | Native LinkedIn for now; revisit Buffer/Taplio if scaling past 2x/week     |
| Code screenshots | Carbon (carbon.now.sh) or Ray.so                                           |
| Diagrams         | Excalidraw                                                                 |
| Analytics        | LinkedIn native + Shield.is (optional paid)                                |
| Comment drafting | Do yourself — never AI-generated comments                                  |

---

## 15. Source synthesis

This plan merges:

- **Profile rewrite + 8-post calendar + Russ d'Sa/Sean DuBois engagement picks + skip-India-influencer-circuit:** Claude
- **Positioning frame ("Technical PM for mobile infra"), final headline, "use behavior not label", 8 comments/week, drop follower targets:** GPT
- **"Tools vs Decisions" reframe + "Audience Collision" diagnosis (as future post material):** Gemini

Hard decisions locked:

- 2 posts/week (not 4)
- file_saver first (public proof, no confidentiality risk)
- 12-week menu (not rigid syllabus)
- First review checkpoint on Thursday June 18, 2026, after roughly 30 days
- 90-day timeline (not 14, not 30)
- No replanning before Day 90

---

## 16. Next action

**Today (Thursday May 14, 2026):**

- [ ] Block 75 min Sunday May 17 morning on calendar for profile surgery
- [ ] Block Mon May 18, 45 min — draft Post 1
- [ ] Block Tue May 19, 6:30 PM IST — publish Post 1

**Done planning. Now ship.**
