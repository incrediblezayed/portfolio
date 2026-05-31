"use client";

import { cases, philosophy, profile } from "@/content";
import { readOptionCanonical } from "@/lib/caseVoice";
import { animate, stagger } from "animejs";
import { useEffect, useRef } from "react";
import styles from "./Prose.module.css";

export function Prose() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || globalThis.window === undefined) return;
    const blocks = el.querySelectorAll(`[data-reveal]`);
    if (blocks.length === 0) return;
    blocks.forEach((b) => {
      (b as HTMLElement).style.opacity = "0";
      (b as HTMLElement).style.transform = "translateY(14px)";
    });
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target);
        if (visible.length === 0) return;
        animate(visible, {
          opacity: [0, 1],
          translateY: [14, 0],
          duration: 720,
          delay: stagger(60),
          ease: "out(2)",
        });
        visible.forEach((target) => observer.unobserve(target));
      },
      { threshold: 0.2 },
    );
    blocks.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, []);

  // Look up by id (not array position) so reordering cases.ts can't attach the
  // hardcoded prose below to the wrong case.
  const infophone = cases.find((c) => c.id === "infophone");
  const clickked = cases.find((c) => c.id === "clickked");
  const fileSaver = cases.find((c) => c.id === "file_saver");
  const infophoneBet = infophone
    ? readOptionCanonical(infophone.options.find((o) => o.selected) ?? infophone.options[0]!).label
    : "";
  const clickkedBet = clickked
    ? readOptionCanonical(clickked.options.find((o) => o.selected) ?? clickked.options[0]!).label
    : "";
  const fileSaverBet = fileSaver
    ? readOptionCanonical(fileSaver.options.find((o) => o.selected) ?? fileSaver.options[0]!).label
    : "";

  return (
    <main ref={rootRef} className={styles.root}>
      <article className={styles.letter}>
        <header className={styles.greeting} data-reveal>
          <p className={styles.hello}>Hi, I&apos;m Hassan.</p>
        </header>

        <section data-reveal>
          <p className={styles.paragraph}>
            I&apos;m a{" "}
            <strong className={styles.emphasis}>
              {profile.currentRole.split(",")[0]?.replace("Senior Product Manager", "Senior PM")}
            </strong>{" "}
            at Enso Webworks in {profile.location}. I spent six years before this
            shipping{" "}
            <Note text="Dart, native iOS, native Android, plus the backends behind them">
              Flutter + Node
            </Note>{" "}
            products. The product calls I care most about are usually the ones
            with technical consequences.
          </p>
        </section>

        <section data-reveal>
          <p className={styles.paragraph}>
            Right now I lead{" "}
            {infophone ? (
              <Note text={infophoneBet}>
                <em>{infophone.title}</em>
              </Note>
            ) : (
              "InfoPhone"
            )}{" "}
            — a real-time communication app we{" "}
            <strong className={styles.emphasis}>scrapped and rebuilt</strong>{" "}
            because every workaround we tried added more drag than it removed.
            The original Flutter + MirrorFly build was working in production. We
            killed it anyway: raw ejabberd for chat, LiveKit for calls, NestJS
            for the rest, and native iOS/Android shells.
          </p>
        </section>

        <section data-reveal>
          <p className={styles.paragraph}>
            On the same plate, I work on{" "}
            {clickked ? (
              <Note text={clickkedBet}>
                <em>{clickked.title}</em>
              </Note>
            ) : (
              "Clickked"
            )}{" "}
            — an offline-first productivity product where the synchronization
            model is the entire product. Both started as engineering projects in
            my head; they became product calls when the architecture had to
            survive scale.
          </p>
        </section>

        <section data-reveal>
          <p className={styles.paragraph}>
            Outside Enso, I maintain{" "}
            {fileSaver ? (
              <Note text={fileSaverBet}>
                <em>file_saver</em>
              </Note>
            ) : (
              "file_saver"
            )}{" "}
            — a cross-platform file-saving package for Flutter, on{" "}
            <a className={styles.link} href={profile.socials.pubdev} target="_blank" rel="noreferrer">
              pub.dev
            </a>
            . Multi-year maintenance, real users, occasionally a bug report I
            wish I had written code for properly the first time.
          </p>
        </section>

        <section data-reveal className={styles.philosophy}>
          <p className={styles.philosophyLead}>The working idea is simple:</p>
          {philosophy.quote.map((line, idx) => (
            <p key={line} className={styles.philosophyLine} data-index={idx}>
              {line}
            </p>
          ))}
        </section>

        <section data-reveal>
          <p className={styles.paragraph}>
            I&apos;m{" "}
            <strong className={styles.emphasis}>
              {profile.availability.message.toLowerCase().replace(".", "")}
            </strong>
            . If you have a hard call on the table — particularly one where the
            architecture matters, or where the team has to ship native after a
            cross-platform stack stops earning its keep — I&apos;d like to
            hear about it.
          </p>
        </section>

        <footer data-reveal className={styles.signOff}>
          <p className={styles.signLine}>— Hassan</p>
          <p className={styles.signMeta}>
            Mumbai · {profile.currentRole.split(",")[0]}
          </p>
        </footer>

        <nav data-reveal className={styles.links}>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.socials.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.socials.x} target="_blank" rel="noreferrer">
            x.com
          </a>
          <a href={profile.socials.pubdev} target="_blank" rel="noreferrer">
            pub.dev
          </a>
        </nav>
      </article>
    </main>
  );
}

function Note({
  text,
  children,
}: Readonly<{ text: string; children: React.ReactNode }>) {
  return (
    <span className={styles.note} tabIndex={0}>
      {children}
      <span className={styles.noteBubble} role="tooltip">
        {text}
      </span>
    </span>
  );
}
