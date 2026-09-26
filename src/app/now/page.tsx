import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
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

export default function NowPage() {
  const now = getNow();

  return (
    <Container sx={{ py: { xs: 6, md: 9 }, maxWidth: 'md' }}>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/now',
            name: 'Now',
            description: 'What IRANKUNDA Elyssa is building right now.',
            dateModified: now.updated,
          }),
          breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'Now', path: '/now' }])
        )}
      />
      <Typography variant="overline" sx={{ color: 'primary.dark', fontWeight: 700, letterSpacing: 2 }}>
        Now
      </Typography>
      <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 1, fontSize: { xs: '2rem', md: '2.6rem' } }}>
        {"What I'm building now"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {`Last updated ${toDisplayDate(now.updated)}`}
      </Typography>
      <Box className="prose" sx={{ maxWidth: 680 }}>
        <MDXRemote source={now.body} />
      </Box>
    </Container>
  );
}

