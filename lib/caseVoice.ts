import type {
  AudienceText,
  CaseAudienceTag,
  CaseReflection,
  CaseVoice,
  OptionRow,
} from "./types";

export function isForVoice(
  entry: { audience: CaseAudienceTag },
  voice: CaseVoice,
): boolean {
  return entry.audience === "both" || entry.audience === voice;
}

export function readVoice<T>(entry: AudienceText<T>, voice: CaseVoice): T {
  if (voice === "tech" && "tech" in entry.voices) return entry.voices.tech;
  if (voice === "product" && "product" in entry.voices)
    return entry.voices.product;
  throw new Error(`Missing ${voice} voice for ${entry.audience} content.`);
}

export function readCanonical<T>(
  entry: AudienceText<T>,
  preferred: CaseVoice = "product",
): T {
  if (preferred === "product" && "product" in entry.voices)
    return entry.voices.product;
  if (preferred === "tech" && "tech" in entry.voices) return entry.voices.tech;
  if ("product" in entry.voices) return entry.voices.product;
  return entry.voices.tech;
}

export function asParagraphs(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

export function readVoiceParagraphs(
  entry: AudienceText<string | string[]>,
  voice: CaseVoice,
): string[] {
  return asParagraphs(readVoice(entry, voice));
}

export function readCanonicalParagraphs(
  entry: AudienceText<string | string[]>,
  preferred: CaseVoice = "product",
): string[] {
  return asParagraphs(readCanonical(entry, preferred));
}

export function readOptionVoice(
  option: OptionRow,
  voice: CaseVoice,
): { label: string; rejection: string } {
  if (voice === "tech" && "tech" in option.voices) return option.voices.tech;
  if (voice === "product" && "product" in option.voices)
    return option.voices.product;
  throw new Error(`Missing ${voice} option voice for option ${option.letter}.`);
}

export function readOptionCanonical(
  option: OptionRow,
  preferred: CaseVoice = "product",
): { label: string; rejection: string } {
  if (preferred === "product" && "product" in option.voices)
    return option.voices.product;
  if (preferred === "tech" && "tech" in option.voices)
    return option.voices.tech;
  if ("product" in option.voices) return option.voices.product;
  return option.voices.tech;
}

export function readReflection(
  reflection: CaseReflection,
  voice: CaseVoice,
): string {
  return voice === "tech" ? reflection.engineering : reflection.product;
}
