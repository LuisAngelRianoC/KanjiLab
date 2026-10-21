import { CssBaseline, ThemeProvider } from '@mui/material';
import type { ReactNode } from 'react';
import theme from '../theme/theme';

/** Proveedores globales: tema de MUI y estilos base. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default AppProviders;
