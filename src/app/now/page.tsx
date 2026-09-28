import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { JsonLd } from '@/components/ui/json-ld';
import { getNow } from '@/lib/content';
import { breadcrumbNode, graph, webPageNode } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';
import { toDisplayDate } from '@/lib/utils/date';

export const metadata = buildMetadata({
  title: 'Now',
  description:
    'What IRANKUNDA Elyssa is building right now — AcademiaPlus school onboardings, IMIZI research, and the Kinyarwanda language program.',
  path: '/now',
  ogImage: '/og/now.png',
});

// How long since the update before it's worth flagging that this page might
// be stale — a "now page" is only useful if it's actually current. Purely a
// visual signal (a muted note), never blocks rendering.
const STALE_AFTER_DAYS = 60;

function daysSince(dateString: string) {
  return Math.floor((Date.now() - Date.parse(dateString)) / (1000 * 60 * 60 * 24));
}

export default function NowPage() {
  const now = getNow();
  const stale = daysSince(now.updated) > STALE_AFTER_DAYS;

  return (
    <Container sx={{ py: { xs: 6, md: 9 } }}>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/now',
            name: 'Now',
            description: 'What IRANKUNDA Elyssa is building right now.',
            dateModified: now.updated,
          }),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Now', path: '/now' },
          ])
        )}
      />

      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        {/* Header treated like a dated entry, in keeping with the "now page"
            convention — the date is part of the content, not a caption. */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
          flexWrap="wrap"
          rowGap={1}
          sx={{ mb: { xs: 4, md: 5 }, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Now
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`Updated ${toDisplayDate(now.updated)}`}
          </Typography>
        </Stack>

        <Typography
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem' },
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            mb: { xs: 4, md: 5 },
          }}
        >
          {"What I'm building now"}
        </Typography>

        {stale ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
            {"This hasn't been updated in a while — some of it may have moved on since."}
          </Typography>
        ) : null}

        <Box className="prose" sx={{ maxWidth: '65ch' }}>
          <MDXRemote source={now.body} />
        </Box>

        <Box
          sx={{
            mt: { xs: 6, md: 7 },
            pt: { xs: 3, md: 4 },
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {'This is a '}
            <Typography
              component="a"
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              now page
            </Typography>
            {' — a snapshot of focus, not a running log.'}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
