'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useColorScheme } from '@mui/material/styles';

import { Iconify } from '@/components/ui/iconify';
import { NAV_ITEMS, SOCIAL_PROFILES, isHomePathname } from '@/lib/nav';

const HEADER_HEIGHT = 72;

export function Header() {
  const pathname = usePathname();
  const { mode, setMode } = useColorScheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const home = isHomePathname(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!home) {
      setActiveSection(null);
      return undefined;
    }
    const sectionIds = ['about', 'focus', 'atas', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
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
      return item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
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
    <Box sx={{ py: 3, px: 2 }}>
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={handleSectionClick(item)}
              selected={isActive(item)}
              sx={{
                borderRadius: 1.5,
                '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Stack direction="row" spacing={1} sx={{ px: 2, mt: 3 }}>
        {SOCIAL_PROFILES.map((social) => (
          <IconButton
            key={social.label}
            size="small"
            component="a"
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            sx={{ color: 'text.secondary' }}
          >
            <Iconify icon={social.icon} width={20} />
          </IconButton>
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
          height: HEADER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          transition: 'background-color 240ms ease, box-shadow 240ms ease, border-color 240ms ease',
          bgcolor: scrolled ? (th) => alpha(th.palette.background.paper, 0.82) : 'transparent',
          borderBottom: 1,
          borderColor: scrolled ? 'divider' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1240, mx: 'auto', px: { xs: 2, md: 3 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Link href="/" aria-label="Home" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <Logo />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  display: { xs: 'none', sm: 'block' },
                  background: (th) => `linear-gradient(135deg, ${th.palette.primary.main}, ${th.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                I. Elyssa
              </Typography>
            </Link>

            <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', lg: 'flex' } }}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  onClick={handleSectionClick(item)}
                  aria-current={isActive(item) ? 'page' : undefined}
                  sx={{
                    color: isActive(item) ? 'primary.dark' : 'text.primary',
                    fontWeight: isActive(item) ? 700 : 500,
                    minWidth: 64,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: isActive(item) ? '56%' : 0,
                      height: 2,
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                      transition: 'width 240ms ease',
                    },
                    '&:hover::after': { width: '56%' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton
                  aria-label="Toggle color scheme"
                  onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                  sx={{ color: 'text.primary' }}
                >
                  <Iconify icon={mode === 'dark' ? 'solar:sun-bold' : 'solar:moon-bold'} width={22} />
                </IconButton>
              </Tooltip>
              <IconButton
                aria-label="Open navigation menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ display: { xs: 'flex', lg: 'none' }, color: 'text.primary' }}
              >
                <Iconify icon="solar:hamburger-menu-bold" width={24} />
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
        slotProps={{ paper: { sx: { width: 290 } } }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

function Logo() {
  return (
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'primary.contrastText',
        fontWeight: 800,
        fontSize: 15,
        letterSpacing: '-0.02em',
        background: (th) => `linear-gradient(135deg, ${th.palette.primary.main}, ${th.palette.secondary.main})`,
        boxShadow: (th) => th.customShadows.z8,
      }}
      aria-hidden
    >
      IE
    </Box>
  );
}

