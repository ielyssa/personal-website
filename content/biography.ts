// Content for the biography page. Paragraphs are plain strings, but where a
// named person from BIO_PEOPLE is mentioned, wrap their exact name in
// {{slug|Displayed Name}} — BiographyPage parses this token and renders it
// as a link to that person's entry in the bottom directory. Keeps the prose
// editable as plain text without JSX creeping into the content file.

export type BioChapter = {
  id: string;
  period: string;
  title: string;
  body: string[];
  pullQuote?: string;
};

export const BIO_INTRO = {
  name: 'IRANKUNDA Elyssa',
  bornLine: 'Born May 18, 2005, in Rubavu District, Western Province, Rwanda.',
  frame:
    'The first of seven children — three boys, four girls — to parents who are both still living.',
};

export const BIO_CHAPTERS: BioChapter[] = [
  {
    id: 'beginnings',
    period: '2012–2025',
    title: 'Beginnings',
    body: [
      'I started primary school at seven, at RUSAMAZA Primary School in Rubavu. From there I went to College de Gisenyi INYEMERAMIHIGO in Rugerero for ordinary level (2017–2021), and later to Runda Technical Secondary School for advanced level (2022–2025), where I studied Software Development.',
      "I was, for most of that early journey, an ordinary student who studied to succeed — nothing more specific than that. When it came time to choose a path after ordinary level, software development wasn't a calling. It was a choice made without knowing what would come of it.",
      "The school I hoped for was Rwanda Coding Academy — not for the technology, but because it doesn't charge school fees, and it takes only the country's top performers. I studied hard enough to place at national level, achieving A's across every subject in the national exam. But when the results came, NESA placed me elsewhere, at a school with a software development track I hadn't asked for. My father and I appealed. The answer didn't change.",
      "A friend who had made it into RCA a year ahead of me gave me one piece of advice: if I was going to study software development anywhere else, I needed to take it seriously myself, because most schools wouldn't equip me for it. I held onto that.",
    ],
  },
  {
    id: 'first-term',
    period: 'L3, first term',
    title: 'The first term',
    body: [
      "It was in that first term that I met {{hagenimana-samuel|HAGENIMANA Samuel}}, who I'd go on to call my closest friend for years afterward. He'd wanted Rwanda Coding Academy just as badly as I had, and when he found out I'd also missed it, despite scoring 54 out of 54 in the national exam, one point above his own 53, he stopped wondering why he hadn't made it in either. Neither of us had been alone in that disappointment, it turned out — we'd simply ended up in the same room. He's remained bold about his own passions ever since, the same way I've tried to be; after we graduated, he went on to found Oliviuus, where he's founder and CEO today.",
      'That first term was almost entirely unrelated to programming — general modules shared with completely different trades: land surveying, building construction, computer architecture. I asked to transfer out, to study something else entirely. A teacher told me to be patient; what I was looking for was coming in the second term.',
      "I didn't wait. I didn't own a computer. The first person to really show me anything was {{ishimwe-eric|ISHIMWE Eric}}, a classmate who already seemed to know far more than the rest of us. He's the one who introduced me to W3Schools, and the very first line of code I ever wrote, I wrote sitting beside him. From there I kept teaching myself — HTML, CSS, a handful of tags, asking teachers and older students whatever they'd answer. My friend {{munyemana-yvan-jabez|MUNYEMANA Yvan Jabez}} and I tried to build a YouTube-like website we called VIDNET, later VIDWATCH, with nothing but a few HTML tags and total confidence. We didn't know JavaScript existed yet. When older students told us we'd need a database, none of them could say what kind — that was next year's material. We abandoned the idea and went back to fundamentals.",
      'I finished that first term top of my class, above 88%.',
    ],
    pullQuote:
      'I remember the day I finally understood how border-radius worked as a genuine, hard-won victory.',
  },
  {
    id: 'no-laptop',
    period: 'L3, second & third term',
    title: 'Learning without a laptop',
    body: [
      "Through the second term, I wrote code in notebooks when I had no computer, and borrowed friends' laptops for an hour or two at a time, returning them the moment I was done. I taught myself from W3Schools' HowTo section — the first place I ever learned JavaScript. By the third term, my parents had bought me a laptop of my own.",
      "It changed everything. I finished L3 first in my class, above 90% for the first time. Over the 2.5-month holiday that followed, I downloaded a full Node.js and MongoDB course from a YouTube channel called The Net Ninja — downloaded in advance, because I knew there'd be no internet at home. I built my first real project from scratch that holiday, often walking to a different school in my community just to get online long enough to debug an error I couldn't otherwise solve.",
    ],
  },
  {
    id: 'computer-lab',
    period: 'L4',
    title: 'The computer lab',
    body: [
      "I came back for L4 with something to show — a simple school management system built over the holiday. When I demonstrated it to my teachers, I was told I was the first student in my grade to ever bring a working project like that to the school. They gave me access to the computer lab — a privilege usually reserved for students ahead of me. I couldn't run it alone, so I gathered friends, and together we expanded that first project into something we called DMS, a Discipline Management System.",
      "That first term of L4, {{hagenimana-samuel|HAGENIMANA Samuel}}, {{ishimwe-romain|ISHIMWE Romain}}, {{rukundo-jean-baptiste|RUKUNDO Jean Baptiste}} and I woke at 2 a.m. some mornings, each of us chasing something we were teaching ourselves outside class. Mine was 100 Days of Python, taught by Angela — a course {{ishimwe-eric|ISHIMWE Eric}} had helped me buy in the first place. Eric himself lived at his parents' house nearby rather than in the boarding section with the rest of us, so he joined our study sessions at more regular hours instead of the 2 a.m. starts. We missed some classes chasing all of this. I finished the term second in my class instead of first, and I knew exactly why — not talent lost, just time spent building something else. My friends and I made a pact: dominate both, the classroom and the lab. In the second term, we did — and that's also where we learned Git, out of sheer necessity to manage our growing projects.",
    ],
  },
  {
    id: 'hackathon',
    period: 'L4, second term',
    title: 'The hackathon',
    body: [
      "Near the end of that second term, a teacher sent me a link to an AI Learning Hackathon, open to all of Rwanda, with only ten schools selected. We were chosen. Our team of three, {{hagenimana-samuel|HAGENIMANA Samuel}}, {{ishimwe-eric|ISHIMWE Eric}}, and I, left our end-of-term exam to compete in Kigali, alongside students from RCA — the school I'd once hoped to attend.",
      "Our pitch, on day one, revealed something unsettling: our idea and RCA's team's idea were nearly identical. And unlike us, they'd arrived with a finished, production-ready product. We had arrived with only an idea, believing incorrectly that building was part of the competition itself. We spent the final two days building without sleep — never once using the hotel beds we'd been given.",
      "We built GuideMe, a personalized learning platform, with me handling the Flask and Python backend. On the final day, exhausted and sick from three sleepless nights, our project's core dependency — a ChatGPT API key — hit a rate limit during rehearsal, minutes before we were due to present. There was no way to recover it in time. We presented anyway, and lost any real chance at placing.",
      "RCA's team took second place. First place went to a team from a school with no software development program at all — their prototype, a simple, solid tool to help blind users operate a computer, had been built the night before with help from {{hagenimana-samuel|HAGENIMANA Samuel}} himself.",
      "Months later, working through an OpenCV project, Samuel came across something that put the whole competition in a different light: RCA's polished, \"production-ready\" entry hadn't been built from scratch during the event at all — it was a customized template from Soul Machine, a company known for hyper-realistic, emotionally intelligent digital humans, styled to look like an original product. We had no idea at the time, and it doesn't undo anything we learned there. We'd written every line of our own code that weekend, and it still wasn't enough to place — which taught me something more useful than a clean loss would have. It's a stranger lesson to sit with once you learn the playing field wasn't quite what it seemed, but it's the same lesson regardless.",
      "President Paul Kagame, who helped award the prizes that day, announced that every participant would receive a new laptop. I'm still using it today.",
    ],
    pullQuote:
      'The tech stack behind a solution barely matters next to whether it actually reaches someone who needed it.',
  },
  {
    id: 'after',
    period: 'L4, internship month',
    title: 'What came after',
    body: [
      "When the competition ended, we came back just in time for the internship every L4 student takes — two weeks of the normal holiday combined with two weeks provided by RTB, forming one full month. Before it began, I pulled together the five of us who could make it — {{hagenimana-samuel|HAGENIMANA Samuel}}, {{rukundo-el-shaddai|RUKUNDO El-shaddai}}, {{muhoza-elan-clever|MUHOZA Elan Clever}}, {{rukundo-jean-baptiste|RUKUNDO Jean Baptiste}}, and I — and made a decision: instead of treating that month as a holiday, we'd turn it into our own internship. We rented two houses in Gasabo, Kigali — one to live in, one that became our office — paid a month upfront, and built out of it what an actual company internship might have looked like, entirely on our own terms. That's where the name EduBridge was actually born. ISHIMWE Eric wasn't part of this stretch — he was in Uganda at the time.",
      "{{igabe-musangamfura-lydivine|IGABE MUSANGAMFURA Lydivine}} and {{ishimwe-romain|ISHIMWE Romain}} weren't living in Gasabo with the rest of us, but they were part of EduBridge from day one all the same, shaping the idea with us throughout even while working from outside that house. All seven of us stood together for the actual presentation, taken to RTB by our teacher — still mostly a concept at that stage, with a partial prototype rather than anything that could genuinely predict a student dropping out. RTB never called the idea bad; they just weren't confident we were the right team to carry it forward, and said they'd follow up. They never did.",
      "When the third term started, I kept working on it on my own, refining it until it became something real — an actual model capable of predicting a student's likelihood of dropping out, built out from that unfinished internship idea. Years later, after we'd all graduated, {{rukundo-el-shaddai|RUKUNDO El-shaddai}} went on to found LinkFy Connect.",
      "That holiday, heading into L5, I taught myself Django from another YouTube course. Not long after, I built and sold my first real client project — a complete school website, for 500,000 RWF. It's still live today, still used by that school.",
    ],
  },
  {
    id: 'real-problem',
    period: 'L5',
    title: 'Finding the real problem',
    body: [
      'In L5, with graduation only months away, I watched classmates plan to start web agencies — building sites for clients. I knew I wanted something else: to solve a real problem, starting from my own community, the way EduBridge had tried to.',
      "At the time, AI still struggled with Kinyarwanda. I briefly considered building a Kinyarwanda-language model myself, until I noticed the existing models were improving at that faster than I could catch up to. So I looked past language, and found something underneath it: speaking a language fluently isn't the same as understanding how a place actually works. My own father struggled to get useful advice from AI — not because it couldn't speak to him, but because its answers were generic, built for no particular context, while his life was built entirely from one.",
      "The father story was one thread, but not the only one. The more I looked, the more I found the same pattern repeating — in healthcare, agriculture, business, government, in ordinary daily life. Something as simple as a birth certificate should exist as retrievable data, yet still usually means an in-person trip to the local umudugudu office. A patient needing urgent care doesn't always have a fast way to reach one. Calling a service center for something routine can mean two hours on hold before a person answers. None of that is a technology problem in the way people usually mean it — it's a systems problem, the kind a general-purpose AI, however fluent, was never built to notice. Those were the moments that shaped what ATAS eventually became: not one product for one use case, but infrastructure meant to sit underneath problems like these, wherever they show up.",
    ],
    pullQuote:
      'An AI could exist on a map without understanding anything true about the place it named.',
  },
  {
    id: 'atas',
    period: '2025',
    title: 'ATAS',
    body: [
      'I chose the name deliberately. The "Alliance" in ATAS was never incidental — I knew from the beginning that whatever I built would eventually mean working alongside others, even if I started alone. I remember asking a classmate to help me get the spelling exactly right, half-worried people would misread it as "ATASA."',
      "When I graduated, I kept the promise I'd made to myself and continued building what I'd started in L5 — AcademiaPlus — the project that, alongside ATAS, still occupies most of my time today.",
    ],
  },
];

export const BIO_CLOSING = {
  title: 'The journey continues',
  body: "This isn't a story with an ending — it's one still being written, one decision, one late night, one honest reckoning with reality at a time. Everything since has been building toward the same idea I found in L5: technology that doesn't just speak someone's language, but understands their world.",
  pullQuote: 'That work is still in progress. So am I.',
};
