import Link from 'next/link';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { JsonLd } from '@/components/ui/json-ld';
import { SectionHeading } from '@/components/ui/section';
import { Iconify } from '@/components/ui/iconify';
import { getWorks } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbNode, collectionPageNode, graph, itemListNode } from '@/lib/jsonld';
import type { Work, WorkStatus } from '@/lib/content';

export const metadata = buildMetadata({
  title: 'Work — Ventures & Research',
  description:
    'Ventures and research programs from ATAS: AcademiaPlus, IMIZI, Kinyarwanda TTS, and EduBridge — built by IRANKUNDA Elyssa in Kigali.',
  path: '/work',
  ogImage: '/og/work-index.png',
});

const STATUS_LABEL: Record<WorkStatus, string> = { active: 'Active product', research: 'Research program', earlier: 'Earlier work' };
const STATUS_ORDER: WorkStatus[] = ['active', 'research', 'earlier'];

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 380ms cubic-bezier(0.4, 0, 0.2, 1)',
};

function groupByStatus(works: Work[]) {
  const groups = new Map<WorkStatus, Work[]>();
  for (const status of STATUS_ORDER) groups.set(status, []);
  for (const work of works) groups.get(work.status)?.push(work);
  return STATUS_ORDER.map((status) => ({ status, items: groups.get(status) ?? [] })).filter((group) => group.items.length > 0);
}

export default function WorkIndexPage() {
  const works = getWorks();
  const groups = groupByStatus(works);

  return (
    <Container sx={{ py: { xs: 6, md: 9 } }}>
      <JsonLd
        data={graph(
          collectionPageNode({
            path: '/work',
            name: 'Ventures & research',
            description: 'Ventures and research programs built by ATAS in Kigali.',
          }),
          itemListNode(
            '/work',
            works.map((work) => ({ name: work.name, path: `/work/${work.slug}` }))
          ),
          breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'Work', path: '/work' }])
        )}
      />
      <Box sx={{ mb: { xs: 6, md: 8 } }}>
        <SectionHeading
          overline="Work"
          title="Ventures & research"
          description="Everything here is built by ATAS, the company I founded — one product in schools today, and research programs building Rwanda's AI foundation."
        />
      </Box>

      <Stack spacing={{ xs: 6, md: 8 }}>
        {groups.map((group) => (
          <Box key={group.status}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              {STATUS_LABEL[group.status]}
            </Typography>

            <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
              {group.items.map((work, index) => (
                <Box
                  key={work.slug}
                  component={Link}
                  href={`/work/${work.slug}`}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                    py: { xs: 3, md: 3.5 },
                    '&:hover .work-name': { backgroundSize: '100% 1px' },
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '2rem 1fr', md: '3rem 1fr 2fr auto' },
                      columnGap: { xs: 2, md: 4 },
                      rowGap: 0.8,
                      alignItems: 'baseline',
                    }}
                  >
                    <Typography color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                      {work.number ?? String(index + 1).padStart(2, '0')}
                    </Typography>

                    <Typography
                      className="work-name"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '1.15rem', md: '1.3rem' },
                        letterSpacing: '-0.01em',
                        display: 'inline-block',
                        gridColumn: { xs: '2', md: 'auto' },
                        ...UNDERLINE_SX,
                      }}
                    >
                      {work.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ gridColumn: { xs: '2', md: 'auto' }, maxWidth: '52ch' }}
                    >
                      {work.summary}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ gridColumn: { xs: '2', md: 'auto' }, textAlign: { xs: 'left', md: 'right' }, whiteSpace: 'nowrap' }}
                    >
                      {work.period}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>

      <Box sx={{ mt: { xs: 8, md: 10 }, pt: { xs: 4, md: 5 }, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography
          component={Link}
          href="/"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.primary',
            textDecoration: 'none',
            fontWeight: 600,
            ...UNDERLINE_SX,
            '&:hover': { backgroundSize: '100% 1px' },
          }}
        >
          <Iconify icon="carbon:arrow-left" width={16} />
          Back to home
        </Typography>
      </Box>
    </Container>
  );
}
