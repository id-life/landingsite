import { CONSENT_COOKIE, OPT_IN_COUNTRIES } from './config';

/**
 * The inline script rendered first in <head> of analytics builds (src/lib/analytics/HeadScript.tsx).
 * It runs during HTML parsing, before any tag can load, and:
 *  1. defines dataLayer and gtag and sets the Consent Mode v2 defaults (everything denied, wait_for_update 500),
 *     then Google signals and ad personalisation off (DATA-07), then replays a stored "granted" answer;
 *  2. records the landing URL, referrer and title (window.__landing), so a deferred tag still reports the right
 *     landing page and campaign;
 *  3. flags automation (navigator.webdriver, headless user agents) and Global Privacy Control;
 *  4. starts the /api/geo lookup the consent module needs;
 *  5. tracks the load stage and, if the visitor leaves before the experience is ready and analytics is allowed,
 *     sends one cookieless load_abandon beacon to /api/t.
 * No identifier is read or written here.
 */
export function analyticsHeadScript() {
  const optIn = JSON.stringify(OPT_IN_COUNTRIES);
  const cookie = JSON.stringify(CONSENT_COOKIE);
  return `(function(){var w=window,d=document,n=navigator;
w.dataLayer=w.dataLayer||[];function gtag(){w.dataLayer.push(arguments);}w.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
gtag('set','allow_google_signals',false);gtag('set','allow_ad_personalization_signals',false);gtag('set','ads_data_redaction',true);
w.__landing={href:location.href,referrer:d.referrer,title:d.title,t0:Math.round(performance.now())};
var I=w.__idl=w.__idl||{stage:'html'};
I.experience=/^\\/(portfolio|insights|spectrum|presence|digitaltwin|connect)?\\/?$/.test(location.pathname);
I.bot=n.webdriver===true||/Headless/i.test(n.userAgent||'');
I.gpc=n.globalPrivacyControl===true;
I.choice=null;try{var m=d.cookie.match(new RegExp('(?:^|; )'+${cookie}+'=([^;]*)'));if(m){var c=JSON.parse(decodeURIComponent(m[1]));I.choice=c.a==='g'?'granted':c.a==='d'?'denied':null;}}catch(e){}
if(I.choice==='granted'&&!I.gpc&&!I.bot)gtag('consent','update',{analytics_storage:'granted'});
var OPT=${optIn};
try{var r=sessionStorage.getItem('idl_region');if(r!==null)I.region=r;}catch(e){}
if(I.region===undefined&&w.fetch){I.geo=fetch('/api/geo',{credentials:'same-origin',cache:'no-store'}).then(function(res){return res.ok?res.json():{};}).then(function(j){I.region=typeof j.country==='string'?j.country.toUpperCase():'';try{sessionStorage.setItem('idl_region',I.region);}catch(e){}return I.region;},function(){I.region='';return '';});}
function allowed(){if(I.bot||I.gpc)return false;if(I.choice)return I.choice==='granted';return typeof I.region==='string'&&I.region!==''&&OPT.indexOf(I.region)<0;}
var sent=false;function abandon(){if(sent||I.stage==='ready')return;sent=true;if(!allowed()||!n.sendBeacon)return;
var b=JSON.stringify({e:'load_abandon',stage:I.stage,ms:Math.round(performance.now()),layout:w.innerWidth<=768?'mobile':'desktop',conn:(n.connection&&n.connection.effectiveType)||''});
try{n.sendBeacon('/api/t',new Blob([b],{type:'application/json'}));}catch(e){}}
w.addEventListener('pagehide',abandon);d.addEventListener('visibilitychange',function(){if(d.visibilityState==='hidden')abandon();});
w.addEventListener('load',function(){if(!I.experience)I.stage='ready';});
})();`;
}
