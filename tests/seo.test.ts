import { describe, expect, it } from 'vitest';

import { SITE } from '@content/site';

import { absoluteUrl, buildMetadata } from '@/lib/seo';
import { articleNode, breadcrumbNode, graph, organizationNode, personNode, websiteNode } from '@/lib/jsonld';

describe('seo metadata builder', () => {
  it('builds absolute canonical and og urls', () => {
    const metadata = buildMetadata({ title: 'Test', description: 'Desc', path: '/work/atas' });
    expect(metadata.alternates?.canonical).toBe('https://ielyssa.com/work/atas');
    expect(metadata.openGraph?.url).toBe('https://ielyssa.com/work/atas');
    const images = metadata.openGraph?.images as { url: string }[];
    expect(images[0].url).toBe('https://ielyssa.com/og/work-atas.png');
  });

  it('uses home og image for root path', () => {
    const metadata = buildMetadata({ title: 'Home', description: 'Desc', path: '/' });
    const images = metadata.openGraph?.images as { url: string }[];
    expect(images[0].url).toBe('https://ielyssa.com/og/home.png');
  });

  it('sets article metadata with ISO times', () => {
    const metadata = buildMetadata({
      title: 'Post',
      description: 'Desc',
      path: '/writing/x',
      type: 'article',
      publishedTime: '2025-12-13',
      modifiedTime: '2026-01-08',
    });
    const openGraph = metadata.openGraph as { publishedTime?: string; modifiedTime?: string };
    expect(openGraph.publishedTime).toBe('2025-12-13');
    expect(openGraph.modifiedTime).toBe('2026-01-08');
  });

  it('supports noindex', () => {
    const metadata = buildMetadata({ title: 'X', description: '', path: '/x', noindex: true });
    expect((metadata.robots as { index: boolean }).index).toBe(false);
  });

  it('absoluteUrl joins base correctly', () => {
    expect(absoluteUrl('/writing')).toBe('https://ielyssa.com/writing');
  });
});

describe('jsonld graph builders', () => {
  it('emits ISO dates on articles', () => {
    const node = articleNode({
      title: 'T',
      summary: 'S',
      slug: 'my-post',
      publishedAt: '2025-10-28',
      tags: ['a'],
      cover: '/media/blog/x.webp',
    });
    expect(node.datePublished).toBe('2025-10-28');
    expect(node.dateModified).toBe('2025-10-28');
    expect(node.author['@id']).toBe(`${SITE.url}/#person`);
  });

  it('person node carries canonical socials', () => {
    const person = personNode();
    expect(person.sameAs).toContain('https://www.linkedin.com/in/ielyssa');
    expect(person.sameAs).toContain('https://x.com/_ielyssa');
    expect(person.jobTitle).toBe('Founder & CEO');
  });

  it('organization node reflects founding facts', () => {
    const org = organizationNode();
    expect(org.foundingDate).toBe('2025');
    expect(org.name).toBe('ATAS');
  });

  it('website node exists with publisher', () => {
    expect(websiteNode()['@type']).toBe('WebSite');
  });

  it('breadcrumb items are absolute', () => {
    const crumb = breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/work' },
    ]);
    expect(crumb.itemListElement[1].item).toBe('https://ielyssa.com/work');
  });

  it('graph wraps nodes in @graph', () => {
    const g = graph(websiteNode(), personNode());
    expect(g['@context']).toBe('https://schema.org');
    expect(g['@graph']).toHaveLength(2);
  });
});
