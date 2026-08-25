import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { getWorks } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Work — Ventures & Research',
  description:
    'Ventures and research programs from ATAS: AcademiaPlus, IMIZI, Kinyarwanda TTS, and EduBridge — built by IRANKUNDA Elyssa in Kigali.',
  path: '/work',
});

const STATUS_COLOR = { active: 'success', research: 'info', earlier: 'default' } as const;
const STATUS_LABEL = { active: 'Active product', research: 'Research program', earlier: 'Earlier work' } as const;

export default function WorkIndexPage() {
  const works = getWorks();

  return (
    <Container sx={{ py: { xs: 6, md: 9 } }}>
      <SectionHeading
        overline="Work"
        title="Ventures & research"
        description="Everything here is built by ATAS, the company I founded — one product in schools today, and research programs building Rwanda's AI foundation."
      />
      <Grid container spacing={{ xs: 3, md: 4 }}>
        {works.map((work, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={work.slug}>
            <Reveal delay={index * 80}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: 'transform 280ms ease, box-shadow 280ms ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 24px -4px rgba(24, 119, 242, 0.2)',
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/work/${work.slug}`}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
                >
                  <SmartImage
                    src={work.cover}
                    alt={`${work.name} — ${work.summary}`}
                    aspect={16 / 10}
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 45vw, 30vw"
                    sx={{ borderRadius: 0 }}
                  />
                  <Box sx={{ p: 2.6, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.7 }}>
                      {work.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {work.summary}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.6} sx={{ mt: 'auto', pt: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                        View venture
                      </Typography>
                      <Iconify icon="carbon:arrow-right" width={14} sx={{ color: 'primary.dark' }} />
                    </Stack>
                  </Box>
                </CardActionArea>
              </Card>
            </Reveal>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button component={Link} href="/" variant="text" startIcon={<Iconify icon="carbon:arrow-left" />}>
          Back to home
        </Button>
      </Box>
    </Container>
  );
}

