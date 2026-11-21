/**
 * The size and type of a picture the owner's site declares as a link preview, read from the file itself (SEO-07; the
 * lead's ruling of 2026-11-21: his own pictures keep their address and format, and the page adds only what describes
 * them truthfully). A ranged request reads the first bytes, where PNG, JPEG and WebP state their size; the result is
 * cached with the page (fetch's data cache, at the page's own revalidation). When the read fails, or the file is
 * not one of the three, nothing is declared rather than a guessed size.
 */
export type ImageInfo = { width: number; height: number; type: 'image/png' | 'image/jpeg' | 'image/webp' };

const HEAD_BYTES = 65536;

/** Parses the size from the start of a PNG, JPEG or WebP file; null when it cannot tell. */
export function parseImageHeader(bytes: Uint8Array): ImageInfo | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ascii = (at: number, length: number) => String.fromCharCode(...bytes.subarray(at, at + length));
  if (bytes.length >= 24 && bytes[0] === 0x89 && ascii(1, 3) === 'PNG' && ascii(12, 4) === 'IHDR') {
    return { width: view.getUint32(16), height: view.getUint32(20), type: 'image/png' };
  }
  if (bytes.length >= 30 && ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    const chunk = ascii(12, 4);
    if (chunk === 'VP8X') {
      const width = 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16));
      const height = 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16));
      return { width, height, type: 'image/webp' };
    }
    if (chunk === 'VP8 ' && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
      return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff, type: 'image/webp' };
    }
    if (chunk === 'VP8L' && bytes[20] === 0x2f) {
      const bits = view.getUint32(21, true);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff), type: 'image/webp' };
    }
    return null;
  }
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let at = 2;
    while (at + 9 < bytes.length) {
      if (bytes[at] !== 0xff) return null;
      const marker = bytes[at + 1];
      if (marker === 0xff) {
        at += 1;
        continue;
      }
      const length = view.getUint16(at + 2);
      // Start-of-frame markers (C0 to CF, except C4 DHT, C8 JPG and CC DAC) carry the size.
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: view.getUint16(at + 5), width: view.getUint16(at + 7), type: 'image/jpeg' };
      }
      at += 2 + length;
    }
  }
  return null;
}

/** Reads a picture's size and type from its first bytes; null when it cannot. */
export async function readImageInfo(url: string, revalidate: number): Promise<ImageInfo | null> {
  try {
    const res = await fetch(url, {
      headers: { Range: `bytes=0-${HEAD_BYTES - 1}` },
      next: { revalidate },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const info = parseImageHeader(new Uint8Array(await res.arrayBuffer()).subarray(0, HEAD_BYTES));
    return info && info.width > 0 && info.height > 0 ? info : null;
  } catch {
    return null;
  }
}
