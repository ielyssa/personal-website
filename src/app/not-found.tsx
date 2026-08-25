import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from '@/components/ui/iconify';

export default function NotFound() {
  return (
    <Container sx={{ py: { xs: 10, md: 14 }, textAlign: 'center' }}>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 800,
          fontSize: { xs: '5rem', md: '7rem' },
          letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, #1877F2, #8E33FF)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}
      >
        404
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
        {"This page doesn't exist"}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 440, mx: 'auto', mb: 4 }}>
        {"The link may be old or mistyped. Here's where you probably want to go instead."}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
        <Button component="a" href="/" variant="contained" startIcon={<Iconify icon="carbon:arrow-left" />}>
          Back home
        </Button>
        <Button component="a" href="/writing" variant="outlined">
          Read the writing
        </Button>
        <Button component="a" href="/work" variant="text">
          Explore the work
        </Button>
      </Stack>
    </Container>
  );
}

