import type { MetadataRoute } from 'next';

import { getPosts, getWorks } from '@/lib/content';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ielyssa.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/work`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/writing`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/speaking`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/press`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/now`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const workRoutes: MetadataRoute.Sitemap = getWorks().map((work) => ({
    url: `${base}/work/${work.slug}`,
    changeFrequency: 'monthly',
    priority: work.status === 'active' ? 0.9 : 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = getPosts().map((post) => ({
    url: `${base}/writing/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...workRoutes, ...postRoutes];
}

