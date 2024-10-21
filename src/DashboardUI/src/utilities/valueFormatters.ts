type NumberFormatOptions = Pick<Intl.NumberFormatOptions, 'maximumFractionDigits' | 'minimumFractionDigits'>
export function formatNumber(value: number | null | undefined, decimals?: number | NumberFormatOptions) {
  if (value === null || value === undefined){
    return '';
  }
  const opts = 
    decimals === undefined ? {maximumFractionDigits: 20, minimumFractionDigits: 0} : 
    typeof decimals === 'number' ? {maximumFractionDigits: decimals, minimumFractionDigits: decimals} :
    decimals;
  return value.toLocaleString(undefined, opts)
}