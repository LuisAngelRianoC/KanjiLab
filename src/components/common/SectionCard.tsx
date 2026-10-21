import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  /** Texto corto bajo el título. */
  subtitle?: string;
  /** Icono o elemento a la izquierda del título. */
  icon?: ReactNode;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  /** Padding interno. */
  padded?: boolean;
  /** Separador entre la cabecera y el contenido. */
  divided?: boolean;
}

/**
 * Tarjeta de contenido: superficie blanca con borde fino y sin sombra,
 * siguiendo el sistema visual de Preply.
 */
export function SectionCard({
  title,
  subtitle,
  icon,
  children,
  sx,
  padded = true,
  divided = true,
}: SectionCardProps) {
  return (
    <Box
      sx={{
        border: '1.6px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {title && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: padded ? 3 : 0,
            pt: padded ? 2.5 : 0,
            pb: 1.75,
          }}
        >
          {icon}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ lineHeight: 1.25 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {divided && title && (
        <Box sx={{ height: 1, bgcolor: 'divider', opacity: 0.7 }} />
      )}

      <Box
        sx={{
          px: padded ? 3 : 0,
          // Sin cabecera el contenido va centrado en la tarjeta: mismo
          // padding por los cuatro lados.
          py: padded ? (title ? 2.5 : 3) : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default SectionCard;
