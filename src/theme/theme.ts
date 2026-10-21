import { createTheme, type Theme } from '@mui/material/styles';
import { fonts } from './fonts';

/**
 * Sistema visual inspirado en Preply: superficies blancas, bordes sólidos
 * finos (sin sombras pesadas), radios pequeños y generosos, tipografía
 * geométrica y mucho aire.
 *
 * La identidad cromática mantiene el bermellón de los sellos hanko, en
 * consonancia con los colores de la bandera de México.
 */
export const palette = {
  /** Fondo general de la página (gris muy claro). */
  canvas: '#F5F5F7',
  /** Superficie de las tarjetas. */
  surface: '#FFFFFF',
  /** Bordes: 1.6px como en Preply. */
  border: '#DCDCE5',
  /** Borde suave para separadores internos. */
  borderSoft: '#EBEBF1',
  /** Texto principal. */
  ink: '#121117',
  /** Texto secundario. */
  inkSoft: '#6E6E80',
  /** Texto terciario. */
  inkMuted: '#9A9AAC',
  /** Acento principal: rojo sello / bandera de México. */
  vermillion: '#C1272D',
  vermillionSoft: '#FDEBEC',
  /** Acento secundario: verde de la bandera. */
  flagGreen: '#006847',
  flagGreenSoft: '#E6F2EE',
  /** Azul de apoyo (información, lecturas). */
  indigo: '#2C4A63',
  indigoSoft: '#E9EFF4',
  /** Estados. */
  success: '#1E8E5A',
  successSoft: '#E6F4EC',
  error: '#D33B3B',
  errorSoft: '#FBEAEA',
  warning: '#C08A2E',
  warningSoft: '#FBF1DF',
  /** Acento rosa usado para elementos destacados (precio/preply). */
  pink: '#FF7AAC',
} as const;

/** Grosor de borde estándar de la casa. */
export const BORDER_WIDTH = '1.6px';
export const BORDER_RADIUS = 8;

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: palette.vermillion,
      light: '#E15A5F',
      dark: '#9A1D22',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: palette.flagGreen,
      light: '#3E8F6E',
      dark: '#004733',
      contrastText: '#FFFFFF',
    },
    success: { main: palette.success, dark: '#136A41' },
    error: { main: palette.error, dark: '#A72A2A' },
    warning: { main: palette.warning, dark: '#8F6418' },
    info: { main: palette.indigo },
    background: { default: palette.canvas, paper: palette.surface },
    text: { primary: palette.ink, secondary: palette.inkSoft },
    divider: palette.border,
  },
  shape: { borderRadius: BORDER_RADIUS },
  spacing: 8,
  typography: {
    fontFamily: fonts.body,
    fontSize: 16,
    h1: {
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
      lineHeight: 1.04,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.18,
      letterSpacing: '-0.015em',
    },
    h4: { fontFamily: fonts.display, fontWeight: 700, fontSize: '1.375rem', lineHeight: 1.25 },
    h5: { fontFamily: fonts.display, fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.3 },
    h6: { fontFamily: fonts.display, fontWeight: 700, fontSize: '1rem', lineHeight: 1.35 },
    subtitle1: { fontWeight: 600, fontSize: '1rem' },
    subtitle2: { fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '0.06em' },
    body1: { fontSize: '1rem', lineHeight: 1.65 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0, fontSize: '1rem' },
    overline: { fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.14em' },
    caption: { fontSize: '0.75rem', lineHeight: 1.45 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.canvas,
          color: palette.ink,
        },
        '::selection': { backgroundColor: 'rgba(193,39,45,0.16)' },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(18,17,23,0.22)',
          borderRadius: 999,
          border: '3px solid transparent',
          backgroundClip: 'content-box',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS,
          paddingInline: 20,
          minHeight: 44,
        },
        contained: {
          '&:hover': { backgroundColor: palette.vermillion, opacity: 0.92 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 700,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: { borderRadius: BORDER_RADIUS, fontWeight: 700 },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { gap: 6 },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.8125rem',
          backgroundColor: palette.ink,
          padding: '8px 12px',
        },
        arrow: { color: palette.ink },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: `${BORDER_WIDTH} solid ${palette.border}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: palette.borderSoft } },
    },
  },
});

export default theme satisfies Theme;
