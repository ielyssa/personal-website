import Box from '@mui/material/Box';

import { ContactSection } from '@/features/contact/ContactSection';
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
      <ContactSection contactConfigured={Boolean(process.env.RESEND_API_KEY)} />
    </Box>
  );
}

