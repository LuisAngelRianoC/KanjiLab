import { useMemo, useState } from 'react';
import { Box, Button, Chip, Divider, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { useKanjiEnrichment } from '../../hooks/useKanjiEnrichment';
import type { ChallengeKind } from '../../features/game/types';
import { RADICALS, RADICAL_NUMBERS } from '../../data/radicals';
import type { Kanji } from '../../types/kanji';
import { palette } from '../../theme/theme';
import { toRomaji } from '../../utils/romaji';
import { cleanReading } from '../../utils/readings';
import { primaryReading } from '../../utils/text';

interface HintCardProps {
  /** Kanji sobre el que se ofrecen las pistas. */
  kanji: Kanji;
  /** Tipo de reto: determina qué pistas no revelarían la respuesta. */
  challengeKind: ChallengeKind;
  /** Pistas ya reveladas en esta ronda. */
  hintsUsed: number;
  /** Puntos que cuesta cada pista. */
  cost: number;
  /** Avisa de que se ha gastado una pista. */
  onUseHint: (cost: number) => void;
  /** Impide pedir más pistas (ronda ya respondida). */
  disabled?: boolean;
}

interface Hint {
  label: string;
  text: string;
}

/**
 * Construye las pistas de un kanji.
 *
 * Las tres primeras salen de datos locales (radical, trazos y lectura), así
 * que están disponibles al instante; las demás llegan de Wiktionary.
 */
function buildHints(
  kanji: Kanji,
  enrichment: {
    words: { word: string; reading: string; romaji: string; meaning: string }[];
    etymology: string | null;
  },
  kind: ChallengeKind,
): Hint[] {
  const hints: Hint[] = [];

  // 1 · Estructura: radical y número de trazos (siempre disponible).
  const radical = RADICALS[kanji.kanji];
  const structure: string[] = [];
  if (radical) {
    const number = RADICAL_NUMBERS[radical];
    structure.push(`radical ${radical}${number ? ` (nº ${number})` : ''}`);
  }
  structure.push(`${kanji.stroke_count} trazos`);
  hints.push({ label: 'Estructura', text: structure.join(' · ') });

  // 2 · Palabras frecuentes que contienen el kanji.
  if (enrichment.words.length > 0) {
    const words = enrichment.words
      .slice(0, 3)
      .map((w) => (w.reading ? `${w.word} (${w.reading})` : w.word))
      .join(' · ');
    hints.push({ label: 'Aparece en', text: words });
  }

  // 3 · Lectura. En el reto de lectura la lectura ES la respuesta, así que
  //     no se ofrece.
  if (kind !== 'reading') {
    const reading = primaryReading(kanji, 'on') ?? primaryReading(kanji, 'kun');
    if (reading) {
      const clean = cleanReading(reading);
      const romaji = toRomaji(clean);
      hints.push({ label: 'Lectura', text: romaji ? `${clean} · ${romaji}` : clean });
    }
  }

  // 4 · Origen del carácter.
  if (enrichment.etymology) {
    hints.push({ label: 'Origen', text: enrichment.etymology });
  }

  return hints;
}

/**
 * Tarjeta de pistas. Cada pista cuesta puntos, así que el jugador decide si
 * le compensa arriesgar puntuación a cambio de información.
 */
export function HintCard({
  kanji,
  challengeKind,
  hintsUsed,
  cost,
  onUseHint,
  disabled = false,
}: HintCardProps) {
  const [open, setOpen] = useState(false);
  const { enrichment, loading } = useKanjiEnrichment(kanji.kanji, open);

  const list = useMemo(
    () => buildHints(kanji, enrichment ?? { words: [], etymology: null }, challengeKind),
    [kanji, enrichment, challengeKind],
  );

  const revealed = list.slice(0, hintsUsed);
  const next = list[hintsUsed];

  return (
    <Box
      sx={{
        border: '1.6px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 1.75,
          bgcolor: open ? palette.warningSoft : 'transparent',
          transition: 'background-color 160ms ease',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: 1.5,
            bgcolor: palette.warningSoft,
            color: palette.warning,
          }}
        >
          <LightbulbRoundedIcon fontSize="small" />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
            Pistas
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', lineHeight: 1.35 }}
          >
            {loading
              ? 'Buscando datos…'
              : !open
                ? `−${cost} pts por pista`
                : list.length > 0
                  ? `${list.length} disponibles · −${cost} pts cada una`
                  : 'Sin datos extra disponibles'}
          </Typography>
        </Box>

        <IconButton
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Ocultar pistas' : 'Abrir pistas'}
          aria-expanded={open}
          size="small"
          sx={{ flexShrink: 0, color: 'text.secondary' }}
        >
          {open ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
        </IconButton>
      </Box>

      {open && (
        <Box sx={{ px: 2.5, pb: 2.5 }}>
          <Divider sx={{ mb: 2 }} />

          {loading && (
            <Stack spacing={1}>
              <Skeleton variant="rounded" height={30} />
              <Skeleton variant="rounded" height={30} width="70%" />
            </Stack>
          )}

          {!loading && revealed.length > 0 && (
            <Stack spacing={1.25} sx={{ mb: 2 }}>
              {revealed.map((hint, index) => (
                <Box
                  key={hint.label}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 1.5,
                    bgcolor: 'rgba(18,17,23,0.03)',
                    border: '1.6px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Chip
                    label={index + 1}
                    size="small"
                    sx={{
                      height: 22,
                      minWidth: 22,
                      bgcolor: palette.ink,
                      color: '#fff',
                      fontWeight: 800,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="overline" color="text.secondary">
                      {hint.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.55 }}>
                      {hint.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}

          {!loading && next && (
            <Button
              fullWidth
              variant="outlined"
              disabled={disabled}
              onClick={() => onUseHint(cost)}
              sx={{ borderColor: 'divider' }}
            >
              Revelar otra pista (−{cost} pts)
            </Button>
          )}

          {!loading && !next && revealed.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Ya has visto todas las pistas disponibles.
            </Typography>
          )}

          {!loading && list.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No hay pistas extra para este kanji. Prueba con otro nivel o quita
              los filtros.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default HintCard;
