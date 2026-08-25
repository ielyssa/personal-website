import sharp from 'sharp';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ORIGINALS = path.join(ROOT, 'content', 'originals');
const OUT_DIR = path.join(ROOT, 'public', 'media');
const MANIFEST_PATH = path.join(ROOT, 'src', 'lib', 'media-manifest.json');

async function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function blurFromPipeline(buffer) {
  return sharp(buffer)
    .resize(16)
    .webp({ quality: 40 })
    .toBuffer()
    .then((b) => `data:image/webp;base64,${b.toString('base64')}`);
}

async function processJob(job) {
  const outAbs = path.join(ROOT, 'public', job.out.replace(/^\//, ''));
  await ensureDir(outAbs);
  let pipeline = sharp(path.join(ORIGINALS, job.input)).rotate();
  if (job.crop) {
    pipeline = pipeline.resize(job.width, Math.round(job.width * (job.crop[1] / job.crop[0])), {
      fit: 'cover',
      position: job.position ?? 'centre',
    });
  } else {
    pipeline = pipeline.resize({ width: job.width, withoutEnlargement: true });
  }
  const { data, info } = await pipeline
    .webp({ quality: job.quality ?? 80, alphaQuality: job.alphaQuality ?? 90 })
    .toBuffer({ resolveWithObject: true });
  fs.writeFileSync(outAbs, data);
  const blurDataURL = await blurFromPipeline(data);
  return {
    out: `/${job.out}`,
    width: info.width,
    height: info.height,
    blurDataURL,
    hash: createHash('md5').update(data).digest('hex').slice(0, 8),
  };
}

const jobs = [
  { input: 'profile-picture.png', out: 'media/person/elyssa-avatar-800.webp', width: 800, crop: [1, 1], quality: 84 },
  { input: 'logo/atas-logo-bg.png', out: 'media/logos/atas.webp', width: 256, quality: 88 },
  { input: 'logo/academiaplus-logo.png', out: 'media/logos/academiaplus.webp', width: 256, quality: 88 },
  { input: 'logo/edubridge-logo.png', out: 'media/logos/edubridge.webp', width: 256, quality: 88 },
  { input: 'logo/kinyarwanda-sts-logo.png', out: 'media/logos/kinyarwanda-tts.webp', width: 256, quality: 88 },

  { input: 'projects/academiaplus/academiaplus-01.png', out: 'media/work/academiaplus-01.webp', width: 1440, quality: 76 },
  { input: 'projects/academiaplus/academiaplus-02.png', out: 'media/work/academiaplus-02.webp', width: 1440, quality: 76 },
  { input: 'projects/academiaplus/academiaplus-03.png', out: 'media/work/academiaplus-03.webp', width: 1440, quality: 76 },
  { input: 'projects/edubridge/edubridge-01.png', out: 'media/work/edubridge-01.webp', width: 1440, quality: 76 },
  { input: 'projects/edubridge/edubridge-02.png', out: 'media/work/edubridge-02.webp', width: 1440, quality: 76 },
  { input: 'projects/edubridge/edubridge-03.png', out: 'media/work/edubridge-03.webp', width: 1440, quality: 76 },
  { input: 'projects/kinyarwanda-tss/kinyarwanda-tss-01.png', out: 'media/work/kinyarwanda-tts-01.webp', width: 1440, quality: 76 },
  { input: 'projects/kinyarwanda-tss/kinyarwanda-tss-02.png', out: 'media/work/kinyarwanda-tts-02.webp', width: 1440, quality: 76 },
  { input: 'projects/kinyarwanda-tss/kinyarwanda-tss-03.png', out: 'media/work/kinyarwanda-tts-03.webp', width: 1440, quality: 76 },

  { input: 'atas/atas-mission.png', out: 'media/work/atas-mission.webp', width: 1600, quality: 78 },
  { input: 'atas/atas-programs.png', out: 'media/work/atas-programs.webp', width: 1600, quality: 78 },
  { input: 'atas/atas-impact.png', out: 'media/work/atas-impact.webp', width: 1600, quality: 78 },

  { input: 'focus/focus-rwanda-context-ai.png', out: 'media/focus/focus-rwanda-context-ai.webp', width: 1400, quality: 74 },
  { input: 'focus/focus-research-signals.png', out: 'media/focus/focus-research-signals.webp', width: 1400, quality: 74 },
  { input: 'focus/focus-language-culture-systems.png', out: 'media/focus/focus-language-culture-systems.webp', width: 1400, quality: 74 },
  { input: 'focus/focus-entrepreneurial-execution.png', out: 'media/focus/focus-entrepreneurial-execution.webp', width: 1400, quality: 74 },

  { input: 'blog/atas-journey.jpg', out: 'media/blog/atas-journey.webp', width: 1600, crop: [16, 9], quality: 80 },
  { input: 'blog/ml-education.png', out: 'media/blog/ml-education.webp', width: 1600, crop: [16, 9], quality: 80 },
  { input: 'blog/kinyarwanda-tts.png', out: 'media/blog/kinyarwanda-tts.webp', width: 1600, crop: [16, 9], quality: 80 },
  { input: 'blog/data-science-skills.jpg', out: 'media/blog/data-science-skills.webp', width: 1600, crop: [16, 9], quality: 80 },
];

const manifest = {};
for (const job of jobs) {
  const result = await processJob(job);
  manifest[result.out] = { width: result.width, height: result.height, blurDataURL: result.blurDataURL };
  const kb = (fs.statSync(path.join(ROOT, 'public', job.out.replace(/^\//, ''))).size / 1024).toFixed(0);
  console.log(`${result.out}  ${result.width}x${result.height}  ${kb}KB`);
}

await ensureDir(MANIFEST_PATH);
fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nManifest written: ${MANIFEST_PATH} (${Object.keys(manifest).length} entries)`);
