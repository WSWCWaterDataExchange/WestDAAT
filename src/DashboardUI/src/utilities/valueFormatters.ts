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

// TODO: JN - review with Beebs
export function formatDateString(date: Date, dateFormat: string): string {
  const validMomentFormats = ['M', 'D', 'Y', 'Mo'];

  const formatComponents = dateFormat.split(/[^A-z]/);

  if (formatComponents.some(format => !validMomentFormats.includes(format))) {
    return moment(date).format('MM/DD/YYYY');
  }

  return moment(date).format(dateFormat);
}