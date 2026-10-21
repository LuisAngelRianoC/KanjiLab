import { Box, type SxProps, type Theme } from '@mui/material';
import { fonts } from '../../theme/fonts';

interface KanjiGlyphProps {
  /** Carácter(es) a mostrar. */
  character: string;
  /** Tamaño de fuente en píxeles. */
  size?: number;
  /** Ajustes extra de estilo. */
  sx?: SxProps<Theme>;
}

/**
 * Renderiza uno o varios kanjis con la tipografía japonesa del proyecto
 * (Shippori Mincho), que dibuja los trazos de forma mucho más legible que
 * una fuente latina genérica.
 */
export function KanjiGlyph({ character, size = 64, sx }: KanjiGlyphProps) {
  return (
    <Box
      component="span"
      sx={{
        fontFamily: fonts.jp,
        fontSize: `${size}px`,
        lineHeight: 1.1,
        fontWeight: 500,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        ...sx,
      }}
    >
      {character}
    </Box>
  );
}

export default KanjiGlyph;
