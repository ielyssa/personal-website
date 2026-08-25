import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { SITE } from '@content/site';

const PROFILE_FACTS = [
  { label: 'Role', value: 'Founder & CEO at ATAS' },
  { label: 'Organization', value: 'ATAS — Alliance for Transformative AI Systems' },
  { label: 'Based in', value: SITE.location },
  { label: 'Founded ATAS', value: SITE.foundedAtas },
];

const FOCUS_AREAS = ['AI Infrastructure', 'Kinyarwanda Language AI', 'Education Technology'];

export function AboutSection() {
  return (
    <Section id="about" neutral>
      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
        <Grid size={{ xs: 12, md: 7 }}>
          <SectionHeading
            align="left"
            overline="About"
            title="Building AI that understands Rwanda"
          />
          <Reveal>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 2.5 }}>
              {`I'm IRANKUNDA Elyssa, founder and CEO of ATAS (Alliance for Transformative AI Systems). I lead the company's research, products, and engineering end to end — from Kinyarwanda language technology to national education infrastructure.`}
            </Typography>
          </Reveal>
          <Reveal delay={90}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
              {`I believe African intelligence should be built and narrated by Africans. ATAS exists to turn that belief into systems people actually use — built in Rwanda, for Rwanda first, then for every market like it.`}
            </Typography>
          </Reveal>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Reveal delay={140}>
            <Card sx={{ p: { xs: 3, md: 3.5 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                At a glance
              </Typography>
              <Stack spacing={1.6}>
                {PROFILE_FACTS.map((fact) => (
                  <Box key={fact.label}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {fact.label}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {fact.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 2.5 }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Focus areas
              </Typography>
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {FOCUS_AREAS.map((area) => (
                  <Chip key={area} label={area} size="small" variant="outlined" />
                ))}
              </Stack>
            </Card>
          </Reveal>
        </Grid>
      </Grid>
    </Section>
  );
}

