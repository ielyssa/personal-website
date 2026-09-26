'use client';

import Image from 'next/image';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from '@/components/ui/iconify';
import { SITE } from '@content/site';
import { trackEvent } from '@/lib/analytics';
import { getMediaEntry } from '@/lib/media';

const avatar = getMediaEntry('/media/person/elyssa-avatar-800.webp') ?? {
  width: 800,
  height: 800,
  blurDataURL: '',
};

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// The concrete facts, not marketing language — a thin data rail rather than
// a stat-card row. This is what makes the hero specific to this subject
// instead of a swappable "name + tagline + photo" template.
const FACTS = [
  { label: 'Role', value: 'Founder & CEO, ATAS' },
  { label: 'Based', value: 'Kigali, Rwanda' },
  { label: 'Founded', value: `ATAS · ${SITE.foundedAtas}` },
  { label: 'Focus', value: 'Rwanda-first AI infrastructure' },
];

export function Hero() {
  return (
    <Box component="section" id="home" sx={{ pt: { xs: 5, md: 7 }, pb: { xs: 6, md: 8 }, scrollMarginTop: '88px' }}>
      <Container>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
            gap: { xs: 5, md: 4 },
            alignItems: 'stretch',
          }}
        >
          {/* Left — type-led. The name and positioning line carry the hero,
              not a photo; the portrait is a supporting element, not the
              focal point. */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 2.5 }}>
              {'Founder & CEO — ATAS, Alliance for Transformative AI Systems'}
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.75rem', sm: '3.75rem', md: '4.5rem' },
                letterSpacing: '-0.03em',
                lineHeight: 0.98,
                mb: { xs: 3, md: 4 },
              }}
            >
              {SITE.name}
            </Typography>

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: { xs: '1.15rem', md: '1.4rem' },
                lineHeight: 1.55,
                color: 'text.secondary',
                maxWidth: '46ch',
                mb: { xs: 4, md: 5 },
              }}
            >
              {'I build AI companies that understand Rwanda — its languages, geography, and everyday realities. Today that means '}
              <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
                AcademiaPlus
              </Box>
              {', national curriculum infrastructure entering schools this term, and '}
              <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
                IMIZI
              </Box>
              {", our long-term contextual intelligence program."}
            </Typography>

            <Stack direction="row" spacing={{ xs: 3, sm: 4 }} flexWrap="wrap" useFlexGap>
              <Typography
                component={Link}
                href="/work/atas"
                onClick={() => trackEvent('cta_click', { cta: 'explore_atas', location: 'hero' })}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  ...UNDERLINE_SX,
                  '&:hover': { backgroundSize: '100% 1px' },
                }}
              >
                Explore ATAS
                <Iconify icon="carbon:arrow-right" width={17} />
              </Typography>

              <Typography
                component={Link}
                href="/writing"
                onClick={() => trackEvent('cta_click', { cta: 'read_writing', location: 'hero' })}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  ...UNDERLINE_SX,
                  '&:hover': { backgroundSize: '100% 1px', color: 'text.primary' },
                }}
              >
                Read my writing
              </Typography>

              <Typography
                component={Link}
                href="/press"
                onClick={() => trackEvent('cta_click', { cta: 'press_kit', location: 'hero' })}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  ...UNDERLINE_SX,
                  '&:hover': { backgroundSize: '100% 1px', color: 'text.primary' },
                }}
              >
                Press kit
              </Typography>
            </Stack>
          </Box>

          {/* Right — a tall photograph, not a centered circular avatar. It
              bleeds toward the container edge on desktop instead of
              floating in whitespace, which is what makes it read as
              editorial rather than a generic "profile card" hero. */}
          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 320, sm: 420, md: 'auto' },
              order: { xs: -1, md: 0 },
            }}
          >
            <Box
              sx={{
                position: { md: 'absolute' },
                inset: { md: 0 },
                height: { xs: 320, sm: 420, md: '100%' },
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Image
                src="/media/person/elyssa-avatar-800.webp"
                alt={`Portrait of ${SITE.name}, Founder & CEO of ATAS`}
                width={avatar.width}
                height={avatar.height}
                priority
                sizes="(max-width: 900px) 100vw, 40vw"
                placeholder="blur"
                blurDataURL={avatar.blurDataURL}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          </Box>
        </Box>

        {/* Data rail — the concrete facts, set as a single hairline-topped
            row rather than stat cards. Wraps to two columns on mobile. */}
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            pt: { xs: 3, md: 3.5 },
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          {FACTS.map((fact) => (
            <Box key={fact.label}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.4 }}>
                {fact.label}
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                {fact.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}