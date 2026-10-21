import { Box, Stack, Typography } from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';

interface ScoreboardProps {
  score: number;
  streak: number;
  bestStreak: number;
  answered: number;
  accuracy: number;
}

/** Marcador de la sesión: puntos, racha y precisión. */
export function Scoreboard({ score, streak, bestStreak, answered, accuracy }: ScoreboardProps) {
  return (
    <Stack direction="row" spacing={{ xs: 2, sm: 3.5 }} sx={{ alignItems: 'center' }}>
      <Stat label="Puntos" value={String(score)} />

      <Stat
        label="Racha"
        value={String(streak)}
        icon={streak > 0 ? <BoltRoundedIcon sx={{ fontSize: 18, color: 'warning.main' }} /> : undefined}
        highlight={streak > 0}
      />

      <Stat label="Mejor racha" value={String(bestStreak)} />

      <Stat label="Aciertos" value={`${answered ? accuracy : 0}%`} />
    </Stack>
  );
}

function Stat({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Box sx={{ minWidth: 58 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, lineHeight: 1.2 }}
      >
        {icon}
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          lineHeight: 1.2,
          fontWeight: 800,
          color: highlight ? 'warning.dark' : 'text.primary',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default Scoreboard;
