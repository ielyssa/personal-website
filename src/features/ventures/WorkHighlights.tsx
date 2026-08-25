'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { trackEvent } from '@/lib/analytics';
import type { Work } from '@/lib/content';

const STATUS_COLOR = { active: 'success', research: 'info', earlier: 'default' } as const;

const STATUS_LABEL = { active: 'Active product', research: 'Research program', earlier: 'Earlier work' } as const;

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
        <Button
          component={Link}
          href="/work"
          endIcon={<Iconify icon="carbon:arrow-right" />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, flexShrink: 0 }}
        >
          All work
        </Button>
      </Stack>

      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        {highlights.map((work, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={work.slug}>
            <Reveal delay={index * 90}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'transform 280ms ease, box-shadow 280ms ease',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: (th) => th.customShadows.z12 },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/work/${work.slug}`}
                  onClick={() => trackEvent('venture_open', { venture: work.slug, source: 'home_work' })}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
                >
                  <SmartImage
                    src={work.cover}
                    alt={`${work.name} — ${work.summary}`}
                    aspect={16 / 10}
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 45vw, 30vw"
                    sx={{ borderRadius: 0 }}
                  />
                  <Box sx={{ p: 2.4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Chip
                        label={STATUS_LABEL[work.status]}
                        size="small"
                        color={STATUS_COLOR[work.status]}
                        variant={work.status === 'earlier' ? 'outlined' : 'filled'}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {work.period}
                      </Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.6 }}>
                      {work.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {work.summary}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Reveal>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: { xs: 'block', sm: 'none' }, textAlign: 'center' }}>
        <Button component={Link} href="/work" endIcon={<Iconify icon="carbon:arrow-right" />}>
          All work
        </Button>
      </Box>
    </Section>
  );
}


