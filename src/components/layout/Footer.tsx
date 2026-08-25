'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';

import { Iconify } from '@/components/ui/iconify';
import { FOOTER_LINKS, SOCIAL_PROFILES, isHomePathname } from '@/lib/nav';

export function Footer() {
  const pathname = usePathname();
  const home = isHomePathname(pathname);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <>
      <Box
        component="footer"
        sx={{
          py: 5,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'center', sm: 'flex-start' }}
            spacing={3}
          >
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                IRANKUNDA Elyssa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Founder & CEO of ATAS · {`Kigali, Rwanda`}
              </Typography>
            </Box>

            <Stack direction="row" spacing={{ xs: 2, sm: 3 }} flexWrap="wrap" justifyContent="center" useFlexGap>
              {FOOTER_LINKS.map((link) => (
                <MuiLink
                  key={link.label}
                  component={Link}
                  href={link.href}
                  underline="none"
                  variant="body2"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>

            <Stack direction="row" spacing={0.5}>
              {SOCIAL_PROFILES.map((social) => (
                <IconButton
                  key={social.label}
                  size="small"
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <Iconify icon={social.icon} width={20} />
                </IconButton>
              ))}
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
            {`© ${new Date().getFullYear()} IRANKUNDA Elyssa · Building AI that understands Rwanda`}
          </Typography>
        </Container>
      </Box>

      <Zoom in={showTop && !home}>
        <Box
          component="button"
          aria-label="Scroll back to top"
          onClick={scrollTop}
          sx={{
            position: 'fixed',
            right: { xs: 16, md: 24 },
            bottom: { xs: 16, md: 24 },
            zIndex: 1200,
            width: 48,
            height: 48,
            p: 0,
            border: 'none',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'primary.contrastText',
            background: (th) => `linear-gradient(135deg, ${th.palette.primary.main}, ${th.palette.primary.dark})`,
            boxShadow: (th) => th.customShadows.z12,
            '&:hover': { transform: 'translateY(-3px)' },
            transition: 'transform 200ms ease',
          }}
        >
          <Iconify icon="solar:arrow-up-bold" width={22} />
        </Box>
      </Zoom>
    </>
  );
}

