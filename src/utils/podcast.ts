import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';

dayjs.extend(dayjsDuration);

export function formatDuration(seconds: number) {
  const dur = dayjs.duration(seconds, 'seconds');
  const hours = Math.floor(dur.asHours());
  const mins = dur.minutes();

  let result = '';
  if (hours > 0) {
    result += `${hours}Hr`;
  }
  if (mins > 0) {
    result += `${mins}Min`;
  }

  return result || '0Min';
}
