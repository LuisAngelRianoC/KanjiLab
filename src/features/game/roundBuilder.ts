import { COMPOUNDS, type Compound } from '../../data/compounds';
import type { Kanji } from '../../types/kanji';
import { pick, pickWeighted, sampleBy, shuffle, type Rng } from '../../utils/random';
import { toRomaji } from '../../utils/romaji';
import {
  allReadings,
  meaningEs,
  primaryReading,
  sharedMeaningWord,
  sharedReading,
  sharesMeaning,
} from '../../utils/text';
import { CHALLENGE_LABELS, type LevelConfig } from './levels';
import type { Challenge, ChallengeKind, GameCard } from './types';

let roundCounter = 0;

function nextRoundId(): string {
  roundCounter += 1;
  return `round-${roundCounter}`;
}

/**
 * Construye una ronda nueva a partir del pool de kanjis del nivel.
 * Devuelve `null` si el pool es demasiado pequeño para algún tipo de reto.
 */
export function buildChallenge(
  pool: Kanji[],
  level: LevelConfig,
  rng: Rng = Math.random,
): Challenge | null {
  if (pool.length < 3) return null;

  for (const kind of shuffle(level.challengeKinds, rng)) {
    const challenge = buildByKind(kind, pool, level, rng);
    if (challenge) return challenge;
  }

  return null;
}

function buildByKind(
  kind: ChallengeKind,
  pool: Kanji[],
  level: LevelConfig,
  rng: Rng,
): Challenge | null {
  switch (kind) {
    case 'meaning':
      return buildMeaning(pool, level, rng);
    case 'glyph':
      return buildGlyph(pool, level, rng);
    case 'reading':
      return buildReading(pool, level, rng);
    case 'sibling':
      return buildSibling(pool, level, rng);
    case 'compound':
      return buildCompound(pool, level, rng);
    default:
      return null;
  }
}

/** Crea las cartas de kanji a partir de una lista de kanjis. */
function toKanjiCards(kanjis: Kanji[]): GameCard[] {
  return kanjis.map((kanji, index) => ({
    id: `card-${index}-${kanji.kanji}`,
    display: 'kanji' as const,
    label: kanji.kanji,
    source: kanji,
  }));
}

/** ── Reto 1: significado → kanji ─────────────────────────────────────────── */
function buildMeaning(pool: Kanji[], level: LevelConfig, rng: Rng): Challenge | null {
  const target = pick(pool, rng);
  if (!target) return null;

  const label = meaningEs(target);
  if (!label) return null;

  // Los distractores no pueden compartir significado con la respuesta.
  const safe = pool.filter((k) => k.kanji !== target.kanji && !sharesMeaning(k, target));
  const others = pool.filter((k) => k.kanji !== target.kanji);
  const source = safe.length >= level.cardCount - 1 ? safe : others;
  if (source.length < level.cardCount - 1) return null;

  const distractors = sampleBy(
    source,
    level.cardCount - 1,
    (k) => Math.abs(k.stroke_count - target.stroke_count),
    rng,
  );

  const cards = toKanjiCards(shuffle([target, ...distractors], rng));

  return {
    id: nextRoundId(),
    kind: 'meaning',
    kindLabel: CHALLENGE_LABELS.meaning,
    instruction: `Arrastra el kanji que significa «${label}»`,
    detail: `${level.label} · ${target.stroke_count} trazos`,
    prompt: [],
    target,
    related: [],
    cards,
    answer: target.kanji,
  };
}

/** ── Reto 2: kanji → significado ─────────────────────────────────────────── */
function buildGlyph(pool: Kanji[], level: LevelConfig, rng: Rng): Challenge | null {
  const target = pick(pool, rng);
  if (!target) return null;

  const targetLabel = meaningEs(target);
  if (!targetLabel) return null;

  const used = new Set([targetLabel]);
  const distractors: Kanji[] = [];

  for (const kanji of shuffle(pool, rng)) {
    if (kanji.kanji === target.kanji) continue;
    const label = meaningEs(kanji);
    if (!label || used.has(label)) continue;
    used.add(label);
    distractors.push(kanji);
    if (distractors.length === level.cardCount - 1) break;
  }

  if (distractors.length < level.cardCount - 1) return null;

  const cards = shuffle([target, ...distractors], rng).map((kanji, index) => ({
    id: `card-${index}-${kanji.kanji}`,
    display: 'text' as const,
    label: meaningEs(kanji),
    source: kanji,
  }));

  return {
    id: nextRoundId(),
    kind: 'glyph',
    kindLabel: CHALLENGE_LABELS.glyph,
    instruction: `Arrastra el significado de ${target.kanji}`,
    detail: `${target.stroke_count} trazos · ${level.label}`,
    prompt: [target.kanji],
    target,
    related: [],
    cards,
    answer: targetLabel,
  };
}

/** ── Reto 3: lectura → kanji ─────────────────────────────────────────────── */
function buildReading(pool: Kanji[], level: LevelConfig, rng: Rng): Challenge | null {
  const readable = pool.filter((k) => primaryReading(k, 'on') ?? primaryReading(k, 'kun'));
  const target = pick(readable, rng);
  if (!target) return null;

  const reading = primaryReading(target, 'on') ?? primaryReading(target, 'kun');
  if (!reading) return null;

  const source = pool.filter(
    (k) => k.kanji !== target.kanji && !allReadings(k).includes(reading),
  );
  if (source.length < level.cardCount - 1) return null;

  const distractors = sampleBy(
    source,
    level.cardCount - 1,
    (k) => Math.abs(k.stroke_count - target.stroke_count),
    rng,
  );

  const cards = toKanjiCards(shuffle([target, ...distractors], rng));

  return {
    id: nextRoundId(),
    kind: 'reading',
    kindLabel: CHALLENGE_LABELS.reading,
    instruction: `Arrastra el kanji que se lee «${reading}»`,
    detail: toRomaji(reading) || level.label,
    prompt: [],
    target,
    related: [],
    cards,
    answer: target.kanji,
  };
}

/** ── Reto 4: kanji emparentado (misma lectura o mismo significado) ───────── */
function buildSibling(pool: Kanji[], level: LevelConfig, rng: Rng): Challenge | null {
  for (const target of shuffle(pool, rng)) {
    // 4a) mismo sonido
    for (const candidate of shuffle(pool, rng)) {
      if (candidate.kanji === target.kanji) continue;
      const reading = sharedReading(target, candidate);
      if (!reading) continue;

      const source = pool.filter(
        (k) => k.kanji !== target.kanji && k.kanji !== candidate.kanji && !allReadings(k).includes(reading),
      );
      if (source.length < level.cardCount - 1) continue;

      const distractors = sampleBy(source, level.cardCount - 1, () => 0, rng);
      const cards = toKanjiCards(shuffle([candidate, ...distractors], rng));

      return {
        id: nextRoundId(),
        kind: 'sibling',
        kindLabel: CHALLENGE_LABELS.sibling,
        instruction: `Arrastra el kanji que también se lee «${reading}» que ${target.kanji}`,
        detail: `misma pronunciación · ${level.label}`,
        prompt: [target.kanji],
        target,
        related: [candidate],
        cards,
        answer: candidate.kanji,
      };
    }

    // 4b) mismo significado
    for (const candidate of shuffle(pool, rng)) {
      if (candidate.kanji === target.kanji) continue;
      const meaning = sharedMeaningWord(target, candidate);
      if (!meaning) continue;

      const source = pool.filter(
        (k) => k.kanji !== target.kanji && k.kanji !== candidate.kanji && !sharesMeaning(k, target),
      );
      if (source.length < level.cardCount - 1) continue;

      const distractors = sampleBy(source, level.cardCount - 1, () => 0, rng);
      const cards = toKanjiCards(shuffle([candidate, ...distractors], rng));

      return {
        id: nextRoundId(),
        kind: 'sibling',
        kindLabel: CHALLENGE_LABELS.sibling,
        instruction: `Arrastra el kanji que también significa «${meaning}» que ${target.kanji}`,
        detail: `mismo significado · ${level.label}`,
        prompt: [target.kanji],
        target,
        related: [candidate],
        cards,
        answer: candidate.kanji,
      };
    }
  }

  return null;
}

/** ── Reto 5: palabra compuesta de dos kanjis ─────────────────────────────── */
function buildCompound(pool: Kanji[], level: LevelConfig, rng: Rng): Challenge | null {
  const poolChars = new Set(pool.map((k) => k.kanji));
  const available = COMPOUNDS.filter(
    (c) => c.jlpt >= level.jlpt && c.chars.every((ch) => poolChars.has(ch)),
  );
  if (available.length < 2) return null;

  // Se priorizan los compuestos del nivel actual y el inmediatamente inferior.
  const weights = available.map((c) => {
    if (c.jlpt === level.jlpt) return 4;
    if (c.jlpt === level.jlpt + 1) return 2;
    return 1;
  });

  const compound = pickWeighted(available, weights, rng);
  if (!compound) return null;

  const used = new Set([compound.meaningEs]);
  const distractors: Compound[] = [];

  for (const candidate of shuffle(available, rng)) {
    if (used.has(candidate.meaningEs)) continue;
    used.add(candidate.meaningEs);
    distractors.push(candidate);
    if (distractors.length === level.cardCount - 1) break;
  }

  if (distractors.length < level.cardCount - 1) return null;

  const byChar = new Map(pool.map((k) => [k.kanji, k]));
  const [first, second] = compound.chars;
  const firstKanji = byChar.get(first);
  const secondKanji = byChar.get(second);
  if (!firstKanji || !secondKanji) return null;

  const chosen = shuffle([compound, ...distractors], rng);
  const cards: GameCard[] = chosen.map((c, index) => ({
    id: `card-${index}-${c.chars.join('')}`,
    display: 'text' as const,
    label: c.meaningEs,
    caption: c.chars.join(''),
    source: byChar.get(c.chars[0]) ?? null,
  }));

  return {
    id: nextRoundId(),
    kind: 'compound',
    kindLabel: CHALLENGE_LABELS.compound,
    instruction: `Arrastra el significado de ${compound.chars.join(' + ')}`,
    detail: `${compound.chars.join('')} · ${compound.romaji}`,
    prompt: compound.chars,
    target: firstKanji,
    related: [secondKanji],
    cards,
    answer: compound.meaningEs,
  };
}

/**
 * Kanjis relacionados con el objetivo: comparten significado, lectura o
 * tienen un número de trazos parecido. Se usan para el panel "relacionados".
 */
export function findRelatedKanji(
  target: Kanji,
  pool: Kanji[],
  limit = 8,
): Kanji[] {
  const targetReadings = new Set(allReadings(target));
  const targetMeanings = new Set(target.meanings.map((m) => m.trim().toLowerCase()));

  const scored = pool
    .filter((k) => k.kanji !== target.kanji)
    .map((k) => {
      let score = 0;
      if (k.meanings.some((m) => targetMeanings.has(m.trim().toLowerCase()))) score += 6;
      if (allReadings(k).some((r) => targetReadings.has(r))) score += 3;
      score -= Math.abs(k.stroke_count - target.stroke_count) * 0.35;
      return { kanji: k, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.kanji);
}
