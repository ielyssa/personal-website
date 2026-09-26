import Box from '@mui/material/Box';

import { ContactSection } from '@/features/contact/ContactSection';
import { JsonLd } from '@/components/ui/json-ld';
import { breadcrumbNode, graph, webPageNode } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Get in touch with IRANKUNDA Elyssa — partnerships, speaking invitations, education collaboration, and press inquiries.',
  path: '/contact',
  ogImage: '/og/contact.png',
});

export default function ContactPage() {
  return (
    <Box>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/contact',
            name: 'Contact',
            description: 'Contact IRANKUNDA Elyssa for partnerships, speaking, education, and press inquiries.',
            type: 'ContactPage',
          }),
          breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])
        )}
      />
      <ContactSection />
    </Box>
  );
}

