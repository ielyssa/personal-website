import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import readingTime from 'reading-time';
import { z } from 'zod';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const isoDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z
    .string()
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)), {
      message: 'Must be an ISO date string (YYYY-MM-DD)',
    })
) as z.ZodType<string>;

export const workStatusSchema = z.enum(['active', 'research', 'earlier']);

export const workSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  status: workStatusSchema,
  period: z.string().min(1),
  summary: z.string().min(1),
  cover: z.string().startsWith('/'),
  website: z.string().url().optional(),
  facts: z.record(z.string(), z.string()).default({}),
  gallery: z
    .array(
      z.object({
        src: z.string().startsWith('/'),
        caption: z.string().min(1),
      })
    )
    .default([]),
});

export const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().min(1),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  tags: z.array(z.string().min(1)).min(1),
  cover: z.string().startsWith('/'),
});

export type Work = z.infer<typeof workSchema> & { body: string };
export type Post = z.infer<typeof postSchema> & { body: string; readingMinutes: number };
export type WorkStatus = z.infer<typeof workStatusSchema>;

function readMatterFiles(dirName: string) {
  const dir = path.join(CONTENT_DIR, dirName);
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => matter(fs.readFileSync(path.join(dir, file), 'utf8')));
}

function statusOrder(status: WorkStatus) {
  return { active: 0, research: 1, earlier: 2 }[status];
}

let worksCache: Work[] | null = null;

export function getWorks(): Work[] {
  if (worksCache) return worksCache;

  worksCache = readMatterFiles('work')
    .map((matterResult) => {
      const frontmatter = workSchema.parse(matterResult.data);
      return { ...frontmatter, body: matterResult.content.trim() };
    })
    .sort((a, b) => statusOrder(a.status) - statusOrder(b.status));

  return worksCache;
}

export function getWork(slug: string): Work | undefined {
  return getWorks().find((work) => work.slug === slug);
}

let postsCache: Post[] | null = null;

export function getPosts(): Post[] {
  if (postsCache) return postsCache;

  postsCache = readMatterFiles('writing')
    .map((matterResult) => {
      const frontmatter = postSchema.parse(matterResult.data);
      const body = matterResult.content.trim();
      return {
        ...frontmatter,
        body,
        readingMinutes: Math.max(1, Math.round(readingTime(body).minutes)),
      };
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  return postsCache;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export function getNow(): { updated: string; body: string } {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'now.mdx'), 'utf8');
  const matterResult = matter(raw);
  const updated = isoDate.parse(matterResult.data.updated);
  return { updated, body: matterResult.content.trim() };
}

