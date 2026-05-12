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
import { Constellation } from "./skins/Constellation";
import { OrbitLab } from "./skins/OrbitLab";
import { Atelier } from "./skins/Atelier";
import { PeachStudio } from "./skins/PeachStudio";
import { ThrelteDocs } from "./skins/ThrelteDocs";
import { StarMap } from "./skins/StarMap";
import { IssueBoard } from "./skins/IssueBoard";
import { Bookshelf } from "./skins/Bookshelf";
import { Keynote } from "./skins/Keynote";
import { InteractLab } from "./skins/InteractLab";
import { Origami } from "./skins/Origami";
import { MagneticType } from "./skins/MagneticType";
import { GlitchReel } from "./skins/GlitchReel";
import { FieldReport } from "./skins/FieldReport";
import { Prose } from "./skins/Prose";
import { Gates } from "./skins/Gates";
import { InkFlow } from "./skins/InkFlow";
import { Aurora } from "./skins/Aurora";
import { Wormhole } from "./skins/Wormhole";
import { HoloWire } from "./skins/HoloWire";
import { Shockwave } from "./skins/Shockwave";

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
    case "constellation":
      return <Constellation />;
    case "orbitlab":
      return <OrbitLab />;
    case "atelier":
      return <Atelier />;
    case "peachstudio":
      return <PeachStudio />;
    case "threltedocs":
      return <ThrelteDocs />;
    case "starmap":
      return <StarMap />;
    case "issueboard":
      return <IssueBoard />;
    case "bookshelf":
      return <Bookshelf />;
    case "keynote":
      return <Keynote />;
    case "interactlab":
      return <InteractLab />;
    case "origami":
      return <Origami />;
    case "magnetictype":
      return <MagneticType />;
    case "glitchreel":
      return <GlitchReel />;
    case "fieldreport":
      return <FieldReport />;
    case "prose":
      return <Prose />;
    case "gates":
      return <Gates />;
    case "inkflow":
      return <InkFlow />;
    case "aurora":
      return <Aurora />;
    case "wormhole":
      return <Wormhole />;
    case "holowire":
      return <HoloWire />;
    case "shockwave":
      return <Shockwave />;
    default:
      return <DecisionLog />;
  }
}
