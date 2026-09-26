import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/section';

// A few honest, specific-feeling personal details, told plainly rather than
// as marketing copy. Edit these to match what's actually true — they're
// written to sound like a person, not a press release, so keep that
// register when you adjust the specifics.
const ASIDES = [
  {
    label: 'Right now',
    value: "I'm ATAS's only full-time person, so most days move between writing research notes, debugging a model, and answering a support email — in that order, sometimes twice.",
  },
  {
    label: 'Outside ATAS',
    value: 'Kigali is home in the literal sense — it\'s where I grew up, and "Rwanda-first" isn\'t an abstraction I chose, it\'s the only version of this problem I actually know from the inside.',
  },
];

export function AboutSection() {
  return (
    <Section id="about" neutral>
      <Box sx={{ mb: { xs: 5, md: 6 } }}>
        <SectionHeading align="left" overline="About" title="Why I'm doing this" />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: { xs: 6, md: 8 },
          alignItems: 'start',
        }}
      >
        {/* Left — the actual story, told as a short sequence of moments
            rather than one dense paragraph. This is the part that can't be
            found anywhere else on the page. */}
        <Stack spacing={{ xs: 3, md: 3.5 }}>
          <Reveal>
            <Typography
              sx={{
                fontSize: { xs: '1.15rem', md: '1.35rem' },
                fontWeight: 600,
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
                maxWidth: '38ch',
              }}
            >
              I started paying attention the day I watched a voice assistant fail to understand my own
              grandmother — not because she said something unusual, but because it was never built to
              hear her in the first place.
            </Typography>
          </Reveal>

          <Reveal delay={80}>
            <Typography color="text.secondary" sx={{ lineHeight: 1.85, maxWidth: '58ch' }}>
              That stuck with me longer than it probably should have. Every AI product I tried after that
              treated Kinyarwanda, and the way Rwandans actually mix it with English and French, as an
              edge case to patch in later — if at all. It wasn&apos;t a technical limitation. It was a decision
              nobody outside Rwanda had a reason to question.
            </Typography>
          </Reveal>

          <Reveal delay={140}>
            <Typography color="text.secondary" sx={{ lineHeight: 1.85, maxWidth: '58ch' }}>
              I started ATAS at 20 because I didn&apos;t think anyone else was going to fix that from the
              outside, and I&apos;d rather spend my twenties building the thing I wished existed than waiting
              for someone else to get around to it.
            </Typography>
          </Reveal>
        </Stack>

        {/* Right — quieter personal asides, set apart by a single hairline
            rather than a fact-grid (the hero already carries the résumé
            facts, so this is deliberately a different register: texture,
            not data). */}
        <Box
          sx={{
            pl: { md: 6 },
            borderLeft: { md: '1px solid' },
            borderColor: { md: 'divider' },
            pt: { xs: 1, md: 0.5 },
          }}
        >
          <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />} spacing={0}>
            {ASIDES.map((aside, index) => (
              <Reveal key={aside.label} delay={100 + index * 70}>
                <Box sx={{ py: index === 0 ? 0 : 3, pb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {aside.label}
                  </Typography>
                  <Typography sx={{ lineHeight: 1.75, maxWidth: '42ch' }}>{aside.value}</Typography>
                </Box>
              </Reveal>
            ))}
          </Stack>
        </Box>
      </Box>
    </Section>
  );
}