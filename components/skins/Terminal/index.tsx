"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  cases,
  experience,
  philosophy,
  profile,
  projects,
  toolkit,
} from "@/content";
import {
  readCanonical,
  readCanonicalParagraphs,
  readReflection,
} from "@/lib/caseVoice";
import type { Case, ThemeId } from "@/lib/types";
import { THEME_ORDER, isThemeId } from "@/lib/themes";
import { COLOR_MODES, useTheme } from "../../ThemeProvider";
import type { ColorMode } from "../../ThemeProvider";
import styles from "./Terminal.module.css";

function isColorMode(value: string): value is ColorMode {
  return (COLOR_MODES as readonly string[]).includes(value);
}

const ALL_AUTOCOMPLETE: string[] = [
  // bash-style (preferred)
  "help",
  "about",
  "work",
  "experience",
  "toolkit",
  "projects",
  "contact",
  "whoami",
  "sudo hire",
  "cv",
  "resume",
  "source",
  "skin ",
  "mode ",
  "theme ",
  "now",
  "uname",
  "date",
  "pwd",
  "principle",
  "fortune",
  "clear",
  "ls",
  "ls -la",
  "cat ",
  "echo ",
  "man ",
  "which ",
  "cd ",
  "exit",
  // slash-prefixed (also works)
  "/help",
  "/about",
  "/work",
  "/skin ",
  "/mode ",
  "/clear",
];

const PRIMARY_HINTS = ["help", "about", "work", "contact"];

type HistoryEntry = {
  id: string;
  command: string | null;
  output: ReactNode;
  tone?: "ok" | "error" | "system";
};

type CommandResult =
  | { kind: "output"; node: ReactNode; tone?: "ok" | "error" | "system" }
  | { kind: "clear" }
  | { kind: "switchSkin"; theme: ThemeId }
  | { kind: "switchMode"; mode: ColorMode }
  | { kind: "exit" };

export function Terminal() {
  const { setTheme, setColorMode } = useTheme();
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [exiting, setExiting] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState("");
  const [now, setNow] = useState(() => new Date());
  const idGen = useId();
  const counterRef = useRef(0);
  const historyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pushHistory = useCallback(
    (
      command: string | null,
      output: ReactNode,
      tone?: "ok" | "error" | "system",
    ) => {
      counterRef.current += 1;
      setHistory((prev) => [
        ...prev,
        { id: `${idGen}-${counterRef.current}`, command, output, tone },
      ]);
    },
    [idGen],
  );

  // Boot sequence — render system banner + a welcome prompt + a pre-run help
  useEffect(() => {
    pushHistory(null, <BootBanner />, "system");
    pushHistory(null, <BootStatus />, "system");
    pushHistory(null, <BootWelcome />, "system");
    pushHistory("help", <HelpOutput />);
    // Only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick clock for header + /now
  useEffect(() => {
    const id = globalThis.setInterval(() => setNow(new Date()), 1000);
    return () => globalThis.clearInterval(id);
  }, []);

  const ghost = useMemo(() => {
    if (!value) return "";
    const lower = value.toLowerCase();
    const match = ALL_AUTOCOMPLETE.find(
      (cmd) => cmd.startsWith(lower) && cmd !== lower,
    );
    return match ? match.slice(value.length) : "";
  }, [value]);

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      const result = parseCommand(trimmed);
      if (result.kind === "clear") {
        setHistory([]);
        return;
      }
      if (result.kind === "switchSkin") {
        pushHistory(
          trimmed,
          <span>
            switching skin to{" "}
            <span className={styles.amber}>{result.theme}</span>...
          </span>,
        );
        globalThis.setTimeout(() => setTheme(result.theme), 300);
        return;
      }
      if (result.kind === "switchMode") {
        pushHistory(
          trimmed,
          <span>
            color mode → <span className={styles.amber}>{result.mode}</span>
          </span>,
        );
        setColorMode(result.mode);
        return;
      }
      if (result.kind === "exit") {
        pushHistory(trimmed, <ExitFarewell />);
        setExiting(true);
        globalThis.setTimeout(() => setTheme(profile.defaultTheme), 1800);
        return;
      }
      pushHistory(trimmed, result.node, result.tone);
    },
    [pushHistory, setTheme, setColorMode],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab" && ghost) {
        e.preventDefault();
        setValue((prev) => prev + ghost);
        return;
      }
      // Right Arrow / End — accept the ghost suggestion when the caret is at
      // end of input (fish/zsh-autosuggestions behaviour). Otherwise let the
      // arrow key move the caret normally.
      if ((e.key === "ArrowRight" || e.key === "End") && ghost) {
        const input = e.currentTarget;
        const atEnd =
          input.selectionStart === value.length &&
          input.selectionEnd === value.length;
        if (atEnd) {
          e.preventDefault();
          setValue((prev) => prev + ghost);
          return;
        }
      }
      if (e.key === "ArrowUp") {
        const commands = history.filter((h) => h.command !== null);
        if (commands.length === 0) return;
        e.preventDefault();
        if (historyIndex === -1) setDraft(value);
        const next =
          historyIndex === -1
            ? commands.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(next);
        setValue(commands[next]!.command!);
        return;
      }
      if (e.key === "ArrowDown") {
        if (historyIndex === -1) return;
        e.preventDefault();
        const commands = history.filter((h) => h.command !== null);
        const next = historyIndex + 1;
        if (next >= commands.length) {
          setHistoryIndex(-1);
          setValue(draft);
        } else {
          setHistoryIndex(next);
          setValue(commands[next]!.command!);
        }
        return;
      }
      if (e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setHistory([]);
      }
    },
    [ghost, history, historyIndex, value, draft],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (exiting) return;
      runCommand(value);
      setValue("");
      setHistoryIndex(-1);
      setDraft("");
    },
    [value, runCommand, exiting],
  );

  // Always keep the latest entry visible. Use Layout effect so the scroll
  // happens before paint (no jumpy flicker).
  useLayoutEffect(() => {
    const el = historyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history.length]);

  // Focus the (invisible) input whenever the user clicks anywhere in the
  // terminal — a real terminal always captures keystrokes.
  const focusInput = useCallback(() => {
    if (exiting) return;
    inputRef.current?.focus();
  }, [exiting]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const uptime = formatUptime(now);

  return (
    <div className={styles.root} onClick={focusInput} role="presentation">
      <div className={styles.scanlines} aria-hidden="true" />

      <Header time={time} uptime={uptime} />

      <div
        ref={historyRef}
        className={styles.historyView}
        role="log"
        aria-live="polite"
      >
        <ol className={styles.history}>
          {history.map((entry) => (
            <li key={entry.id} className={styles.historyEntry}>
              {entry.command !== null ? (
                <p className={styles.historyCommand}>
                  <span className={styles.promptMark} aria-hidden="true">
                    $
                  </span>
                  <span>{entry.command}</span>
                </p>
              ) : null}
              <div
                className={
                  entry.tone === "error"
                    ? styles.historyOutputError
                    : entry.tone === "system"
                      ? styles.historyOutputSystem
                      : styles.historyOutput
                }
              >
                {entry.output}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <form
        className={styles.inputBar}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <label className={styles.commandLine}>
          <span className={styles.promptPath} aria-hidden="true">
            hassan@portfolio
          </span>
          <span className={styles.promptSeparator} aria-hidden="true">
            :
          </span>
          <span className={styles.promptCwd} aria-hidden="true">
            ~
          </span>
          <span className={styles.promptMark} aria-hidden="true">
            $
          </span>
          <span className={styles.typedWrapper}>
            <span className={styles.typed}>{value}</span>
            {ghost ? (
              <span className={styles.suggestionGhost} aria-hidden="true">
                {ghost}
              </span>
            ) : null}
            <span
              className={`${styles.blockCaret} ${exiting ? styles.caretSolid : ""}`}
              aria-hidden="true"
            />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={exiting}
            aria-label="Terminal command input"
            className={styles.invisibleInput}
          />
        </label>
        <p className={styles.hintBar}>
          <span>
            <kbd>tab</kbd> <kbd>→</kbd> autocomplete
          </span>
          <span>
            <kbd>↑↓</kbd> history
          </span>
          <span>
            <kbd>^L</kbd> clear
          </span>
          <span>
            try:{" "}
            {PRIMARY_HINTS.map((cmd, idx) => (
              <span key={cmd}>
                {idx > 0 ? " · " : null}
                <code>{cmd}</code>
              </span>
            ))}
          </span>
        </p>
      </form>
    </div>
  );
}

/* ─────────── HEADER ─────────── */

function Header({ time, uptime }: Readonly<{ time: string; uptime: string }>) {
  return (
    <header className={styles.terminalHeader}>
      <div className={styles.headerMeta}>
        <HeaderField label="SYS.NAME" value={`${slug(profile.name)}@portfolio`} />
        <HeaderField label="SYS.NODE" value="enso-webworks/mumbai" />
        <HeaderField label="UPTIME" value={uptime} />
        <HeaderField label="TIME" value={`${time} IST`} mono />
        <HeaderField label="TERMINAL" value="bash · 80×24" />
        <HeaderField label="STATUS" value={profile.availability.signal.toUpperCase()} ok />
      </div>
      <pre className={styles.headerAscii} aria-hidden="true">{`  ┌────────────────────────────────────────────────────────────┐
  │  HASSAN.ANSARI · TERMINAL v2.0 · type help to begin        │
  └────────────────────────────────────────────────────────────┘`}</pre>
    </header>
  );
}

function HeaderField({
  label,
  value,
  ok,
  mono,
}: Readonly<{ label: string; value: string; ok?: boolean; mono?: boolean }>) {
  return (
    <div className={styles.headerField}>
      <span className={styles.headerLabel}>{label}</span>
      <span
        className={`${styles.headerValue} ${ok ? styles.headerOk : ""} ${mono ? styles.headerMono : ""}`}
      >
        {ok ? <span className={styles.statusBlink} aria-hidden="true" /> : null}
        {value}
      </span>
    </div>
  );
}

/* ─────────── BOOT MESSAGES ─────────── */

function BootBanner() {
  return (
    <pre className={styles.banner} aria-hidden="true">{` ┌────────────────────────────────────────────────────────────┐
 │                                                            │
 │     H A S S A N   A N S A R I                              │
 │     ────────────────────────────────                       │
 │     portfolio.osr · shell v2.0 · 24 skins loaded           │
 │                                                            │
 └────────────────────────────────────────────────────────────┘`}</pre>
  );
}

function BootStatus() {
  return (
    <div className={styles.bootLines}>
      <p>
        <span className={styles.dimKey}>boot</span> portfolio.osr ·{" "}
        <span className={styles.amber}>OK</span>
      </p>
      <p>
        <span className={styles.dimKey}>load</span> content/profile.ts,
        content/cases.ts ·{" "}
        <span className={styles.amber}>OK</span>
      </p>
      <p>
        <span className={styles.dimKey}>warm</span> 24 skins, 3 in archive ·{" "}
        <span className={styles.amber}>OK</span>
      </p>
    </div>
  );
}

function BootWelcome() {
  return (
    <p className={styles.bootWelcome}>
      Welcome. This is {profile.name.toLowerCase()}&apos;s portfolio rendered as a
      shell. Try a command below — every section is a command.
    </p>
  );
}

/* ─────────── COMMAND PARSER ─────────── */

/**
 * Output handlers — each entry registers under BOTH `cmd` and `/cmd`
 * via `aliasOutputs()` below. Add new commands here, not in SIMPLE_COMMANDS.
 */
const OUTPUT_HANDLERS: Record<string, () => ReactNode> = {
  help: () => <HelpOutput />,
  about: () => <AboutOutput />,
  work: () => <WorkOutput />,
  experience: () => <ExperienceOutput />,
  toolkit: () => <ToolkitOutput />,
  projects: () => <ProjectsOutput />,
  contact: () => <ContactOutput />,
  whoami: () => <WhoamiOutput />,
  "sudo hire": () => <HireOutput />,
  cv: () => <CvOutput />,
  resume: () => <CvOutput />,
  source: () => <SourceOutput />,
  now: () => <NowOutput />,
  uname: () => <UnameOutput />,
  date: () => <DateOutput />,
  pwd: () => <span>/home/hassan/portfolio</span>,
  principle: () => <PrincipleOutput />,
  fortune: () => <FortuneOutput />,
  top: () => <TopOutput />,
  ls: () => <LsOutput />,
  "ls -la": () => <LsOutput long />,
  "ls -l": () => <LsOutput long />,
};

const SIMPLE_COMMANDS: Record<string, () => CommandResult> = (() => {
  const map: Record<string, () => CommandResult> = {};

  // Register every output handler under both `cmd` and `/cmd`.
  for (const [name, render] of Object.entries(OUTPUT_HANDLERS)) {
    const handler = (): CommandResult => ({ kind: "output", node: render() });
    map[name] = handler;
    map[`/${name}`] = handler;
  }

  // Clear / exit — same aliasing pattern.
  map["clear"] = () => ({ kind: "clear" });
  map["/clear"] = () => ({ kind: "clear" });
  map["exit"] = () => ({ kind: "exit" });
  map["/exit"] = () => ({ kind: "exit" });
  map["logout"] = () => ({ kind: "exit" });
  map["quit"] = () => ({ kind: "exit" });

  // Editor jokes.
  const escapeArt = (): CommandResult => ({
    kind: "output",
    node: <span>nice try. you can&apos;t escape that easily.</span>,
  });
  map["vim"] = escapeArt;
  map["nvim"] = escapeArt;
  map["emacs"] = () => ({
    kind: "output",
    node: <span>nice try. (also: emacs.)</span>,
  });
  map["nano"] = () => ({
    kind: "output",
    node: (
      <span>
        nano: nothing to edit here. try <code>cat &lt;case_id&gt;</code>.
      </span>
    ),
  });

  // Vim escape sequences — pretend they came in via :q/:wq
  const exitVim = (): CommandResult => ({
    kind: "output",
    node: <span>you weren&apos;t in vim. but the shell let you out anyway.</span>,
  });
  map[":q"] = exitVim;
  map[":q!"] = exitVim;
  map[":wq"] = exitVim;
  map[":x"] = exitVim;

  // Sudo without args — denied with a wink.
  map["sudo"] = () => ({
    kind: "output",
    node: (
      <span>
        sudo: a password is required. try <code>sudo hire</code>.
      </span>
    ),
    tone: "error",
  });

  // Joke commands.
  map["rm -rf /"] = () => ({
    kind: "output",
    node: (
      <span>
        rm: refusing to remove &quot;/&quot; without{" "}
        <code>--no-preserve-root</code>. (and even then, no.)
      </span>
    ),
    tone: "error",
  });
  map["rm -rf"] = map["rm -rf /"]!;
  map[":(){:|:&};:"] = () => ({
    kind: "output",
    node: <span>fork bomb intercepted. nice classic, though.</span>,
    tone: "error",
  });
  map["git status"] = () => ({
    kind: "output",
    node: (
      <pre className={styles.outputPre}>{`On branch main
Your branch is up to date with 'origin/main'.

Untracked decisions:
  (use "git add" to start tracking them)
        the next bet
        another rewrite
        the third app rewrite that probably isn't worth it`}</pre>
    ),
  });
  map["git push"] = () => ({
    kind: "output",
    node: (
      <span>
        Everything up-to-date. <span className={styles.dimKey}>(in production, anyway.)</span>
      </span>
    ),
  });
  map["npm install"] = () => ({
    kind: "output",
    node: (
      <span>
        added 6 years of mobile dev in 0.04s.{" "}
        <span className={styles.dimKey}>2 vulnerabilities (legacy node_modules of the soul).</span>
      </span>
    ),
  });
  map["npm install hassan"] = map["npm install"]!;
  map["yarn"] = () => ({
    kind: "output",
    node: <span>yarn: already installed (in the toolkit).</span>,
  });
  map["coffee"] = () => ({
    kind: "output",
    node: <span>☕  brewing… ok. proceed.</span>,
  });
  map["sl"] = () => ({
    kind: "output",
    node: (
      <pre className={styles.outputPre}>{`      ____
     |    |__
     |____|_|
      o  o`}</pre>
    ),
  });
  map["hire me"] = () => ({ kind: "output", node: <HireOutput /> });
  map["hire"] = map["hire me"]!;

  return map;
})();

function parseCatCommand(trimmed: string): CommandResult {
  const id = trimmed.slice(4).trim().toLowerCase();
  const found = cases.find((c) => c.id === id || c.title.toLowerCase() === id);
  if (!found) {
    return {
      kind: "output",
      node: (
        <span>
          cat: <span className={styles.amber}>{id}</span>: no such case_id (try{" "}
          <code>ls</code>)
        </span>
      ),
      tone: "error",
    };
  }
  return { kind: "output", node: <CatOutput caseStudy={found} /> };
}

function stripPrefix(trimmed: string, prefixes: string[]): string {
  for (const prefix of prefixes) {
    if (trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
      return trimmed.slice(prefix.length).trim();
    }
  }
  return trimmed;
}

function parseSkinCommand(trimmed: string): CommandResult {
  const skinName = stripPrefix(trimmed, ["/skin ", "skin ", "theme "]).toLowerCase();
  if (isThemeId(skinName)) return { kind: "switchSkin", theme: skinName };
  return {
    kind: "output",
    node: (
      <span>
        unknown skin: <span className={styles.amber}>{skinName}</span>. try one
        of:{" "}
        <span className={styles.dimKey}>
          {THEME_ORDER.slice(0, 8).join(", ")}, …
        </span>
      </span>
    ),
    tone: "error",
  };
}

function parseModeCommand(trimmed: string): CommandResult {
  const modeName = stripPrefix(trimmed, ["/mode ", "mode "]).toLowerCase();
  if (isColorMode(modeName)) return { kind: "switchMode", mode: modeName };
  return {
    kind: "output",
    node: (
      <span>
        unknown mode: <span className={styles.amber}>{modeName}</span>. try one
        of: {COLOR_MODES.join(", ")}
      </span>
    ),
    tone: "error",
  };
}

function parseEchoCommand(trimmed: string): CommandResult {
  const text = trimmed.slice(5);
  return { kind: "output", node: <span>{text || " "}</span> };
}

function parseCdCommand(trimmed: string): CommandResult {
  const target = trimmed.slice(2).trim();
  if (!target || target === "~" || target === "/" || target === ".") {
    return {
      kind: "output",
      node: (
        <span>
          <span className={styles.dimKey}>(already at ~ — there is only one home.)</span>
        </span>
      ),
    };
  }
  return {
    kind: "output",
    node: (
      <span>
        cd: <span className={styles.amber}>{target}</span>: no such directory.
        try <code>ls</code> for what exists, or <code>/work</code> for cases.
      </span>
    ),
    tone: "error",
  };
}

function parseManCommand(trimmed: string): CommandResult {
  const cmd = trimmed.slice(4).trim().toLowerCase().replace(/^\//, "");
  if (!cmd) {
    return {
      kind: "output",
      node: <span>What manual page do you want? try <code>man help</code>.</span>,
    };
  }
  const description = MAN_PAGES[cmd];
  if (!description) {
    return {
      kind: "output",
      node: (
        <span>
          No manual entry for <span className={styles.amber}>{cmd}</span>. try{" "}
          <code>help</code> for the full list.
        </span>
      ),
      tone: "error",
    };
  }
  return {
    kind: "output",
    node: (
      <div className={styles.outputGrid}>
        <p>
          <span className={styles.amber}>NAME</span>
        </p>
        <p className={styles.outputDim}>{cmd} — {description.tagline}</p>
        <p>
          <span className={styles.amber}>SYNOPSIS</span>
        </p>
        <p className={styles.outputDim}>
          <code>{description.synopsis}</code>
        </p>
        <p>
          <span className={styles.amber}>DESCRIPTION</span>
        </p>
        <p className={styles.outputDim}>{description.body}</p>
      </div>
    ),
  };
}

function parseWhichCommand(trimmed: string): CommandResult {
  const cmd = trimmed.slice(6).trim().toLowerCase().replace(/^\//, "");
  if (!cmd) {
    return {
      kind: "output",
      node: <span>usage: <code>which &lt;command&gt;</code></span>,
    };
  }
  const known =
    cmd in OUTPUT_HANDLERS ||
    cmd === "clear" || cmd === "exit" || cmd === "cat" || cmd === "echo" ||
    cmd === "skin" || cmd === "mode" || cmd === "theme" || cmd === "man" ||
    cmd === "which" || cmd === "cd";
  return {
    kind: "output",
    node: known ? (
      <span>/usr/local/bin/{cmd}</span>
    ) : (
      <span className={styles.outputDim}>{cmd} not found.</span>
    ),
  };
}

function parseKillCommand(trimmed: string): CommandResult {
  const arg = trimmed.slice(5).trim();
  return {
    kind: "output",
    node: (
      <span>
        kill: <span className={styles.amber}>{arg || "?"}</span>: operation not
        permitted on a portfolio.
      </span>
    ),
    tone: "error",
  };
}

function parseCommand(input: string): CommandResult {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // Exact-match table first — covers both `cmd` and `/cmd` aliases.
  const simple = SIMPLE_COMMANDS[lower];
  if (simple) return simple();

  // Prefix-based commands (anything taking arguments).
  if (lower.startsWith("cat ")) return parseCatCommand(trimmed);
  if (lower.startsWith("/skin ") || lower.startsWith("skin ") || lower.startsWith("theme "))
    return parseSkinCommand(trimmed);
  if (lower.startsWith("/mode ") || lower.startsWith("mode "))
    return parseModeCommand(trimmed);
  if (lower.startsWith("echo ") || lower === "echo")
    return parseEchoCommand(trimmed);
  if (lower.startsWith("cd ") || lower === "cd")
    return parseCdCommand(trimmed);
  if (lower.startsWith("man ") || lower === "man")
    return parseManCommand(trimmed);
  if (lower.startsWith("which ") || lower === "which")
    return parseWhichCommand(trimmed);
  if (lower.startsWith("kill ") || lower === "kill")
    return parseKillCommand(trimmed);

  return {
    kind: "output",
    node: (
      <span>
        command not found: <span className={styles.amber}>{trimmed}</span> (try{" "}
        <code>help</code>)
      </span>
    ),
    tone: "error",
  };
}

const MAN_PAGES: Record<string, { tagline: string; synopsis: string; body: string }> = {
  help: {
    tagline: "list every command this terminal knows.",
    synopsis: "help",
    body: "Renders the full command index, with bash-style and slash-style aliases. Every section is a command.",
  },
  about: {
    tagline: "print a short bio + status.",
    synopsis: "about",
    body: "Name, role, location, email, availability signal, plus a paragraph of intro prose.",
  },
  work: {
    tagline: "list shipped case studies.",
    synopsis: "work",
    body: "Three cases, each with [SHIPPED]/[WIP] status. Use `cat <case_id>` for the full case file.",
  },
  ls: {
    tagline: "list case_ids in the working directory.",
    synopsis: "ls [-l] [-la]",
    body: "Without flags, prints case ids and short status. With `-l` or `-la`, prints long format with stack and date.",
  },
  cat: {
    tagline: "print the full content of a case.",
    synopsis: "cat <case_id>",
    body: "case_id is one of the ids from `ls`. Prints title, role, stack, bet, outcome, metrics, and reflections.",
  },
  skin: {
    tagline: "switch the portfolio skin.",
    synopsis: "skin <name>   (alias: theme <name>)",
    body: "Press 1-9 or W-J for keyboard shortcuts. The full list is in the Theme Switcher in the bottom-right corner.",
  },
  mode: {
    tagline: "switch color mode.",
    synopsis: "mode <default|light|dark>",
    body: "Some skins respect light/dark color mode overrides. Most ignore it.",
  },
  exit: {
    tagline: "leave the terminal and return to the canonical Decision Log.",
    synopsis: "exit   (aliases: quit, logout)",
    body: "Plays a brief farewell, then loads skin #1 — the canonical hiring-signal view.",
  },
  clear: {
    tagline: "wipe the history view.",
    synopsis: "clear   (or Ctrl+L)",
    body: "Removes everything from the scroll buffer. Does not reload state.",
  },
};

/* ─────────── COMMAND OUTPUTS ─────────── */

function HelpOutput() {
  return (
    <div className={styles.outputGrid}>
      <p className={styles.outputDim}>
        every command works with or without a leading <code>/</code>.
      </p>
      <p className={styles.outputSection}>
        <span className={styles.amber}>┌ portfolio</span>
      </p>
      <ul className={styles.helpList}>
        <li>
          <code>about</code> <span className={styles.dimKey}>bio · location · status</span>
        </li>
        <li>
          <code>work</code> <span className={styles.dimKey}>case studies — try <code>cat &lt;id&gt;</code> for a full read</span>
        </li>
        <li>
          <code>experience</code> <span className={styles.dimKey}>roles, reverse chronological</span>
        </li>
        <li>
          <code>toolkit</code> <span className={styles.dimKey}>engineering + product loadout</span>
        </li>
        <li>
          <code>projects</code> <span className={styles.dimKey}>open source + side work</span>
        </li>
        <li>
          <code>contact</code> <span className={styles.dimKey}>email, linkedin, github, pub.dev</span>
        </li>
        <li>
          <code>principle</code> <span className={styles.dimKey}>operating philosophy</span>
        </li>
        <li>
          <code>whoami</code> · <code>cv</code> · <code>source</code> · <code>sudo hire</code>
        </li>
      </ul>
      <p className={styles.outputSection}>
        <span className={styles.amber}>┌ filesystem</span>
      </p>
      <ul className={styles.helpList}>
        <li>
          <code>ls</code> <span className={styles.dimKey}>list cases (try <code>ls -la</code>)</span>
        </li>
        <li>
          <code>cat &lt;case_id&gt;</code> <span className={styles.dimKey}>print a single case</span>
        </li>
        <li>
          <code>pwd</code> · <code>cd</code> · <code>echo &lt;text&gt;</code>
        </li>
        <li>
          <code>man &lt;cmd&gt;</code> <span className={styles.dimKey}>manual page</span>
        </li>
        <li>
          <code>which &lt;cmd&gt;</code>
        </li>
      </ul>
      <p className={styles.outputSection}>
        <span className={styles.amber}>┌ system</span>
      </p>
      <ul className={styles.helpList}>
        <li>
          <code>skin &lt;name&gt;</code> <span className={styles.dimKey}>switch portfolio skin (alias: theme)</span>
        </li>
        <li>
          <code>mode &lt;default|light|dark&gt;</code>
        </li>
        <li>
          <code>now</code> · <code>date</code> · <code>uname</code> · <code>top</code> · <code>fortune</code>
        </li>
        <li>
          <code>clear</code> or <kbd>Ctrl</kbd>+<kbd>L</kbd> <span className={styles.dimKey}>wipe the screen</span>
        </li>
        <li>
          <code>exit</code> <span className={styles.dimKey}>return to canonical Decision Log</span>
        </li>
      </ul>
    </div>
  );
}

function AboutOutput() {
  return (
    <div className={styles.outputGrid}>
      <KV k="name" v={profile.name} accent />
      <KV k="role" v={profile.currentRole} />
      <KV k="location" v={profile.location} />
      <KV k="email" v={profile.email} link={`mailto:${profile.email}`} />
      <KV
        k="status"
        v={`${profile.availability.signal} — ${profile.availability.message}`}
        accent
      />
      <p className={styles.outputProse}>{profile.intro}</p>
    </div>
  );
}

function WorkOutput() {
  return (
    <div className={styles.outputGrid}>
      <p className={styles.outputDim}>
        three calls, three outcomes. type{" "}
        <code>cat &lt;case_id&gt;</code> for the full text.
      </p>
      <ul className={styles.workList}>
        {cases.map((c) => {
          const wip = /testing|in development|in-flight/i.test(c.meta.status);
          return (
            <li key={c.id}>
              <span className={styles.workCode}>
                case_{String(c.number).padStart(2, "0")}
              </span>
              <span className={styles.workId}>{c.id}</span>
              <span className={styles.workTitle}>
                — {c.title.toLowerCase()}
              </span>
              <span className={wip ? styles.statusWip : styles.statusShipped}>
                [{wip ? "WIP" : "SHIPPED"}]
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ExperienceOutput() {
  return (
    <div className={styles.outputGrid}>
      <p className={styles.outputDim}>roles · reverse chronological.</p>
      <ul className={styles.expList}>
        {experience.map((role) => (
          <li key={`${role.company}-${role.period}`}>
            <p className={styles.expHead}>
              <span className={styles.expPeriod}>{role.period}</span>
              <span className={styles.expCompany}>{role.company}</span>
              <span className={styles.dimKey}>:: {role.title.toLowerCase()}</span>
            </p>
            <p className={styles.outputProse}>{role.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ToolkitOutput() {
  return (
    <div className={styles.outputGrid}>
      <p className={styles.outputSection}>
        <span className={styles.amber}>┌ engineering</span>
      </p>
      <dl className={styles.kvList}>
        {toolkit.engineering.map((group) => (
          <KV
            key={group.category}
            k={group.category.toLowerCase()}
            v={group.items.join(" · ")}
          />
        ))}
      </dl>
      <p className={styles.outputSection}>
        <span className={styles.amber}>┌ product</span>
      </p>
      <ul className={styles.bulletList}>
        {toolkit.product.map((entry) => (
          <li key={entry.category}>
            <span className={styles.bulletMark} aria-hidden="true">
              *
            </span>{" "}
            <strong>{entry.category}:</strong> {entry.headline}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectsOutput() {
  return (
    <div className={styles.outputGrid}>
      {projects.map((group) => (
        <div key={group.heading} className={styles.projGroup}>
          <p className={styles.outputSection}>
            <span className={styles.amber}>┌ {group.heading.toLowerCase()}/</span>
          </p>
          <ul className={styles.projList}>
            {group.projects.map((p) => (
              <li key={p.name}>
                <p className={styles.projName}>
                  <span className={styles.amber}>{p.name}</span>{" "}
                  <span className={styles.dimKey}>— {p.tagline}</span>
                </p>
                <p className={styles.outputDim}>
                  <span className={styles.dimKey}>stack</span> {p.stack}
                </p>
                <p className={styles.outputDim}>
                  <span className={styles.dimKey}>status</span> {p.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ContactOutput() {
  return (
    <div className={styles.outputGrid}>
      <KV k="email" v={profile.email} link={`mailto:${profile.email}`} />
      <KV
        k="linkedin"
        v={profile.socials.linkedin}
        link={profile.socials.linkedin}
      />
      <KV k="github" v={profile.socials.github} link={profile.socials.github} />
      <KV k="x" v={profile.socials.x} link={profile.socials.x} />
      <KV k="pub.dev" v={profile.socials.pubdev} link={profile.socials.pubdev} />
      <p className={styles.outputProse}>
        <span className={styles.amber}>&gt;</span>{" "}
        {profile.availability.message}
      </p>
    </div>
  );
}

function PrincipleOutput() {
  return (
    <div className={styles.outputGrid}>
      <p className={styles.outputDim}>{"// operating principle"}</p>
      {philosophy.quote.map((line, idx) => (
        <p key={line} className={styles.principleLine} data-index={idx}>
          <span className={styles.amber}>&gt;</span> {line}
        </p>
      ))}
    </div>
  );
}

function WhoamiOutput() {
  return (
    <div className={styles.outputGrid}>
      <p>
        <span className={styles.amber}>{slug(profile.name)}</span>
      </p>
      <p className={styles.outputDim}>
        full-stack mobile dev who became a product manager. flutter, native
        swift/kotlin, node, nestjs. currently shipping InfoPhone at Enso
        Webworks, plus Clickked as independent technical lead.
      </p>
      <p className={styles.outputDim}>
        author of file_saver on pub.dev — multi-year maintenance, real users,
        cross-platform.
      </p>
    </div>
  );
}

function HireOutput() {
  return (
    <div className={styles.outputGrid}>
      <pre className={styles.asciiInline} aria-hidden="true">
        {`  [sudo] password for hire:
  ✓ permission granted.`}
      </pre>
      <p className={styles.outputDim}>fastest way in:</p>
      <KV k="email" v={profile.email} link={`mailto:${profile.email}`} />
      <KV k="linkedin" v={profile.socials.linkedin} link={profile.socials.linkedin} />
      <p className={styles.outputDim}>{profile.availability.message}</p>
    </div>
  );
}

function CvOutput() {
  return (
    <div className={styles.outputGrid}>
      <p>
        opening cv at{" "}
        <a
          className={styles.link}
          href={profile.socials.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          {profile.socials.linkedin}
        </a>
      </p>
      <p className={styles.outputDim}>
        (full pdf coming to /resume.pdf — linkedin is canonical for now.)
      </p>
    </div>
  );
}

function SourceOutput() {
  return (
    <div className={styles.outputGrid}>
      <p>
        portfolio source:{" "}
        <a
          className={styles.link}
          href="https://github.com/IncredibleZayed/portfolio"
          target="_blank"
          rel="noreferrer"
        >
          github.com/IncredibleZayed/portfolio
        </a>
      </p>
      <p className={styles.outputDim}>
        Next.js 16 · React 19 · 24 skins, 3 archived. shell built with{" "}
        <code>anime.js</code> + raw r3f.
      </p>
    </div>
  );
}

function NowOutput() {
  const now = new Date();
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return (
    <div className={styles.outputGrid}>
      <KV k="local time" v={`${time} IST`} accent />
      <KV k="location" v={`${profile.location} · 19.0760°N 72.8777°E`} />
      <KV k="weather" v="warm, humid, monsoon-adjacent" />
    </div>
  );
}

function UnameOutput() {
  return (
    <pre className={styles.outputPre}>{`portfolio v6.0  shell-edition  build ${new Date().toISOString().slice(0, 10)}
kernel: react 19.2.4 · next 16.2.6
engine: r3f 9.6.1 + drei 10.7.7 + anime.js 4.4.1
24 skins online · 3 archived · built in mumbai
`}</pre>
  );
}

function LsOutput({ long = false }: Readonly<{ long?: boolean }>) {
  if (long) {
    return (
      <pre className={styles.outputPre}>{`total ${cases.length}
${cases
  .map((c) => {
    const wip = /testing|in development|in-flight/i.test(c.meta.status);
    const flag = wip ? "WIP " : "SHIP";
    const id = `case_${String(c.number).padStart(2, "0")}_${c.id}`;
    const date = c.meta.year;
    return `${flag}  hassan  ${date}  ${id.padEnd(28)} ${c.title}`;
  })
  .join("\n")}`}</pre>
    );
  }
  return (
    <ul className={styles.lsList}>
      {cases.map((c) => {
        const wip = /testing|in development|in-flight/i.test(c.meta.status);
        return (
          <li key={c.id}>
            <span className={styles.lsId}>
              case_{String(c.number).padStart(2, "0")}
            </span>
            <span className={styles.lsName}>{c.id}</span>
            <span className={wip ? styles.statusWip : styles.statusShipped}>
              [{wip ? "WIP" : "SHIPPED"}]
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function CatOutput({ caseStudy: c }: Readonly<{ caseStudy: Case }>) {
  return (
    <div className={styles.outputGrid}>
      <p className={styles.catTitle}>
        <span className={styles.amber}>{c.title}</span>{" "}
        <span className={styles.dimKey}>— {c.meta.role}</span>
      </p>
      <KV k="year" v={c.meta.year} />
      <KV k="stack" v={c.meta.stack} />
      <KV k="status" v={c.meta.status} />
      <p className={styles.outputSection}>
        <span className={styles.amber}>┌ bet</span>
      </p>
      <p className={styles.outputDim}>
        {c.bet.intro ? readCanonical(c.bet.intro, "tech") : c.summary}
      </p>
      <p className={styles.outputSection}>
        <span className={styles.amber}>┌ outcome</span>
      </p>
      <p className={styles.outputDim}>
        {readCanonicalParagraphs(c.outcome.paragraphs[0], "tech")[0]}
      </p>
      {c.outcome.metrics?.length ? (
        <ul className={styles.catMetrics}>
          {c.outcome.metrics.slice(0, 4).map((m) => (
            <li key={m.label}>
              <span className={styles.amber}>{m.value}</span>{" "}
              <span className={styles.dimKey}>{m.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className={styles.outputSection}>
        <span className={styles.amber}>┌ reflection</span>
      </p>
      <p className={styles.outputDim}>
        <span className={styles.amber}>[engineering]</span>{" "}
        {readReflection(c.reflection, "tech")}
      </p>
      <p className={styles.outputDim}>
        <span className={styles.amber}>[product]</span>{" "}
        {readReflection(c.reflection, "product")}
      </p>
    </div>
  );
}

function DateOutput() {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return <span>{day} · {time} IST</span>;
}

function FortuneOutput() {
  // Pick one principle as today's fortune; rotates by date so it feels deliberate.
  const idx = new Date().getDate() % philosophy.quote.length;
  const line = philosophy.quote[idx] ?? philosophy.quote[0] ?? "";
  return (
    <div className={styles.outputGrid}>
      <p className={styles.outputDim}>{"// fortune of the day"}</p>
      <p>
        <span className={styles.amber}>&gt;</span>{" "}
        <span className={styles.outputProse}>{line}</span>
      </p>
    </div>
  );
}

function TopOutput() {
  return (
    <pre className={styles.outputPre}>{`PID  USER    %CPU  %MEM  TIME    COMMAND
01   hassan  62.4  41.2  6y00m   ship native iOS rebuild
02   hassan  18.1  22.0  2y04m   maintain file_saver
03   hassan  14.8  19.6  --:--   prep next product call
04   hassan   4.7   8.3  --:--   write decision memos
05   hassan   ?    --:-- 0d00m   not take the next bet`}</pre>
  );
}

function ExitFarewell() {
  return (
    <pre className={styles.asciiInline} aria-hidden="true">{`  ┌─────────────────────────────────────┐
  │  process exited (0).                │
  │  thanks for poking around.          │
  │  returning to canonical view...     │
  └─────────────────────────────────────┘`}</pre>
  );
}

/* ─────────── PRIMITIVES ─────────── */

function KV({
  k,
  v,
  link,
  accent,
}: Readonly<{ k: string; v: string; link?: string; accent?: boolean }>) {
  const value = link ? (
    <a href={link} target="_blank" rel="noreferrer" className={styles.link}>
      {v}
    </a>
  ) : (
    v
  );
  return (
    <div className={styles.row}>
      <dt>{k}</dt>
      <dd className={accent ? styles.amber : undefined}>{value}</dd>
    </div>
  );
}

/* ─────────── helpers ─────────── */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function slug(name: string): string {
  return name.toLowerCase().split(" ")[0] ?? "user";
}

const BOOT_TIME = Date.now();
function formatUptime(now: Date): string {
  const ms = now.getTime() - BOOT_TIME;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}
