'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
          pt: { xs: 6, md: 8 },
          pb: { xs: 4, md: 5 },
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            spacing={{ xs: 4, sm: 3 }}
            sx={{ mb: { xs: 5, md: 6 } }}
          >
            <Box>
              <Typography
                sx={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em', mb: 0.4 }}
              >
                IRANKUNDA Elyssa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {'Founder & CEO of ATAS · Kigali, Rwanda'}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2.5}>
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
                    transition: 'color 200ms ease',
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  <Iconify icon={social.icon} width={19} />
                </Typography>
              ))}
            </Stack>
          </Stack>

          <Stack
            direction="row"
            flexWrap="wrap"
            useFlexGap
            columnGap={{ xs: 3, sm: 4 }}
            rowGap={1.2}
            sx={{ pt: 3, pb: { xs: 4, md: 5 }, borderTop: '1px solid', borderColor: 'divider' }}
          >
            {FOOTER_LINKS.map((link) => (
              <Typography
                key={link.label}
                component={Link}
                href={link.href}
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  transition: 'color 200ms ease',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {`© ${new Date().getFullYear()} IRANKUNDA Elyssa — Building AI that understands Rwanda`}
          </Typography>
        </Container>
      </Box>

      <Fade in={showTop && !home}>
        <Box
          component="button"
          aria-label="Scroll back to top"
          onClick={scrollTop}
          sx={{
            position: 'fixed',
            right: { xs: 16, md: 24 },
            bottom: { xs: 16, md: 24 },
            zIndex: 1200,
            width: 44,
            height: 44,
            p: 0,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'text.primary',
            bgcolor: 'background.default',
            transition: 'transform 200ms ease, border-color 200ms ease',
            '&:hover': { transform: 'translateY(-3px)', borderColor: 'text.primary' },
          }}
        >
          <Iconify icon="solar:arrow-up-bold" width={20} />
        </Box>
      </Fade>
    </>
  );
}
