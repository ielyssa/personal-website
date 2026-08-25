'use client';

import { useMemo } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { buildTheme } from './theme';

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const theme = useMemo(() => buildTheme('var(--font-dm-sans)'), []);

  return (
    <AppRouterCacheProvider options={{ key: 'mui', enableCssLayer: true }}>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
