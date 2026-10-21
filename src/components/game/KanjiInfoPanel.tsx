import { Divider, Stack, Typography } from '@mui/material';
import type { Kanji } from '../../types/kanji';
import { SectionCard } from '../common/SectionCard';
import { KanjiFicha } from './KanjiFicha';

interface KanjiInfoPanelProps {
  /** Kanji principal de la ronda. */
  target: Kanji;
  /** Otros kanjis implicados en el reto (palabras compuestas, emparentados). */
  related?: Kanji[];
  /** Texto explicativo del reto. */
  note?: string;
}

/**
 * Panel con la información del kanji de la ronda. Aparece al responder
 * correcta o incorrectamente, para reforzar el aprendizaje.
 */
export function KanjiInfoPanel({ target, related = [], note }: KanjiInfoPanelProps) {
  return (
    <SectionCard title="Información del kanji" subtitle={note ?? 'Ficha completa de kanjiapi.dev'}>
      <KanjiFicha kanji={target} />

      {related.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="overline" color="text.secondary">
            Kanji relacionado
          </Typography>
          <Stack spacing={3} sx={{ mt: 1.5 }}>
            {related.map((kanji) => (
              <KanjiFicha key={kanji.kanji} kanji={kanji} compact />
            ))}
          </Stack>
        </>
      )}
    </SectionCard>
  );
}

export default KanjiInfoPanel;
