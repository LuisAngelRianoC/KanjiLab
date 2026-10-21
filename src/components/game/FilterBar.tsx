import { useMemo } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { AVAILABLE_GRADES } from '../../features/game/levels';
import type { GameFilters } from '../../features/game/types';
import type { Kanji } from '../../types/kanji';

interface FilterBarProps {
  filters: GameFilters;
  onChange: (filters: GameFilters) => void;
  /** Kanjis del nivel actual (sin filtros): permite contar cuántos hay por grado. */
  pool?: Kanji[];
}

/**
 * Filtros adicionales que la API de kanjiapi.dev permite aplicar:
 * grado escolar (`/v1/kanji/grade-N`) y kanjis Jōyō (`/v1/kanji/joyo`).
 *
 * Cada opción muestra cuántos kanjis del nivel actual pasarían el filtro, y
 * se desactiva las que dejarían el mazo vacío.
 */
export function FilterBar({ filters, onChange, pool = [] }: FilterBarProps) {
  const { gradeCounts, joyoCount } = useMemo(() => {
    const counts: Record<number, number> = {};
    let joyo = 0;

    for (const kanji of pool) {
      if (kanji.grade !== null && kanji.grade !== 9) {
        counts[kanji.grade] = (counts[kanji.grade] ?? 0) + 1;
        joyo += 1;
      }
    }

    return { gradeCounts: counts, joyoCount: joyo };
  }, [pool]);

  const total = pool.length;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <TuneRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        <Typography variant="overline" color="text.secondary">
          Filtros
        </Typography>
      </Box>

      <FormControl size="small" sx={{ minWidth: 168 }}>
        <InputLabel id="grade-label">Grado</InputLabel>
        <Select
          labelId="grade-label"
          label="Grado"
          value={filters.grade ?? 'all'}
          onChange={(event) => {
            const raw = event.target.value;
            onChange({ ...filters, grade: raw === 'all' ? null : Number(raw) });
          }}
          sx={{ borderRadius: 1.5, fontWeight: 600 }}
        >
          <MenuItem value="all">Todos ({total})</MenuItem>
          {AVAILABLE_GRADES.map((grade) => {
            const count = gradeCounts[grade] ?? 0;
            return (
              <MenuItem key={grade} value={grade} disabled={count === 0}>
                {grade === 8 ? 'Grado 8 (Jōyō)' : `Grado ${grade}`} · {count}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <Tooltip
        title={`Restringe el mazo a los kanjis Jōyō (${joyoCount} disponibles en este nivel)`}
      >
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={filters.joyoOnly}
              disabled={joyoCount === 0}
              onChange={(event) => onChange({ ...filters, joyoOnly: event.target.checked })}
            />
          }
          label={
            <Typography variant="body2">
              Solo Jōyō{joyoCount > 0 ? ` · ${joyoCount}` : ''}
            </Typography>
          }
        />
      </Tooltip>
    </Box>
  );
}

export default FilterBar;
