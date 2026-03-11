export function splitCsv(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function monthLabel(value: string): string {
  return new Date(value).toLocaleString(undefined, { month: 'short', year: 'numeric' });
}
