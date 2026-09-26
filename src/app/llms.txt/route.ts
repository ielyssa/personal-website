import { SITE } from '@content/site';
import { getPosts, getWorks } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getPosts();
  const works = getWorks();

  const workLines = works
    .map((work) => `  - [${work.name}](${absoluteUrl(`/work/${work.slug}`)}): ${work.summary}`)
    .join('\n');
  const postLines = posts
    .map((post) => `  - [${post.title}](${absoluteUrl(`/writing/${post.slug}`)}): ${post.summary}`)
    .join('\n');

  const body = `# ${SITE.name}

> ${SITE.roleLine}. ${SITE.positioningLine}

${SITE.name} is the founder and CEO of ATAS (Alliance for Transformative AI Systems), a Rwandan AI research and product company based in Kigali, founded in ${SITE.foundedAtas}. He builds AI systems that understand Rwanda — its languages, geography, culture, and everyday realities — and leads the company's research, products, and engineering end to end.

## Ventures & research (at ATAS)

${workLines}

## Writing

${postLines}

## Key pages

- [Home](${absoluteUrl('/')}): profile, mission, and contact paths
- [Speaking](${absoluteUrl('/speaking')}): topics and media resources
- [Press kit](${absoluteUrl('/press')}): bios, fact sheet, photos, downloads
- [Now](${absoluteUrl('/now')}): current focus
- [Contact](${absoluteUrl('/contact')}): direct channels

## Contact

- Email: ${SITE.email}
- Location: ${SITE.location}
- LinkedIn: ${SITE.socials.linkedin}
- X: ${SITE.socials.x}
- ATAS: ${SITE.atas.site}

Updated ${new Date().toISOString().slice(0, 10)}.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

