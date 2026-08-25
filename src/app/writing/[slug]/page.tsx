import Link from 'next/link';
import { notFound } from 'next/navigation';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { MDXRemote } from 'next-mdx-remote/rsc';

import { SmartImage } from '@/components/media/SmartImage';
import { JsonLd } from '@/components/ui/json-ld';
import { Iconify } from '@/components/ui/iconify';
import { SITE } from '@content/site';
import { getPost, getPosts } from '@/lib/content';
import { articleNode, breadcrumbNode, graph } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';
import { toDisplayDate } from '@/lib/utils/date';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return buildMetadata({ title: 'Not found', description: 'Post not found.', path: `/writing/${slug}`, noindex: true });
  return buildMetadata({
    title: post.title,
    description: post.summary,
    path: `/writing/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    tags: post.tags,
    ogImage: `/og/post-${post.slug}.png`,
  });
}

export default async function WritingDetailPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <JsonLd
        data={graph(
          articleNode(post),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
            { name: post.title, path: `/writing/${post.slug}` },
          ])
        )}
      />

      <Button component={Link} href="/writing" startIcon={<Iconify icon="carbon:arrow-left" />} sx={{ mb: 3 }}>
        All writing
      </Button>

      <Box sx={{ maxWidth: 760, mx: 'auto' }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {post.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>

        <Typography
          variant="h1"
          component="h1"
          sx={{ fontWeight: 800, fontSize: { xs: '1.9rem', sm: '2.4rem', md: '2.8rem' }, letterSpacing: '-0.02em', mb: 2.5 }}
        >
          {post.title}
        </Typography>

        <Stack direction="row" spacing={1.6} alignItems="center" sx={{ mb: 4 }}>
          <Avatar src="/media/person/elyssa-avatar-800.webp" alt={SITE.name} sx={{ width: 44, height: 44 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {SITE.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {`${toDisplayDate(post.publishedAt)} · ${post.readingMinutes} min read${
                post.updatedAt ? ` · Updated ${toDisplayDate(post.updatedAt)}` : ''
              }`}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mb: 4 }}>
          <SmartImage
            src={post.cover}
            alt={post.title}
            aspect={16 / 9}
            priority
            sizes="(max-width: 900px) 100vw, 760px"
          />
        </Box>

        <Box className="prose">
          <MDXRemote source={post.body} />
        </Box>

        <Divider sx={{ my: 5 }} />

        <Card sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 2.4, md: 3 } }}>
          <Avatar src="/media/person/elyssa-avatar-800.webp" alt={SITE.name} sx={{ width: 56, height: 56 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {SITE.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {`${SITE.roleLine} — ${SITE.positioningLine}`}
            </Typography>
          </Box>
          <Button component={Link} href="/" size="small" variant="outlined">
            Profile
          </Button>
        </Card>
      </Box>
    </Container>
  );
}
