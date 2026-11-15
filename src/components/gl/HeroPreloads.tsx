import { DESKTOP_MEDIA, HERO_MODEL_URL, HERO_PHONE_SVG_URLS, HERO_TEXTURE_URLS, PHONE_MEDIA } from './heroAssetUrls';

/**
 * Rendered by the experience layouts: the hero's own files start with the HTML, in parallel with
 * the JavaScript, instead of after it has run. crossOrigin matches three.js's requests (fetch for
 * the model and the phone SVGs, CORS images for the textures); without it the preloaded response
 * is not reused and the file downloads twice. Each tree only preloads what it draws.
 */
export default function HeroPreloads() {
  return (
    <>
      <link rel="preload" as="fetch" href={HERO_MODEL_URL} crossOrigin="anonymous" fetchPriority="high" />
      {HERO_TEXTURE_URLS.map((href) => (
        <link
          key={href}
          rel="preload"
          as="image"
          href={href}
          crossOrigin="anonymous"
          fetchPriority="high"
          media={DESKTOP_MEDIA}
        />
      ))}
      {HERO_PHONE_SVG_URLS.map((href) => (
        <link
          key={href}
          rel="preload"
          as="fetch"
          href={href}
          crossOrigin="anonymous"
          fetchPriority="high"
          media={PHONE_MEDIA}
        />
      ))}
    </>
  );
}
