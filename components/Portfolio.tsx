"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useTheme } from "./ThemeProvider";
import type { ThemeId } from "@/lib/types";

// Each skin is code-split into its own chunk via next/dynamic. Only the active
// theme's chunk loads — the initial bundle no longer ships all 31 skins (and
// their three.js / motion / animejs deps) up front. SSR stays on (default), so
// the active skin is still server-rendered for SEO and first paint.
//
// The Record<ThemeId, …> shape makes a missing/renamed theme a compile error,
// keeping this map in lockstep with the ThemeId union.
const SKINS: Record<ThemeId, ComponentType> = {
  decisionlog: dynamic(() => import("./skins/DecisionLog").then((m) => m.DecisionLog)),
  editorial: dynamic(() => import("./skins/Editorial").then((m) => m.Editorial)),
  twocolumn: dynamic(() => import("./skins/TwoColumns").then((m) => m.TwoColumns)),
  changelog: dynamic(() => import("./skins/Changelog").then((m) => m.Changelog)),
  terminal: dynamic(() => import("./skins/Terminal").then((m) => m.Terminal)),
  readingroom: dynamic(() => import("./skins/ReadingRoom").then((m) => m.ReadingRoom)),
  reel: dynamic(() => import("./skins/Reel").then((m) => m.Reel)),
  horizontalreel: dynamic(() => import("./skins/HorizontalReel").then((m) => m.HorizontalReel)),
  scene: dynamic(() => import("./skins/Scene").then((m) => m.Scene)),
  constellation: dynamic(() => import("./skins/Constellation").then((m) => m.Constellation)),
  orbitlab: dynamic(() => import("./skins/OrbitLab").then((m) => m.OrbitLab)),
  atelier: dynamic(() => import("./skins/Atelier").then((m) => m.Atelier)),
  peachstudio: dynamic(() => import("./skins/PeachStudio").then((m) => m.PeachStudio)),
  threltedocs: dynamic(() => import("./skins/ThrelteDocs").then((m) => m.ThrelteDocs)),
  starmap: dynamic(() => import("./skins/StarMap").then((m) => m.StarMap)),
  issueboard: dynamic(() => import("./skins/IssueBoard").then((m) => m.IssueBoard)),
  bookshelf: dynamic(() => import("./skins/Bookshelf").then((m) => m.Bookshelf)),
  keynote: dynamic(() => import("./skins/Keynote").then((m) => m.Keynote)),
  interactlab: dynamic(() => import("./skins/InteractLab").then((m) => m.InteractLab)),
  origami: dynamic(() => import("./skins/Origami").then((m) => m.Origami)),
  magnetictype: dynamic(() => import("./skins/MagneticType").then((m) => m.MagneticType)),
  glitchreel: dynamic(() => import("./skins/GlitchReel").then((m) => m.GlitchReel)),
  fieldreport: dynamic(() => import("./skins/FieldReport").then((m) => m.FieldReport)),
  prose: dynamic(() => import("./skins/Prose").then((m) => m.Prose)),
  gates: dynamic(() => import("./skins/Gates").then((m) => m.Gates)),
  inkflow: dynamic(() => import("./skins/InkFlow").then((m) => m.InkFlow)),
  aurora: dynamic(() => import("./skins/Aurora").then((m) => m.Aurora)),
  wormhole: dynamic(() => import("./skins/Wormhole").then((m) => m.Wormhole)),
  holowire: dynamic(() => import("./skins/HoloWire").then((m) => m.HoloWire)),
  shockwave: dynamic(() => import("./skins/Shockwave").then((m) => m.Shockwave)),
  aipromptbox: dynamic(() => import("./skins/AIPromptbox").then((m) => m.AIPromptbox)),
};

export function Portfolio() {
  const { theme } = useTheme();
  const Skin = SKINS[theme] ?? SKINS.decisionlog;
  return <Skin />;
}
