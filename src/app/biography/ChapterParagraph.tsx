import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TOKEN_PATTERN = /\{\{([a-z0-9-]+)\|([^}]+)\}\}/g;

const PERSON_LINK_SX = {
  color: 'text.primary',
  textDecoration: 'none',
  fontWeight: 700,
  backgroundImage: 'linear-gradient(currentColor, currentColor)',
  backgroundSize: '100% 1px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0 100%',
  '&:hover': { color: 'text.secondary' },
};

// Renders body text containing {{slug|Name}} tokens as plain text with the
// named spans turned into anchor links to #person-{slug}. Keeps the
// biography content file free of JSX while still letting names link out.
export function ChapterParagraph({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  TOKEN_PATTERN.lastIndex = 0;
  while ((match = TOKEN_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [, slug, name] = match;
    parts.push(
      <Box key={`person-${key++}`} component="a" href={`#person-${slug}`} sx={PERSON_LINK_SX}>
        {name}
      </Box>
    );
    lastIndex = TOKEN_PATTERN.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>
      {parts}
    </Typography>
  );
}
