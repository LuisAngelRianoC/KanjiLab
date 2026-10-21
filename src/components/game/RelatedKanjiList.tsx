import { Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import type { Kanji } from '../../types/kanji';
import { palette } from '../../theme/theme';
import { KanjiGlyph } from '../common/KanjiGlyph';

interface RelatedKanjiListProps {
  kanjis: Kanji[];
  onSelect: (character: string) => void;
}

/** Kanjis emparentados con el de la ronda (misma lectura, mismo significado...). */
export function RelatedKanjiList({ kanjis, onSelect }: RelatedKanjiListProps) {
  if (kanjis.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Todavía no hay kanjis emparentados para esta ronda.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        Kanjis relacionados
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {kanjis.map((kanji) => (
          <Tooltip key={kanji.kanji} title={`Ver la ficha de ${kanji.kanji}`}>
            <Chip
              onClick={() => onSelect(kanji.kanji)}
              label={<KanjiGlyph character={kanji.kanji} size={26} />}
              sx={{
                width: 48,
                height: 48,
                bgcolor: palette.indigoSoft,
                border: '1.6px solid rgba(44,74,99,0.22)',
                borderRadius: 1.5,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(44,74,99,0.16)' },
                '&:focus-visible': { outline: '3px solid rgba(193,39,45,0.45)' },
              }}
            />
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}

export default RelatedKanjiList;
