import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

type SectionHeadingProps = {
  overline: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
};

export function SectionHeading({
  overline,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: align }}>
      <Typography
        variant="overline"
        sx={{ color: 'primary.dark', fontWeight: 700, letterSpacing: 2 }}
      >
        {overline}
      </Typography>
      <Typography
        variant="h2"
        sx={{
          mt: 1,
          mb: description ? 2 : 0,
          fontWeight: 800,
          fontSize: { xs: '1.8rem', sm: '2.35rem', md: '2.9rem' },
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {description ? (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={align === 'center' ? { maxWidth: 720, mx: 'auto' } : undefined}
        >
          {description}
        </Typography>
      ) : null}
    </Box>
  );
}

export function Section({
  id,
  children,
  neutral = false,
  sx,
}: {
  id?: string;
  children: React.ReactNode;
  neutral?: boolean;
  sx?: object;
}) {
  // Anchor the content, rather than the padded section wrapper. This keeps
  // header navigation from stopping in the section's decorative top spacing.
  const anchorSx = id ? { scrollMarginTop: { xs: '72px', md: '84px' } } : undefined;

  return (
    <Box
      component="section"
      sx={[
        {
          py: { xs: 7, md: 11 },
          ...(neutral && { bgcolor: 'background.default' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Container id={id} sx={anchorSx}>
        {children}
      </Container>
    </Box>
  );
}
