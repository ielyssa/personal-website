'use client';

import { useState } from 'react';

import Image from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { Carousel } from '@/components/media/Carousel';
import { Section, SectionHeading } from '@/components/ui/section';
import { FOCUS_METRICS, FOCUS_SLIDES } from '@content/home';
import { getMediaEntry } from '@/lib/media';

export function FocusSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = FOCUS_SLIDES.map((slide) => {
    const entry = getMediaEntry(slide.image);
    return {
      id: slide.id,
      caption: slide.title,
      node: (
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          sizes="(max-width: 900px) 100vw, 58vw"
          placeholder="blur"
          blurDataURL={entry?.blurDataURL}
          style={{ objectFit: 'cover' }}
        />
      ),
    };
  });

  const activeSlideId = FOCUS_SLIDES[activeIndex]?.id;

  return (
    <Section id="focus">
      <SectionHeading
        overline="Focus"
        title="What guides the work"
        description="The signals I hold myself accountable to: building from context, proving outcomes, and moving from research to systems people use."
      />
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Carousel
            slides={slides}
            ariaLabel="Focus areas"
            aspect={16 / 11}
            onSlideChange={setActiveIndex}
            showDots={false}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Grid container spacing={1.6}>
            {FOCUS_METRICS.map((metric) => {
              const slideIdx = FOCUS_SLIDES.findIndex((slide) => slide.id === metric.slideId);
              const selected = slideIdx === activeIndex;
              return (
                <Grid size={{ xs: 6 }} key={metric.label}>
                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      border: 1,
                      borderColor: selected ? 'primary.main' : 'divider',
                      bgcolor: selected ? (th) => alpha(th.palette.primary.main, 0.06) : 'background.paper',
                      transition: 'border-color 240ms ease, background-color 240ms ease',
                    }}
                  >
                    <CardActionArea
                      onClick={() => setActiveIndex(slideIdx >= 0 ? slideIdx : 0)}
                      sx={{ p: 2, height: '100%' }}
                      aria-pressed={selected}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.4 }}>
                        {metric.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>
                        {metric.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.9, minHeight: 32 }}>
                        {metric.detail}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          <Stack sx={{ mt: 2, display: { xs: 'none', md: 'flex' } }}>
            <Typography variant="caption" color="text.secondary">
              {`Currently: ${FOCUS_SLIDES[activeIndex]?.title ?? ''}`}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Box component="span" sx={{ display: 'none' }} data-active-slide={activeSlideId} />
    </Section>
  );
}


