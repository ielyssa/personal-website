'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { SmartImage } from '@/components/media/SmartImage';
import type { Post } from '@/lib/content';
import { toDisplayDate } from '@/lib/utils/date';

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export function WritingIndexClient({ posts }: { posts: Post[] }) {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag');

  const tags = [...new Set(posts.flatMap((post) => post.tags))];
  const filtered = activeTag ? posts.filter((post) => post.tags.includes(activeTag)) : posts;
  const [featured, ...rest] = filtered;

  return (
    <>
      {/* Tag filter — a single scrollable line of text, not a wall of pills.
          The active tag is marked with an underline, same visual language
          as every other link/hover state on the site. */}
      <Box
        role="tablist"
        aria-label="Filter by topic"
        tabIndex={0}
        sx={{
          display: 'flex',
          gap: { xs: 2.5, md: 3.5 },
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          pb: 2.5,
          mb: { xs: 4, md: 5 },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TagLink label="All" active={!activeTag} href="/writing" />
        {tags.map((tag) => (
          <TagLink key={tag} label={tag} active={activeTag === tag} href={`/writing?tag=${encodeURIComponent(tag)}`} />
        ))}
      </Box>

      {filtered.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 6 }}>
          No posts with this tag yet.
        </Typography>
      ) : (
        <>
          {featured ? (
            <Box sx={{ mb: { xs: 7, md: 9 } }}>
              <FeaturedPost post={featured} />
            </Box>
          ) : null}

          {rest.length ? (
            <Stack role="list" aria-label="More posts" divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
              {rest.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </Stack>
          ) : null}
        </>
      )}
    </>
  );

  function TagLink({ label, active, href }: { label: string; active: boolean; href: string }) {
    return (
      <Typography
        component={Link}
        href={href}
        scroll={false}
        role="tab"
        aria-selected={active}
        variant="body2"
        sx={{
          flexShrink: 0,
          pb: 2.5,
          mb: -2.5,
          color: active ? 'text.primary' : 'text.secondary',
          textDecoration: 'none',
          fontWeight: active ? 700 : 500,
          borderBottom: '1px solid',
          borderColor: active ? 'text.primary' : 'transparent',
          transition: 'color 200ms ease, border-color 200ms ease',
          '&:hover': {
            color: 'text.primary',
          },
        }}
      >
        {label}
      </Typography>
    );
  }

  function FeaturedPost({ post }: { post: Post }) {
    return (
      <Box
        component={Link}
        href={`/writing/${post.slug}`}
        sx={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
            gap: { xs: 3, md: 6 },
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              overflow: 'hidden',
              order: { xs: 1, md: 1 },
              '& img': { transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)' },
              '&:hover img': { transform: 'scale(1.035)' },
            }}
          >
            <SmartImage
              src={post.cover}
              alt={post.title}
              aspect={4 / 3}
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              sx={{ borderRadius: 0 }}
            />
          </Box>

          <Stack justifyContent="center" sx={{ py: { xs: 0, md: 1 } }}>
            <Stack
              direction="row"
              alignItems="baseline"
              spacing={2}
              sx={{
                pb: 1.5,
                mb: 2.5,
                borderBottom: '1px solid',
                borderColor: alpha(theme.palette.text.primary, 0.14),
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {post.tags[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`${toDisplayDate(post.publishedAt)} · ${post.readingMinutes} min read`}
              </Typography>
            </Stack>

            <Box sx={{ '&:hover .post-title': { backgroundSize: '100% 1px' } }}>
              <Typography
                className="post-title"
                sx={{
                  fontSize: 'clamp(1.9rem, 3.6vw, 3.25rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.08,
                  mb: 2,
                  display: 'inline-block',
                  ...UNDERLINE_SX,
                }}
              >
                {post.title}
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, maxWidth: '46ch', mb: 2 }}>
              {post.summary}
            </Typography>

            {post.updatedAt ? (
              <Typography variant="body2" color="text.secondary">
                {`Updated ${toDisplayDate(post.updatedAt)}`}
              </Typography>
            ) : null}
          </Stack>
        </Box>
      </Box>
    );
  }

  function PostRow({ post }: { post: Post }) {
    return (
      <Box
        component={Link}
        href={`/writing/${post.slug}`}
        sx={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          py: { xs: 3.5, md: 4.5 },
          '&:hover .post-cover img': { transform: 'scale(1.035)' },
          '&:hover .post-title': { backgroundSize: '100% 1px' },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '340px 1fr' },
            gap: { xs: 2.5, sm: 4 },
            alignItems: 'center',
          }}
        >
          <Box
            className="post-cover"
            sx={{
              overflow: 'hidden',
              order: { xs: 1, sm: 1 },
              '& img': { transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)' },
            }}
          >
            <SmartImage
              src={post.cover}
              alt={post.title}
              aspect={16 / 10}
              sizes="(max-width: 600px) 100vw, 240px"
              sx={{ borderRadius: 0 }}
            />
          </Box>

          <Box>
            <Stack direction="row" spacing={2} alignItems="baseline" sx={{ mb: 1.2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {post.tags[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {`${toDisplayDate(post.publishedAt)} · ${post.readingMinutes} min read`}
              </Typography>
            </Stack>

            <Typography
              className="post-title"
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: 1.35,
                mb: 1,
                display: 'inline-block',
                ...UNDERLINE_SX,
              }}
            >
              {post.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
                maxWidth: '60ch',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.summary}
            </Typography>

            {post.updatedAt ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {`Updated ${toDisplayDate(post.updatedAt)}`}
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Box>
    );
  }
}
