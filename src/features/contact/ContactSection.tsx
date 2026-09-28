'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { SITE } from '@content/site';
import { COLLABORATION_ITEMS } from '@content/home';
import { trackEvent } from '@/lib/analytics';
import { SOCIAL_PROFILES } from '@/lib/nav';

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

const CHANNELS = [
  { icon: 'mdi:email', label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: 'mdi:phone', label: 'Phone', value: SITE.phone, href: SITE.phoneHref },
  { icon: 'mdi:map-marker', label: 'Location', value: SITE.location, href: null },
];

export function ContactSection() {
  return (
    <Section id="contact" neutral>
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <SectionHeading
          overline="Contact"
          title="Let's build something that matters"
          description="Partnerships, speaking invitations, collaboration with schools, or press — email is the fastest way to reach me directly."
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '6fr 6fr' },
          gap: { xs: 7, md: 10 },
        }}
      >
        {/* Left — direct channels, the actual point of the section. Email
            is set noticeably larger since it's the one action that matters. */}
        <Reveal>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Direct
            </Typography>

            <Typography
              component="a"
              href={CHANNELS[0].href!}
              onClick={() => trackEvent('contact_channel_click', { channel: 'Email' })}
              sx={{
                display: 'inline-block',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 800,
                letterSpacing: '-0.015em',
                color: 'text.primary',
                textDecoration: 'none',
                wordBreak: 'break-word',
                mb: { xs: 4, md: 5 },
                ...UNDERLINE_SX,
                '&:hover': { backgroundSize: '100% 1px' },
              }}
            >
              {SITE.email}
            </Typography>

            <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
              {CHANNELS.slice(1).map((channel) => (
                <Stack
                  key={channel.label}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ py: 1.8 }}
                >
                  <Iconify
                    icon={channel.icon}
                    width={17}
                    style={{ flexShrink: 0, opacity: 0.55 }}
                  />
                  {channel.href ? (
                    <Typography
                      component="a"
                      href={channel.href}
                      onClick={() =>
                        trackEvent('contact_channel_click', { channel: channel.label })
                      }
                      sx={{
                        display: 'inline-block',
                        fontWeight: 700,
                        color: 'text.primary',
                        textDecoration: 'none',
                        wordBreak: 'break-word',
                        ...UNDERLINE_SX,
                        '&:hover': { backgroundSize: '100% 1px' },
                      }}
                    >
                      {channel.value}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontWeight: 700 }}>{channel.value}</Typography>
                  )}
                </Stack>
              ))}
            </Stack>
          </Box>
        </Reveal>

        {/* Right — what I'm open to, plus socials. Real content, not a
            sidebar filler: gives the second column its own reason to exist. */}
        <Reveal delay={100}>
          <Box
            sx={{
              pl: { md: 6 },
              borderLeft: { md: '1px solid' },
              borderColor: { md: 'divider' },
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Open to
            </Typography>

            <Stack
              divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}
              sx={{ mb: { xs: 5, md: 6 } }}
            >
              {COLLABORATION_ITEMS.map((item) => (
                <Typography
                  key={item}
                  variant="body1"
                  sx={{ py: 1.8, lineHeight: 1.6, maxWidth: '42ch' }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Elsewhere
            </Typography>
            <Stack direction="row" spacing={3}>
              {SOCIAL_PROFILES.map((social) => (
                <Typography
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  onClick={() =>
                    trackEvent('social_click', { platform: social.label, location: 'contact' })
                  }
                  sx={{
                    display: 'inline-flex',
                    color: 'text.secondary',
                    transition: 'color 200ms ease',
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  <Iconify icon={social.icon} width={20} />
                </Typography>
              ))}
            </Stack>
          </Box>
        </Reveal>
      </Box>
    </Section>
  );
}
