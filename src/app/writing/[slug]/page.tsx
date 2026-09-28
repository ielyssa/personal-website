import Link from 'next/link';
import { notFound } from 'next/navigation';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { MDXRemote } from 'next-mdx-remote/rsc';

import { SmartImage } from '@/components/media/SmartImage';
import { JsonLd } from '@/components/ui/json-ld';
import { Iconify } from '@/components/ui/iconify';
import { SITE } from '@content/site';
import { getPost, getPosts } from '@/lib/content';
import { articleNode, breadcrumbNode, graph, webPageNode } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';
import { toDisplayDate } from '@/lib/utils/date';

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post)
    return buildMetadata({
      title: 'Not found',
      description: 'Post not found.',
      path: `/writing/${slug}`,
      noindex: true,
    });
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

  const posts = getPosts();
  const currentIndex = posts.findIndex((item) => item.slug === post.slug);
  const nextPost = posts[currentIndex + 1]; // older post, since list is newest-first
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined; // newer post

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <JsonLd
        data={graph(
          articleNode(post),
          webPageNode({
            path: `/writing/${post.slug}`,
            name: post.title,
            description: post.summary,
            dateModified: post.updatedAt ?? post.publishedAt,
          }),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Writing', path: '/writing' },
            { name: post.title, path: `/writing/${post.slug}` },
          ])
        )}
      />

      <Box sx={{ maxWidth: 760, mx: 'auto' }}>
        <Typography
          component={Link}
          href="/writing"
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
          All writing
        </Typography>

        {/* Meta line above the title, plain text, no chip pills — tags
            joined by spacing rather than a row of outlined badges. */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {post.tags.map((tag, index) => (
            <Typography key={tag} variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {tag}
              {index < post.tags.length - 1 ? ' ·' : ''}
            </Typography>
          ))}
        </Stack>

        <Typography
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '2rem', sm: '2.6rem', md: '3.1rem' },
            letterSpacing: '-0.025em',
            lineHeight: 1.08,
            mb: 3,
          }}
        >
          {post.title}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
          flexWrap="wrap"
          rowGap={1}
          sx={{ mb: { xs: 4, md: 5 }, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Typography sx={{ fontWeight: 700 }}>{SITE.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {`${toDisplayDate(post.publishedAt)} · ${post.readingMinutes} min read${
              post.updatedAt ? ` · Updated ${toDisplayDate(post.updatedAt)}` : ''
            }`}
          </Typography>
        </Stack>

        <Box sx={{ mb: { xs: 5, md: 6 } }}>
          <SmartImage
            src={post.cover}
            alt={post.title}
            aspect={16 / 9}
            priority
            sizes="(max-width: 900px) 100vw, 760px"
            sx={{ borderRadius: 0 }}
          />
        </Box>

        <Box className="prose">
          <MDXRemote source={post.body} />
        </Box>

        {/* Footer — author line as plain text, no avatar-in-card. Prev/next
            navigation replaces the single "Profile" link, since a reader
            who finished an article is more likely to want the next one
            than to jump to the homepage. */}
        <Box
          sx={{
            mt: { xs: 7, md: 9 },
            pt: { xs: 4, md: 5 },
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography sx={{ fontWeight: 800, mb: 0.5 }}>{SITE.name}</Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.65, maxWidth: '52ch' }}
          >
            {`${SITE.roleLine} — ${SITE.positioningLine}`}
          </Typography>
        </Box>

        {prevPost || nextPost ? (
          <Box
            sx={{
              mt: 5,
              pt: 4,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
            }}
          >
            {prevPost ? (
              <Box
                component={Link}
                href={`/writing/${prevPost.slug}`}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover .nav-title': { backgroundSize: '100% 1px' },
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Newer
                </Typography>
                <Typography
                  className="nav-title"
                  sx={{ fontWeight: 700, display: 'inline-block', ...UNDERLINE_SX }}
                >
                  {prevPost.title}
                </Typography>
              </Box>
            ) : (
              <Box />
            )}
            {nextPost ? (
              <Box
                component={Link}
                href={`/writing/${nextPost.slug}`}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  textAlign: { xs: 'left', sm: 'right' },
                  '&:hover .nav-title': { backgroundSize: '100% 1px' },
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Older
                </Typography>
                <Typography
                  className="nav-title"
                  sx={{ fontWeight: 700, display: 'inline-block', ...UNDERLINE_SX }}
                >
                  {nextPost.title}
                </Typography>
              </Box>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Container>
  );
}
