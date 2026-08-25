'use client';

import Image from 'next/image';
import Link from 'next/link';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { Carousel } from '@/components/media/Carousel';
import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { trackEvent } from '@/lib/analytics';
import { getMediaEntry } from '@/lib/media';

const GALLERY = [
  { src: '/media/work/atas-mission.webp', caption: 'Building AI that understands Rwanda.' },
  { src: '/media/work/atas-programs.webp', caption: 'AcademiaPlus in schools today; IMIZI as long-term infrastructure.' },
  { src: '/media/work/atas-impact.webp', caption: 'Research excellence and practical delivery as one pipeline.' },
];

const BULLETS = [
  'AcademiaPlus — national curriculum infrastructure, entering schools this academic term',
  'IMIZI — Rwanda’s first Contextual Intelligence Infrastructure, in active research',
  'Kinyarwanda language technology — speech and understanding built natively',
];

export function VentureSpotlight() {
  const slides = GALLERY.map((image) => ({
    id: image.src,
    caption: image.caption,
    node: (
      <Image
        src={image.src}
        alt={image.caption}
        fill
        sizes="(max-width: 900px) 100vw, 42vw"
        placeholder="blur"
        blurDataURL={getMediaEntry(image.src)?.blurDataURL}
        style={{ objectFit: 'cover' }}
      />
    ),
  }));

  return (
    <Section id="atas" neutral>
      <SectionHeading
        overline="ATAS"
        title="The company I founded"
        description="Alliance for Transformative AI Systems — defining our own AI future through systems that understand our realities."
      />
      <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }}>
          <Reveal>
            <Card
              sx={{
                p: { xs: 2.8, md: 3.6 },
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                border: 1,
                borderColor: (th) => alpha(th.palette.primary.main, 0.25),
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: (th) =>
                    `linear-gradient(150deg, ${alpha(th.palette.primary.main, 0.08)} 0%, transparent 45%, ${alpha(th.palette.secondary.main, 0.06)} 100%)`,
                  pointerEvents: 'none',
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                <Avatar
                  src="/media/logos/atas.webp"
                  alt="ATAS logo"
                  sx={{ width: 56, height: 56, bgcolor: 'background.neutral' }}
                />
                <Box>
                  <Typography variant="overline" sx={{ color: 'primary.dark', fontWeight: 700, letterSpacing: 1.5, display: 'block' }}>
                    Company · Founded 2025
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    ATAS
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.85, mb: 2.5, position: 'relative' }}>
                {`I founded ATAS in Kigali to build AI systems that genuinely understand Rwanda — its languages, geography, culture, and the way Rwandans actually live, work, and communicate. We run research and product as one pipeline.`}
              </Typography>

              <Stack spacing={1.1} sx={{ mb: 3, position: 'relative' }}>
                {BULLETS.map((bullet) => (
                  <Stack key={bullet} direction="row" spacing={1} alignItems="flex-start">
                    <Iconify
                      icon="carbon:checkmark-filled"
                      width={18}
                      sx={{ color: 'primary.dark', mt: '2px', flexShrink: 0 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {bullet}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ position: 'relative' }}>
                <Button
                  component={Link}
                  href="/work/atas"
                  variant="contained"
                  endIcon={<Iconify icon="carbon:arrow-right" />}
                  onClick={() => trackEvent('venture_open', { venture: 'atas', source: 'home_spotlight' })}
                >
                  Explore ATAS
                </Button>
                <Button
                  component={Link}
                  href="/work/academiaplus"
                  variant="outlined"
                  onClick={() => trackEvent('venture_open', { venture: 'academiaplus', source: 'home_spotlight' })}
                >
                  AcademiaPlus
                </Button>
              </Stack>
            </Card>
          </Reveal>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Reveal delay={120}>
            <Carousel slides={slides} ariaLabel="ATAS in pictures" aspect={16 / 12} />
          </Reveal>
        </Grid>
      </Grid>
    </Section>
  );
}

