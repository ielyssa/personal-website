import type { MetadataRoute } from 'next';

import { getPosts, getWorks } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/work'), changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/writing'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/speaking'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/press'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/now'), changeFrequency: 'weekly', priority: 0.6 },
    { url: absoluteUrl('/contact'), changeFrequency: 'yearly', priority: 0.6 },
    { url: absoluteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
  ];

  const workRoutes: MetadataRoute.Sitemap = getWorks().map((work) => ({
    url: absoluteUrl(`/work/${work.slug}`),
    changeFrequency: 'monthly',
    priority: work.status === 'active' ? 0.9 : 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = getPosts().map((post) => ({
    url: absoluteUrl(`/writing/${post.slug}`),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...workRoutes, ...postRoutes];
}

