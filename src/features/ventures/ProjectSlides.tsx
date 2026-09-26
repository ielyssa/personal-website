'use client';

import { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from '@/components/ui/iconify';

export type ProjectSlide = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

// A slide viewer scoped to this section: image full-bleed within its own
// frame, caption set as normal page text underneath (never overlaid on the
// photo), advanced by plain hairline-circle controls or native swipe. No
// autoplay — this section is making an argument in text; the imagery
// supports it and shouldn't compete for attention on a timer.
export function ProjectSlides({ slides, aspect = 4 / 3 }: { slides: ProjectSlide[]; aspect?: number }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const count = slides.length;

  const goTo = (next: number) => setIndex(((next % count) + count) % count);

  // Keep the index in sync if the user swipes/scrolls the track directly on
  // touch, rather than only trusting the button-driven state.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const width = el.clientWidth;
      if (width === 0) return;
      const next = Math.round(el.scrollLeft / width);
      setIndex((current) => (current === next ? current : next));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const target = index * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 2) {
      el.scrollTo({ left: target, behavior: 'smooth' });
    }
  }, [index]);

  const active = slides[index];

  return (
    <Box>
      <Box
        ref={trackRef}
        role="group"
        aria-roledescription="slides"
        aria-label="ATAS in pictures"
        tabIndex={0}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {slides.map((slide) => (
          <Box
            key={slide.id}
            sx={{
              flex: '0 0 100%',
              scrollSnapAlign: 'start',
              position: 'relative',
              aspectRatio: `${aspect}`,
              bgcolor: 'background.neutral' as const,
            }}
          >
            <Box
              component="img"
              src={slide.src}
              alt={slide.alt}
              loading="lazy"
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, maxWidth: '46ch' }}>
          {active?.caption}
        </Typography>

        {count > 1 ? (
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, ml: 3 }}>
            <SlideButton direction="prev" onClick={() => goTo(index - 1)} />
            <Typography variant="body2" color="text.secondary" sx={{ px: 0.5, alignSelf: 'center' }}>
              {`${index + 1} / ${count}`}
            </Typography>
            <SlideButton direction="next" onClick={() => goTo(index + 1)} />
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}

function SlideButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous image' : 'Next image'}
      sx={{
        width: 34,
        height: 34,
        p: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'transparent',
        color: 'text.primary',
        cursor: 'pointer',
        transition: 'border-color 200ms ease',
        '&:hover': { borderColor: 'text.primary' },
      }}
    >
      <Iconify icon={direction === 'prev' ? 'carbon:arrow-left' : 'carbon:arrow-right'} width={15} />
    </Box>
  );
}
