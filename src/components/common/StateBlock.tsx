import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';

interface StateBlockProps {
  variant: 'loading' | 'error' | 'empty';
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Bloque unificado para los estados de carga, error y vacío. */
export function StateBlock({
  variant,
  title,
  description,
  actionLabel,
  onAction,
}: StateBlockProps) {
  if (variant === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          py: 8,
        }}
      >
        <CircularProgress size={38} thickness={4} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">{title}</Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  if (variant === 'error') {
    return (
      <Alert
        severity="error"
        sx={{ borderRadius: 2.5 }}
        action={
          actionLabel && onAction ? (
            <Button color="inherit" size="small" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : undefined
        }
      >
        <Typography variant="subtitle2">{title}</Typography>
        {description && (
          <Typography variant="body2" sx={{ mt: 0.25 }}>
            {description}
          </Typography>
        )}
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        py: 6,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default StateBlock;
