import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { fetchKanji } from '../../services/kanjiApi';
import type { Kanji } from '../../types/kanji';
import { gameReducer, initialGameState } from './gameReducer';
import { LEVELS, type LevelId } from './levels';
import { loadKanjiPool } from './loadPool';
import { buildChallenge, findRelatedKanji } from './roundBuilder';
import type { GameFilters } from './types';

/**
 * Orquestador de la sesión de juego: carga el pool según el nivel y los
 * filtros, genera rondas y mantiene la puntuación.
 *
 * @param initialLevel Nivel con el que arranca la partida (p. ej. el que
 *   viene en la URL). Solo se aplica al inicio: si no, cualquier cambio
 *   manual de nivel se revertiría al parámetro de la URL.
 */
export function useGameSession(initialLevel: LevelId = 'n5') {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialGameState,
    levelId: initialLevel,
  });
  const level = LEVELS[state.levelId];

  // ── Carga del pool cuando cambia el nivel o los filtros ──────────────────
  useEffect(() => {
    let active = true;
    dispatch({ type: 'pool/loading' });

    loadKanjiPool(level, state.filters)
      .then(({ base, pool }) => {
        if (active) dispatch({ type: 'pool/loaded', pool, basePool: base });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message =
          error instanceof Error ? error.message : 'No se pudo contactar con kanjiapi.dev.';
        dispatch({ type: 'pool/error', message });
      });

    return () => {
      active = false;
    };
  }, [level, state.filters]);

  // ── Genera la siguiente ronda ─────────────────────────────────────────────
  useEffect(() => {
    if (state.phase !== 'ready' || state.challenge) return;

    const challenge = buildChallenge(state.pool, level);
    if (challenge) {
      dispatch({ type: 'challenge/set', challenge });
    } else {
      dispatch({ type: 'challenge/unavailable' });
    }
  }, [state.phase, state.challenge, state.pool, level]);

  // ── Acciones ──────────────────────────────────────────────────────────────
  const setLevel = useCallback((levelId: LevelId) => {
    dispatch({ type: 'level/change', levelId });
  }, []);

  const setFilters = useCallback((filters: GameFilters) => {
    dispatch({ type: 'filters/change', filters });
  }, []);

  const answer = useCallback((cardId: string) => {
    dispatch({ type: 'answer', cardId });
  }, []);

  const useHint = useCallback((cost: number) => {
    dispatch({ type: 'hint/use', cost });
  }, []);

  const nextRound = useCallback(() => {
    dispatch({ type: 'next' });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'restart' });
  }, []);

  // ── Datos derivados ───────────────────────────────────────────────────────
  const related = useMemo(() => {
    if (!state.challenge) return [];
    return findRelatedKanji(state.challenge.target, state.pool);
  }, [state.challenge, state.pool]);

  const accuracy =
    state.answered > 0 ? Math.round((state.correctCount / state.answered) * 100) : 0;

  return {
    state,
    level,
    related,
    accuracy,
    setLevel,
    setFilters,
    answer,
    useHint,
    nextRound,
    restart,
  };
}

/**
 * Ficha completa de un kanji suelto (para el detalle de kanjis relacionados).
 * Usa la API `/v1/kanji/{character}`.
 *
 * El componente que la usa debe montarse con `key={character}` para que al
 * cambiar de kanji se reinicie el estado de carga.
 */
export function useKanjiDetail(character: string) {
  const [kanji, setKanji] = useState<Kanji | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchKanji(character)
      .then((data) => {
        if (active) setKanji(data);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'No se pudo cargar el kanji.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [character]);

  return { kanji, loading, error };
}
