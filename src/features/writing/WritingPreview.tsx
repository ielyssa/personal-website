'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { trackEvent } from '@/lib/analytics';
import type { Post } from '@/lib/content';
import { toDisplayDate } from '@/lib/utils/date';

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// How many items are visible at once, per breakpoint. Keep this in sync with
// the `flexBasis` values in the item's sx below — they both describe the
// same layout and the scroll math needs to match what's actually on screen.
const VISIBLE_DESKTOP = 2;
const VISIBLE_MOBILE = 1;
const MOBILE_BREAKPOINT = 600; // px, matches MUI's `sm`

// How many viewport-heights of vertical scroll it takes to fully traverse
// the strip. Higher = slower / more deliberate horizontal reveal per item.
const SCROLL_LENGTH_PER_ITEM_VH = 0.6;

export function WritingPreview({ posts }: { posts: Post[] }) {
  const theme = useTheme();
  const [featured, ...recent] = posts;
  const items = useMemo(() => recent.slice(0, 6), [recent]);

  const spacerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const visibleCount = isMobile ? VISIBLE_MOBILE : VISIBLE_DESKTOP;
  const hiddenCount = Math.max(items.length - visibleCount, 0);

  // Track viewport size and motion preference — both change how much (or
  // whether) we drive horizontal translation from vertical scroll.
  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMobile = () => setIsMobile(mobileQuery.matches);
    const syncMotion = () => setReduceMotion(motionQuery.matches);

    syncMobile();
    syncMotion();

    mobileQuery.addEventListener('change', syncMobile);
    motionQuery.addEventListener('change', syncMotion);
    return () => {
      mobileQuery.removeEventListener('change', syncMobile);
      motionQuery.removeEventListener('change', syncMotion);
    };
  }, []);

  // The core scroll-linked mechanism. Native `window` scroll only — nothing
  // is ever intercepted or preventDefault'd, so the page can never get
  // "stuck": at worst, this effect simply doesn't move the strip.
  useEffect(() => {
    if (reduceMotion || hiddenCount <= 0) {
      setTranslateX(0);
      return;
    }

    let raf = 0;

    const measure = () => {
      raf = 0;
      const spacer = spacerRef.current;
      const track = trackRef.current;
      if (!spacer || !track) return;

      const viewportHeight = window.innerHeight;
      const rect = spacer.getBoundingClientRect();

      // Progress is 0 the instant the spacer's top reaches the top of the
      // viewport, and 1 once we've scrolled past the extra height we gave
      // the spacer for the horizontal reveal. Outside that range we clamp,
      // so the strip holds its first/last position in normal document flow.
      const scrollableDistance = spacer.offsetHeight - viewportHeight;
      const scrolled = -rect.top;
      const progress = scrollableDistance > 0
        ? Math.min(Math.max(scrolled / scrollableDistance, 0), 1)
        : 0;

      const maxShift = track.scrollWidth - track.clientWidth;
      setTranslateX(-progress * Math.max(maxShift, 0));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduceMotion, hiddenCount, isMobile, items.length]);

  // Extra vertical space the spacer needs so there's something to scroll
  // through while the strip is pinned. One "unit" per hidden item.
  const spacerExtraVh = hiddenCount * SCROLL_LENGTH_PER_ITEM_VH * 100;

  return (
    <Section id="writing" neutral>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: { xs: 5, md: 7 } }}>
        <SectionHeading
          align="left"
          overline="Writing"
          title="Notes from building"
          description="What I'm learning while building ATAS — research notes, product decisions, and lessons."
        />
        <Typography
          component={Link}
          href="/writing"
          onClick={() => trackEvent('writing_index_open', { source: 'home' })}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            alignItems: 'center',
            gap: 0.75,
            flexShrink: 0,
            color: 'text.primary',
            textDecoration: 'none',
            fontWeight: 600,
            ...UNDERLINE_SX,
            '&:hover': { backgroundSize: '100% 1px' },
          }}
        >
          All writing
          <Iconify icon="carbon:arrow-right" width={16} />
        </Typography>
      </Stack>

      {/* Featured post — normal document flow, unrelated to the pin/scroll
          math below, so its own height is never part of that calculation. */}
      {featured ? (
        <Reveal>
          <Box
            component={Link}
            href={`/writing/${featured.slug}`}
            onClick={() => trackEvent('post_open', { post: featured.slug, source: 'home_featured' })}
            sx={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              mb: { xs: 8, md: 11 },
            }}
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
                  '& img': { transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)' },
                  '&:hover img': { transform: 'scale(1.035)' },
                }}
              >
                <SmartImage
                  src={featured.cover}
                  alt={featured.title}
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
                    {featured.tags[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {toDisplayDate(featured.publishedAt)}
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
                    {featured.title}
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.75, maxWidth: '46ch', mb: 2 }}
                >
                  {featured.summary}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {`${featured.readingMinutes} min read`}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Reveal>
      ) : null}

      {/* Pinned, scroll-driven filmstrip. The spacer gives the page extra
          height to scroll through; the track inside is what visually pins
          and translates. On reduced-motion or when everything already fits
          on screen, this degrades to a plain static row (translateX stays 0
          and the spacer collapses to exactly one viewport-worth of height,
          i.e. no pin at all). */}
      {items.length ? (
        <Box
          ref={spacerRef}
          sx={{
            position: 'relative',
            height: hiddenCount > 0 && !reduceMotion
              ? { xs: `calc(100vh + ${spacerExtraVh}vh)`, sm: `calc(100vh + ${spacerExtraVh}vh)` }
              : 'auto',
          }}
        >
          <Box
            sx={{
              position: hiddenCount > 0 && !reduceMotion ? 'sticky' : 'static',
              top: 0,
              height: hiddenCount > 0 && !reduceMotion ? '100vh' : 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              ref={trackRef}
              role="list"
              aria-label="Recent posts"
              sx={{
                display: 'flex',
                willChange: 'transform',
                transform: `translateX(${translateX}px)`,
                // No CSS transition here on purpose: translateX is already
                // recomputed every animation frame from scroll position, so
                // a transition would fight the rAF updates and lag input.
              }}
            >
              {items.map((post, index) => (
                <Box
                  key={post.slug}
                  data-post-item
                  role="listitem"
                  sx={{
                    flex: {
                      xs: `0 0 ${100 / VISIBLE_MOBILE}%`,
                      sm: `0 0 calc(${100 / VISIBLE_DESKTOP}% - ${(32 * (VISIBLE_DESKTOP - 1)) / VISIBLE_DESKTOP}px)`,
                    },
                    pr: 4,
                    mr: 4,
                    borderRight: index === items.length - 1 ? 'none' : '1px solid',
                    borderColor: alpha(theme.palette.text.primary, 0.1),
                  }}
                >
                  <Box
                    component={Link}
                    href={`/writing/${post.slug}`}
                    onClick={() => trackEvent('post_open', { post: post.slug, source: 'home_grid' })}
                    sx={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover .post-cover img': { transform: 'scale(1.035)' },
                      '&:hover .post-title': { backgroundSize: '100% 1px' },
                    }}
                  >
                    <Box
                      className="post-cover"
                      sx={{
                        overflow: 'hidden',
                        mb: 2.5,
                        '& img': { transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)' },
                      }}
                    >
                      <SmartImage
                        src={post.cover}
                        alt={post.title}
                        aspect={16 / 10}
                        sizes="(max-width: 600px) 88vw, 40vw"
                        sx={{ borderRadius: 0 }}
                      />
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="baseline" sx={{ mb: 1.2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {post.tags[0]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {toDisplayDate(post.publishedAt)}
                      </Typography>
                    </Stack>

                    <Typography
                      className="post-title"
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.4,
                        mb: 1,
                        display: 'inline-block',
                        ...UNDERLINE_SX,
                      }}
                    >
                      {post.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {post.summary}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ) : null}

      <Box sx={{ mt: 4, display: { xs: 'block', sm: 'none' } }}>
        <Typography
          component={Link}
          href="/writing"
          onClick={() => trackEvent('writing_index_open', { source: 'home_mobile' })}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            color: 'text.primary',
            textDecoration: 'none',
            fontWeight: 600,
            ...UNDERLINE_SX,
            '&:hover': { backgroundSize: '100% 1px' },
          }}
        >
          All writing
          <Iconify icon="carbon:arrow-right" width={16} />
        </Typography>
      </Box>
    </Section>
  );
}