import { describe, expect, it } from 'vitest';

import { isValidIsoDate, toDisplayDate } from '@/lib/utils/date';

describe('date utils', () => {
  it('formats ISO to display date', () => {
    expect(toDisplayDate('2025-12-13')).toBe('Dec 13, 2025');
  });

  it('validates ISO date strings', () => {
    expect(isValidIsoDate('2025-12-13')).toBe(true);
    expect(isValidIsoDate('Dec 13, 2025')).toBe(false);
    expect(isValidIsoDate('not-a-date')).toBe(false);
  });
});
