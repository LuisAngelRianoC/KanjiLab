import type { Kanji } from '../../types/kanji';
import type { LevelId } from './levels';
import type { Challenge, GameFilters, RoundResult } from './types';

export type GamePhase = 'loading' | 'ready' | 'answered' | 'empty' | 'error';

export interface GameState {
  phase: GamePhase;
  levelId: LevelId;
  filters: GameFilters;
  /** Kanjis disponibles con el nivel y los filtros actuales. */
  pool: Kanji[];
  /** Kanjis del nivel sin filtros (para contar cuántos hay de cada grado). */
  basePool: Kanji[];
  /** Reto actual. */
  challenge: Challenge | null;
  /** Pistas ya reveladas en la ronda actual. */
  hintsUsed: number;
  /** Carta que el jugador ha soltado en la zona de respuesta. */
  placedCardId: string | null;
  /** Resultado de la última respuesta. */
  lastAnswer: { cardId: string; correct: boolean } | null;
  /** Resultado de la ronda en curso (null si todavía no se ha respondido). */
  lastResult: RoundResult | null;
  score: number;
  streak: number;
  bestStreak: number;
  answered: number;
  correctCount: number;
  history: RoundResult[];
  error: string | null;
}

export const initialGameState: GameState = {
  phase: 'loading',
  levelId: 'n5',
  filters: { grade: null, joyoOnly: false },
  pool: [],
  basePool: [],
  challenge: null,
  hintsUsed: 0,
  placedCardId: null,
  lastAnswer: null,
  lastResult: null,
  score: 0,
  streak: 0,
  bestStreak: 0,
  answered: 0,
  correctCount: 0,
  history: [],
  error: null,
};

export type GameAction =
  | { type: 'level/change'; levelId: LevelId }
  | { type: 'filters/change'; filters: GameFilters }
  | { type: 'pool/loading' }
  | { type: 'pool/loaded'; pool: Kanji[]; basePool: Kanji[] }
  | { type: 'pool/error'; message: string }
  | { type: 'challenge/set'; challenge: Challenge }
  | { type: 'challenge/unavailable' }
  | { type: 'hint/use'; cost: number }
  | { type: 'answer'; cardId: string }
  | { type: 'next' }
  | { type: 'restart' };

/** Puntuación de una ronda: base + bonus por racha. */
export function scoreFor(streakBefore: number): number {
  return 100 + Math.min(streakBefore, 5) * 20;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'level/change': {
      if (action.levelId === state.levelId) return state;
      return {
        ...initialGameState,
        phase: 'loading',
        levelId: action.levelId,
        filters: state.filters,
      };
    }

    case 'filters/change': {
      return {
        ...state,
        phase: 'loading',
        filters: action.filters,
        challenge: null,
        placedCardId: null,
        lastAnswer: null,
        lastResult: null,
        streak: 0,
        error: null,
      };
    }

    case 'pool/loading':
      return {
        ...state,
        phase: 'loading',
        challenge: null,
        placedCardId: null,
        lastAnswer: null,
        lastResult: null,
        error: null,
      };

    case 'pool/loaded':
      return {
        ...state,
        phase: 'ready',
        pool: action.pool,
        basePool: action.basePool,
        error: null,
      };

    case 'pool/error':
      return {
        ...state,
        phase: 'error',
        challenge: null,
        error: action.message,
      };

    case 'challenge/set':
      return {
        ...state,
        phase: 'ready',
        challenge: action.challenge,
        placedCardId: null,
        lastAnswer: null,
        lastResult: null,
        hintsUsed: 0,
      };

    case 'challenge/unavailable':
      return { ...state, phase: 'empty', challenge: null };

    case 'hint/use': {
      if (state.phase !== 'ready') return state;
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        score: Math.max(0, state.score - action.cost),
      };
    }

    case 'answer': {
      if (state.phase !== 'ready' || !state.challenge) return state;

      const card = state.challenge.cards.find((c) => c.id === action.cardId);
      if (!card) return state;

      const correct = card.label === state.challenge.answer;
      const points = correct ? scoreFor(state.streak) : 0;
      const streak = correct ? state.streak + 1 : 0;

      const result: RoundResult = {
        challengeId: state.challenge.id,
        kind: state.challenge.kind,
        correct,
        chosen: card.label,
        answer: state.challenge.answer,
        target: state.challenge.target,
        points,
      };

      return {
        ...state,
        phase: 'answered',
        placedCardId: card.id,
        lastAnswer: { cardId: card.id, correct },
        lastResult: result,
        score: state.score + points,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        answered: state.answered + 1,
        correctCount: state.correctCount + (correct ? 1 : 0),
        history: [...state.history, result],
      };
    }

    case 'next':
      return {
        ...state,
        phase: 'ready',
        challenge: null,
        placedCardId: null,
        lastAnswer: null,
        lastResult: null,
        hintsUsed: 0,
      };

    case 'restart':
      return {
        ...state,
        phase: state.pool.length > 0 ? 'ready' : 'loading',
        challenge: null,
        placedCardId: null,
        lastAnswer: null,
        lastResult: null,
        hintsUsed: 0,
        score: 0,
        streak: 0,
        bestStreak: 0,
        answered: 0,
        correctCount: 0,
        history: [],
        error: null,
      };

    default:
      return state;
  }
}
