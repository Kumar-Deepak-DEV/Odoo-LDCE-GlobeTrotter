import { format, parseISO, differenceInCalendarDays, isValid } from 'date-fns';

export function formatDate(dateString?: string | null, formatPattern: string = 'MMM dd, yyyy'): string {
  if (!dateString) return '';
  try {
    const parsed = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    if (!isValid(parsed)) return dateString;
    return format(parsed, formatPattern);
  } catch {
    return dateString || '';
  }
}

export function formatDateRange(startDate?: string | null, endDate?: string | null): string {
  if (!startDate && !endDate) return 'Dates TBD';
  if (startDate && !endDate) return `${formatDate(startDate)} onwards`;
  if (!startDate && endDate) return `Until ${formatDate(endDate)}`;
  
  const start = formatDate(startDate, 'MMM d');
  const end = formatDate(endDate, 'MMM d, yyyy');
  return `${start} – ${end}`;
}

export function getTripDurationInDays(startDate?: string | null, endDate?: string | null): number {
  if (!startDate || !endDate) return 1;
  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const diff = differenceInCalendarDays(end, start);
    return Math.max(1, diff + 1);
  } catch {
    return 1;
  }
}

export function toInputDateValue(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
}
