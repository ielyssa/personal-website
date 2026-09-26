'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { trackEvent } from '@/lib/analytics';
import type { Work } from '@/lib/content';

const STATUS_LABEL = { active: 'Active product', research: 'Research program', earlier: 'Earlier work' } as const;

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export function WorkHighlights({ works }: { works: Work[] }) {
  const highlights = works.filter((work) => work.slug !== 'atas').slice(0, 3);

  return (
    <Section id="work">
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: { xs: 4, md: 6 } }}>
        <SectionHeading
          align="left"
          overline="Work"
          title="What I'm building"
          description="Selected ventures and research programs from ATAS."
        />
        <Typography
          component={Link}
          href="/work"
          onClick={() => trackEvent('work_index_open', { source: 'home' })}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            alignItems: 'center',
            gap: 0.75,
            flexShrink: 0,
            color: 'text.primary',
            textDecoration: 'none',
            fontWeight: 600,
            ...UNDERLINE_SX,
            '&:hover': { backgroundSize: '100% 1px' },
          }}
        >
          All work
          <Iconify icon="carbon:arrow-right" width={16} />
        </Typography>
      </Stack>

      {/* A numbered ledger, not cards: each row treats status and period as
          plain annotations rather than a colored badge, since this is
          structured index content (like a table of contents) rather than a
          browsable image gallery — a different job than the writing list. */}
      <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
        {highlights.map((work, index) => (
          <Reveal key={work.slug} delay={index * 80}>
            <Box
              component={Link}
              href={`/work/${work.slug}`}
              onClick={() => trackEvent('venture_open', { venture: work.slug, source: 'home_work' })}
              sx={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                py: { xs: 3, md: 3.5 },
                '&:hover .work-name': { backgroundSize: '100% 1px' },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '2rem 1fr', md: '3rem 1fr 1fr auto' },
                  columnGap: { xs: 2, md: 4 },
                  rowGap: 0.8,
                  alignItems: 'baseline',
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, gridRow: { xs: '1 / 3', md: 'auto' } }}
                >
                  {work.number ?? String(index + 1).padStart(2, '0')}
                </Typography>

                <Typography
                  className="work-name"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '1.15rem', md: '1.3rem' },
                    letterSpacing: '-0.01em',
                    display: 'inline-block',
                    gridColumn: { xs: '2', md: 'auto' },
                    ...UNDERLINE_SX,
                  }}
                >
                  {work.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    gridColumn: { xs: '2', md: 'auto' },
                    gridRow: { xs: 'auto', md: 'auto' },
                  }}
                >
                  {work.summary}
                </Typography>

                <Stack
                  sx={{
                    gridColumn: { xs: '2', md: 'auto' },
                    textAlign: { xs: 'left', md: 'right' },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {STATUS_LABEL[work.status]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {work.period}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Reveal>
        ))}
      </Stack>

      <Box sx={{ mt: 3, display: { xs: 'block', sm: 'none' } }}>
        <Typography
          component={Link}
          href="/work"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            color: 'text.primary',
            textDecoration: 'none',
            fontWeight: 600,
            ...UNDERLINE_SX,
            '&:hover': { backgroundSize: '100% 1px' },
          }}
        >
          All work
          <Iconify icon="carbon:arrow-right" width={16} />
        </Typography>
      </Box>
    </Section>
  );
}