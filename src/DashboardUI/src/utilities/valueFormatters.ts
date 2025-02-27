import moment from "moment";

type NumberFormatOptions = Pick<Intl.NumberFormatOptions, 'maximumFractionDigits' | 'minimumFractionDigits'>;
export function formatNumber(value: number | null | undefined, decimals?: number | NumberFormatOptions) {
  if (value === null || value === undefined) {
    return '';
  }
  const opts =
    decimals === undefined
      ? { maximumFractionDigits: 20, minimumFractionDigits: 0 }
      : typeof decimals === 'number'
        ? { maximumFractionDigits: decimals, minimumFractionDigits: decimals }
        : decimals;
  return value.toLocaleString(undefined, opts);
}

export function formatDateString(date: Date, dateFormat: string): string {
  return moment(date).format(dateFormat);
}

/**
 * Formats large numbers to a more succinct format.
 * For large numbers (greater than 1000), the number is truncated to the largest unit 
 * (ex: thousands or millions), followed by a K or M suffix.
 * @param value the number to format
 * @returns the formatted number with a K or M suffix
 */
export function formatNumberToLargestUnit(value: number | null): string {
  if (value === null) {
    return '-'
  } else if (value >= 999950000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 999950) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  } else {
    return `${value.toFixed(0)}`;
  }
}
