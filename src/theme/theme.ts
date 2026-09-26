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
  z8: '0 8px 16px 0 rgba(0, 0, 0, 0.16)',
  z12: '0 12px 24px -4px rgba(0, 0, 0, 0.2)',
  z16: '0 16px 32px -4px rgba(0, 0, 0, 0.22)',
  z24: '0 24px 48px 0 rgba(0, 0, 0, 0.26)',
};

const grey = {
  '50': '#FAFAFA',
  '100': '#F5F5F5',
  '200': '#EEEEEE',
  '300': '#E0E0E0',
  '400': '#BDBDBD',
  '500': '#757575',
  '600': '#616161',
  '700': '#424242',
  '800': '#212121',
  '900': '#121212',
};

const brand = {
  primary: {
    lighter: '#E0E0E0',
    light: '#424242',
    main: '#000000',
    dark: '#000000',
    darker: '#000000',
    contrastText: '#FFFFFF',
  },
  secondary: {
    lighter: '#F5F5F5',
    light: '#9E9E9E',
    main: '#616161',
    dark: '#424242',
    darker: '#212121',
    contrastText: '#FFFFFF',
  },
  info: { main: '#616161', contrastText: '#FFFFFF' },
  success: { main: '#424242', contrastText: '#FFFFFF' },
  warning: { main: '#757575', contrastText: '#000000' },
  error: { main: '#000000', contrastText: '#FFFFFF' },
};

function flatShadows(): Theme['shadows'] {
  const base = (blur: number, y: number, alpha: number) =>
    `0px ${y}px ${blur}px rgba(0, 0, 0, ${alpha})`;
  return Array.from({ length: 25 }, (_, i) =>
    i === 0 ? 'none' : `${base(8 + i, 1 + i, 0.1 + i * 0.008)}`
  ) as Theme['shadows'];
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
          text: { primary: '#000000', secondary: grey['600'] },
          background: { paper: '#FFFFFF', default: grey['50'], neutral: grey['100'] },
          divider: 'rgba(0, 0, 0, 0.12)',
        },
      },
      dark: {
        palette: {
          ...brand,
          primary: {
            ...brand.primary,
            light: '#BDBDBD',
            main: '#FFFFFF',
            dark: '#E0E0E0',
            contrastText: '#000000',
          },
          grey,
          text: { primary: '#FFFFFF', secondary: grey['400'] },
          background: { paper: '#121212', default: '#000000', neutral: '#212121' },
          divider: 'rgba(255, 255, 255, 0.16)',
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
      overline: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
      },
      button: { fontWeight: 700, lineHeight: '24px', fontSize: '0.875rem', textTransform: 'none' },
    } as Theme['typography'],
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 10 },
          sizeLarge: { padding: '12px 22px' },
          containedPrimary: {
            backgroundColor: 'var(--mui-palette-primary-main)',
            color: 'var(--mui-palette-primary-contrastText)',
            '&:hover': { backgroundColor: 'var(--mui-palette-primary-dark)' },
          },
          outlinedPrimary: {
            color: 'var(--mui-palette-primary-main)',
            borderColor: 'var(--mui-palette-divider)',
            '&:hover': { borderColor: 'var(--mui-palette-primary-main)' },
          },
          textPrimary: {
            color: 'var(--mui-palette-primary-main)',
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
            backgroundColor: '#E0E0E0',
            color: '#000000',
          },
          colorSuccess: {
            backgroundColor: '#E0E0E0',
            color: '#212121',
          },
          colorInfo: {
            backgroundColor: '#EEEEEE',
            color: '#212121',
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
