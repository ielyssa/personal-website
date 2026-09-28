import dayjs from 'dayjs';

export function toDisplayDate(iso: string, template = 'MMM D, YYYY') {
  return dayjs(iso).format(template);
}

export function toIsoDate(date: Date) {
  return date.toISOString();
}

export function isValidIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && dayjs(value).isValid();
}
