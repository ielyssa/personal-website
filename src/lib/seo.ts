import type { Metadata } from 'next';

import { SITE } from '@content/site';

const OG_IMAGE_SIZE = { width: 1200, height: 630, type: 'image/png' as const };
const X_HANDLE = `@${new URL(SITE.socials.x).pathname.split('/').filter(Boolean)[0]}`;
const DEFAULT_OG_PATHS: Record<string, string> = {
  '/': '/og/home.png',
  '/work': '/og/work-index.png',
  '/writing': '/og/writing-index.png',
  '/speaking': '/og/speaking.png',
  '/press': '/og/press.png',
  '/now': '/og/now.png',
  '/contact': '/og/contact.png',
  '/privacy': '/og/privacy.png',
};

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
  return DEFAULT_OG_PATHS[path] ?? `/og/${path.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '-')}.png`;
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
  const articleMetadata =
    type === 'article'
      ? {
          authors: [SITE.name],
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
          ...(tags?.length ? { tags } : {}),
        }
      : {};

  return {
    title,
    description,
    creator: SITE.name,
    publisher: SITE.name,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
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
      ...articleMetadata,
    },
    twitter: {
      card: 'summary_large_image',
      site: X_HANDLE,
      creator: X_HANDLE,
      title,
      description,
      images: [image],
    },
  };
}

