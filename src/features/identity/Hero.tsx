'use client';

import Image from 'next/image';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { Iconify } from '@/components/ui/iconify';
import { SITE } from '@content/site';
import { trackEvent } from '@/lib/analytics';
import { getMediaEntry } from '@/lib/media';

const avatar = getMediaEntry('/media/person/elyssa-avatar-800.webp') ?? {
  width: 800,
  height: 800,
  blurDataURL: '',
};

export function Hero() {
  return (
    <Box
      component="section"
      id="home"
      sx={{
        position: 'relative',
        py: { xs: 7, md: 12 },
        scrollMarginTop: '88px',
        overflow: 'hidden',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '4%',
          right: '-10%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: (th) => `radial-gradient(circle, ${alpha(th.palette.primary.main, 0.16)} 0%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-8%',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: (th) => `radial-gradient(circle, ${alpha(th.palette.secondary.main, 0.12)} 0%, transparent 70%)`,
        }}
      />
      <Container sx={{ position: 'relative' }}>
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          spacing={{ xs: 4, md: 6 }}
          alignItems="center"
        >
          <Box sx={{ flex: '1 1 58%' }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.dark', fontWeight: 700, letterSpacing: 1.5, display: 'block', mb: 1.5 }}
            >
              {`Founder & CEO — ATAS · Alliance for Transformative AI Systems`}
            </Typography>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem' },
                letterSpacing: '-0.03em',
                mb: 1.5,
                background: (th) =>
                  `linear-gradient(135deg, ${th.palette.primary.main} 10%, ${th.palette.secondary.main} 90%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {SITE.name}
            </Typography>
            <Typography
              variant="h4"
              component="p"
              sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.25rem', md: '1.55rem' } }}
            >
              {SITE.positioningLine}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620, lineHeight: 1.8, mb: 3.5 }}>
              {`I founded ATAS in Kigali to build AI systems that genuinely understand Rwanda — its languages, geography, and everyday realities. Today that means AcademiaPlus, our national education platform entering schools this academic term, and IMIZI, our long-term contextual intelligence infrastructure.`}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                component={Link}
                href="/work/atas"
                variant="contained"
                size="large"
                startIcon={<Iconify icon="carbon:arrow-right" />}
                onClick={() => trackEvent('cta_click', { cta: 'explore_atas', location: 'hero' })}
                sx={{ boxShadow: (th) => th.customShadows.z8 }}
              >
                Explore ATAS
              </Button>
              <Button
                component={Link}
                href="/writing"
                variant="outlined"
                size="large"
                onClick={() => trackEvent('cta_click', { cta: 'read_writing', location: 'hero' })}
              >
                Read my writing
              </Button>
              <Button
                component={Link}
                href="/press"
                variant="text"
                size="large"
                endIcon={<Iconify icon="carbon:arrow-up-right" />}
                onClick={() => trackEvent('cta_click', { cta: 'press_kit', location: 'hero' })}
              >
                Press kit
              </Button>
            </Stack>
          </Box>

          <Box sx={{ flex: '1 1 42%', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', width: { xs: 260, sm: 300, md: 330 }, aspectRatio: '1' }}>
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: -14,
                  borderRadius: '50%',
                  background: (th) =>
                    `linear-gradient(135deg, ${th.palette.primary.main}, ${th.palette.secondary.main})`,
                  opacity: 0.35,
                  filter: 'blur(2px)',
                }}
              />
              <Image
                src="/media/person/elyssa-avatar-800.webp"
                alt={`Portrait of ${SITE.name}, Founder & CEO of ATAS`}
                width={avatar.width}
                height={avatar.height}
                priority
                sizes="(max-width: 600px) 260px, (max-width: 900px) 300px, 330px"
                placeholder="blur"
                blurDataURL={avatar.blurDataURL}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  position: 'relative',
                  border: '5px solid',
                  borderColor: 'var(--mui-palette-background-paper)',
                  boxShadow: '0 24px 48px 0 rgba(24, 119, 242, 0.26)',
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

