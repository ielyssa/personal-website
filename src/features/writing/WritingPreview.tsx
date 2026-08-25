'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { trackEvent } from '@/lib/analytics';
import type { Post } from '@/lib/content';
import { toDisplayDate } from '@/lib/utils/date';

export function WritingPreview({ posts }: { posts: Post[] }) {
  const [featured, ...recent] = posts;

  return (
    <Section id="writing" neutral>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: { xs: 4, md: 6 } }}>
        <SectionHeading
          align="left"
          overline="Writing"
          title="Notes from building"
          description="What I'm learning while building ATAS — research notes, product decisions, and lessons."
        />
        <Button
          component={Link}
          href="/writing"
          endIcon={<Iconify icon="carbon:arrow-right" />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, flexShrink: 0 }}
        >
          All writing
        </Button>
      </Stack>

      {featured ? (
        <Reveal>
          <Card
            sx={{ mb: 3, overflow: 'hidden', transition: 'box-shadow 280ms ease', '&:hover': { boxShadow: (th) => th.customShadows.z12 } }}
          >
            <CardActionArea
              component={Link}
              href={`/writing/${featured.slug}`}
              onClick={() => trackEvent('post_open', { post: featured.slug, source: 'home_featured' })}
            >
              <Grid container>
                <Grid size={{ xs: 12, md: 5 }}>
                  <SmartImage
                    src={featured.cover}
                    alt={featured.title}
                    aspect={16 / 9}
                    priority
                    sizes="(max-width: 900px) 100vw, 40vw"
                    sx={{ borderRadius: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <CardContent sx={{ p: { xs: 2.6, md: 3.6 } }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                      <Chip label={featured.tags[0]} size="small" color="primary" />
                      <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                        {toDisplayDate(featured.publishedAt)}
                      </Typography>
                    </Stack>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.2 }}>
                      {featured.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75, mb: 1.5 }}>
                      {featured.summary}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {`${featured.readingMinutes} min read`}
                    </Typography>
                  </CardContent>
                </Grid>
              </Grid>
            </CardActionArea>
          </Card>
        </Reveal>
      ) : null}

      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        {recent.slice(0, 3).map((post, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.slug}>
            <Reveal delay={index * 90}>
              <Card
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  transition: 'transform 280ms ease, box-shadow 280ms ease',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: (th) => th.customShadows.z12 },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/writing/${post.slug}`}
                  onClick={() => trackEvent('post_open', { post: post.slug, source: 'home_grid' })}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
                >
                  <SmartImage
                    src={post.cover}
                    alt={post.title}
                    aspect={16 / 9}
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 45vw, 30vw"
                    sx={{ borderRadius: 0 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Chip label={post.tags[0]} size="small" variant="outlined" />
                      <Typography variant="caption" color="text.secondary">
                        {toDisplayDate(post.publishedAt)}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.8, lineHeight: 1.4 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {post.summary}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Reveal>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: { xs: 'block', sm: 'none' }, textAlign: 'center' }}>
        <Button component={Link} href="/writing" endIcon={<Iconify icon="carbon:arrow-right" />}>
          All writing
        </Button>
      </Box>
    </Section>
  );
}

