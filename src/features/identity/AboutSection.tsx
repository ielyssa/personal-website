'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Reveal } from '@/components/motion/Reveal';
import { Iconify } from '@/components/ui/iconify';
import { Section, SectionHeading } from '@/components/ui/section';
import { trackEvent } from '@/lib/analytics';

// A few honest, specific-feeling personal details, told plainly rather than
// as marketing copy. Edit these to match what's actually true — they're
// written to sound like a person, not a press release, so keep that
// register when you adjust the specifics.
const ASIDES = [
  {
    label: 'Right now',
    value:
      "I'm ATAS's only full-time person, so most days move between writing research notes, debugging a model, and answering a support email — in that order, sometimes twice.",
  },
  {
    label: 'Outside ATAS',
    value:
      "Rwanda is home in the literal sense — it's where I grew up, and \"Rwanda-first\" isn't an abstraction I chose, it's the only version of this problem I actually know from the inside.",
  },
];

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export function AboutSection() {
  return (
    <Section id="about" neutral>
      <Box sx={{ mb: { xs: 5, md: 6 } }}>
        <SectionHeading align="left" overline="About" title="Why I'm doing this" />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: { xs: 6, md: 8 },
          alignItems: 'start',
        }}
      >
        {/* Left — the actual story, told as a short sequence of moments
            rather than one dense paragraph. This is the part that can't be
            found anywhere else on the page. */}
        <Stack spacing={{ xs: 3, md: 3.5 }}>
          <Reveal>
            <Typography
              sx={{
                fontSize: { xs: '1.15rem', md: '1.35rem' },
                fontWeight: 600,
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
                maxWidth: '38ch',
              }}
            >
              I started paying attention the day I watched my father ask AI for advice on a problem
              only he actually understood — and get back an answer that could have been written for
              anyone, anywhere.
            </Typography>
          </Reveal>

          <Reveal delay={80}>
            <Typography color="text.secondary" sx={{ lineHeight: 1.85, maxWidth: '58ch' }}>
              By then, AI had gotten fluent in Kinyarwanda. That was never really the problem.
              Speaking a language and understanding how things actually work in a place are two
              different achievements — and only one of them was getting solved.
            </Typography>
          </Reveal>

          <Reveal delay={140}>
            <Typography
              component={Link}
              href="/biography"
              onClick={() =>
                trackEvent('cta_click', { cta: 'full_story', location: 'about_section' })
              }
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.primary',
                textDecoration: 'none',
                fontWeight: 700,
                ...UNDERLINE_SX,
                '&:hover': { backgroundSize: '100% 1px' },
              }}
            >
              Read the full story
              <Iconify icon="carbon:arrow-right" width={17} />
            </Typography>
          </Reveal>
        </Stack>

        {/* Right — quieter personal asides, set apart by a single hairline
            rather than a fact-grid (the hero already carries the résumé
            facts, so this is deliberately a different register: texture,
            not data). */}
        <Box
          sx={{
            pl: { md: 6 },
            borderLeft: { md: '1px solid' },
            borderColor: { md: 'divider' },
            pt: { xs: 1, md: 0.5 },
          }}
        >
          <Stack
            divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}
            spacing={0}
          >
            {ASIDES.map((aside, index) => (
              <Reveal key={aside.label} delay={100 + index * 70}>
                <Box sx={{ py: index === 0 ? 0 : 3, pb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {aside.label}
                  </Typography>
                  <Typography sx={{ lineHeight: 1.75, maxWidth: '42ch' }}>{aside.value}</Typography>
                </Box>
              </Reveal>
            ))}
          </Stack>
        </Box>
      </Box>
    </Section>
  );
}
