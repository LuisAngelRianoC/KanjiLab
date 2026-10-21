import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { AppShell } from '../components/layout/AppShell';
import { StateBlock } from '../components/common/StateBlock';
import { GameBoard } from '../components/game/GameBoard';
import { KanjiDetailDialog } from '../components/game/KanjiDetailDialog';
import { FilterBar } from '../components/game/FilterBar';
import { LevelSelector } from '../components/game/LevelSelector';
import { Scoreboard } from '../components/game/Scoreboard';
import type { LevelId } from '../features/game/levels';
import { useGameSession } from '../features/game/useGameSession';
import { KanjiGlyph } from '../components/common/KanjiGlyph';

/** Rondas por sesión antes de mostrar el resumen. */
const SESSION_ROUNDS = 10;

/** Puntos que cuesta revelar una pista. */
const HINT_COST = 20;

const LEVEL_IDS = new Set<string>(['n5', 'n4', 'n3', 'n2', 'n1']);

function isLevelId(value: string): value is LevelId {
  return LEVEL_IDS.has(value);
}

/** Página principal del juego. */
export function GamePage() {
  // El nivel de la URL solo se aplica al entrar: si se releyera en cada
  // cambio, pulsar otro nivel lo devolvería al inicial.
  const [initialLevel] = useState<LevelId>(() => {
    const requested = new URLSearchParams(window.location.search).get('level');
    return requested && isLevelId(requested) ? requested : 'n5';
  });

  const session = useGameSession(initialLevel);
  const {
    state,
    level,
    related,
    accuracy,
    setLevel,
    setFilters,
    answer,
    useHint,
    nextRound,
    restart,
  } = session;

  const [inspected, setInspected] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const handleNext = () => {
    if (state.answered > 0 && state.answered % SESSION_ROUNDS === 0) {
      setSummaryOpen(true);
      return;
    }
    nextRound();
  };

  const handleRestart = () => {
    restart();
    setSummaryOpen(false);
  };

  const lastResult = state.lastResult;

  return (
    <AppShell>
      {/* ── Barra de control ─────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          gap: { xs: 2, md: 3 },
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Stack spacing={2.5}>
          <LevelSelector value={state.levelId} onChange={setLevel} />
          <FilterBar
            filters={state.filters}
            onChange={setFilters}
            pool={state.basePool}
          />
        </Stack>

        <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
          <Scoreboard
            score={state.score}
            streak={state.streak}
            bestStreak={state.bestStreak}
            answered={state.answered}
            accuracy={accuracy}
          />
          <Button
            variant="outlined"
            startIcon={<RestartAltRoundedIcon />}
            onClick={handleRestart}
            sx={{ borderColor: 'divider' }}
          >
            Reiniciar
          </Button>
        </Stack>
      </Box>

      {/* ── Contenido ─────────────────────────────────────────────────────── */}
      {state.phase === 'loading' && (
        <StateBlock
          variant="loading"
          title="Cargando kanjis de la API…"
          description={`Descargando las listas ${level.lists.join(', ')}`}
        />
      )}

      {state.phase === 'error' && (
        <StateBlock
          variant="error"
          title="No se pudo cargar el mazo"
          description={state.error ?? 'Error desconocido'}
          actionLabel="Reintentar"
          onAction={handleRestart}
        />
      )}

      {state.phase === 'empty' && (
        <StateBlock
          variant="empty"
          title="Ningún kanji cumple estos filtros"
          description={`El nivel ${level.label} tiene ${state.pool.length} kanjis${
            state.filters.grade !== null ? ` de grado ${state.filters.grade}` : ''
          }${state.filters.joyoOnly ? ' y solo Jōyō' : ''}. Prueba con otro nivel o quita los filtros.`}
          actionLabel="Quitar filtros"
          onAction={() => setFilters({ grade: null, joyoOnly: false })}
        />
      )}

      {(state.phase === 'ready' || state.phase === 'answered') && state.challenge && (
        <GameBoard
          challenge={state.challenge}
          related={related}
          placedCardId={state.placedCardId}
          lastResult={lastResult}
          hintsUsed={state.hintsUsed}
          hintCost={HINT_COST}
          onAnswer={answer}
          onUseHint={useHint}
          onNext={handleNext}
          onInspect={setInspected}
        />
      )}

      <KanjiDetailDialog character={inspected} onClose={() => setInspected(null)} />

      {/* ── Resumen de sesión ─────────────────────────────────────────────── */}
      <Dialog
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3, bgcolor: 'background.paper', backgroundImage: 'none' } },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="overline" color="text.secondary">
            Fin de la tanda
          </Typography>
          <Typography variant="h5" component="p">
            {state.correctCount} de {state.answered} correctas
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1.5,
              mb: 3,
            }}
          >
            <SummaryStat label="Puntuación" value={String(state.score)} />
            <SummaryStat label="Precisión" value={`${accuracy}%`} />
            <SummaryStat label="Mejor racha" value={String(state.bestStreak)} />
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          <Typography variant="overline" color="text.secondary">
            Kanjis que has practicado
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mt: 1.25,
              maxHeight: 180,
              overflowY: 'auto',
            }}
          >
            {state.history.map((result, index) => (
              <Box
                key={`${result.challengeId}-${index}`}
                title={`${result.target.kanji} · ${result.answer}`}
                sx={{
                  px: 0.75,
                  py: 0.4,
                  borderRadius: 1.5,
                  border: '1.6px solid',
                  borderColor: result.correct
                    ? 'rgba(30,142,90,0.4)'
                    : 'rgba(211,59,59,0.35)',
                  bgcolor: result.correct ? 'rgba(30,142,90,0.06)' : 'rgba(211,59,59,0.05)',
                }}
              >
                <KanjiGlyph character={result.target.kanji} size={22} />
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setSummaryOpen(false)}>Seguir jugando</Button>
          <Button variant="contained" startIcon={<RestartAltRoundedIcon />} onClick={handleRestart}>
            Nueva tanda
          </Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        textAlign: 'center',
        bgcolor: 'rgba(18,17,23,0.03)',
        border: '1.6px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Typography>
    </Box>
  );
}

export default GamePage;
