import { Suspense } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { JsonLd } from '@/components/ui/json-ld';
import { SectionHeading } from '@/components/ui/section';
import { WritingIndexClient } from '@/features/writing/WritingIndexClient';
import { getPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbNode, collectionPageNode, graph, itemListNode } from '@/lib/jsonld';

export const metadata = buildMetadata({
  title: 'Writing',
  description:
    'Essays and notes from IRANKUNDA Elyssa on building AI in Rwanda — entrepreneurship, Kinyarwanda language technology, education infrastructure.',
  path: '/writing',
  ogImage: '/og/writing-index.png',
});

export default function WritingIndexPage() {
  const posts = getPosts();

  return (
    <Container sx={{ py: { xs: 6, md: 9 } }}>
      <JsonLd
        data={graph(
          collectionPageNode({
            path: '/writing',
            name: 'Writing',
            description: 'Essays and notes from building AI in Rwanda.',
          }),
          itemListNode(
            '/writing',
            posts.map((post) => ({ name: post.title, path: `/writing/${post.slug}` }))
          ),
          breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'Writing', path: '/writing' }])
        )}
      />
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <SectionHeading
          overline="Writing"
          title="Notes from building"
          description="What I learn while building ATAS — documented with publication and update context."
        />
      </Box>
      <Suspense fallback={<Box sx={{ minHeight: 320 }} />}>
        <WritingIndexClient posts={posts} />
      </Suspense>
    </Container>
  );
}
