import { useEffect, useState } from 'react';
import { fetchKanjiEnrichment, type KanjiEnrichment } from '../services/hintsApi';

const EMPTY: KanjiEnrichment = { words: [], etymology: null };

/**
 * Carga los datos de apoyo externos de un kanji **solo cuando hace falta**
 * (`enabled`), porque Wiktionary limita las peticiones por minuto.
 */
export function useKanjiEnrichment(kanji: string, enabled: boolean) {
  const [state, setState] = useState<{ key: string; data: KanjiEnrichment | null }>({
    key: '',
    data: null,
  });

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    fetchKanjiEnrichment(kanji)
      .then((data) => {
        if (active) setState({ key: kanji, data });
      })
      .catch(() => {
        if (active) setState({ key: kanji, data: EMPTY });
      });

    return () => {
      active = false;
    };
  }, [kanji, enabled]);

  const data = state.key === kanji && state.data ? state.data : null;
  const loading = enabled && data === null;

  return { enrichment: data, loading };
}
