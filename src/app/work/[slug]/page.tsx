import Link from 'next/link';
import { notFound } from 'next/navigation';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { MDXRemote } from 'next-mdx-remote/rsc';

import { ProjectSlides, type ProjectSlide } from '@/features/ventures/ProjectSlides';
import { JsonLd } from '@/components/ui/json-ld';
import { Iconify } from '@/components/ui/iconify';
import { getWork, getWorks } from '@/lib/content';
import { breadcrumbNode, creativeWorkNode, graph, webPageNode } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';
import type { WorkStatus } from '@/lib/content';

const STATUS_LABEL: Record<WorkStatus, string> = { active: 'Active product', research: 'Research program', earlier: 'Earlier work' };

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
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

  const slides: ProjectSlide[] = work.gallery.map((image) => ({
    id: image.src,
    src: image.src,
    alt: image.caption,
    caption: image.caption,
  }));

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <JsonLd
        data={graph(
          creativeWorkNode(work),
          webPageNode({
            path: `/work/${work.slug}`,
            name: work.name,
            description: work.summary,
          }),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: work.name, path: `/work/${work.slug}` },
          ])
        )}
      />

      <Typography
        component={Link}
        href="/work"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          mb: { xs: 4, md: 5 },
          color: 'text.secondary',
          textDecoration: 'none',
          fontWeight: 600,
          ...UNDERLINE_SX,
          '&:hover': { backgroundSize: '100% 1px', color: 'text.primary' },
        }}
      >
        <Iconify icon="carbon:arrow-left" width={16} />
        All work
      </Typography>

      {/* Header — status and period as plain text meta, not a colored
          chip, matching the ledger language on the index page. */}
      <Stack
        direction="row"
        alignItems="baseline"
        spacing={2}
        sx={{ mb: 1.5, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Typography sx={{ fontWeight: 700 }}>{STATUS_LABEL[work.status]}</Typography>
        <Typography color="text.secondary">{work.period}</Typography>
        {work.role ? (
          <Typography color="text.secondary" sx={{ ml: { sm: 'auto' } }}>
            {work.role}
          </Typography>
        ) : null}
      </Stack>

      <Typography
        component="h1"
        sx={{ fontWeight: 800, fontSize: { xs: '2.25rem', md: '3.25rem' }, letterSpacing: '-0.02em', lineHeight: 1.05, mb: 2.5 }}
      >
        {work.name}
      </Typography>

      <Typography
        sx={{ fontWeight: 500, fontSize: { xs: '1.1rem', md: '1.3rem' }, lineHeight: 1.6, color: 'text.secondary', maxWidth: '48ch', mb: { xs: 5, md: 6 } }}
      >
        {work.summary}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' },
          gap: { xs: 6, md: 8 },
          alignItems: 'start',
        }}
      >
        <Box>
          {slides.length > 0 ? (
            <Box sx={{ mb: { xs: 5, md: 6 } }}>
              <ProjectSlides slides={slides} aspect={16 / 10} />
            </Box>
          ) : null}

          <Box className="prose" sx={{ maxWidth: '68ch' }}>
            <MDXRemote source={work.body} />
          </Box>

          {work.website ? (
            <Typography
              component="a"
              href={work.website}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mt: 4,
                color: 'text.primary',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '1.05rem',
                ...UNDERLINE_SX,
                '&:hover': { backgroundSize: '100% 1px' },
              }}
            >
              {`Visit ${work.name}`}
              <Iconify icon="carbon:arrow-up-right" width={16} />
            </Typography>
          ) : null}
        </Box>

        {/* Facts + related, separated by one hairline rule rather than two
            stacked outlined cards. */}
        <Box sx={{ position: { md: 'sticky' }, top: { md: 112 } }}>
          {Object.keys(work.facts).length > 0 ? (
            <Box sx={{ mb: { xs: 5, md: 6 } }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Facts
              </Typography>
              <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
                {Object.entries(work.facts).map(([label, value]) => (
                  <Stack key={label} direction="row" justifyContent="space-between" spacing={2} sx={{ py: 1.3 }}>
                    <Typography variant="body2" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'right' }}>
                      {value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          ) : null}

          {others.length > 0 ? (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                More work
              </Typography>
              <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
                {others.map((item) => (
                  <Box
                    key={item.slug}
                    component={Link}
                    href={`/work/${item.slug}`}
                    sx={{
                      display: 'block',
                      py: 1.6,
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover .related-name': { backgroundSize: '100% 1px' },
                    }}
                  >
                    <Typography
                      className="related-name"
                      sx={{ fontWeight: 700, display: 'inline-block', mb: 0.3, ...UNDERLINE_SX }}
                    >
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item.summary}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Container>
  );
}
