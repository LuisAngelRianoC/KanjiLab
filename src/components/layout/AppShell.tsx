import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { KanjiGlyph } from '../common/KanjiGlyph';
import { MexicoFlag } from '../common/MexicoFlag';
import { palette } from '../../theme/theme';

interface AppShellProps {
  children: React.ReactNode;
  /** Oculta la barra superior (portada). */
  hideBar?: boolean;
}

/** Estructura general de la aplicación: barra superior + contenido. */
export function AppShell({ children, hideBar = false }: AppShellProps) {
  return (
    <Box sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
      {!hideBar && (
        <AppBar
          position="sticky"
          elevation={0}
          color="transparent"
          sx={{
            bgcolor: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1.6px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar sx={{ gap: 2, minHeight: { xs: 64, md: 72 } }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                borderRadius: 1.5,
                '&:focus-visible': { outline: '3px solid rgba(193,39,45,0.45)' },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 42,
                  height: 42,
                  borderRadius: 1.5,
                  bgcolor: palette.vermillion,
                  color: '#fff',
                }}
              >
                <KanjiGlyph character="漢" size={26} sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ lineHeight: 1.15 }}>
                  Kanji Lab
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.2, fontFamily: '"Noto Sans JP", sans-serif' }}
                >
                  漢字 · aprende jugando
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            <TooltipFlag />
          </Toolbar>
        </AppBar>
      )}

      <Container
        maxWidth="xl"
        component="main"
        sx={{ flex: 1, py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}
      >
        {children}
      </Container>
    </Box>
  );
}

/** Insignia con la bandera en la esquina superior derecha. */
function TooltipFlag() {
  return (
    <Box
      component="a"
      href="https://es.wikipedia.org/wiki/Bandera_de_M%C3%A9xico"
      target="_blank"
      rel="noreferrer noopener"
      title="Hecho en México 🇲🇽"
      aria-label="Bandera de México"
      sx={{
        display: 'block',
        lineHeight: 0,
        transition: 'transform 160ms ease',
        '&:hover': { transform: 'scale(1.06)' },
        '&:focus-visible': { outline: '3px solid rgba(193,39,45,0.45)', outlineOffset: 2 },
      }}
    >
      <MexicoFlag size={44} />
    </Box>
  );
}

export default AppShell;
