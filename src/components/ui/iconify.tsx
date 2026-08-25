'use client';

import { useId } from 'react';
import { Icon } from '@iconify/react';

import { styled } from '@mui/material/styles';

import { registerIcons } from '@/lib/register-icons';

export type IconifyProps = React.ComponentProps<typeof IconRoot> & {
  icon: string;
};

export function Iconify({ className, icon, width = 20, height, sx, ...other }: IconifyProps) {
  const id = useId();

  registerIcons();

  return (
    <IconRoot
      ssr
      id={id}
      icon={icon}
      className={['iconify-root', className].filter(Boolean).join(' ')}
      sx={[
        {
          width,
          flexShrink: 0,
          height: height ?? width,
          display: 'inline-flex',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  );
}

const IconRoot = styled(Icon)``;


