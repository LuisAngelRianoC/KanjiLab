import { ButtonBase, Box, Tooltip, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import type { GameCard } from '../../features/game/types';
import { fonts } from '../../theme/fonts';
import { KanjiGlyph } from '../common/KanjiGlyph';

/** Estado visual de una carta. */
export type CardState = 'idle' | 'dragging' | 'correct' | 'wrong' | 'muted';

interface DraggableCardProps {
  card: GameCard;
  /** Impide arrastrar la carta (ronda ya respondida). */
  disabled?: boolean;
  state?: CardState;
  /** Coloca la carta en la zona de respuesta (alternativa accesible al arrastre). */
  onSelect?: (card: GameCard) => void;
}

const STATE_STYLES: Record<CardState, { border: string; bg: string }> = {
  idle: { border: 'rgba(18,17,23,0.14)', bg: '#FFFFFF' },
  dragging: { border: 'rgba(193,39,45,0.5)', bg: '#FFFFFF' },
  correct: { border: 'rgba(30,142,90,0.75)', bg: 'rgba(30,142,90,0.08)' },
  wrong: { border: 'rgba(211,59,59,0.75)', bg: 'rgba(211,59,59,0.07)' },
  muted: { border: 'rgba(18,17,23,0.08)', bg: 'rgba(18,17,23,0.02)' },
};

/** Contenido visual de una carta (compartido por la carta y su overlay). */
export function CardFace({ card, state = 'idle' }: { card: GameCard; state?: CardState }) {
  const styles = STATE_STYLES[state];
  const isKanji = card.display === 'kanji';

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: 108, sm: 126 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        px: 1.5,
        py: 2,
        borderRadius: 2,
        border: '1.6px solid',
        borderColor: styles.border,
        bgcolor: styles.bg,
        transition: 'border-color 160ms ease, background-color 160ms ease',
      }}
    >
      {isKanji ? (
        <KanjiGlyph character={card.label} size={64} />
      ) : (
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: { xs: 17, sm: 19 },
            fontWeight: 700,
            lineHeight: 1.3,
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          {card.label}
        </Typography>
      )}

      {card.caption && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
          <KanjiGlyph character={card.caption} size={18} sx={{ color: 'text.secondary' }} />
          {card.source && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              {card.source.stroke_count} trazos
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

/** Carta del mazo: se arrastra con el ratón o con el dedo hasta la respuesta. */
export function DraggableCard({
  card,
  disabled = false,
  state = 'idle',
  onSelect,
}: DraggableCardProps) {
  const locked = state === 'correct' || state === 'wrong' || state === 'muted';

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
    disabled: disabled || locked,
  });

  return (
    <Tooltip
      title="Arrastra esta carta a la zona de respuesta"
      placement="top"
      disableHoverListener={disabled || locked}
    >
      <ButtonBase
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={() => onSelect?.(card)}
        disabled={disabled || locked}
        aria-label={
          card.display === 'kanji'
            ? `Kanji ${card.label}. Arrastra o pulsa para responder.`
            : `Significado ${card.label}. Arrastra o pulsa para responder.`
        }
        sx={{
          display: 'block',
          width: '100%',
          borderRadius: 2,
          cursor: disabled || locked ? 'default' : 'grab',
          touchAction: 'none',
          transition: 'transform 160ms ease, opacity 160ms ease',
          opacity: isDragging ? 0.3 : 1,
          '&:hover': disabled || locked
            ? undefined
            : {
                transform: 'translateY(-3px)',
                '& > div': { borderColor: 'rgba(193,39,45,0.55)' },
              },
          '&:focus-visible': {
            outline: '3px solid rgba(193,39,45,0.45)',
            outlineOffset: '3px',
          },
          '&.Mui-disabled': { color: 'inherit' },
        }}
      >
        <CardFace card={card} state={state} />
      </ButtonBase>
    </Tooltip>
  );
}

export default DraggableCard;
