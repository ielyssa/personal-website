import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SITE } from '@content/site';
import { JsonLd } from '@/components/ui/json-ld';
import { breadcrumbNode, graph, webPageNode } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Privacy',
  description:
    'How ielyssa.com handles data: privacy-friendly analytics, direct correspondence, and your choices.',
  path: '/privacy',
  ogImage: '/og/privacy.png',
});

const SECTIONS = [
  {
    title: 'Analytics',
    body: 'This site uses Vercel Analytics and Vercel Speed Insights for aggregate pageview and performance data. If enabled, Plausible Analytics provides cookieless custom-event measurement. If a Google Analytics 4 measurement ID is configured, Google Analytics also receives pageviews and selected interaction events; Google may use cookies and processes that data under its own policies. No advertising pixels or retargeting campaigns are configured by this site.',
  },
  {
    title: 'Contact',
    body: `Messages sent to ${SITE.email} are used only to reply to you and are not stored on this website beyond normal email retention.`,
  },
  {
    title: 'Your choices',
    body: 'You can browse this site with analytics blocked or disabled — the site works fully either way. To request deletion of any correspondence, email the address below.',
  },
  {
    title: 'Changes',
    body: 'This policy may be updated as the site evolves. Material changes will be reflected on this page with an updated date.',
  },
];

const UPDATED = 'September 2026';

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 320ms cubic-bezier(0.4, 0, 0.2, 1)',
};

function slug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function PrivacyPage() {
  return (
    <Container sx={{ py: { xs: 6, md: 9 } }}>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/privacy',
            name: 'Privacy',
            description:
              'How ielyssa.com handles analytics, direct correspondence, and your choices.',
          }),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Privacy', path: '/privacy' },
          ])
        )}
      />

      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1.5 }}>
          Legal
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.25rem', md: '3rem' },
            letterSpacing: '-0.02em',
            mb: 1.5,
          }}
        >
          Privacy
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`Last updated ${UPDATED}`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '4fr 8fr' },
          gap: { xs: 5, md: 8 },
        }}
      >
        {/* Jump-to index — genuinely functional here, unlike a decorative
            table of contents: this is the one page type people actually
            scan for a single answer rather than read start to finish. */}
        <Box sx={{ position: { md: 'sticky' }, top: { md: 112 }, alignSelf: 'start' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            On this page
          </Typography>
          <Stack
            component="nav"
            spacing={1.2}
            sx={{ borderLeft: '1px solid', borderColor: 'divider', pl: 2.5 }}
          >
            {SECTIONS.map((section) => (
              <Typography
                key={section.title}
                component="a"
                href={`#${slug(section.title)}`}
                variant="body2"
                sx={{
                  display: 'inline-block',
                  width: 'fit-content',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  ...UNDERLINE_SX,
                  '&:hover': { backgroundSize: '100% 1px', color: 'text.primary' },
                }}
              >
                {section.title}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
          {SECTIONS.map((section, index) => (
            <Box
              key={section.title}
              id={slug(section.title)}
              sx={{ py: { xs: 3.5, md: 4 }, scrollMarginTop: 96 }}
            >
              <Stack direction="row" spacing={2} alignItems="baseline" sx={{ mb: 1.2 }}>
                <Typography
                  color="text.secondary"
                  sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', md: '1.3rem' } }}>
                  {section.title}
                </Typography>
              </Stack>
              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.8, maxWidth: '62ch', pl: { xs: 0, sm: 4.5 } }}
              >
                {section.body}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          mt: { xs: 6, md: 7 },
          pt: { xs: 4, md: 5 },
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Questions
        </Typography>
        <Typography
          component="a"
          href={`mailto:${SITE.email}`}
          sx={{
            display: 'inline-block',
            fontWeight: 700,
            color: 'text.primary',
            textDecoration: 'none',
            ...UNDERLINE_SX,
            '&:hover': { backgroundSize: '100% 1px' },
          }}
        >
          {SITE.email}
        </Typography>
      </Box>
    </Container>
  );
}
