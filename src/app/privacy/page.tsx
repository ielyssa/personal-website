import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { SITE } from '@content/site';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Privacy',
  description: 'How ielyssa.com handles data: privacy-friendly analytics, the contact form, and your choices.',
  path: '/privacy',
  ogImage: '/og/privacy.png',
});

const SECTIONS = [
  {
    title: 'Analytics',
    body: `This site uses privacy-friendly, aggregate analytics: Vercel Analytics and Vercel Speed Insights collect anonymized pageview and performance data without cookies or cross-site tracking. If enabled, Plausible Analytics also runs cookieless and stores no personal identifiers. No advertising trackers are used.`,
  },
  {
    title: 'Contact form',
    body: `If you send a message through the contact form, your name, email address, and message are delivered to ${SITE.email} via an email service and used only to reply to you. Messages are not stored on this website.`,
  },
  {
    title: 'Newsletter',
    body: `If you subscribe to updates, your email address is processed by our newsletter provider (Buttondown) solely to send occasional updates. Every email includes an unsubscribe link.`,
  },
  {
    title: 'Your choices',
    body: `You can browse this site with analytics blocked or disabled — the site works fully either way. To request deletion of any correspondence, email ${SITE.email}.`,
  },
  {
    title: 'Changes',
    body: `This policy may be updated as the site evolves. Material changes will be reflected on this page with an updated date.`,
  },
];

export default function PrivacyPage() {
  return (
    <Container sx={{ py: { xs: 6, md: 9 }, maxWidth: 'md' }}>
      <Typography variant="overline" sx={{ color: 'primary.dark', fontWeight: 700, letterSpacing: 2 }}>
        Legal
      </Typography>
      <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 4, fontSize: { xs: '2rem', md: '2.6rem' } }}>
        Privacy
      </Typography>
      <Box sx={{ maxWidth: 680 }}>
        {SECTIONS.map((section) => (
          <Box key={section.title} sx={{ mb: 3.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {section.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.85 }}>
              {section.body}
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="text.secondary">
          {`Questions? ${SITE.email}`}
        </Typography>
      </Box>
    </Container>
  );
}

