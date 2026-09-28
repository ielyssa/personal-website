import Link from 'next/link';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SmartImage } from '@/components/media/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import { JsonLd } from '@/components/ui/json-ld';
import { Iconify } from '@/components/ui/iconify';
import { SITE } from '@content/site';
import { BIO_CHAPTERS, BIO_CLOSING, BIO_INTRO } from '@content/biography';
import { BIO_PEOPLE } from '@content/bio-people';
import { ChapterParagraph } from './ChapterParagraph';
import {
  biographyPageNode,
  biographyPersonNode,
  breadcrumbNode,
  graph,
  itemListNode,
} from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

const BIOGRAPHY_DESCRIPTION =
  'Biography of IRANKUNDA Elyssa, Founder & CEO of ATAS, building Rwanda-first AI systems rooted in language, place, culture, and everyday life.';
const BIOGRAPHY_KEYWORDS = [
  'IRANKUNDA Elyssa biography',
  'Elyssa Irankunda story',
  'ATAS founder Rwanda',
  'Rwanda Coding Academy',
  'software development in Rwanda',
  ...BIO_PEOPLE.map((person) => person.name),
];

export const metadata = buildMetadata({
  title: 'Biography',
  description: BIOGRAPHY_DESCRIPTION,
  path: '/biography',
  ogImage: '/og/biography.png',
  keywords: BIOGRAPHY_KEYWORDS,
});

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 320ms cubic-bezier(0.4, 0, 0.2, 1)',
};

const RAIL_WIDTH = { xs: 0, sm: 40 };
const DOT_SIZE = 9;

export default function BiographyPage() {
  return (
    <Container sx={{ py: { xs: 6, md: 9 } }}>
      <JsonLd
        data={graph(
          biographyPageNode({
            description: BIOGRAPHY_DESCRIPTION,
            keywords: BIOGRAPHY_KEYWORDS,
            people: BIO_PEOPLE,
          }),
          itemListNode(
            '/biography',
            BIO_PEOPLE.map((person) => ({
              name: person.name,
              path: `/biography#person-${person.slug}`,
            })),
            'people-list'
          ),
          ...BIO_PEOPLE.map(biographyPersonNode),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Biography', path: '/biography' },
          ])
        )}
      />

      {/* Page header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: { xs: 4, md: 7 },
          alignItems: 'end',
          mb: { xs: 7, md: 9 },
          pb: { xs: 5, md: 6 },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ order: { xs: 2, md: 1 } }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>
            Biography
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4rem' },
              letterSpacing: '-0.03em',
              lineHeight: 1,
              mb: 3,
            }}
          >
            The journey so far
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.05rem', md: '1.2rem' },
              lineHeight: 1.6,
              mb: 1,
            }}
          >
            {BIO_INTRO.name}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, maxWidth: '46ch', mb: 0.5 }}>
            {BIO_INTRO.bornLine}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, maxWidth: '46ch' }}>
            {BIO_INTRO.frame}
          </Typography>
        </Box>

        <Box sx={{ order: { xs: 1, md: 2 } }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 320, sm: 380, md: 440 },
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <SmartImage
              src="/media/person/elyssa-avatar-800.webp"
              alt={`Portrait of ${SITE.name}`}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              sx={{ borderRadius: 0 }}
            />
          </Box>
        </Box>
      </Box>

      {/* A note that names are linked, since the underline-on-every-name
          convention isn't self-explanatory the first time a reader sees it. */}
      <Box sx={{ maxWidth: 760, mb: { xs: 5, md: 6 } }}>
        <Typography variant="body2" color="text.secondary">
          {'Underlined names link to '}
          <Box
            component="a"
            href="#people"
            sx={{
              color: 'text.secondary',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            people in this story
          </Box>
          {', further down this page.'}
        </Typography>
      </Box>

      {/* Timeline */}
      <Box sx={{ maxWidth: 760 }}>
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              left: { xs: 0, sm: RAIL_WIDTH.sm / 2 },
              top: 8,
              bottom: 8,
              width: '1px',
              bgcolor: 'divider',
              display: { xs: 'none', sm: 'block' },
              transform: 'translateX(-0.5px)',
            }}
          />

          <Stack spacing={{ xs: 6, md: 7 }}>
            {BIO_CHAPTERS.map((chapter, index) => (
              <Reveal key={chapter.id} delay={Math.min(index, 4) * 60}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: `${RAIL_WIDTH.sm}px 1fr` },
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: 'none', sm: 'flex' },
                      justifyContent: 'center',
                      pt: '10px',
                    }}
                  >
                    <Box
                      sx={{
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                        borderRadius: '50%',
                        bgcolor: 'text.primary',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600, mb: 0.8 }}
                    >
                      {chapter.period}
                    </Typography>
                    <Typography
                      component="h2"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '1.4rem', md: '1.65rem' },
                        letterSpacing: '-0.01em',
                        mb: 2,
                      }}
                    >
                      {chapter.title}
                    </Typography>

                    <Stack spacing={1.8}>
                      {chapter.body.map((paragraph) => (
                        <ChapterParagraph key={paragraph.slice(0, 32)} text={paragraph} />
                      ))}
                    </Stack>

                    {chapter.pullQuote ? (
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1.15rem', md: '1.3rem' },
                          lineHeight: 1.5,
                          letterSpacing: '-0.01em',
                          mt: 2.5,
                          pl: 2.5,
                          borderLeft: '2px solid',
                          borderColor: 'text.primary',
                        }}
                      >
                        {chapter.pullQuote}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              </Reveal>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Closing */}
      <Box sx={{ maxWidth: 760 }}>
        <Reveal delay={280}>
          <Box
            sx={{
              mt: { xs: 7, md: 8 },
              pt: { xs: 5, md: 6 },
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.5rem', md: '1.85rem' },
                letterSpacing: '-0.01em',
                mb: 2,
              }}
            >
              {BIO_CLOSING.title}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.85, maxWidth: '58ch', mb: 3 }}>
              {BIO_CLOSING.body}
            </Typography>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.5rem', md: '1.9rem' },
                letterSpacing: '-0.015em',
                lineHeight: 1.3,
              }}
            >
              {BIO_CLOSING.pullQuote}
            </Typography>
          </Box>
        </Reveal>
      </Box>

      {/* People directory — every named person from the story, with
          whatever links apply. A ledger, same language as Work/Speaking:
          name + context as the row, links as plain underlined text
          trailing after, not icon buttons or avatar cards. */}
      <Box
        id="people"
        sx={{
          mt: { xs: 8, md: 10 },
          pt: { xs: 5, md: 6 },
          borderTop: '1px solid',
          borderColor: 'divider',
          scrollMarginTop: 96,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          People in this story
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ lineHeight: 1.75, maxWidth: '58ch', mb: { xs: 4, md: 5 } }}
        >
          Everyone named above, in one place — the people who were actually there for the parts of
          this that involved more than one person.
        </Typography>

        <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
          {BIO_PEOPLE.map((person) => (
            <Box
              key={person.slug}
              id={`person-${person.slug}`}
              sx={{ py: { xs: 3, md: 3.5 }, scrollMarginTop: 96 }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
                  gap: { xs: 1.5, sm: 4 },
                  alignItems: 'baseline',
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', mb: 0.6 }}>
                    {person.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, maxWidth: '56ch' }}
                  >
                    {person.context}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2.5} sx={{ flexShrink: 0 }}>
                  {person.company ? (
                    <Typography
                      component="a"
                      href={person.company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'inline-block',
                        ...UNDERLINE_SX,
                        '&:hover': { backgroundSize: '100% 1px' },
                      }}
                    >
                      {person.company.name}
                    </Typography>
                  ) : null}
                  {person.website ? (
                    <Typography
                      component="a"
                      href={person.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'inline-block',
                        ...UNDERLINE_SX,
                        '&:hover': { backgroundSize: '100% 1px' },
                      }}
                    >
                      Website
                    </Typography>
                  ) : null}
                  {person.instagram ? (
                    <Typography
                      component="a"
                      href={person.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${person.name} on Instagram`}
                      sx={{
                        display: 'inline-flex',
                        color: 'text.secondary',
                        '&:hover': { color: 'text.primary' },
                      }}
                    >
                      <Iconify icon="mdi:instagram" width={19} />
                    </Typography>
                  ) : null}
                </Stack>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          mt: { xs: 7, md: 8 },
          pt: { xs: 4, md: 5 },
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={{ xs: 3, sm: 4 }} flexWrap="wrap" useFlexGap>
          <Typography
            component={Link}
            href="/work/atas"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.05rem',
              ...UNDERLINE_SX,
              '&:hover': { backgroundSize: '100% 1px' },
            }}
          >
            Explore ATAS
            <Iconify icon="carbon:arrow-right" width={16} />
          </Typography>
          <Typography
            component={Link}
            href="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.secondary',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.05rem',
              ...UNDERLINE_SX,
              '&:hover': { backgroundSize: '100% 1px', color: 'text.primary' },
            }}
          >
            <Iconify icon="carbon:arrow-left" width={16} />
            Back to home
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
