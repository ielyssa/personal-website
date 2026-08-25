import Image, { type ImageProps } from 'next/image';

import Box from '@mui/material/Box';

import { getMediaEntry } from '@/lib/media';

type SmartImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  aspect?: number;
  fill?: boolean;
  quality?: ImageProps['quality'];
  sx?: object;
};

export function SmartImage({ src, alt, sizes, priority = false, aspect, fill = false, quality, sx }: SmartImageProps) {
  const entry = getMediaEntry(src);

  if (!entry) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SmartImage] No manifest entry for ${src}`);
    }
    return (
      <Box
        sx={[
          {
            width: '100%',
            aspectRatio: aspect ?? '16 / 9',
            bgcolor: 'action.hover',
            borderRadius: 1,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        role="img"
        aria-label={alt}
      />
    );
  }

  if (fill || aspect) {
    return (
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          ...(aspect
            ? {
                position: 'relative',
                inset: 'auto',
                width: '100%',
                aspectRatio: `${aspect}`,
              }
            : {}),
          overflow: 'hidden',
          borderRadius: 1,
          ...sx,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? '100vw'}
          priority={priority}
          quality={quality}
          placeholder="blur"
          blurDataURL={entry.blurDataURL}
          style={{ objectFit: 'cover' }}
        />
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      <Image
        src={src}
        alt={alt}
        width={entry.width}
        height={entry.height}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={entry.blurDataURL}
        style={{ width: '100%', height: 'auto' }}
      />
    </Box>
  );
}

