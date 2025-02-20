import { formatNumberToLargestUnit } from './formatNumber';

describe('formatNumberToLargestUnit', () => {
  it('should handle null values correctly', () => {
    expect(formatNumberToLargestUnit(null)).toBe('-');
  });

  it('should format numbers less than 1000 correctly', () => {
    expect(formatNumberToLargestUnit(0)).toBe('0');
    expect(formatNumberToLargestUnit(100)).toBe('100');
    expect(formatNumberToLargestUnit(123.99)).toBe('124');
    expect(formatNumberToLargestUnit(999)).toBe('999');
  });

  it('should format numbers in thousands correctly', () => {
    expect(formatNumberToLargestUnit(1000)).toBe('1.0k');
    expect(formatNumberToLargestUnit(1299)).toBe('1.3k');
    expect(formatNumberToLargestUnit(9999)).toBe('10.0k');
    expect(formatNumberToLargestUnit(10000)).toBe('10.0k');
    expect(formatNumberToLargestUnit(999499)).toBe('999.5k');
    expect(formatNumberToLargestUnit(999500)).toBe('999.5k');
    expect(formatNumberToLargestUnit(999899)).toBe('999.9k');
    expect(formatNumberToLargestUnit(999900)).toBe('999.9k');
    expect(formatNumberToLargestUnit(999999)).toBe('1.0M');
  });

  it('should format numbers in millions correctly', () => {
    expect(formatNumberToLargestUnit(1000000)).toBe('1.0M');
    expect(formatNumberToLargestUnit(1550000)).toBe('1.6M');
    expect(formatNumberToLargestUnit(12345678.9)).toBe('12.3M');
    expect(formatNumberToLargestUnit(999949999)).toBe('999.9M');
    expect(formatNumberToLargestUnit(999950000)).toBe('1.0B');
    expect(formatNumberToLargestUnit(999999999)).toBe('1.0B');
  });
});
