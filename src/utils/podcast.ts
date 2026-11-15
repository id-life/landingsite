// Plain arithmetic, not dayjs's duration plugin (PERF-10: dayjs was about 4 kB gzip of the episode page's first-load
// JavaScript for two formatters). Same output as the dayjs versions for every input checked (20,000 values, NaN too).
const pad = (n: number) => String(n).padStart(2, '0');

/** "1Hr5Min", "45Min", "0Min". */
export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  let result = '';
  if (hours > 0) {
    result += `${hours}Hr`;
  }
  if (mins > 0) {
    result += `${mins}Min`;
  }

  return result || '0Min';
}

/** "mm:ss", or "H:mm:ss" from one hour up. */
export function formatPlaybackTime(seconds: number) {
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return hours > 0 ? `${hours}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
}
