'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';

import { Footer } from './Footer';
import { Header } from './Header';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const main = document.getElementById('main-content');
    if (main && window.location.hash === '') {
      main.focus({ preventScroll: true });
    }
  }, [pathname]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'fixed',
          left: 12,
          top: -48,
          zIndex: 2000,
          px: 1.6,
          py: 0.9,
          borderRadius: 1.5,
          bgcolor: 'primary.dark',
          color: 'primary.contrastText',
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'top 200ms ease',
          '&:focus-visible': { top: 12 },
        }}
      >
        Skip to content
      </Box>
      <Header />
      <Box
        id="main-content"
        component="main"
        tabIndex={-1}
        sx={{ flex: '1 1 auto', outline: 'none', pt: { xs: '64px', md: '72px' } }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

