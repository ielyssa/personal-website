'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { ProjectSlides, type ProjectSlide } from './ProjectSlides';
import { trackEvent } from '@/lib/analytics';

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

const SLIDES: ProjectSlide[] = [
  {
    id: 'mission',
    src: '/media/work/atas-mission.webp',
    alt: 'ATAS mission',
    caption: 'Building AI that understands Rwanda.',
  },
  {
    id: 'programs',
    src: '/media/work/atas-programs.webp',
    alt: 'AcademiaPlus and IMIZI',
    caption: 'AcademiaPlus in schools today; IMIZI as long-term infrastructure.',
  },
  {
    id: 'impact',
    src: '/media/work/atas-impact.webp',
    alt: 'ATAS research and delivery',
    caption: 'Research excellence and practical delivery as one pipeline.',
  },
];

const PROGRAMS = [
  {
    name: 'AcademiaPlus',
    status: 'Entering schools this term',
    description: 'National curriculum infrastructure for Rwandan secondary education.',
    href: '/work/academiaplus',
  },
  {
    name: 'IMIZI',
    status: 'Active research',
    description: "Rwanda's first Contextual Intelligence Infrastructure.",
    href: '/work/imizi',
  },
  {
    name: 'Language research',
    status: 'Ongoing',
    description: 'Kinyarwanda speech recognition and understanding, built natively.',
    href: '/work/atas',
  },
];

export function VentureSpotlight() {
  return (
    <Section id="atas" neutral>
      <Box sx={{ mb: { xs: 5, md: 6 } }}>
        <SectionHeading
          overline="ATAS"
          title="The company I founded"
          description="Alliance for Transformative AI Systems — defining our own AI future through systems that understand our realities."
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          gap: { xs: 6, md: 8 },
          alignItems: 'start',
        }}
      >
        {/* Left — the case for the company, as plain text + a divided list
            of what it actually builds. No card, no logo avatar, no
            gradient wash. */}
        <Reveal>
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: { xs: 4, md: 5 }, maxWidth: '46ch' }}>
              I founded ATAS in Kigali to build AI systems that genuinely understand Rwanda — its languages,
              geography, culture, and the way Rwandans actually live, work, and communicate. We run research
              and product as one pipeline.
            </Typography>

            <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />} sx={{ mb: { xs: 4, md: 5 } }}>
              {PROGRAMS.map((program) => (
                <Box
                  key={program.name}
                  component={Link}
                  href={program.href}
                  onClick={() => trackEvent('venture_open', { venture: program.name.toLowerCase(), source: 'home_spotlight' })}
                  sx={{
                    display: 'block',
                    py: 2.2,
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover .program-name': { backgroundSize: '100% 1px' },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2} sx={{ mb: 0.5 }}>
                    <Typography
                      className="program-name"
                      sx={{ fontWeight: 800, fontSize: '1.1rem', display: 'inline-block', ...UNDERLINE_SX }}
                    >
                      {program.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {program.status}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                    {program.description}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Typography
              component={Link}
              href="/work/atas"
              onClick={() => trackEvent('venture_open', { venture: 'atas', source: 'home_spotlight' })}
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
          </Box>
        </Reveal>

        {/* Right — the slide viewer, framed by a hairline rather than
            floating with drop shadows. */}
        <Reveal delay={120}>
          <ProjectSlides slides={SLIDES} aspect={16 / 12} />
        </Reveal>
      </Box>
    </Section>
  );
}