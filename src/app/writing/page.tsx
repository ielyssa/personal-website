import { Suspense } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/section';
import { WritingIndexClient } from '@/features/writing/WritingIndexClient';
import { getPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

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
      <SectionHeading
        overline="Writing"
        title="Notes from building"
        description="What I learn while building ATAS — documented with publication and update context."
      />
      <Reveal>
        <Suspense fallback={<Box sx={{ minHeight: 320 }} />}>
          <WritingIndexClient posts={posts} />
        </Suspense>
      </Reveal>
    </Container>
  );
}

