import type { Metadata } from 'next';

import { SITE } from '@content/site';

const OG_IMAGE_SIZE = { width: 1200, height: 630, type: 'image/png' as const };

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
};

export function absoluteUrl(pathname: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url;
  return new URL(pathname, base).toString();
}

function defaultOgPath(path: string) {
  if (path === '/') return '/og/home.png';
  return `/og/${path.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '-')}.png`;
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
  noindex = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const image = absoluteUrl(ogImage ?? defaultOgPath(path));

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: 'en_RW',
      type,
      images: [{ ...OG_IMAGE_SIZE, url: image, alt: title }],
      ...(type === 'article' ? { publishedTime, modifiedTime, tags } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@_ielyssa',
      creator: '@_ielyssa',
      title,
      description,
      images: [image],
    },
  };
}

