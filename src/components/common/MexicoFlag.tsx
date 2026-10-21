import { Box } from '@mui/material';

/**
 * Bandera de México.
 *
 * Usa `public/icono.jpg` (generado con `make_flag.py`), que es la imagen de
 * la bandera sin bordes ni marco, solo a la dimensión correcta.
 */
export function MexicoFlag({ size = 40 }: { size?: number }) {
  return (
    <Box
      component="img"
      src="/icono.jpg"
      alt="Bandera de México"
      width={size}
      height={(size * 5) / 7}
      sx={{
        display: 'block',
        objectFit: 'cover',
        borderRadius: 0,
        border: 'none',
        boxShadow: 'none',
      }}
    />
  );
}

export default MexicoFlag;
