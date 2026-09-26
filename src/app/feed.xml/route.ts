import { getPosts } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function escapeCdata(value: string) {
  return value.replaceAll(']]>', ']]]]><![CDATA[>');
}

export async function GET() {
  const posts = getPosts();
  const lastBuild = new Date().toUTCString();

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${absoluteUrl(`/writing/${post.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/writing/${post.slug}`)}</guid>
      <description>${escapeXml(post.summary)}</description>
      <content:encoded><![CDATA[${escapeCdata(post.summary)}]]></content:encoded>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>IRANKUNDA Elyssa — Writing</title>
    <link>${absoluteUrl('/writing')}</link>
    <description>Notes from building AI in Rwanda — by the Founder &amp; CEO of ATAS.</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}

