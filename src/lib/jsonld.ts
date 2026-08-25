import { SITE } from '@content/site';

import { absoluteUrl } from './seo';

export function personNode() {
  return {
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: SITE.name,
    givenName: 'Elyssa',
    familyName: 'IRANKUNDA',
    jobTitle: 'Founder & CEO',
    description: SITE.positioningLine,
    url: `${SITE.url}/`,
    email: `mailto:${SITE.email}`,
    telephone: SITE.phone,
    homeLocation: { '@type': 'Place', name: SITE.location },
    worksFor: { '@id': `${SITE.url}/work/atas#organization` },
    sameAs: [...Object.values(SITE.socials)],
  };
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${SITE.url}/work/atas#organization`,
    name: SITE.atas.shortName,
    alternateName: SITE.atas.name,
    url: SITE.atas.site,
    logo: absoluteUrl('/media/logos/atas.webp'),
    foundingDate: SITE.foundedAtas,
    foundingLocation: { '@type': 'Place', name: 'Kigali, Rwanda' },
    founder: { '@id': `${SITE.url}/#person` },
    sameAs: [SITE.atas.linkedin, SITE.atas.x, SITE.atas.instagram, SITE.atas.youtube],
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: `${SITE.url}/`,
    name: SITE.name,
    description: SITE.tagline,
    publisher: { '@id': `${SITE.url}/#person` },
    inLanguage: 'en',
  };
}

export function profilePageNode() {
  return {
    '@type': 'ProfilePage',
    '@id': `${SITE.url}/#profilepage`,
    url: `${SITE.url}/`,
    name: SITE.name,
    mainEntity: { '@id': `${SITE.url}/#person` },
  };
}

export function articleNode(post: {
  title: string;
  summary: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  cover: string;
}) {
  return {
    '@type': 'Article',
    '@id': `${SITE.url}/writing/${post.slug}#article`,
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { '@id': `${SITE.url}/#person` },
    publisher: { '@id': `${SITE.url}/work/atas#organization` },
    mainEntityOfPage: `${SITE.url}/writing/${post.slug}`,
    keywords: post.tags.join(', '),
    image: absoluteUrl(post.cover),
    inLanguage: 'en',
  };
}

export function creativeWorkNode(work: { name: string; slug: string; summary: string }) {
  return {
    '@type': 'CreativeWork',
    '@id': `${SITE.url}/work/${work.slug}#creativework`,
    name: work.name,
    description: work.summary,
    url: `${SITE.url}/work/${work.slug}`,
    creator: { '@id': `${SITE.url}/#person` },
    inLanguage: 'en',
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

