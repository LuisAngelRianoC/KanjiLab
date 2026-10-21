import { useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { Box, Stack, Typography } from '@mui/material';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import type { Challenge, GameCard, RoundResult } from '../../features/game/types';
import type { Kanji } from '../../types/kanji';
import { SectionCard } from '../common/SectionCard';
import { AnswerSlot, ANSWER_SLOT_ID } from './AnswerSlot';
import { ChallengePrompt } from './ChallengePrompt';
import { CardFace, type CardState } from './DraggableCard';
import { FeedbackPanel } from './FeedbackPanel';
import { HintCard } from './HintCard';
import { KanjiDeck } from './KanjiDeck';
import { KanjiInfoPanel } from './KanjiInfoPanel';
import { RelatedKanjiList } from './RelatedKanjiList';

interface GameBoardProps {
  challenge: Challenge;
  related: Kanji[];
  /** Carta ya colocada en la zona de respuesta. */
  placedCardId: string | null;
  /** Resultado de la ronda en curso (null si todavía no se ha respondido). */
  lastResult: RoundResult | null;
  /** Pistas ya reveladas. */
  hintsUsed: number;
  /** Coste en puntos de cada pista. */
  hintCost: number;
  onAnswer: (cardId: string) => void;
  onUseHint: (cost: number) => void;
  onNext: () => void;
  onInspect: (character: string) => void;
}

/** Tablero principal: enunciado, zona de respuesta, pistas, mazo e información. */
export function GameBoard({
  challenge,
  related,
  placedCardId,
  lastResult,
  hintsUsed,
  hintCost,
  onAnswer,
  onUseHint,
  onNext,
  onInspect,
}: GameBoardProps) {
  const [activeCard, setActiveCard] = useState<GameCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 130, tolerance: 8 } }),
  );

  const answered = Boolean(lastResult);
  const placed = challenge.cards.find((card) => card.id === placedCardId) ?? null;

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveCard(challenge.cards.find((card) => card.id === event.active.id) ?? null);
    },
    [challenge.cards],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCard(null);
      if (!event.over || event.over.id !== ANSWER_SLOT_ID) return;
      onAnswer(String(event.active.id));
    },
    [onAnswer],
  );

  /** Alternativa accesible: pulsar la carta la lleva a la zona de respuesta. */
  const handleSelect = useCallback(
    (card: GameCard) => {
      if (answered) return;
      onAnswer(card.id);
    },
    [answered, onAnswer],
  );

  /** Estado visual de cada carta según el resultado de la ronda. */
  const cardStates: Record<string, CardState> = {};
  for (const card of challenge.cards) {
    if (!answered) {
      cardStates[card.id] = 'idle';
      continue;
    }
    if (card.id === placedCardId) {
      cardStates[card.id] = lastResult?.correct ? 'correct' : 'wrong';
      continue;
    }
    if (card.label === challenge.answer) {
      cardStates[card.id] = 'correct';
      continue;
    }
    cardStates[card.id] = 'muted';
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveCard(null)}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
          },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* ── Columna principal: enunciado, respuesta, pistas y mazo ─────── */}
        <Stack spacing={3}>
          <SectionCard>
            <ChallengePrompt challenge={challenge} />
          </SectionCard>

          <SectionCard title="Tu respuesta" subtitle="Suelta la carta aquí o púlsala">
            <AnswerSlot
              placed={placed}
              correct={answered ? (lastResult?.correct ?? null) : null}
              disabled={answered}
            />

            {lastResult && <FeedbackPanel result={lastResult} onNext={onNext} />}
          </SectionCard>

          <SectionCard>
            <KanjiDeck
              cards={challenge.cards}
              cardStates={cardStates}
              disabled={answered}
              onSelect={handleSelect}
            />
          </SectionCard>
        </Stack>

        {/* ── Columna lateral: pistas, ficha y kanjis emparentados ─────────── */}
        <Stack spacing={3}>
          {!answered && (
            <HintCard
              key={challenge.id}
              kanji={challenge.target}
              challengeKind={challenge.kind}
              hintsUsed={hintsUsed}
              cost={hintCost}
              onUseHint={onUseHint}
            />
          )}

          {answered && challenge.target ? (
            <KanjiInfoPanel
              target={challenge.target}
              related={challenge.related}
              note={
                challenge.kind === 'compound'
                  ? `Palabra compuesta: ${challenge.prompt.join('')}`
                  : undefined
              }
            />
          ) : (
            <SectionCard
              title="Aprende mientras juegas"
              subtitle="Al responder verás la ficha completa del kanji"
              icon={<LightbulbRoundedIcon sx={{ color: 'warning.main' }} />}
            >
              <Typography variant="body2" color="text.secondary">
                Cada carta es un kanji del nivel que has elegido. Arrastra el que
                corresponde al enunciado y, al terminar, tendrás el significado,
                las lecturas on y kun, los trazos y los kanjis emparentados.
              </Typography>
            </SectionCard>
          )}

          <SectionCard title="Explora" subtitle="Kanjis que se parecen al de la ronda">
            <RelatedKanjiList kanjis={related} onSelect={onInspect} />
          </SectionCard>
        </Stack>
      </Box>

      <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
        {activeCard ? (
          <Box sx={{ transform: 'rotate(-2.5deg) scale(1.05)' }}>
            <CardFace card={activeCard} state="dragging" />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default GameBoard;
