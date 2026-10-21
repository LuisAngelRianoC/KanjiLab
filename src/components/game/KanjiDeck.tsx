import { Box, Typography } from '@mui/material';
import type { GameCard } from '../../features/game/types';
import { DraggableCard, type CardState } from './DraggableCard';

interface KanjiDeckProps {
  cards: GameCard[];
  /** Estado visual por carta. */
  cardStates: Record<string, CardState>;
  disabled?: boolean;
  onSelect: (card: GameCard) => void;
}

/** Mazo de cartas de las que el jugador arrastra la respuesta. */
export function KanjiDeck({ cards, cardStates, disabled = false, onSelect }: KanjiDeckProps) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Mazo · arrastra la carta correcta
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(auto-fit, minmax(132px, 1fr))',
          },
          gap: 1.5,
        }}
      >
        {cards.map((card) => (
          <DraggableCard
            key={card.id}
            card={card}
            disabled={disabled}
            state={cardStates[card.id] ?? 'idle'}
            onSelect={onSelect}
          />
        ))}
      </Box>
    </Box>
  );
}

export default KanjiDeck;
