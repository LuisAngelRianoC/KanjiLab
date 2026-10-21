import type { KanjiListName } from '../../types/kanji';
import type { ChallengeKind } from './types';

export type LevelId = 'n5' | 'n4' | 'n3' | 'n2' | 'n1';

export interface LevelConfig {
  id: LevelId;
  /** Etiqueta corta (N5, N4...). */
  label: string;
  /** Nombre descriptivo. */
  title: string;
  /** Descripción para la interfaz. */
  description: string;
  /** Nivel numérico del JLPT (5 = más fácil). */
  jlpt: number;
  /**
   * Listas de la API que componen el pool acumulado del nivel.
   * El pool de N4 incluye los kanjis de N5, el de N3 los de N4, etc.
   */
  lists: KanjiListName[];
  /** Tipos de reto desbloqueados en este nivel. */
  challengeKinds: ChallengeKind[];
  /** Número de cartas del mazo. */
  cardCount: number;
  /** Color de acento del nivel. */
  color: string;
}

const JLPT_LISTS: Record<LevelId, KanjiListName[]> = {
  n5: ['jlpt-5'],
  n4: ['jlpt-5', 'jlpt-4'],
  n3: ['jlpt-5', 'jlpt-4', 'jlpt-3'],
  n2: ['jlpt-5', 'jlpt-4', 'jlpt-3', 'jlpt-2'],
  n1: ['jlpt-5', 'jlpt-4', 'jlpt-3', 'jlpt-2', 'jlpt-1'],
};

export const LEVELS: Record<LevelId, LevelConfig> = {
  n5: {
    id: 'n5',
    label: 'N5',
    title: 'Iniciación',
    description: 'Los 79 kanjis básicos del JLPT N5.',
    jlpt: 5,
    lists: JLPT_LISTS.n5,
    challengeKinds: ['meaning', 'glyph'],
    cardCount: 4,
    color: '#3F7A5E',
  },
  n4: {
    id: 'n4',
    label: 'N4',
    title: 'Elemental',
    description: 'N5 + 166 kanjis: ya aparecen las lecturas on.',
    jlpt: 4,
    lists: JLPT_LISTS.n4,
    challengeKinds: ['meaning', 'glyph', 'reading'],
    cardCount: 4,
    color: '#2C4A63',
  },
  n3: {
    id: 'n3',
    label: 'N3',
    title: 'Intermedio',
    description: 'Se desbloquean los kanjis que comparten lectura o significado.',
    jlpt: 3,
    lists: JLPT_LISTS.n3,
    challengeKinds: ['meaning', 'glyph', 'reading', 'sibling'],
    cardCount: 6,
    color: '#6C4A72',
  },
  n2: {
    id: 'n2',
    label: 'N2',
    title: 'Avanzado',
    description: 'Se desbloquean las palabras compuestas de dos kanjis.',
    jlpt: 2,
    lists: JLPT_LISTS.n2,
    challengeKinds: ['meaning', 'glyph', 'reading', 'sibling', 'compound'],
    cardCount: 6,
    color: '#B3382C',
  },
  n1: {
    id: 'n1',
    label: 'N1',
    title: 'Maestro',
    description: 'Todos los retos con el pool completo del JLPT.',
    jlpt: 1,
    lists: JLPT_LISTS.n1,
    challengeKinds: ['meaning', 'glyph', 'reading', 'sibling', 'compound'],
    cardCount: 6,
    color: '#8C2A21',
  },
};

export const LEVEL_ORDER: LevelId[] = ['n5', 'n4', 'n3', 'n2', 'n1'];

/** Etiquetas de los tipos de reto. */
export const CHALLENGE_LABELS: Record<ChallengeKind, string> = {
  meaning: 'Significado → Kanji',
  glyph: 'Kanji → Significado',
  reading: 'Lectura → Kanji',
  sibling: 'Kanji emparentado',
  compound: 'Palabra compuesta',
};

/** Descripción de cada tipo de reto para la interfaz. */
export const CHALLENGE_DESCRIPTIONS: Record<ChallengeKind, string> = {
  meaning: 'Arrastra el kanji que significa lo que pide el enunciado.',
  glyph: 'Arrastra el significado que corresponde al kanji mostrado.',
  reading: 'Arrastra el kanji que se lee como pide el enunciado.',
  sibling: 'Arrastra el kanji que comparte lectura o significado con el propuesto.',
  compound: 'Arrastra el significado de la palabra formada por los dos kanjis.',
};

/** Grados escolares disponibles en la API (`/v1/kanji/grade-N`). */
export const AVAILABLE_GRADES = [1, 2, 3, 4, 5, 6, 8] as const;
