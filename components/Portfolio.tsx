"use client";

import { useTheme } from "./ThemeProvider";
import { DecisionLog } from "./skins/DecisionLog";
import { Editorial } from "./skins/Editorial";
import { TwoColumns } from "./skins/TwoColumns";
import { Changelog } from "./skins/Changelog";
import { Terminal } from "./skins/Terminal";
import { ReadingRoom } from "./skins/ReadingRoom";
import { Reel } from "./skins/Reel";
import { HorizontalReel } from "./skins/HorizontalReel";
import { Scene } from "./skins/Scene";

export function Portfolio() {
  const { theme } = useTheme();
  switch (theme) {
    case "decisionlog":
      return <DecisionLog />;
    case "editorial":
      return <Editorial />;
    case "twocolumn":
      return <TwoColumns />;
    case "changelog":
      return <Changelog />;
    case "terminal":
      return <Terminal />;
    case "readingroom":
      return <ReadingRoom />;
    case "reel":
      return <Reel />;
    case "horizontalreel":
      return <HorizontalReel />;
    case "scene":
      return <Scene />;
    default:
      return <DecisionLog />;
  }
}
