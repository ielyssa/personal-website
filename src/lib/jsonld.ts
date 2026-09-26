import { SITE } from '@content/site';

import { absoluteUrl } from './seo';

function canonicalRoot() {
  return absoluteUrl('/').replace(/\/$/, '');
}

export function personNode() {
  const root = canonicalRoot();
  return {
    '@type': 'Person',
    '@id': `${root}/#person`,
    name: SITE.name,
    givenName: 'Elyssa',
    familyName: 'IRANKUNDA',
    jobTitle: 'Founder & CEO',
    description: SITE.positioningLine,
    url: `${root}/`,
    email: `mailto:${SITE.email}`,
    telephone: SITE.phone,
    image: absoluteUrl('/media/person/elyssa-avatar-800.webp'),
    nationality: { '@type': 'Country', name: 'Rwanda' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kigali',
      addressCountry: 'RW',
    },
    homeLocation: { '@type': 'Place', name: SITE.location },
    knowsAbout: [
      'Rwanda-first artificial intelligence',
      'Kinyarwanda language technology',
      'AI infrastructure',
      'education technology',
      'entrepreneurship in Africa',
    ],
    worksFor: { '@id': `${root}/work/atas#organization` },
    sameAs: [...Object.values(SITE.socials)],
  };
}

export function organizationNode() {
  const root = canonicalRoot();
  return {
    '@type': 'Organization',
    '@id': `${root}/work/atas#organization`,
    name: SITE.atas.shortName,
    alternateName: SITE.atas.name,
    url: SITE.atas.site,
    description: 'A Rwandan AI research and product company building systems that understand Rwanda.',
    logo: absoluteUrl('/media/logos/atas.webp'),
    image: absoluteUrl('/media/logos/atas.webp'),
    foundingDate: SITE.foundedAtas,
    foundingLocation: { '@type': 'Place', name: 'Kigali, Rwanda' },
    areaServed: { '@type': 'Country', name: 'Rwanda' },
    knowsAbout: ['Artificial intelligence', 'Kinyarwanda language technology', 'Education technology'],
    founder: { '@id': `${root}/#person` },
    sameAs: [SITE.atas.linkedin, SITE.atas.x, SITE.atas.instagram, SITE.atas.youtube],
  };
}

export function websiteNode() {
  const root = canonicalRoot();
  return {
    '@type': 'WebSite',
    '@id': `${root}/#website`,
    url: `${root}/`,
    name: SITE.name,
    description: SITE.tagline,
    publisher: { '@id': `${root}/#person` },
    copyrightHolder: { '@id': `${root}/#person` },
    inLanguage: 'en',
  };
}

export function profilePageNode() {
  const root = canonicalRoot();
  return {
    '@type': 'ProfilePage',
    '@id': `${root}/#profilepage`,
    url: `${root}/`,
    name: SITE.name,
    mainEntity: { '@id': `${root}/#person` },
    isPartOf: { '@id': `${root}/#website` },
    inLanguage: 'en',
  };
}

export function webPageNode(input: {
  path: string;
  name: string;
  description: string;
  type?: 'WebPage' | 'ContactPage';
  dateModified?: string;
}) {
  const root = canonicalRoot();
  const url = absoluteUrl(input.path);
  return {
    '@type': input.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': `${root}/#website` },
    about: { '@id': `${root}/#person` },
    inLanguage: 'en',
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

export function collectionPageNode(input: { path: string; name: string; description: string }) {
  const root = canonicalRoot();
  const url = absoluteUrl(input.path);
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': `${root}/#website` },
    about: { '@id': `${root}/#person` },
    inLanguage: 'en',
    mainEntity: { '@id': `${url}#itemlist` },
  };
}

export function itemListNode(path: string, items: { name: string; path: string }[]) {
  const url = absoluteUrl(path);
  return {
    '@type': 'ItemList',
    '@id': `${url}#itemlist`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
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
  const root = canonicalRoot();
  return {
    '@type': 'Article',
    '@id': `${root}/writing/${post.slug}#article`,
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { '@id': `${root}/#person` },
    publisher: { '@id': `${root}/work/atas#organization` },
    mainEntityOfPage: { '@id': `${root}/writing/${post.slug}#webpage` },
    isPartOf: { '@id': `${root}/#website` },
    keywords: post.tags.join(', '),
    image: absoluteUrl(post.cover),
    articleSection: post.tags[0],
    inLanguage: 'en',
  };
}

export function creativeWorkNode(work: { name: string; slug: string; summary: string; cover: string }) {
  const root = canonicalRoot();
  return {
    '@type': 'CreativeWork',
    '@id': `${root}/work/${work.slug}#creativework`,
    name: work.name,
    description: work.summary,
    url: `${root}/work/${work.slug}`,
    creator: { '@id': `${root}/#person` },
    image: absoluteUrl(work.cover),
    mainEntityOfPage: { '@id': `${root}/work/${work.slug}#webpage` },
    isPartOf: { '@id': `${root}/#website` },
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

