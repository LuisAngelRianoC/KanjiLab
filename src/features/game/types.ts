import type { Kanji } from '../../types/kanji';

/** Tipos de reto disponibles en el juego. */
export type ChallengeKind = 'meaning' | 'glyph' | 'reading' | 'sibling' | 'compound';

/** Filtros adicionales de la API que se aplican sobre el pool del nivel. */
export interface GameFilters {
  /** Filtra por grado escolar (`/v1/kanji/grade-N`). `null` = todos. */
  grade: number | null;
  /** Restringe a los kanjis Jōyō (`/v1/kanji/joyo`). */
  joyoOnly: boolean;
}

/** Una carta del mazo: contiene un kanji o un significado. */
export interface GameCard {
  /** Identificador único dentro de la ronda. */
  id: string;
  /** Qué muestra visualmente la carta. */
  display: 'kanji' | 'text';
  /** Texto principal de la carta. */
  label: string;
  /** Texto secundario opcional. */
  caption?: string;
  /** Kanji asociado, para poder abrir su ficha. */
  source: Kanji | null;
}

/** Un reto completo: enunciado, cartas y respuesta correcta. */
export interface Challenge {
  id: string;
  kind: ChallengeKind;
  /** Nombre legible del tipo de reto. */
  kindLabel: string;
  /** Instrucción principal. */
  instruction: string;
  /** Texto de apoyo (lectura, significado, etc.). */
  detail: string;
  /** Kanjis grandes del enunciado. */
  prompt: string[];
  /** Kanji principal de la ronda (el que se explica en el panel de información). */
  target: Kanji;
  /** Otros kanjis implicados en el reto. */
  related: Kanji[];
  /** Mazo de cartas. */
  cards: GameCard[];
  /** Texto de la respuesta correcta. */
  answer: string;
}

/** Resultado de una ronda ya respondida. */
export interface RoundResult {
  challengeId: string;
  kind: ChallengeKind;
  correct: boolean;
  chosen: string;
  answer: string;
  target: Kanji;
  points: number;
}
