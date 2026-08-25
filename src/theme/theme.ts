import type { CSSObject, Theme } from '@mui/material/styles';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
  }
  interface ThemeOptions {
    customShadows?: CustomShadows;
  }
  interface TypeBackground {
    neutral: string;
  }
}

export interface CustomShadows {
  z8: string;
  z12: string;
  z16: string;
  z24: string;
}

export const customShadows: CustomShadows = {
  z8: '0 8px 16px 0 rgba(24, 119, 242, 0.16)',
  z12: '0 12px 24px -4px rgba(24, 119, 242, 0.2)',
  z16: '0 16px 32px -4px rgba(24, 119, 242, 0.22)',
  z24: '0 24px 48px 0 rgba(24, 119, 242, 0.26)',
};

const grey = {
  '50': '#FCFDFD',
  '100': '#F9FAFB',
  '200': '#F4F6F8',
  '300': '#DFE3E8',
  '400': '#C4CDD5',
  '500': '#919EAB',
  '600': '#637381',
  '700': '#454F5B',
  '800': '#1C252E',
  '900': '#141A21',
};

const brand = {
  primary: {
    lighter: '#D0ECFE',
    light: '#73BAFB',
    main: '#1877F2',
    dark: '#0C44AE',
    darker: '#042174',
    contrastText: '#FFFFFF',
  },
  secondary: {
    lighter: '#EFD6FF',
    light: '#C684FF',
    main: '#8E33FF',
    dark: '#5119B7',
    darker: '#27097A',
    contrastText: '#FFFFFF',
  },
  info: { main: '#00B8D9', contrastText: '#FFFFFF' },
  success: { main: '#22C55E', contrastText: '#ffffff' },
  warning: { main: '#FFAB00', contrastText: '#1C252E' },
  error: { main: '#FF5630', contrastText: '#FFFFFF' },
};

function flatShadows(): Theme['shadows'] {
  const base = (blur: number, y: number, alpha: number) =>
    `0px ${y}px ${blur}px rgba(145,158,171,${alpha})`;
  return Array.from({ length: 25 }, (_, i) => (i === 0 ? 'none' : `${base(8 + i, 1 + i, 0.1 + i * 0.008)}`)) as Theme['shadows'];
}

export function buildTheme(fontFamily: string) {
  return createTheme({
    customShadows,
    cssVariables: {
      colorSchemeSelector: 'data',
    },
    colorSchemes: {
      light: {
        palette: {
          ...brand,
          grey,
          text: { primary: grey['900'], secondary: grey['600'] },
          background: { paper: '#FFFFFF', default: grey['100'], neutral: grey['200'] },
          divider: 'rgba(145, 158, 171, 0.24)',
        },
      },
      dark: {
        palette: {
          ...brand,
          grey,
          text: { primary: '#F4F6F8', secondary: grey['500'] },
          background: { paper: '#141A21', default: '#0C0F14', neutral: '#1C252E' },
          divider: 'rgba(145, 158, 171, 0.2)',
        },
      },
    },
    shape: { borderRadius: 10 },
    shadows: flatShadows(),
    typography: {
      fontFamily,
      h1: { fontWeight: 800, lineHeight: 1.15, fontSize: '2.5rem', letterSpacing: '-0.02em' },
      h2: { fontWeight: 800, lineHeight: 1.25, fontSize: '2rem', letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, lineHeight: 1.4, fontSize: '1.5rem' },
      h4: { fontWeight: 700, lineHeight: 1.5, fontSize: '1.25rem' },
      h5: { fontWeight: 700, lineHeight: 1.5, fontSize: '1.125rem' },
      h6: { fontWeight: 600, lineHeight: 1.5, fontSize: '1.0625rem' },
      subtitle1: { fontWeight: 600, lineHeight: 1.5, fontSize: '1rem' },
      subtitle2: { fontWeight: 600, lineHeight: '22px', fontSize: '0.875rem' },
      body1: { lineHeight: 1.6, fontSize: '1rem' },
      body2: { lineHeight: '22px', fontSize: '0.875rem' },
      caption: { lineHeight: 1.5, fontSize: '0.75rem' },
      overline: { fontWeight: 700, lineHeight: 1.5, fontSize: '0.75rem', textTransform: 'uppercase' },
      button: { fontWeight: 700, lineHeight: '24px', fontSize: '0.875rem', textTransform: 'none' },
    } as Theme['typography'],
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 10 },
          sizeLarge: { padding: '12px 22px' },
          containedPrimary: {
            backgroundColor: '#0B63D8',
            '&:hover': { backgroundColor: '#0A56BC' },
          },
          outlinedPrimary: {
            color: '#0C44AE',
            borderColor: 'rgba(12, 68, 174, 0.5)',
            '&:hover': { borderColor: '#0C44AE' },
          },
          textPrimary: {
            color: '#0C44AE',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 16, backgroundImage: 'none' },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 600 },
          outlined: {
            color: 'var(--mui-palette-text-primary)',
            borderColor: 'var(--mui-palette-divider)',
          },
          colorPrimary: {
            backgroundColor: '#D0ECFE',
            color: '#042174',
          },
          colorSuccess: {
            backgroundColor: '#D3FCD2',
            color: '#065E49',
          },
          colorInfo: {
            backgroundColor: '#CAFDF5',
            color: '#003768',
          },
        },
      },
      MuiContainer: {
        defaultProps: { maxWidth: 'lg' },
      },
    },
  });
}

export type ThemeCssVariables = {
  '--layout-header-height': string;
};

export type FontStyleExtend = {
  fontWeightSemiBold: CSSObject['fontWeight'];
};
