import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Reveal } from '@/components/motion/Reveal';
import { JsonLd } from '@/components/ui/json-ld';
import { SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { PRESS } from '@content/press';
import { SITE } from '@content/site';
import { SPEAKING } from '@content/speaking';
import { breadcrumbNode, graph, webPageNode } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Speaking & Media',
  description:
    'Speaking topics, media resources, and downloadable assets for event organizers and press — IRANKUNDA Elyssa, Founder & CEO of ATAS.',
  path: '/speaking',
  ogImage: '/og/speaking.png',
});

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export default function SpeakingPage() {
  return (
    <Container sx={{ py: { xs: 6, md: 9 } }}>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/speaking',
            name: 'Speaking & Media',
            description: 'Speaking topics, media resources, and downloadable assets.',
          }),
          breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'Speaking & Media', path: '/speaking' }])
        )}
      />
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <SectionHeading
          overline="Speaking & Media"
          title="Talks, topics & media assets"
          description="For event organizers and press teams — what I speak about and everything you need to make it easy."
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: { xs: 7, md: 9 },
          alignItems: 'start',
        }}
      >
        {/* Left column — topics + engagements, both plain text lists
            separated by hairline rules. No card surfaces anywhere. */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Topics
          </Typography>

          <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
            {SPEAKING.topics.map((topic, index) => (
              <Reveal key={topic.title} delay={index * 60}>
                <Box sx={{ py: { xs: 3, md: 3.5 } }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'baseline' }}
                    spacing={{ xs: 0.8, sm: 2 }}
                    sx={{ mb: 1.2 }}
                  >
                    <Typography
                      sx={{
                        fontSize: 'clamp(1.25rem, 1.8vw, 1.5rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                      }}
                    >
                      {topic.title}
                    </Typography>
                    {topic.format ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                      >
                        {topic.format}
                      </Typography>
                    ) : null}
                  </Stack>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.75, maxWidth: '62ch' }}
                  >
                    {topic.description}
                  </Typography>
                </Box>
              </Reveal>
            ))}
          </Stack>

          <Box sx={{ mt: { xs: 6, md: 7 } }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Selected engagements
            </Typography>

            {SPEAKING.engagements.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, maxWidth: '56ch' }}>
                Public sessions will be listed here as they happen. In the meantime, the topics above reflect
                current material — reach out for a full session outline.
              </Typography>
            ) : (
              <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
                {SPEAKING.engagements.map((engagement) => {
                  const content = (
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'baseline' }}
                      spacing={{ xs: 0.5, sm: 2 }}
                      sx={{ py: 2.5 }}
                    >
                      <Box>
                        <Typography
                          component={engagement.link ? 'span' : 'p'}
                          sx={{
                            fontSize: 'clamp(1.05rem, 1.3vw, 1.2rem)',
                            fontWeight: 700,
                            display: 'inline-block',
                            ...(engagement.link ? UNDERLINE_SX : {}),
                          }}
                        >
                          {engagement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                          {[engagement.venue, engagement.location].filter(Boolean).join(' · ')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                        {engagement.year}
                      </Typography>
                    </Stack>
                  );

                  return engagement.link ? (
                    <Box
                      key={`${engagement.title}-${engagement.year}`}
                      component="a"
                      href={engagement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'block',
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover span': { backgroundSize: '100% 1px' },
                      }}
                    >
                      {content}
                    </Box>
                  ) : (
                    <Box key={`${engagement.title}-${engagement.year}`}>{content}</Box>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Box>

        {/* Right column — invite + downloads. Sticky on desktop, plain text
            actions instead of buttons, since these are links, not app UI. */}
        <Box sx={{ position: { md: 'sticky' }, top: { md: 112 } }}>
          <Reveal delay={120}>
            <Box
              sx={{
                pl: { md: 6 },
                borderLeft: { md: '1px solid' },
                borderColor: { md: 'divider' },
              }}
            >
              <Typography
                sx={{ fontSize: 'clamp(1.4rem, 2vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.01em', mb: 2 }}
              >
                Invite me to speak
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, mb: 4, maxWidth: '42ch' }}>
                I give conference talks, podcast interviews, panel sessions, and workshops on Rwanda-first AI
                infrastructure, Kinyarwanda language technology, and building AI companies from Kigali.
              </Typography>

              <Stack spacing={1.6} sx={{ mb: 5 }}>
                <ActionLink
                  href={`mailto:${SITE.email}?subject=Speaking%20invitation`}
                  icon="carbon:email"
                  label="Send an invitation"
                />
                <ActionLink href="/press" icon="carbon:arrow-right" label="Press kit" />
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ pt: 4, mb: 2.5, borderTop: '1px solid', borderColor: 'divider' }}
              >
                Downloads
              </Typography>
              <Stack spacing={1.6}>
                {PRESS.downloads.map((download) => (
                  <Box
                    key={download.href}
                    component="a"
                    href={download.href}
                    download
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: 2,
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover .download-label': { backgroundSize: '100% 1px' },
                    }}
                  >
                    <Typography
                      className="download-label"
                      variant="body1"
                      sx={{ fontWeight: 600, display: 'inline-block', ...UNDERLINE_SX }}
                    >
                      {download.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                      {download.file}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Reveal>
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 8, md: 10 }, pt: { xs: 4, md: 5 }, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography
          component="a"
          href="/"
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
          <Iconify icon="carbon:arrow-left" width={16} />
          Back to home
        </Typography>
      </Box>
    </Container>
  );
}

function ActionLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Typography
      component="a"
      href={href}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        color: 'text.primary',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: '1.05rem',
        width: 'fit-content',
        ...UNDERLINE_SX,
        '&:hover': { backgroundSize: '100% 1px' },
      }}
    >
      <Iconify icon={icon} width={18} />
      {label}
    </Typography>
  );
}
