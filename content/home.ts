export const FOCUS_SLIDES = [
  {
    id: 'rwanda-first',
    image: '/media/focus/focus-rwanda-context-ai.webp',
    title: 'Rwanda-first AI, from research to deployment',
    description:
      'I build systems that understand local realities and constraints — designed in Kigali, for the way Rwandans actually live and work.',
  },
  {
    id: 'language',
    image: '/media/focus/focus-language-culture-systems.webp',
    title: 'Kinyarwanda language technology as a foundation',
    description:
      'Speech and language systems built natively for Kinyarwanda — not adapted from elsewhere and translated after the fact.',
  },
  {
    id: 'education',
    image: '/media/focus/focus-research-signals.webp',
    title: 'National education infrastructure in production',
    description:
      'AcademiaPlus maps real curriculum evidence for students, teachers, schools — and the country as a whole.',
  },
  {
    id: 'long-term',
    image: '/media/focus/focus-entrepreneurial-execution.webp',
    title: 'Long-term commitment over short-term wins',
    description:
      'ATAS is building lasting AI capability for Rwanda — one deliberate layer at a time, from IMIZI to shipped products.',
  },
] as const;

export const FOCUS_METRICS = [
  {
    label: 'Products & programs at ATAS',
    value: '2 tracks',
    detail: 'One product entering schools, one long-term research program.',
    slideId: 'education',
  },
  {
    label: 'Language focus',
    value: 'Kinyarwanda-first',
    detail: 'Speech & understanding built natively, not translated.',
    slideId: 'language',
  },
  {
    label: 'Milestone',
    value: 'AcademiaPlus enters schools',
    detail: "Rwanda's curriculum infrastructure. First onboardings next term.",
    slideId: 'education',
  },
  {
    label: 'Founded',
    value: '2025 · Kigali',
    detail: 'Research → product, one pipeline, built in public.',
    slideId: 'long-term',
  },
] as const;

export const COLLABORATION_ITEMS = [
  'AI infrastructure research partnerships',
  'Collaboration with schools and education institutions',
  'Kinyarwanda language technology projects',
  'Speaking invitations and mentorship',
] as const;

export const CONTACT_INTRO =
  "I read everything myself and reply within a few days. If it's urgent, email is fastest.";
