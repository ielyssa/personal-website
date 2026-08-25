import mediaManifestJson from './media-manifest.json';

export type MediaEntry = { width: number; height: number; blurDataURL: string };

const manifest = mediaManifestJson as Record<string, MediaEntry>;

export function getMediaEntry(src: string): MediaEntry | undefined {
  return manifest[src];
}
