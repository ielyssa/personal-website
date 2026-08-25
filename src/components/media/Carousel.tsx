'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from '@/components/ui/iconify';

export type CarouselSlide = {
  id: string;
  node: ReactNode;
  caption?: string;
};

type CarouselProps = {
  slides: CarouselSlide[];
  autoPlayMs?: number | null;
  aspect?: number;
  ariaLabel: string;
  showDots?: boolean;
  showControls?: boolean;
  showCaption?: boolean;
  onSlideChange?: (index: number) => void;
  controlledIndex?: number | null;
};

export function Carousel({
  slides,
  autoPlayMs = 6000,
  aspect = 16 / 10,
  ariaLabel,
  showDots = true,
  showControls = true,
  showCaption = true,
  onSlideChange,
  controlledIndex = null,
}: CarouselProps) {
  const theme = useTheme();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [internalIndex, setInternalIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inViewRef = useRef(false);

  const index = controlledIndex ?? internalIndex;
  const count = slides.length;
  const autoPlay = autoPlayMs !== null && !prefersReducedMotion;

  const goTo = useCallback(
    (next: number) => {
      const clamped = ((next % count) + count) % count;
      setInternalIndex(clamped);
      onSlideChange?.(clamped);
    },
    [count, onSlideChange]
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoPlay || count <= 1 || paused || !inViewRef.current) return undefined;
    if (typeof document !== 'undefined' && document.hidden) return undefined;
    const timer = window.setTimeout(() => goTo(index + 1), autoPlayMs);
    return () => window.clearTimeout(timer);
  }, [autoPlay, autoPlayMs, count, goTo, index, paused]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(index + 1);
    }
  };

  const mounted = useMemo(() => {
    if (count <= 1) return [0];
    return [(index - 1 + count) % count, index, (index + 1) % count];
  }, [count, index]);

  const activeSlide = slides[index];

  return (
    <Box
      ref={containerRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      sx={{
        position: 'relative',
        borderRadius: 2.5,
        overflow: 'hidden',
        '&:focus-visible': { outline: (th) => `2px solid ${th.palette.primary.main}`, outlineOffset: 3 },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: `${aspect}`, bgcolor: 'background.neutral' }}>
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;
          if (!mounted.includes(slideIndex)) return null;
          return (
            <Box
              key={slide.id}
              aria-hidden={!isActive}
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'none' : 'scale(1.02)',
                transition: prefersReducedMotion
                  ? 'none'
                  : 'opacity 560ms ease, transform 900ms cubic-bezier(0.22, 1, 0.36, 1)',
                pointerEvents: isActive ? 'auto' : 'none',
                '& img': { userSelect: 'none' },
              }}
            >
              {slide.node}
            </Box>
          );
        })}
      </Box>

      {autoPlay && count > 1 ? (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            bgcolor: (th) => alpha(th.palette.common.white, 0.25),
            zIndex: 3,
          }}
        >
          <Box
            key={`${index}-${paused}`}
            sx={{
              height: '100%',
              bgcolor: 'common.white',
              transformOrigin: 'left',
              animation: `carouselProgress ${autoPlayMs}ms linear forwards`,
              animationPlayState: paused ? 'paused' : 'running',
              '@keyframes carouselProgress': {
                from: { transform: 'scaleX(0)' },
                to: { transform: 'scaleX(1)' },
              },
            }}
          />
        </Box>
      ) : null}

      {showControls && count > 1 ? (
        <Stack direction="row" spacing={0.75} sx={{ position: 'absolute', top: 12, right: 12, zIndex: 3 }}>
          <ControlButton label={`Previous slide in ${ariaLabel}`} direction="prev" onClick={() => goTo(index - 1)} />
          <ControlButton label={`Next slide in ${ariaLabel}`} direction="next" onClick={() => goTo(index + 1)} />
        </Stack>
      ) : null}

      {showCaption && activeSlide?.caption ? (
        <Box
          sx={{
            position: 'absolute',
            left: 12,
            right: { xs: 12, sm: 110 },
            bottom: 12,
            zIndex: 2,
            px: 1.4,
            py: 1,
            borderRadius: 1.6,
            bgcolor: (th) => alpha(th.palette.common.black, 0.72),
            backdropFilter: 'blur(8px)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'common.white', fontWeight: 600 }}>
            {activeSlide.caption}
          </Typography>
        </Box>
      ) : null}

      {showDots && count > 1 ? (
        <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', top: 14, left: 14, zIndex: 3 }}>
          {slides.map((slide, slideIndex) => (
            <Box
              key={slide.id}
              component="button"
              type="button"
              aria-label={`Go to slide ${slideIndex + 1} of ${count}`}
              aria-current={slideIndex === index}
              onClick={() => goTo(slideIndex)}
              sx={{
                width: slideIndex === index ? 22 : 8,
                height: 8,
                p: '6px',
                m: '-6px',
                boxSizing: 'content-box',
                backgroundClip: 'content-box',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 99,
                bgcolor: slideIndex === index ? 'common.white' : alpha(theme.palette.common.white, 0.55),
                transition: 'width 240ms ease',
              }}
            />
          ))}
        </Stack>
      ) : null}

      <Box component="span" sx={{ display: 'none' }} aria-live="polite">
        {`Slide ${index + 1} of ${count}`}
      </Box>
    </Box>
  );
}

function ControlButton({
  label,
  onClick,
  direction,
}: {
  label: string;
  onClick: () => void;
  direction: 'prev' | 'next';
}) {
  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      sx={{
        width: 40,
        height: 40,
        color: 'common.white',
        bgcolor: (th) => alpha(th.palette.common.black, 0.45),
        backdropFilter: 'blur(8px)',
        '&:hover': { bgcolor: (th) => alpha(th.palette.common.black, 0.65) },
      }}
    >
      <Iconify icon={direction === 'prev' ? 'carbon:chevron-left' : 'carbon:chevron-right'} width={18} />
    </IconButton>
  );
}

