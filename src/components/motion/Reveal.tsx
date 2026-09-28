'use client';

import { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
};

export function Reveal({ children, delay = 0, threshold = 0.15 }: RevealProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', { noSsr: true });
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion, threshold]);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible || prefersReducedMotion ? 'none' : 'translateY(22px)',
        transition: prefersReducedMotion
          ? 'none'
          : `opacity 520ms ease ${delay}ms, transform 640ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </Box>
  );
}
