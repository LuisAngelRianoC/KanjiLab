import { Box, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import type { GameCard } from '../../features/game/types';
import { KanjiGlyph } from '../common/KanjiGlyph';

export const ANSWER_SLOT_ID = 'answer-slot';

interface AnswerSlotProps {
  /** Carta ya soltada en la zona (si la hay). */
  placed: GameCard | null;
  /** Si la respuesta era correcta. */
  correct?: boolean | null;
  disabled?: boolean;
}

/** Zona donde se suelta la carta con la respuesta. */
export function AnswerSlot({ placed, correct = null, disabled = false }: AnswerSlotProps) {
  const { isOver, setNodeRef } = useDroppable({ id: ANSWER_SLOT_ID, disabled });

  const borderColor = isOver
    ? 'rgba(193,39,45,0.75)'
    : correct === true
      ? 'rgba(30,142,90,0.8)'
      : correct === false
        ? 'rgba(211,59,59,0.8)'
        : 'rgba(18,17,23,0.22)';

  const background = isOver
    ? 'rgba(193,39,45,0.06)'
    : correct === true
      ? 'rgba(30,142,90,0.08)'
      : correct === false
        ? 'rgba(211,59,59,0.07)'
        : 'rgba(18,17,23,0.02)';

  return (
    <Box
      ref={setNodeRef}
      sx={{
        position: 'relative',
        minHeight: { xs: 160, sm: 180 },
        borderRadius: 2,
        border: '2px dashed',
        borderColor,
        backgroundColor: background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        px: 2,
        py: 3,
        textAlign: 'center',
        transition: 'border-color 160ms ease, background-color 160ms ease, transform 160ms ease',
        transform: isOver ? 'scale(1.012)' : 'none',
      }}
    >
      {placed ? (
        <>
          {placed.display === 'kanji' ? (
            <KanjiGlyph character={placed.label} size={76} />
          ) : (
            <Typography
              sx={{
                fontSize: { xs: 22, sm: 26 },
                fontWeight: 800,
                lineHeight: 1.25,
                maxWidth: 420,
              }}
            >
              {placed.label}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {placed.display === 'kanji' ? 'tu respuesta' : (placed.caption ?? 'tu respuesta')}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
            ZONA DE RESPUESTA
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suelta aquí la carta correcta
          </Typography>
        </>
      )}
    </Box>
  );
}

export default AnswerSlot;
