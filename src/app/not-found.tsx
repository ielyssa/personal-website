import Link from 'next/link';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from '@/components/ui/iconify';

const UNDERLINE_SX = {
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '0% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  transition: 'background-size 320ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export default function NotFound() {
  return (
    <Container sx={{ py: { xs: 10, md: 16 } }}>
      <Box sx={{ maxWidth: 560 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: '4.5rem', md: '6rem' },
            letterSpacing: '-0.04em',
            lineHeight: 1,
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.75rem', md: '2.1rem' },
            letterSpacing: '-0.015em',
            mb: 1.5,
          }}
        >
          This page doesn&apos;t exist
        </Typography>

        <Typography color="text.secondary" sx={{ lineHeight: 1.75, mb: { xs: 5, md: 6 } }}>
          The link may be old or mistyped — nothing to worry about. Here&apos;s where you probably
          meant to go.
        </Typography>

        {/* One clear primary path, then two quieter alternates — not three
            flat, equally-weighted buttons with no sense of which matters
            most. */}
        <Stack spacing={2.5}>
          <Typography
            component={Link}
            href="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              width: 'fit-content',
              color: 'text.primary',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              ...UNDERLINE_SX,
              '&:hover': { backgroundSize: '100% 1px' },
            }}
          >
            <Iconify icon="carbon:arrow-left" width={18} />
            Back to home
          </Typography>

          <Stack direction="row" spacing={4}>
            <Typography
              component={Link}
              href="/writing"
              sx={{
                display: 'inline-block',
                width: 'fit-content',
                color: 'text.secondary',
                textDecoration: 'none',
                fontWeight: 600,
                ...UNDERLINE_SX,
                '&:hover': { backgroundSize: '100% 1px', color: 'text.primary' },
              }}
            >
              Read the writing
            </Typography>
            <Typography
              component={Link}
              href="/work"
              sx={{
                display: 'inline-block',
                width: 'fit-content',
                color: 'text.secondary',
                textDecoration: 'none',
                fontWeight: 600,
                ...UNDERLINE_SX,
                '&:hover': { backgroundSize: '100% 1px', color: 'text.primary' },
              }}
            >
              Explore the work
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
