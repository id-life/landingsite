import { HERO_MODEL_URL, HERO_SVG_URLS } from './heroAssetUrls';

/**
 * The WebGL capability probe (ENG-02) and the model preload it gates, as one inline script that runs while the HTML
 * is parsed. It creates a throwaway context (webgl2, then webgl), gives it back at once, and records the answer in
 * window.__idlWebGL for probeWebGL(), with what the GPU tier needs (window.__idlGpu: WebGL2, float render targets, the
 * renderer string; src/motion/gpuTier.ts); only a browser that can draw the hero is told to preload its model, so a visitor
 * without WebGL downloads no model at all. A constant built from code, never from data.
 */
const probeAndPreload = `(function(){var ok=false;try{var c=document.createElement('canvas');var g=c.getContext('webgl2')||c.getContext('webgl');ok=!!g;if(g){var v=typeof WebGL2RenderingContext!=='undefined'&&g instanceof WebGL2RenderingContext;var d=g.getExtension('WEBGL_debug_renderer_info');window.__idlGpu={gl2:v,renderer:String(g.getParameter(d?d.UNMASKED_RENDERER_WEBGL:g.RENDERER)||''),float:v?!!(g.getExtension('EXT_color_buffer_float')||g.getExtension('EXT_color_buffer_half_float')):!!(g.getExtension('OES_texture_half_float')&&g.getExtension('EXT_color_buffer_half_float'))};var x=g.getExtension('WEBGL_lose_context');if(x)x.loseContext();}}catch(e){}window.__idlWebGL=ok;document.documentElement.setAttribute('data-webgl',ok?'1':'0');if(!ok)return;var l=document.createElement('link');l.rel='preload';l.as='fetch';l.href=${JSON.stringify(HERO_MODEL_URL)};l.crossOrigin='anonymous';l.setAttribute('fetchpriority','high');document.head.appendChild(l);})();`;

/**
 * Rendered by the experience layouts: the hero's own files start with the HTML, in parallel with
 * the JavaScript, instead of after it has run. crossOrigin matches three.js's requests (fetch for
 * the model and the phone SVGs, CORS images for the textures); without it the preloaded response
 * is not reused and the file downloads twice. Both trees draw the same two wordmark SVGs (VIS-03).
 */
export default function HeroPreloads() {
  return (
    <>
      <script id="idl-webgl-probe" dangerouslySetInnerHTML={{ __html: probeAndPreload }} />
      {HERO_SVG_URLS.map((href) => (
        <link key={href} rel="preload" as="fetch" href={href} crossOrigin="anonymous" fetchPriority="high" />
      ))}
    </>
  );
}
