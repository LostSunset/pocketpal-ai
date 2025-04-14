import dayjs from 'dayjs';

/**
 * Formats a byte value into a human-readable string with appropriate units
 * @param size - The size in bytes to format
 * @param fractionDigits - Number of decimal places to show (default: 2)
 * @param useBinary - Whether to use binary (1024) or decimal (1000) units (default: false)
 * @param threeDigits - Whether to format the number to always show 3 significant digits (default: false)
 *                      When true:
 *                      - Numbers >= 100 show no decimals (e.g., "234 MB")
 *                      - Numbers >= 10 show 1 decimal (e.g., "23.4 MB")
 *                      - Numbers < 10 show 2 decimals (e.g., "2.34 MB")
 * @returns Formatted string with units (e.g., "1.5 MB" or "2 GiB")
 */
export const formatBytes = (
  size: number,
  fractionDigits = 2,
  useBinary = false,
  threeDigits = false,
) => {
  if (size <= 0) {
    return '0 B';
  }

  const base = useBinary ? 1024 : 1000;
  const multiple = Math.floor(Math.log(size) / Math.log(base));

  const units = useBinary
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    : ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const value = size / Math.pow(base, multiple);

  if (threeDigits) {
    const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
    return value.toFixed(digits) + ' ' + units[multiple];
  }

  return parseFloat(value.toFixed(fractionDigits)) + ' ' + units[multiple];
};

export function formatNumber(
  num: number,
  fractionDigits = 2,
  uppercase = false,
  withSpace = false,
): string {
  const space = withSpace ? ' ' : '';

  if (num < 1000) {
    return num.toString();
  } else if (num < 1_000_000) {
    const suffix = uppercase ? 'K' : 'k';
    return `${(num / 1_000)
      .toFixed(fractionDigits)
      .replace(/\.?0+$/, '')}${space}${suffix}`;
  } else if (num < 1_000_000_000) {
    const suffix = uppercase ? 'M' : 'm';
    return `${(num / 1_000_000)
      .toFixed(fractionDigits)
      .replace(/\.?0+$/, '')}${space}${suffix}`;
  } else {
    const suffix = uppercase ? 'B' : 'b';
    return `${(num / 1_000_000_000)
      .toFixed(fractionDigits)
      .replace(/\.?0+$/, '')}${space}${suffix}`;
  }
}

/** Returns formatted date used as a divider between different days in the chat history */
export const getVerboseDateTimeRepresentation = (
  dateTime: number,
  {
    dateFormat,
    timeFormat,
  }: {
    dateFormat?: string;
    timeFormat?: string;
  },
) => {
  const formattedDate = dateFormat
    ? dayjs(dateTime).format(dateFormat)
    : dayjs(dateTime).format('MMM D');

  const formattedTime = timeFormat
    ? dayjs(dateTime).format(timeFormat)
    : dayjs(dateTime).format('HH:mm');

  const localDateTime = dayjs(dateTime);
  const now = dayjs();

  if (
    localDateTime.isSame(now, 'day') &&
    localDateTime.isSame(now, 'month') &&
    localDateTime.isSame(now, 'year')
  ) {
    return formattedTime;
  }

  return `${formattedDate}, ${formattedTime}`;
};

export function timeAgo(
  dateString: string,
  prefix: string = 'Updated ',
  suffix: string = ' ago',
): string {
  const inputDate = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${prefix}${years} year${years > 1 ? 's' : ''}${suffix}`;
  } else if (months > 0) {
    return `${prefix}${months} month${months > 1 ? 's' : ''}${suffix}`;
  } else if (weeks > 0) {
    return `${prefix}${weeks} week${weeks > 1 ? 's' : ''}${suffix}`;
  } else if (days > 0) {
    return `${prefix}${days} day${days > 1 ? 's' : ''}${suffix}`;
  } else if (hours > 0) {
    return `${prefix}${hours} hour${hours > 1 ? 's' : ''}${suffix}`;
  } else if (minutes > 0) {
    return `${prefix}${minutes} minute${minutes > 1 ? 's' : ''}${suffix}`;
  } else {
    return `${prefix}just now`;
  }
}
