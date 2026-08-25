import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { PRESS } from '@content/press';
import { SITE } from '@content/site';
import { SPEAKING } from '@content/speaking';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Speaking & Media',
  description:
    'Speaking topics, media resources, and downloadable assets for event organizers and press — IRANKUNDA Elyssa, Founder & CEO of ATAS.',
  path: '/speaking',
  ogImage: '/og/speaking.png',
});

export default function SpeakingPage() {
  return (
    <Container sx={{ py: { xs: 6, md: 9 } }}>
      <SectionHeading
        overline="Speaking & Media"
        title="Talks, topics & media assets"
        description="For event organizers and press teams — what I speak about and everything you need to make it easy."
      />

      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={{ xs: 2, md: 2.5 }}>
            {SPEAKING.topics.map((topic, index) => (
              <Reveal key={topic.title} delay={index * 70}>
                <Card sx={{ p: { xs: 2.6, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.8 }}>
                    {topic.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    {topic.description}
                  </Typography>
                </Card>
              </Reveal>
            ))}
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Card variant="outlined" sx={{ p: { xs: 2.6, md: 3 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.6 }}>
                Selected engagements
              </Typography>
              {SPEAKING.engagements.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Public sessions will be listed here as they happen. In the meantime, the topics above reflect
                  current material — reach out for a full session outline.
                </Typography>
              ) : (
                <Stack spacing={1.2}>
                  {SPEAKING.engagements.map((engagement) => (
                    <Box key={`${engagement.title}-${engagement.year}`}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {`${engagement.title} — ${engagement.venue}, ${engagement.year}`}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Card>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Reveal delay={120}>
            <Card sx={{ p: { xs: 2.8, md: 3.2 }, position: 'sticky', top: 96 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                Invite me to speak
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 2.4 }}>
                {`I give conference talks, podcast interviews, panel sessions, and workshops on Rwanda-first AI infrastructure, Kinyarwanda language technology, and building AI companies from Kigali.`}
              </Typography>
              <Stack spacing={1.2}>
                <Button
                  component="a"
                  href={`mailto:${SITE.email}?subject=Speaking%20invitation`}
                  variant="contained"
                  startIcon={<Iconify icon="carbon:email" />}
                >
                  Send an invitation
                </Button>
                <Button component="a" href="/press" variant="outlined" endIcon={<Iconify icon="carbon:arrow-right" />}>
                  Press kit
                </Button>
              </Stack>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 3, mb: 1.2 }}>
                Downloads
              </Typography>
              <Stack spacing={1}>
                {PRESS.downloads.map((download) => (
                  <Button
                    key={download.href}
                    component="a"
                    href={download.href}
                    download
                    variant="outlined"
                    size="small"
                    startIcon={<Iconify icon="carbon:document-download" />}
                    sx={{ justifyContent: 'space-between' }}
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
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button component="a" href="/" variant="text" startIcon={<Iconify icon="carbon:arrow-left" />}>
          Back to home
        </Button>
      </Box>
    </Container>
  );
}

