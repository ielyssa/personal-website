import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public', 'og');
const AVATAR = path.join(ROOT, 'public', 'media', 'person', 'elyssa-avatar-800.webp');
const ATAS_LOGO = path.join(ROOT, 'public', 'media', 'logos', 'atas.webp');

const W = 1200;
const H = 630;
const FORCE_REGENERATE = process.argv.includes('--force');

function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrap(text, max) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > max && line) {
      lines.push(line.trim());
      line = word;
    } else {
      line += ` ${word}`;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 3);
}

async function toDataUri(file) {
  const buf = await sharp(file).resize(560, 560, { fit: 'cover' }).png({ quality: 90 }).toBuffer();
  return `data:image/png;base64,${buf.toString('base64')}`;
}

function baseSvg({ titleLines, subtitle, kicker, footer, compact }) {
  const maxTitleWidth = compact ? 600 : 1050;
  const titleSize = compact ? 56 : titleLines.some((l) => l.length > 24) ? 62 : 74;
  const titleStartY = 250 - (titleLines.length - 1) * (titleSize * 0.55);
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#000000"/>
      <stop offset="52%" stop-color="#212121"/>
      <stop offset="100%" stop-color="#424242"/>
    </linearGradient>
    <radialGradient id="glow" cx="82%" cy="18%" r="55%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="circle"><circle cx="935" cy="315" r="205"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g opacity="0.14" stroke="#FFFFFF" stroke-width="1">
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${90 * i + 40}" x2="${W}" y2="${90 * i - 20}"/>`).join('')}
  </g>
  <g>
    <rect x="72" y="66" rx="16" width="56" height="56" fill="#FFFFFF" opacity="0.14"/>
    <text x="100" y="104" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">IE</text>
    <text x="148" y="102" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="21" font-weight="600" fill="#FFFFFF" opacity="0.92">${esc(kicker)}</text>
  </g>
  ${titleLines
    .map(
      (l, i) =>
        `<text x="76" y="${titleStartY + i * titleSize * 1.12}" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="800" fill="#FFFFFF">${esc(l)}</text>`
    )
    .join('\n  ')}
  ${subtitle ? `<text x="78" y="${titleStartY + titleLines.length * titleSize * 1.12 + 26}" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="27" font-weight="400" fill="#FFFFFF" opacity="0.85">${esc(subtitle.slice(0, 110))}</text>` : ''}
  <text x="76" y="${H - 58}" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="#FFFFFF" opacity="0.75">${esc(footer)}</text>
</svg>`;
}

async function renderCard({ file, kind, image, ...text }) {
  let svg = baseSvg({ ...text, compact: !!image });
  if (image) {
    const uri = await toDataUri(path.join(ROOT, 'public', image));
    svg = svg.replace(
      '</svg>',
      `  <image x="675" y="55" width="520" height="520" clip-path="url(#circle)" xlink:href="${uri}"/>
  <circle cx="935" cy="315" r="205" fill="none" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="3"/>
</svg>`
    );
  }
  const out = path.join(OUT_DIR, `${file}.png`);
  if (fs.existsSync(out) && !FORCE_REGENERATE) {
    console.log(`preserved og/${file}.png`);
    return;
  }
  await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile(out);
  console.log(`og/${file}.png`);
}

await fs.promises.mkdir(OUT_DIR, { recursive: true });

const cards = [
  {
    file: 'home',
    kicker: 'IRANKUNDA Elyssa · Founder & CEO',
    titleLines: ['I build AI', 'companies that', 'understand Rwanda'],
    subtitle: 'ATAS — Alliance for Transformative AI Systems · Kigali',
    footer: 'ielyssa.com',
    image: 'media/person/elyssa-avatar-800.webp',
    kind: 'person',
  },
  {
    file: 'work-index',
    kicker: 'Work',
    titleLines: ['Ventures & research'],
    subtitle: 'What I am building at ATAS — from classrooms to infrastructure.',
    footer: 'ielyssa.com/work',
  },
  {
    file: 'writing-index',
    kicker: 'Writing',
    titleLines: ['Notes from building', 'AI in Rwanda'],
    subtitle: 'Research notes, product decisions, lessons.',
    footer: 'ielyssa.com/writing',
  },
  {
    file: 'speaking',
    kicker: 'Speaking & media',
    titleLines: ['Talks & interviews'],
    subtitle: 'Rwanda-first AI · language technology · building in Kigali.',
    footer: 'ielyssa.com/speaking',
  },
  {
    file: 'press',
    kicker: 'Press kit',
    titleLines: ['Bios, facts & assets'],
    subtitle: 'Everything organizers and journalists need.',
    footer: 'ielyssa.com/press',
  },
  {
    file: 'now',
    kicker: 'Now',
    titleLines: ['What I am building now'],
    subtitle: 'AcademiaPlus · IMIZI · Kinyarwanda language program.',
    footer: 'ielyssa.com/now',
  },
  {
    file: 'biography',
    kicker: 'Biography',
    titleLines: ['The journey', 'so far'],
    subtitle: 'From Rubavu to founding ATAS, and the people who shaped the work.',
    footer: 'ielyssa.com/biography',
    image: 'media/person/elyssa-avatar-800.webp',
    kind: 'person',
  },
  {
    file: 'contact',
    kicker: 'Contact',
    titleLines: ['Get in touch'],
    subtitle: 'Partnerships, speaking, collaboration.',
    footer: 'ielyssa.com/contact',
  },
  {
    file: 'privacy',
    kicker: 'Privacy',
    titleLines: ['Privacy & data'],
    subtitle: 'How ielyssa.com handles data and your choices.',
    footer: 'ielyssa.com/privacy',
  },
];

const works = [
  {
    slug: 'atas',
    name: 'ATAS',
    sub: 'Alliance for Transformative AI Systems — founded 2025, Kigali.',
    img: 'media/logos/atas.webp',
  },
  {
    slug: 'academiaplus',
    name: 'AcademiaPlus',
    sub: 'National curriculum infrastructure for Rwandan secondary education.',
    img: null,
  },
  {
    slug: 'imizi',
    name: 'IMIZI',
    sub: "Rwanda's first Contextual Intelligence Infrastructure.",
    img: null,
  },
  {
    slug: 'edubridge',
    name: 'EduBridge',
    sub: 'Predictive student-risk analytics for earlier intervention.',
    img: null,
  },
  {
    slug: 'kinyarwanda-tts',
    name: 'Kinyarwanda TTS',
    sub: 'Voice technology built natively for Kinyarwanda.',
    img: null,
  },
];
for (const w of works) {
  cards.push({
    file: `work-${w.slug}`,
    kicker: 'ATAS Venture',
    titleLines: wrap(w.name, 20),
    subtitle: w.sub,
    footer: 'ielyssa.com',
    ...(w.img ? { image: w.img } : {}),
  });
}
cards.push({
  file: 'post-academiaplus-first-version-failed',
  kicker: 'Writing',
  titleLines: wrap('The First Version of AcademiaPlus Failed', 26),
  subtitle: 'Building for Rwanda instead of building for everyone.',
  footer: 'ielyssa.com/writing',
});
cards.push({
  file: 'post-confidence-is-not-capacity',
  kicker: 'Writing',
  titleLines: wrap('Confidence Is Not Capacity', 26),
  subtitle: 'Keeping ambition honest while ATAS is still early.',
  footer: 'ielyssa.com/writing',
});
cards.push({
  file: 'post-language-is-not-context',
  kicker: 'Writing',
  titleLines: wrap('Fluent Is Not the Same as Understanding', 26),
  subtitle: 'Why language is only the doorway to context.',
  footer: 'ielyssa.com/writing',
});
cards.push({
  file: 'post-learning-tech-with-almost-nothing',
  kicker: 'Writing',
  titleLines: wrap('Learning to Build Software With Almost Nothing', 26),
  subtitle: 'Teaching yourself to build when resources are limited.',
  footer: 'ielyssa.com/writing',
});
cards.push({
  file: 'post-we-turned-a-holiday-into-an-office',
  kicker: 'Writing',
  titleLines: wrap('We Turned a School Holiday Into Our Own Office', 26),
  subtitle: 'Building without waiting for permission.',
  footer: 'ielyssa.com/writing',
});
cards.push({
  file: 'post-what-a-lost-hackathon-taught-me',
  kicker: 'Writing',
  titleLines: wrap('What a Lost Hackathon Taught Me About Technology', 26),
  subtitle: 'Useful technology matters more than impressive technology.',
  footer: 'ielyssa.com/writing',
});
cards.push({
  file: 'post-why-atas-starts-with-data',
  kicker: 'Writing',
  titleLines: wrap('Why ATAS Starts With Data, Not a Model', 26),
  subtitle: 'The patient work underneath AI that understands Rwanda.',
  footer: 'ielyssa.com/writing',
});
cards.push({
  file: 'post-build-for-the-people-you-know',
  kicker: 'Writing',
  titleLines: wrap('Build for the People You Actually Know', 26),
  subtitle: 'A real place and real constraints are a better starting point.',
  footer: 'ielyssa.com/writing',
});

for (const card of cards) {
  await renderCard(card);
}

console.log(`\n${cards.length} OG images written to public/og/`);
