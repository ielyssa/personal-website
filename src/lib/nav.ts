import { SITE } from '@content/site';

export type NavItem = {
  label: string;
  href: string;
  kind: 'section' | 'route';
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', kind: 'route' },
  { label: 'About', href: '/#about', kind: 'section' },
  { label: 'Biography', href: '/biography', kind: 'route' },
  { label: 'ATAS', href: '/#atas', kind: 'section' },
  { label: 'Work', href: '/work', kind: 'route' },
  { label: 'Writing', href: '/writing', kind: 'route' },
  { label: 'Speaking', href: '/speaking', kind: 'route' },
  { label: 'Contact', href: '/#contact', kind: 'section' },
];

export const FOOTER_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Biography', href: '/biography' },
  { label: 'Writing', href: '/writing' },
  { label: 'Speaking', href: '/speaking' },
  { label: 'Press', href: '/press' },
  { label: 'Now', href: '/now' },
  { label: 'Privacy', href: '/privacy' },
];

export const SOCIAL_PROFILES = [
  { label: 'LinkedIn', href: SITE.socials.linkedin, icon: 'mdi:linkedin' },
  { label: 'X', href: SITE.socials.x, icon: 'mdi:twitter' },
  { label: 'Instagram', href: SITE.socials.instagram, icon: 'mdi:instagram' },
  { label: 'GitHub', href: SITE.socials.github, icon: 'mdi:github' },
];

export function isHomePathname(pathname: string) {
  return pathname === '/';
}
