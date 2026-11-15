import { DESKTOP_MEDIA, HERO_MODEL_URL, HERO_PHONE_SVG_URLS, HERO_TEXTURE_URLS, PHONE_MEDIA } from './heroAssetUrls';

/**
 * The WebGL capability probe (ENG-02) and the model preload it gates, as one inline script that runs while the HTML
 * is parsed. It creates a throwaway context (webgl2, then webgl), gives it back at once, and records the answer in
 * window.__idlWebGL for probeWebGL(); only a browser that can draw the hero is told to preload its model, so a visitor
 * without WebGL downloads no model at all. A constant built from code, never from data.
 */
const probeAndPreload = `(function(){var ok=false;try{var c=document.createElement('canvas');var g=c.getContext('webgl2')||c.getContext('webgl');ok=!!g;if(g){var x=g.getExtension('WEBGL_lose_context');if(x)x.loseContext();}}catch(e){}window.__idlWebGL=ok;if(!ok)return;var l=document.createElement('link');l.rel='preload';l.as='fetch';l.href=${JSON.stringify(HERO_MODEL_URL)};l.crossOrigin='anonymous';l.setAttribute('fetchpriority','high');document.head.appendChild(l);})();`;

/**
 * Rendered by the experience layouts: the hero's own files start with the HTML, in parallel with
 * the JavaScript, instead of after it has run. crossOrigin matches three.js's requests (fetch for
 * the model and the phone SVGs, CORS images for the textures); without it the preloaded response
 * is not reused and the file downloads twice. Each tree only preloads what it draws.
 */
export default function HeroPreloads() {
  return (
    <>
      <script id="idl-webgl-probe" dangerouslySetInnerHTML={{ __html: probeAndPreload }} />
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
