import Box from '@mui/material/Box';

import { AboutSection } from '@/features/identity/AboutSection';
import { Hero } from '@/features/identity/Hero';
import { ContactSection } from '@/features/contact/ContactSection';
import { VentureSpotlight } from '@/features/ventures/VentureSpotlight';
import { WorkHighlights } from '@/features/ventures/WorkHighlights';
import { WritingPreview } from '@/features/writing/WritingPreview';
import { getPosts, getWorks } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'IRANKUNDA Elyssa — Founder & CEO of ATAS',
  description:
    'I build AI companies that understand Rwanda. Founder of ATAS — AcademiaPlus in schools today, IMIZI as long-term research, Kinyarwanda language technology underneath.',
  path: '/',
});

export default function HomePage() {
  const posts = getPosts();
  const works = getWorks();

  return (
    <Box>
      <Hero />
      <AboutSection />
      <VentureSpotlight />
      <WorkHighlights works={works} />
      <WritingPreview posts={posts} />
      <ContactSection />
    </Box>
  );
}
