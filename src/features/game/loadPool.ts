import { fetchEnrichedListCached, fetchKanjiListCached } from '../../services/kanjiApi';
import type { Kanji, KanjiListName } from '../../types/kanji';
import type { LevelConfig } from './levels';
import type { GameFilters } from './types';

export interface KanjiPool {
  /** Kanjis del nivel, sin filtros: sirve para contar cuántos hay de cada grado. */
  base: Kanji[];
  /** Kanjis del nivel con los filtros aplicados. */
  pool: Kanji[];
}

/**
 * Descarga el pool de kanjis del nivel aplicando los filtros de la API.
 *
 * - El nivel define qué listas se descargan (acumuladas: N4 incluye N5).
 * - El filtro de grado usa `/v1/kanji/grade-N`.
 * - El filtro Jōyō usa `/v1/kanji/joyo`.
 */
export async function loadKanjiPool(
  level: LevelConfig,
  filters: GameFilters,
): Promise<KanjiPool> {
  const lists = await Promise.all(level.lists.map((list) => fetchEnrichedListCached(list)));

  const seen = new Set<string>();
  const base = lists.flat().filter((kanji) => {
    if (seen.has(kanji.kanji)) return false;
    seen.add(kanji.kanji);
    return true;
  });

  let pool = base;

  if (filters.grade !== null) {
    const gradeChars = new Set(await fetchKanjiListCached(gradeList(filters.grade)));
    pool = pool.filter((kanji) => gradeChars.has(kanji.kanji));
  }

  if (filters.joyoOnly) {
    const joyoChars = new Set(await fetchKanjiListCached('joyo'));
    pool = pool.filter((kanji) => joyoChars.has(kanji.kanji));
  }

  return { base, pool };
}

function gradeList(grade: number): KanjiListName {
  return `grade-${grade}` as KanjiListName;
}
