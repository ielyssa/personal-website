import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import { JsonLd } from '@/components/ui/json-ld';
import { SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { PRESS } from '@content/press';
import { SITE } from '@content/site';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbNode, graph, webPageNode } from '@/lib/jsonld';

export const metadata = buildMetadata({
  title: 'Press Kit',
  description:
    'Official bios, fact sheet, photos, and downloadable assets for journalists, event organizers, and partners — IRANKUNDA Elyssa, Founder & CEO of ATAS.',
  path: '/press',
  ogImage: '/og/press.png',
});

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{ fontSize: 'clamp(1.4rem, 2vw, 1.75rem)', fontWeight: 800, letterSpacing: '-0.01em', mb: 2 }}
    >
      {children}
    </Typography>
  );
}

export default function PressPage() {
  return (
    <Container sx={{ py: { xs: 6, md: 9 } }}>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/press',
            name: 'Press Kit',
            description: 'Official bios, facts, photos, and downloadable media assets.',
          }),
          breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'Press Kit', path: '/press' }])
        )}
      />
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <SectionHeading
          overline="Press"
          title="Press kit"
          description="Everything organizers, journalists, and partners need — accurate, current, and ready to use."
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
        {/* Left column — bios, read top to bottom like a document */}
        <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />} spacing={{ xs: 4, md: 5 }}>
          <Reveal>
            <Box sx={{ pb: { xs: 4, md: 5 } }}>
              <Heading>Short bio</Heading>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.85, maxWidth: '68ch' }}>
                {PRESS.shortBio}
              </Typography>
            </Box>
          </Reveal>

          <Reveal delay={70}>
            <Box sx={{ pb: { xs: 4, md: 5 } }}>
              <Heading>Long bio</Heading>
              <Stack spacing={2}>
                {PRESS.longBio.split('\n\n').map((paragraph) => (
                  <Typography
                    key={paragraph.slice(0, 24)}
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.85, maxWidth: '68ch' }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Reveal>

          <Reveal delay={140}>
            <Box>
              <Heading>About ATAS</Heading>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.85, maxWidth: '68ch', mb: 1.5 }}>
                {PRESS.boilerplate}
              </Typography>
              <Typography
                component="a"
                href={SITE.atas.site}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontWeight: 700,
                  ...UNDERLINE_SX,
                  '&:hover': { backgroundSize: '100% 1px' },
                }}
              >
                atas.rw
                <Iconify icon="carbon:arrow-up-right" width={16} />
              </Typography>
            </Box>
          </Reveal>
        </Stack>

        {/* Right column — fact sheet, photo, downloads. Sticky, no card
            surface: separated from the left column by a single hairline. */}
        <Box sx={{ position: { md: 'sticky' }, top: { md: 112 } }}>
          <Reveal delay={100}>
            <Box sx={{ pl: { md: 6 }, borderLeft: { md: '1px solid' }, borderColor: { md: 'divider' } }}>
              <Heading>Fact sheet</Heading>
              <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />} sx={{ mb: 5 }}>
                {PRESS.factSheet.map((row) => (
                  <Stack
                    key={row.label}
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ py: 1.4 }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                      {row.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
                      {row.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Heading>Photo</Heading>
              <Box sx={{ mb: 5 }}>
                <Box sx={{ maxWidth: 220, mb: 1 }}>
                  <SmartImage
                    src="/media/person/elyssa-avatar-800.webp"
                    alt={`Official portrait of ${SITE.name}`}
                    aspect={1}
                    sizes="220px"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {'Official portrait — credit "IRANKUNDA Elyssa / ATAS"'}
                </Typography>
              </Box>

              <Heading>Downloads</Heading>
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
          href={`mailto:${SITE.email}`}
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
          <Iconify icon="carbon:email" width={18} />
          Press inquiries
        </Typography>
      </Box>
    </Container>
  );
}
