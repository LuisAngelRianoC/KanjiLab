import { Box, Button, Stack, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import type { RoundResult } from '../../features/game/types';
import { KanjiGlyph } from '../common/KanjiGlyph';

interface FeedbackPanelProps {
  result: RoundResult;
  onNext: () => void;
  isLast?: boolean;
}

/** Mensaje de resultado tras responder, con la respuesta correcta. */
export function FeedbackPanel({ result, onNext, isLast = false }: FeedbackPanelProps) {
  const correct = result.correct;

  return (
    <Box
      sx={{
        mt: 2.5,
        p: 2,
        borderRadius: 2,
        border: '1.6px solid',
        borderColor: correct ? 'rgba(30,142,90,0.4)' : 'rgba(211,59,59,0.35)',
        bgcolor: correct ? 'rgba(30,142,90,0.06)' : 'rgba(211,59,59,0.05)',
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
        {correct ? (
          <CheckCircleRoundedIcon sx={{ color: 'success.main', fontSize: 30, mt: 0.25 }} />
        ) : (
          <CancelRoundedIcon sx={{ color: 'error.main', fontSize: 30, mt: 0.25 }} />
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {correct ? '¡Correcto!' : 'No era esa'}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {correct ? (
              <>
                Has ganado <strong>{result.points}</strong> puntos.
              </>
            ) : (
              <>
                La respuesta correcta era{' '}
                <Box
                  component="span"
                  sx={{
                    fontFamily: 'inherit',
                    fontWeight: 800,
                    color: 'text.primary',
                  }}
                >
                  «{result.answer}»
                </Box>
                .
              </>
            )}
          </Typography>

          {!correct && /[\u3000-\u9fff]/.test(result.answer) && (
            <Box sx={{ mt: 1.25 }}>
              <KanjiGlyph character={result.answer} size={50} />
            </Box>
          )}
        </Box>

        <Button variant="contained" onClick={onNext} sx={{ flexShrink: 0 }}>
          {isLast ? 'Ver resumen' : 'Siguiente'}
        </Button>
      </Stack>
    </Box>
  );
}

export default FeedbackPanel;
