'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';

import { Iconify } from '@/components/ui/iconify';
import { NAV_ITEMS, SOCIAL_PROFILES, isHomePathname } from '@/lib/nav';

const HEADER_HEIGHT = 76;
const HEADER_HEIGHT_COMPACT = 60;
const REVEAL_THRESHOLD = 12; // px of scroll before the header starts reacting at all
const HIDE_AFTER = HEADER_HEIGHT + 40; // don't hide until scrolled past the header's own height

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 320ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export function Header() {
  const pathname = usePathname();
  const { mode, setMode } = useColorScheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const home = isHomePathname(pathname);

  // Tracks scroll direction to hide the header on the way down (more room
  // to read) and bring it back the instant the user scrolls up — a single
  // deliberate response to intent, not a decorative transition.
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      setCompact(y > REVEAL_THRESHOLD);

      if (y <= HIDE_AFTER) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
        setDrawerOpen(false);
      } else if (delta < -4) {
        setHidden(false);
      }

      lastScrollY.current = y;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!home) {
      setActiveSection(null);
      return undefined;
    }
    const sectionIds = ['about', 'atas', 'contact'];
    const visibility = new Map<string, IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visibility.set(entry.target.id, entry);
        const active = [...visibility.values()]
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        setActiveSection(active?.target.id ?? null);
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [home]);

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.kind === 'route') {
      if (item.href === '/') return pathname === '/' && activeSection === null;
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    }
    return home && activeSection === item.href.replace('/#', '');
  };

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleSectionClick = (item: (typeof NAV_ITEMS)[number]) => (event: React.MouseEvent) => {
    setDrawerOpen(false);
    if (item.kind !== 'section') return;
    if (!home) return;
    event.preventDefault();
    const target = document.getElementById(item.href.replace('/#', ''));
    target?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const drawer = (
    <Box sx={{ py: 4, px: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack component="nav" spacing={2.5} sx={{ mt: 2 }}>
        {NAV_ITEMS.map((item) => (
          <Typography
            key={item.label}
            component={Link}
            href={item.href}
            onClick={handleSectionClick(item)}
            aria-current={isActive(item) ? 'page' : undefined}
            sx={{
              fontSize: '1.5rem',
              fontWeight: isActive(item) ? 800 : 500,
              color: isActive(item) ? 'text.primary' : 'text.secondary',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            {item.label}
          </Typography>
        ))}
      </Stack>

      <Stack
        direction="row"
        spacing={2.5}
        sx={{ mt: 'auto', pt: 4, borderTop: '1px solid', borderColor: 'divider' }}
      >
        {SOCIAL_PROFILES.map((social) => (
          <Typography
            key={social.label}
            component="a"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            sx={{
              display: 'inline-flex',
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
            }}
          >
            <Iconify icon={social.icon} width={20} />
          </Typography>
        ))}
      </Stack>
    </Box>
  );

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          height: compact ? HEADER_HEIGHT_COMPACT : HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
          transition:
            'transform 320ms cubic-bezier(0.4, 0, 0.2, 1), height 240ms ease, background-color 240ms ease, border-color 240ms ease',
          bgcolor: compact ? 'background.default' : 'transparent',
          borderBottom: '1px solid',
          borderColor: compact ? 'divider' : 'transparent',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1240, mx: 'auto', px: { xs: 2.5, md: 3 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography
              component={Link}
              href="/"
              aria-label="Home"
              sx={{
                fontWeight: 800,
                fontSize: '1.05rem',
                letterSpacing: '-0.01em',
                color: 'text.primary',
                textDecoration: 'none',
              }}
            >
              IRANKUNDA Elyssa
            </Typography>

            <Stack
              component="nav"
              direction="row"
              spacing={{ lg: 4, xl: 5 }}
              sx={{ display: { xs: 'none', lg: 'flex' } }}
            >
              {NAV_ITEMS.map((item) => (
                <Typography
                  key={item.label}
                  component={Link}
                  href={item.href}
                  onClick={handleSectionClick(item)}
                  aria-current={isActive(item) ? 'page' : undefined}
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: isActive(item) ? 700 : 500,
                    color: isActive(item) ? 'text.primary' : 'text.secondary',
                    textDecoration: 'none',
                    display: 'inline-block',
                    ...UNDERLINE_SX,
                    backgroundSize: isActive(item) ? '100% 1px' : '0% 1px',
                    '&:hover': { backgroundSize: '100% 1px', color: 'text.primary' },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton
                aria-label="Toggle color scheme"
                onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                sx={{ color: 'text.primary' }}
              >
                <Iconify icon={mode === 'dark' ? 'solar:sun-bold' : 'solar:moon-bold'} width={20} />
              </IconButton>
              <IconButton
                aria-label="Open navigation menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ display: { xs: 'flex', lg: 'none' }, color: 'text.primary' }}
              >
                <Iconify icon="solar:hamburger-menu-bold" width={22} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', lg: 'none' } }}
        slotProps={{
          paper: { sx: { width: { xs: '100%', sm: 340 }, bgcolor: 'background.default' } },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
