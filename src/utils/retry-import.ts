// A lazy chunk can fail to download (flaky network, a deploy swapping files, a crawler's fetch budget).
// Retry before giving up: webpack forgets a failed chunk, so calling the loader again re-requests it.
export function retryImport<T>(load: () => Promise<T>, retries = 2, delayMs = 1000): Promise<T> {
  return load().catch((error: unknown) => {
    if (retries <= 0) throw error;
    return new Promise((resolve) => setTimeout(resolve, delayMs)).then(() => retryImport(load, retries - 1, delayMs * 2));
  });
}
