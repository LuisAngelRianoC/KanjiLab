/** Utilidades de aleatoriedad (inyectables para poder testear). */

export type Rng = () => number;

/** Devuelve un número entero en [0, max). */
export function randomInt(max: number, rng: Rng = Math.random): number {
  return Math.floor(rng() * max);
}

/** Devuelve un elemento al azar del array. */
export function pick<T>(items: readonly T[], rng: Rng = Math.random): T | undefined {
  if (items.length === 0) return undefined;
  return items[randomInt(items.length, rng)];
}

/** Devuelve una copia barajada del array (algoritmo de Fisher-Yates). */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1, rng);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Toma `count` elementos distintos al azar, priorizando la similitud
 * (cuanto menor `distance`, antes se escogen).
 */
export function sampleBy<T>(
  items: readonly T[],
  count: number,
  distance: (item: T) => number,
  rng: Rng = Math.random,
): T[] {
  const pool = shuffle(items, rng);
  return pool
    .sort((a, b) => distance(a) - distance(b))
    .slice(0, count);
}

/** Selección ponderada. `weights` debe tener la misma longitud que `items`. */
export function pickWeighted<T>(
  items: readonly T[],
  weights: readonly number[],
  rng: Rng = Math.random,
): T | undefined {
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) return pick(items, rng);

  let threshold = rng() * total;
  for (let i = 0; i < items.length; i += 1) {
    threshold -= weights[i];
    if (threshold <= 0) return items[i];
  }
  return items[items.length - 1];
}
