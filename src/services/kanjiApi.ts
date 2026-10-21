import type { Kanji, KanjiListName } from '../types/kanji';
import { apiFetch } from './http';

/**
 * Cliente de https://kanjiapi.dev
 *
 * Endpoints documentados (https://kanjiapi.dev/#!/documentation):
 *  - GET /v1/kanji/{list}          → string[]   (lista de kanjis)
 *  - GET /v1/kanji/{list}-enriched  → kanji[]    (misma lista con los datos completos)
 *  - GET /v1/kanji/{character}      → kanji      (ficha de un kanji)
 *
 * Nota: la API no admite barra final en las rutas (`/v1/kanji/jlpt-5/` da 404).
 */

/** Lista de kanjis (solo caracteres) según la categoría pedida. */
export function fetchKanjiList(list: KanjiListName): Promise<string[]> {
  return apiFetch<string[]>(`/v1/kanji/${list}`);
}

/** Lista de kanjis con la ficha completa de cada uno. */
export function fetchEnrichedList(list: KanjiListName): Promise<Kanji[]> {
  return apiFetch<Kanji[]>(`/v1/kanji/${list}-enriched`);
}

/** Ficha completa de un kanji concreto. */
export function fetchKanji(character: string): Promise<Kanji> {
  return apiFetch<Kanji>(`/v1/kanji/${encodeURIComponent(character)}`);
}

const listCache = new Map<string, string[]>();
const enrichedCache = new Map<string, Kanji[]>();

/** Igual que `fetchKanjiList` pero memoiza el resultado en memoria. */
export async function fetchKanjiListCached(list: KanjiListName): Promise<string[]> {
  const cached = listCache.get(list);
  if (cached) return cached;

  const data = await fetchKanjiList(list);
  listCache.set(list, data);
  return data;
}

/** Igual que `fetchEnrichedList` pero memoiza el resultado en memoria. */
export async function fetchEnrichedListCached(list: KanjiListName): Promise<Kanji[]> {
  const cached = enrichedCache.get(list);
  if (cached) return cached;

  const data = await fetchEnrichedList(list);
  enrichedCache.set(list, data);
  return data;
}
