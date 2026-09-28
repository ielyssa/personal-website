export const SPEAKING = {
  topics: [
    {
      title: 'Rwanda-First AI Infrastructure',
      description:
        'Why AI built for Rwanda — its languages, geography, and realities — outperforms adapted foreign systems, and what that looks like in practice.',
      format: 'Keynote',
    },
    {
      title: 'Language & Culture-Aware AI Systems',
      description:
        'Building Kinyarwanda language technology natively: speech, understanding, and the data discipline behind it.',
      format: 'Technical talk',
    },
    {
      title: 'From Research to Deployment',
      description:
        'How ATAS runs research and product as one pipeline — rigorous methods applied to systems schools and institutions actually use.',
      format: 'Workshop',
    },
    {
      title: 'Building AI Companies in Africa',
      description:
        'Lessons from founding and running an AI company in Kigali at 20 — talent, trust, pricing, and long-term commitment.',
      format: 'Panel · Fireside chat',
    },
  ],
  // Optional `location` and `link` — leave either out until there's a real
  // recording, writeup, or venue detail to point to.
  engagements: [] as {
    title: string;
    venue: string;
    year: string;
    location?: string;
    link?: string;
  }[],
};
