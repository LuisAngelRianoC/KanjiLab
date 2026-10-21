/**
 * Utilidades para las lecturas de kanji.
 *
 * KANJIDIC (y por tanto kanjiapi.dev) marca la okurigana con un punto y el
 * final de una lectura con un guion: "さ.す", "あま-". Esos marcadores no
 * significan nada para quien está aprendiendo, así que se limpian antes de
 * mostrarse.
 */

/** Quita los marcadores de okurigana de una lectura. */
export function cleanReading(reading: string): string {
  return reading
    .replace(/[.．]/g, '')
    .replace(/-+$/, '')
    .replace(/^[-.．\s]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Limpia una lista de lecturas y elimina duplicados conservando el orden. */
export function cleanReadings(readings: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const reading of readings) {
    const clean = cleanReading(reading);
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    result.push(clean);
  }

  return result;
}

/**
 * Una lectura de un solo carácter (como "い") no aporta información real:
 * suele ser una lectura de nombres muy genérica. Se descartan.
 */
export function isInformativeReading(reading: string, romaji: string): boolean {
  if (reading.length > 1) return true;
  // "い" -> "i", "う" -> "u": vocal aislada, sin valor.
  return !['i', 'u', 'e', 'o', 'a'].includes(romaji.toLowerCase());
}
