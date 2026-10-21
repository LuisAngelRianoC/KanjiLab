import { Box, Chip, Stack, Typography } from '@mui/material';
import type { Challenge } from '../../features/game/types';
import { palette } from '../../theme/theme';
import { KanjiGlyph } from '../common/KanjiGlyph';

interface ChallengePromptProps {
  challenge: Challenge;
}

/**
 * Enunciado del reto: qué hay que hacer y sobre qué kanji.
 *
 * El kanji que aparece en la frase se saca en un bloque con fondo propio para
 * que no quede pegado al texto (los ideogramas tienen un caja de línea mucho
 * más alta que las latinas).
 */
export function ChallengePrompt({ challenge }: ChallengePromptProps) {
  // Solo se resalta el kanji cuando hay uno: en las palabras compuestas se
  // muestran los dos en grande, más abajo.
  const emphasis = challenge.prompt.length === 1 ? challenge.prompt[0] : null;
  const index = emphasis ? challenge.instruction.indexOf(emphasis) : -1;

  const before = index >= 0 ? challenge.instruction.slice(0, index) : challenge.instruction;
  const after = index >= 0 && emphasis ? challenge.instruction.slice(index + emphasis.length) : '';

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label={challenge.kindLabel}
          size="small"
          sx={{
            bgcolor: palette.indigoSoft,
            color: palette.indigo,
            fontWeight: 800,
            letterSpacing: '0.03em',
          }}
        />
        <Chip
          label={challenge.detail}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 700, borderColor: 'divider', bgcolor: 'rgba(18,17,23,0.02)' }}
        />
      </Stack>

      <Typography
        variant="h4"
        component="p"
        sx={{
          fontSize: { xs: 22, sm: 28 },
          lineHeight: 1.45,
          fontWeight: 700,
          textWrap: 'balance',
        }}
      >
        {before}
        {emphasis && index >= 0 && (
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              mx: 0.75,
              px: 1,
              py: 0.25,
              borderRadius: 1.5,
              bgcolor: 'rgba(193,39,45,0.08)',
              border: '1.6px solid rgba(193,39,45,0.22)',
              lineHeight: 1.15,
              verticalAlign: 'baseline',
            }}
          >
            <KanjiGlyph character={emphasis} size={38} />
          </Box>
        )}
        {after}
      </Typography>

      {challenge.prompt.length > 1 && (
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2, sm: 3 },
            minHeight: 120,
            px: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(193,39,45,0.06), rgba(0,104,71,0.06))',
            border: '1.6px solid',
            borderColor: 'divider',
          }}
        >
          {challenge.prompt.map((character, index) => (
            <KanjiGlyph
              key={`${character}-${index}`}
              character={character}
              size={92}
              sx={{ color: 'text.primary' }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ChallengePrompt;
