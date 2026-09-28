// Everyone named in the biography who gets a link + bottom-of-page profile
// entry. GRACE and Angela are deliberately excluded per instructions.

export type Person = {
  slug: string;
  name: string;
  context: string; // who they are in the story, drawn from the text itself
  instagram?: string;
  website?: string;
  company?: { name: string; url: string };
};

export const BIO_PEOPLE: Person[] = [
  {
    slug: 'hagenimana-samuel',
    name: 'HAGENIMANA Samuel',
    context:
      "Closest friend since our first term together. Missed Rwanda Coding Academy by one point, the same year I missed it too. On our hackathon team, and later helped build the first-place team's tool the night before it won.",
    instagram: 'https://www.instagram.com/_s.am.u.e.l_/',
    website: 'https://hagenimanasamuel.pages.dev/',
    company: { name: 'Oliviuus', url: 'https://oliviuus.com/' },
  },
  {
    slug: 'ishimwe-eric',
    name: 'ISHIMWE Eric',
    context:
      'The first person to really show me anything — introduced me to W3Schools, and sat beside me for the first line of code I ever wrote. Helped me buy my first Udemy course. On our hackathon team.',
    instagram: 'https://www.instagram.com/chapu__0',
  },
  {
    slug: 'munyemana-yvan-jabez',
    name: 'MUNYEMANA Yvan Jabez',
    context:
      'Built VIDNET/VIDWATCH with me — our first, doomed attempt at a YouTube-like website with nothing but a few HTML tags.',
    instagram: 'https://www.instagram.com/prodbyyvan0tt/',
  },
  {
    slug: 'ishimwe-romain',
    name: 'ISHIMWE Romain',
    context:
      'Part of the 2 a.m. study sessions in L4, and part of EduBridge from the idea stage, working from outside the Gasabo house.',
    instagram: 'https://www.instagram.com/9teen.k/',
  },
  {
    slug: 'rukundo-jean-baptiste',
    name: 'RUKUNDO Jean Baptiste',
    context:
      'Part of the 2 a.m. study sessions in L4, and one of the five of us who turned our RTB internship into EduBridge.',
    website: 'https://rukundo-jean-baptiste.web.app/',
    instagram: 'https://www.instagram.com/rukundo__0/',
  },
  {
    slug: 'rukundo-el-shaddai',
    name: 'RUKUNDO El-shaddai',
    context:
      'One of the five who built EduBridge out of our own internship month in Gasabo. Later founded LinkFy Connect.',
    instagram: 'https://www.instagram.com/e.l_s.h.a.d.d.a.i',
    website: 'https://rukundoelshaddai.web.app/',
    company: { name: 'LinkFy Connect', url: 'https://linkfyconnect.com/' },
  },
  {
    slug: 'muhoza-elan-clever',
    name: 'MUHOZA Elan Clever',
    context: 'One of the five who built EduBridge out of our own internship month in Gasabo.',
    instagram: 'https://www.instagram.com/muhoza_ngenzi_elan/',
  },
  {
    slug: 'igabe-musangamfura-lydivine',
    name: 'IGABE MUSANGAMFURA Lydivine',
    context:
      'Part of EduBridge from day one, shaping the idea with us while working from outside the Gasabo house.',
    instagram: 'https://www.instagram.com/__i.ga.be_/',
  },
];

export function getPerson(slug: string): Person | undefined {
  return BIO_PEOPLE.find((person) => person.slug === slug);
}
