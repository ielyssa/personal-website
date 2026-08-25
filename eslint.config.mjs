// @ts-check
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'next-env.d.ts',
      'playwright-report/**',
      'test-results/**',
      'scripts/**',
      'public/**',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    files: ['src/lib/icon-sets.ts'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
];

export default eslintConfig;
