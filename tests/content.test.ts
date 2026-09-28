import { describe, expect, it } from 'vitest';

import { BIO_CHAPTERS } from '@content/biography';
import { BIO_PEOPLE } from '@content/bio-people';
import { getNow, getPost, getPosts, getWork, getWorks } from '@/lib/content';

describe('content layer', () => {
  it('keeps biography person links aligned with the people directory', () => {
    const tokenPattern = /\{\{([a-z0-9-]+)\|([^}]+)\}\}/g;
    const peopleBySlug = new Map(BIO_PEOPLE.map((person) => [person.slug, person]));
    const linkedSlugs = new Set<string>();

    for (const chapter of BIO_CHAPTERS) {
      for (const paragraph of chapter.body) {
        tokenPattern.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = tokenPattern.exec(paragraph)) !== null) {
          const [, slug, displayedName] = match;
          const person = peopleBySlug.get(slug);
          expect(person, `Unknown biography person slug: ${slug}`).toBeDefined();
          expect(displayedName).toBe(person?.name);
          linkedSlugs.add(slug);
        }
      }
    }

    expect(linkedSlugs).toEqual(new Set(BIO_PEOPLE.map((person) => person.slug)));
  });

  it('loads all 8 posts with valid frontmatter', () => {
    const posts = getPosts();
    expect(posts).toHaveLength(8);
    for (const post of posts) {
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(post.summary.length).toBeGreaterThan(0);
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(post.publishedAt))).toBe(false);
      expect(post.tags.length).toBeGreaterThan(0);
      expect(post.cover.startsWith('/media/')).toBe(true);
      expect(post.readingMinutes).toBeGreaterThanOrEqual(1);
      expect(post.body.length).toBeGreaterThan(100);
    }
  });

  it('sorts posts newest first', () => {
    const posts = getPosts();
    for (let i = 1; i < posts.length; i += 1) {
      expect(Date.parse(posts[i - 1].publishedAt)).toBeGreaterThanOrEqual(Date.parse(posts[i].publishedAt));
    }
  });

  it('has unique post slugs', () => {
    const slugs = getPosts().map((post) => post.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('finds a post by slug', () => {
    const post = getPost('why-atas-starts-with-data');
    expect(post).toBeDefined();
    expect(post?.title).toContain('ATAS');
  });

  it('loads all 5 ventures with valid status', () => {
    const works = getWorks();
    expect(works).toHaveLength(5);
    const slugs = works.map((work) => work.slug);
    expect(slugs).toEqual(expect.arrayContaining(['atas', 'academiaplus', 'imizi', 'edubridge', 'kinyarwanda-tts']));
    for (const work of works) {
      expect(['active', 'research', 'earlier']).toContain(work.status);
      expect(work.period.length).toBeGreaterThan(0);
      expect(Object.keys(work.facts).length).toBeGreaterThan(0);
    }
  });

  it('orders ventures active → research → earlier', () => {
    const order = getWorks().map((work) => work.status);
    const rank = { active: 0, research: 1, earlier: 2 } as const;
    for (let i = 1; i < order.length; i += 1) {
      expect(rank[order[i - 1]]).toBeLessThanOrEqual(rank[order[i]]);
    }
  });

  it('finds a work by slug', () => {
    const work = getWork('imizi');
    expect(work?.status).toBe('research');
    expect(work?.body).toContain('missing layer');
  });

  it('loads now page with valid date', () => {
    const now = getNow();
    expect(now.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(now.body).toContain('AcademiaPlus');
  });
});
