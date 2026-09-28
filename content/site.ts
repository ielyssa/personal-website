export const SITE = {
  name: 'IRANKUNDA Elyssa',
  shortName: 'Elyssa',
  initials: 'IE',
  url: 'https://ielyssa.com',
  email: 'info@ielyssa.com',
  phone: '+250 788 235 574',
  phoneHref: 'tel:+250788235574',
  location: 'Kigali, Rwanda',
  roleLine: 'Founder & CEO of ATAS',
  tagline: 'AI infrastructure that understands Rwanda',
  positioningLine:
    'I build AI infrastructure for Rwanda — its languages, geography, and everyday realities.',
  foundedAtas: '2025',
  socials: {
    linkedin: 'https://www.linkedin.com/in/ielyssa',
    x: 'https://x.com/_ielyssa',
    instagram: 'https://www.instagram.com/_ielyssa/',
    github: 'https://github.com/ielyssa',
  },
  atas: {
    name: 'ATAS — Alliance for Transformative AI Systems',
    shortName: 'ATAS',
    site: 'https://atas.rw',
    linkedin: 'https://www.linkedin.com/company/atas-rwanda',
    x: 'https://x.com/atas_rw',
    instagram: 'https://www.instagram.com/atas.rw/',
    youtube: 'https://www.youtube.com/@ATASRwanda',
  },
} as const;

export type Site = typeof SITE;
