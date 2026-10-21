import { Box, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { LEVELS, LEVEL_ORDER, type LevelId } from '../../features/game/levels';

interface LevelSelectorProps {
  value: LevelId;
  onChange: (level: LevelId) => void;
}

/** Selector de nivel JLPT. */
export function LevelSelector({ value, onChange }: LevelSelectorProps) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Nivel
      </Typography>

      <ToggleButtonGroup
        exclusive
        value={value}
        onChange={(_, next: LevelId | null) => {
          if (next) onChange(next);
        }}
        size="small"
        aria-label="Nivel JLPT"
        sx={{
          '& .MuiToggleButtonGroup-grouped': {
            border: '1.6px solid',
            borderColor: 'divider',
            borderRadius: '8px !important',
            px: 2.25,
            py: 1,
            color: 'text.secondary',
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'rgba(18,17,23,0.04)' },
          },
        }}
      >
        {LEVEL_ORDER.map((id) => {
          const level = LEVELS[id];
          return (
            <Tooltip key={id} title={level.description} placement="bottom">
              <ToggleButton
                value={id}
                sx={{
                  fontWeight: 800,
                  '&.Mui-selected': {
                    bgcolor: level.color,
                    color: '#fff',
                    borderColor: level.color,
                    '&:hover': { bgcolor: level.color, opacity: 0.92 },
                  },
                }}
              >
                {level.label}
              </ToggleButton>
            </Tooltip>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
}

export default LevelSelector;
