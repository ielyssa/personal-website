'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SmartImage } from '@/components/media/SmartImage';
import type { Post } from '@/lib/content';
import { toDisplayDate } from '@/lib/utils/date';

export function WritingIndexClient({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag');

  const tags = [...new Set(posts.flatMap((post) => post.tags))];
  const filtered = activeTag ? posts.filter((post) => post.tags.includes(activeTag)) : posts;
  const [featured, ...rest] = filtered;

  return (
    <>
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
        <TagChip label="All" active={!activeTag} href="/writing" />
        {tags.map((tag) => (
          <TagChip key={tag} label={tag} active={activeTag === tag} href={`/writing?tag=${encodeURIComponent(tag)}`} />
        ))}
      </Stack>

      {filtered.length === 0 ? (
        <Typography color="text.secondary">No posts with this tag yet.</Typography>
      ) : (
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {featured ? (
            <Grid size={{ xs: 12 }}>
              <PostCard post={featured} featured />
            </Grid>
          ) : null}
          {rest.map((post) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.slug}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

function TagChip({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Chip
      component={Link}
      href={href}
      scroll={false}
      label={label}
      clickable
      color={active ? 'primary' : 'default'}
      variant={active ? 'filled' : 'outlined'}
      sx={{ mb: 0.75 }}
    />
  );
}

function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
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
        sx={{ display: 'flex', flexDirection: featured ? { xs: 'column', md: 'row' } : 'column', alignItems: 'stretch', height: '100%' }}
      >
        <Box sx={{ width: featured ? { xs: '100%', md: '44%' } : '100%', flexShrink: 0 }}>
          <SmartImage
            src={post.cover}
            alt={post.title}
            aspect={16 / 9}
            sizes={featured ? '(max-width: 900px) 100vw, 42vw' : '(max-width: 600px) 100vw, 33vw'}
            sx={{ borderRadius: 0, height: '100%', minHeight: featured ? { md: 280 } : undefined }}
          />
        </Box>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: { xs: 2.4, md: 3 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
            <Chip label={post.tags[0]} size="small" color={featured ? 'primary' : 'default'} variant={featured ? 'filled' : 'outlined'} />
            <Typography variant="caption" color="text.secondary">
              {`${toDisplayDate(post.publishedAt)} · ${post.readingMinutes} min read`}
            </Typography>
          </Stack>
          <Typography
            variant={featured ? 'h5' : 'h6'}
            sx={{ fontWeight: 800, mb: 1, lineHeight: 1.35 }}
          >
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {post.summary}
          </Typography>
          {post.updatedAt ? (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto', pt: 1.5, display: 'block' }}>
              {`Updated ${toDisplayDate(post.updatedAt)}`}
            </Typography>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

