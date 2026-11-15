import { analyticsHeadScript } from './head-script';

/**
 * The analytics head script as a raw inline <script>, so it runs during HTML parsing before anything else can call
 * gtag (next/script's beforeInteractive defers inline code to the Next runtime in the App Router). The source is a
 * constant built from code (./head-script.ts), never from data. This file is the one ESLint exception to the
 * dangerouslySetInnerHTML ban besides JsonLd.
 */
export default function HeadScript() {
  return <script id="idl-analytics-head" dangerouslySetInnerHTML={{ __html: analyticsHeadScript() }} />;
}
