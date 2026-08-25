import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { PRESS } from '@content/press';
import { SITE } from '@content/site';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Press Kit',
  description:
    'Official bios, fact sheet, photos, and downloadable assets for journalists, event organizers, and partners — IRANKUNDA Elyssa, Founder & CEO of ATAS.',
  path: '/press',
  ogImage: '/og/press.png',
});

export default function PressPage() {
  return (
    <Container sx={{ py: { xs: 6, md: 9 } }}>
      <SectionHeading
        overline="Press"
        title="Press kit"
        description="Everything organizers, journalists, and partners need — accurate, current, and ready to use."
      />

      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            <Reveal>
              <Card sx={{ p: { xs: 2.8, md: 3.4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.4 }}>
                  Short bio
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.85 }}>
                  {PRESS.shortBio}
                </Typography>
              </Card>
            </Reveal>

            <Reveal delay={80}>
              <Card sx={{ p: { xs: 2.8, md: 3.4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.4 }}>
                  Long bio
                </Typography>
                {PRESS.longBio.split('\n\n').map((paragraph) => (
                  <Typography
                    key={paragraph.slice(0, 24)}
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.85, mb: 1.6 }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Card>
            </Reveal>

            <Reveal delay={140}>
              <Card sx={{ p: { xs: 2.8, md: 3.4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.4 }}>
                  About ATAS (boilerplate)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.85 }}>
                  {PRESS.boilerplate}
                </Typography>
                <Button
                  component="a"
                  href={SITE.atas.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  endIcon={<Iconify icon="carbon:arrow-up-right" />}
                  sx={{ mt: 1.6 }}
                >
                  atas.rw
                </Button>
              </Card>
            </Reveal>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3} sx={{ position: 'sticky', top: 96 }}>
            <Reveal delay={100}>
              <Card sx={{ p: { xs: 2.8, md: 3.2 } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Fact sheet
                </Typography>
                <Stack spacing={1.4}>
                  {PRESS.factSheet.map((row) => (
                    <Stack key={row.label} direction="row" justifyContent="space-between" spacing={2}>
                      <Typography variant="body2" sx={{ fontWeight: 700, flexShrink: 0 }}>
                        {row.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                        {row.value}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Card>
            </Reveal>

            <Reveal delay={160}>
              <Card sx={{ p: { xs: 2.8, md: 3.2 } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Photos & downloads
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <SmartImage
                    src="/media/person/elyssa-avatar-800.webp"
                    alt={`Official portrait of ${SITE.name}`}
                    aspect={1}
                    sizes="(max-width: 900px) 100vw, 380px"
                    sx={{ maxWidth: 220 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.6 }}>
                    Official portrait — credit “IRANKUNDA Elyssa / ATAS”
                  </Typography>
                </Box>
                <Divider />
                <Stack spacing={1.2} sx={{ mt: 2 }}>
                  {PRESS.downloads.map((download) => (
                    <Button
                      key={download.href}
                      component="a"
                      href={download.href}
                      download
                      variant="contained"
                      color="inherit"
                      sx={{ bgcolor: 'background.neutral', color: 'text.primary', justifyContent: 'space-between' }}
                      startIcon={<Iconify icon="carbon:document-download" />}
                    >
                      <Box component="span">{download.label}</Box>
                      <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                        {download.file}
                      </Box>
                    </Button>
                  ))}
                </Stack>
              </Card>
            </Reveal>
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button component="a" href={`mailto:${SITE.email}`} variant="contained" startIcon={<Iconify icon="carbon:email" />}>
          Press inquiries
        </Button>
      </Box>
    </Container>
  );
}

