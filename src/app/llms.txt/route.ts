import { SITE } from '@content/site';
import { getPosts, getWorks } from '@/lib/content';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getPosts();
  const works = getWorks();

  const workLines = works
    .map((work) => `  - [${work.name}](${SITE.url}/work/${work.slug}): ${work.summary}`)
    .join('\n');
  const postLines = posts
    .map((post) => `  - [${post.title}](${SITE.url}/writing/${post.slug}): ${post.summary}`)
    .join('\n');

  const body = `# ${SITE.name}

> ${SITE.roleLine}. ${SITE.positioningLine}

${SITE.name} is the founder and CEO of ATAS (Alliance for Transformative AI Systems), a Rwandan AI research and product company based in Kigali, founded in ${SITE.foundedAtas}. He builds AI systems that understand Rwanda — its languages, geography, culture, and everyday realities — and leads the company's research, products, and engineering end to end.

## Ventures & research (at ATAS)

${workLines}

## Writing

${postLines}

## Key pages

- [Home](${SITE.url}/): profile, mission, and contact paths
- [Speaking](${SITE.url}/speaking): topics and media resources
- [Press kit](${SITE.url}/press): bios, fact sheet, photos, downloads
- [Now](${SITE.url}/now): current focus
- [Contact](${SITE.url}/contact): direct channels

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

