import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import type { Kanji } from '../../types/kanji';
import { toRomaji } from '../../utils/romaji';
import { cleanReadings, isInformativeReading } from '../../utils/readings';
import { RADICALS, RADICAL_NUMBERS } from '../../data/radicals';
import { gradeLabel, meaningsEs } from '../../utils/text';
import { KanjiGlyph } from '../common/KanjiGlyph';

interface KanjiFichaProps {
  kanji: Kanji;
  /** Muestra las lecturas de nombres propios. */
  compact?: boolean;
}

/** Ficha completa de un kanji: grafía, lecturas, significados y metadatos. */
export function KanjiFicha({ kanji, compact = false }: KanjiFichaProps) {
  const es = meaningsEs(kanji);
  const en = kanji.meanings;
  const radical = RADICALS[kanji.kanji] ?? null;
  const radicalNumber = radical ? RADICAL_NUMBERS[radical] : null;

  return (
    <Box>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            width: 112,
            height: 112,
            flexShrink: 0,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(140deg, rgba(193,39,45,0.08), rgba(0,104,71,0.08))',
            border: '1.6px solid',
            borderColor: 'divider',
          }}
        >
          <KanjiGlyph character={kanji.kanji} size={76} />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h5" sx={{ lineHeight: 1.25 }}>
            {es[0] ?? kanji.heisig_en}
          </Typography>
          {es.length > 1 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              {es.slice(1).join(' · ')}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
            En inglés: {en.join(', ')}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      <Stack spacing={2.25}>
        <ReadingRow label="On (katakana)" readings={kanji.on_readings} />
        <ReadingRow label="Kun (hiragana)" readings={kanji.kun_readings} />
        {!compact && <ReadingRow label="Nombres propios" readings={kanji.name_readings} />}
      </Stack>

      <Divider sx={{ my: 2.5 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(118px, 1fr))',
          gap: 1,
        }}
      >
        <Meta label="Trazos" value={String(kanji.stroke_count)} />
        <Meta
          label="Radical"
          value={
            radical
              ? `${radical}${radicalNumber ? ` (nº ${radicalNumber})` : ''}`
              : '—'
          }
        />
        <Meta label="Grado" value={gradeLabel(kanji)} />
        <Meta label="JLPT" value={kanji.jlpt ? `N${kanji.jlpt}` : '—'} />
        <Meta label="Unicode" value={`U+${kanji.unicode}`} mono />
        <Meta label="Heisig" value={kanji.heisig_en} />
        <Meta label="Frecuencia" value={String(kanji.freq_mainichi_shinbun)} />
      </Box>

      {kanji.notes.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {kanji.notes.map((note) => (
            <Typography key={note} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              • {note}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}

function ReadingRow({ label, readings }: { label: string; readings: string[] }) {
  const clean = cleanReadings(readings).filter((reading) =>
    isInformativeReading(reading, toRomaji(reading)),
  );

  if (clean.length === 0) return null;

  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.75, mt: 0.75 }}>
        {clean.map((reading) => {
          const romaji = toRomaji(reading);
          return (
            <Chip
              key={reading}
              label={romaji ? `${reading} · ${romaji}` : reading}
              size="small"
              variant="outlined"
              sx={{
                fontFamily: '"Noto Sans JP", sans-serif',
                borderColor: 'divider',
                bgcolor: 'rgba(18,17,23,0.02)',
                borderRadius: 1.5,
                height: 30,
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

function Meta({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: 1.5,
        bgcolor: 'rgba(18,17,23,0.03)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          fontFamily: mono ? '"JetBrains Mono", monospace' : 'inherit',
          fontSize: mono ? 13 : undefined,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default KanjiFicha;
