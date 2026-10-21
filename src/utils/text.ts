import { KANJI_ES, translateWord } from '../data/meaningsEs';
import type { Kanji } from '../types/kanji';

/** Significado principal en español de un kanji. */
export function meaningEs(kanji: Kanji): string {
  const direct = KANJI_ES[kanji.kanji];
  if (direct) return direct;

  // Respaldo: se busca cualquier significado de la API que esté traducido.
  for (const meaning of kanji.meanings) {
    const translated = translateWord(meaning);
    if (translated) return translated;
  }

  return kanji.meanings[0] ?? kanji.heisig_en ?? '—';
}

/** Todos los significados de un kanji traducidos (en español cuando se puede). */
export function meaningsEs(kanji: Kanji): string[] {
  const direct = KANJI_ES[kanji.kanji];
  if (direct) return direct.split(' / ');

  const translated = kanji.meanings.map((m) => translateWord(m) ?? m);
  // Si ninguno se pudo traducir, se muestra el que más información aporta.
  const known = kanji.meanings.find((m) => translateWord(m));
  if (!known && kanji.heisig_en) {
    return [kanji.heisig_en, ...translated.slice(1)];
  }
  return translated;
}

/** Significado en español de un significado concreto de la API. */
export function translateMeaning(english: string): string {
  return translateWord(english) ?? english;
}

/** Conjunto normalizado de significados (para detectar kanjis ambiguos). */
export function meaningKeys(kanji: Kanji): Set<string> {
  return new Set(kanji.meanings.map((m) => m.trim().toLowerCase()));
}

/** Dos kanjis comparten significado si sus listas de significados se solapan. */
export function sharesMeaning(a: Kanji, b: Kanji): boolean {
  const keys = meaningKeys(a);
  return b.meanings.some((m) => keys.has(m.trim().toLowerCase()));
}

/** Lectura preferida: on (katakana) o kun (hiragana). */
export function primaryReading(kanji: Kanji, prefer: 'on' | 'kun'): string | null {
  const list = prefer === 'on' ? kanji.on_readings : kanji.kun_readings;
  const clean = list.filter((r) => r && !r.includes('.'));
  return clean[0] ?? list[0] ?? null;
}

/** Todas las lecturas (on + kun + de nombres) sin repeticiones. */
export function allReadings(kanji: Kanji): string[] {
  return [...new Set([...kanji.on_readings, ...kanji.kun_readings])].filter(Boolean);
}

/** Kanjis que comparten alguna lectura con el objetivo. */
export function sharedReading(target: Kanji, other: Kanji): string | null {
  const targetReadings = new Set(allReadings(target));
  for (const reading of allReadings(other)) {
    if (targetReadings.has(reading)) return reading;
  }
  return null;
}

/** Kanjis que comparten algún significado con el objetivo. */
export function sharedMeaningWord(target: Kanji, other: Kanji): string | null {
  const targetMeanings = new Set(target.meanings.map((m) => m.trim().toLowerCase()));
  for (const meaning of other.meanings) {
    if (targetMeanings.has(meaning.trim().toLowerCase())) return meaning;
  }
  return null;
}

/** Etiqueta legible del nivel de un kanji. */
export function gradeLabel(kanji: Kanji): string {
  if (kanji.grade === null) return '—';
  return kanji.grade === 8 ? '8 (Jōyō)' : `Grado ${kanji.grade}`;
}
