'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ContactForm } from '@/features/contact/ContactForm';
import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { SITE } from '@content/site';
import { COLLABORATION_ITEMS } from '@content/home';
import { trackEvent } from '@/lib/analytics';
import { SOCIAL_PROFILES } from '@/lib/nav';

const CHANNELS = [
  { icon: 'mdi:email', label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: 'mdi:phone', label: 'Phone', value: SITE.phone, href: SITE.phoneHref },
  { icon: 'mdi:map-marker', label: 'Location', value: SITE.location, href: null },
];

export function ContactSection({ contactConfigured }: { contactConfigured: boolean }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);
  const newsletterUrl = process.env.NEXT_PUBLIC_BUTTONDOWN_URL;

  return (
    <Section id="contact" neutral>
      <SectionHeading
        overline="Contact"
        title="Let's build something that matters"
        description="Partnerships, speaking invitations, collaboration with schools, or press — this is the fastest path."
      />
      <Grid container spacing={{ xs: 3, md: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Reveal>
            <Card sx={{ p: { xs: 2.8, md: 3.4 }, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Direct channels
              </Typography>
              <Stack spacing={1.4}>
                {CHANNELS.map((channel) => (
                  <Stack
                    key={channel.label}
                    direction="row"
                    spacing={1.4}
                    alignItems="center"
                    sx={{ p: 1.4, borderRadius: 1.8, border: 1, borderColor: 'divider', bgcolor: 'background.neutral' }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 1.4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: (th) => th.palette.primary.main,
                        color: 'primary.contrastText',
                        flexShrink: 0,
                      }}
                    >
                      <Iconify icon={channel.icon} width={19} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {channel.label}
                      </Typography>
                      {channel.href ? (
                        <Typography
                          component="a"
                          href={channel.href}
                          variant="subtitle2"
                          onClick={() => trackEvent('contact_channel_click', { channel: channel.label })}
                          sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.dark' }, wordBreak: 'break-word' }}
                        >
                          {channel.value}
                        </Typography>
                      ) : (
                        <Typography variant="subtitle2">{channel.value}</Typography>
                      )}
                    </Box>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 2.6 }} />

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.6 }}>
                Open to
              </Typography>
              <Stack spacing={1.1} sx={{ mb: 2.6 }}>
                {COLLABORATION_ITEMS.map((item) => (
                  <Stack key={item} direction="row" spacing={1} alignItems="flex-start">
                    <Iconify icon="carbon:checkmark-filled" width={17} sx={{ color: 'primary.dark', mt: '3px' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                {SOCIAL_PROFILES.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    onClick={() => trackEvent('social_click', { platform: social.label, location: 'contact' })}
                    sx={{
                      width: 44,
                      height: 44,
                      color: 'text.secondary',
                      bgcolor: 'background.neutral',
                      '&:hover': { color: 'primary.dark', transform: 'translateY(-2px)' },
                      transition: 'color 200ms ease, transform 200ms ease',
                    }}
                  >
                    <Iconify icon={social.icon} width={21} />
                  </IconButton>
                ))}
              </Stack>
            </Card>
          </Reveal>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3} sx={{ height: '100%' }}>
            <Reveal delay={100}>
              <ContactForm configured={contactConfigured} />
            </Reveal>

            {newsletterUrl ? (
              <Reveal delay={160}>
                <Card sx={{ p: { xs: 2.8, md: 3.2 } }}>
                  {newsletterDone ? (
                    <Typography variant="body2" color="text.secondary">
                      Thanks — check your inbox to confirm the subscription.
                    </Typography>
                  ) : (
                    <form
                      action={newsletterUrl}
                      method="post"
                      target="_blank"
                      onSubmit={() => {
                        setNewsletterDone(true);
                        trackEvent('newsletter_signup', { location: 'contact' });
                      }}
                    >
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {"Occasional updates"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {"What I'm building and writing. No spam."}
                          </Typography>
                        </Box>
                        <TextField
                          size="small"
                          type="email"
                          name="email"
                          required
                          placeholder="you@example.com"
                          value={newsletterEmail}
                          onChange={(event) => setNewsletterEmail(event.target.value)}
                          aria-label="Email address for updates"
                          sx={{ minWidth: { sm: 240 } }}
                        />
                        <Button type="submit" variant="outlined">
                          Subscribe
                        </Button>
                      </Stack>
                    </form>
                  )}
                </Card>
              </Reveal>
            ) : null}
          </Stack>
        </Grid>
      </Grid>
    </Section>
  );
}

