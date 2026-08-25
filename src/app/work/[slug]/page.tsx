import Link from 'next/link';
import { notFound } from 'next/navigation';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { MDXRemote } from 'next-mdx-remote/rsc';

import { Carousel } from '@/components/media/Carousel';
import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import { JsonLd } from '@/components/ui/json-ld';
import { Iconify } from '@/components/ui/iconify';
import { SITE } from '@content/site';
import { getWork, getWorks } from '@/lib/content';
import { breadcrumbNode, creativeWorkNode, graph } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

const STATUS_COLOR = { active: 'success', research: 'info', earlier: 'default' } as const;
const STATUS_LABEL = { active: 'Active product', research: 'Research program', earlier: 'Earlier work' } as const;

const LOGOS: Record<string, string> = {
  atas: '/media/logos/atas.webp',
  academiaplus: '/media/logos/academiaplus.webp',
  imizi: '/media/logos/atas.webp',
  edubridge: '/media/logos/edubridge.webp',
  'kinyarwanda-tts': '/media/logos/kinyarwanda-tts.webp',
};

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWorks().map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return buildMetadata({ title: 'Not found', description: 'Venture not found.', path: `/work/${slug}`, noindex: true });
  return buildMetadata({
    title: `${work.name} — ATAS Venture`,
    description: work.summary,
    path: `/work/${work.slug}`,
    ogImage: `/og/work-${work.slug}.png`,
  });
}

export default async function WorkDetailPage({ params }: Params) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const others = getWorks().filter((item) => item.slug !== work.slug).slice(0, 2);

  const slides = work.gallery.map((image) => ({
    id: image.src,
    caption: image.caption,
    node: <SmartImage src={image.src} alt={image.caption} fill sizes="(max-width: 900px) 100vw, 66vw" sx={{ borderRadius: 0 }} />,
  }));

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <JsonLd
        data={graph(
          creativeWorkNode(work),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: work.name, path: `/work/${work.slug}` },
          ])
        )}
      />

      <Button component={Link} href="/work" startIcon={<Iconify icon="carbon:arrow-left" />} sx={{ mb: 3 }}>
        All work
      </Button>

      <Grid container spacing={{ xs: 3, md: 5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
            <Avatar src={LOGOS[work.slug]} alt={`${work.name} logo`} sx={{ width: 56, height: 56, bgcolor: 'background.neutral' }} />
            <Box>
              <Stack direction="row" spacing={1.2} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="h2" component="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.9rem', md: '2.5rem' } }}>
                  {work.name}
                </Typography>
                <Chip label={STATUS_LABEL[work.status]} size="small" color={STATUS_COLOR[work.status]} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                {`${work.period} · Built at ${SITE.atas.shortName}, Kigali`}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.6, color: 'text.secondary', mb: 3 }}>
            {work.summary}
          </Typography>

          {slides.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              <Carousel slides={slides} ariaLabel={`${work.name} gallery`} aspect={16 / 10} />
            </Box>
          ) : null}

          <Box className="prose" sx={{ maxWidth: 720 }}>
            <MDXRemote source={work.body} />
          </Box>

          {work.website ? (
            <Button
              component="a"
              href={work.website}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              endIcon={<Iconify icon="carbon:arrow-up-right" />}
              sx={{ mt: 3 }}
            >
              Visit {work.name}
            </Button>
          ) : null}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Reveal>
            <Card variant="outlined" sx={{ p: 2.8, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.6 }}>
                Facts
              </Typography>
              <Stack spacing={1.4}>
                {Object.entries(work.facts).map(([label, value]) => (
                  <Box key={label}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {label}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>

            <Card variant="outlined" sx={{ p: 2.8 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.6 }}>
                More work
              </Typography>
              <Stack spacing={1.6}>
                {others.map((item) => (
                  <Box key={item.slug}>
                    <Button
                      component={Link}
                      href={`/work/${item.slug}`}
                      sx={{ p: 0, minWidth: 0, justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.name}
                      </Typography>
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      {item.summary}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary">
                {`All ventures are built at ATAS — ${SITE.atas.site.replace('https://', '')}`}
              </Typography>
            </Card>
          </Reveal>
        </Grid>
      </Grid>
    </Container>
  );
}
