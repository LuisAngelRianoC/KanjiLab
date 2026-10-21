import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useKanjiDetail } from '../../features/game/useGameSession';
import { KanjiGlyph } from '../common/KanjiGlyph';
import { KanjiFicha } from './KanjiFicha';

interface KanjiDetailDialogProps {
  /** Kanji a mostrar (null = cerrado). */
  character: string | null;
  onClose: () => void;
}

/** Ficha amplia de un kanji, cargada desde `/v1/kanji/{character}`. */
export function KanjiDetailDialog({ character, onClose }: KanjiDetailDialogProps) {
  return (
    <Dialog
      open={Boolean(character)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3, bgcolor: 'background.paper', backgroundImage: 'none' } },
      }}
    >
      {character && (
        <KanjiDetailContent key={character} character={character} onClose={onClose} />
      )}
    </Dialog>
  );
}

function KanjiDetailContent({
  character,
  onClose,
}: {
  character: string;
  onClose: () => void;
}) {
  const { kanji, loading, error } = useKanjiDetail(character);

  return (
    <>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 6 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary">
            Kanji
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <KanjiGlyph character={character} size={48} />
            <Typography variant="body2" color="text.secondary">
              {kanji?.meanings.join(', ')}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" size="small">
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 5 }}>
            <CircularProgress size={32} />
          </Box>
        )}

        {!loading && error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        {!loading && !error && kanji && <KanjiFicha kanji={kanji} />}
      </DialogContent>
    </>
  );
}

export default KanjiDetailDialog;
