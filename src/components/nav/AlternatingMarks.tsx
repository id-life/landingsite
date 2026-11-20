import LogoSVGcn from '@/components/svg/LogoSVGcn';
import LogoSVGen from '@/components/svg/LogoSVGen';

/**
 * The two marks of AlternatingLogo, built where the header is built: on the content pages that is the server, so the
 * marks' drawings travel as HTML and not in a client chunk (PERF-10). Which one shows follows the box's data-mark
 * (a group variant), so these classes never change on the client. Each mark keeps its own compositing layer
 * (will-change: opacity), so the swap every 8 s is a cross-fade only: changing a mark's opacity between 1 and 0
 * otherwise made and removed that layer and laid out the page twice per swap, while the page was otherwise at rest
 * (MOT-12).
 */
export function alternatingMarks() {
  return {
    en: (
      <LogoSVGen className="h-10 w-auto max-w-full opacity-100 transition-opacity duration-500 will-change-[opacity] [grid-area:1/1] group-data-[mark=cn]:opacity-0 mobile:h-5" />
    ),
    cn: (
      <LogoSVGcn className="h-8 w-auto max-w-full opacity-0 transition-opacity duration-500 will-change-[opacity] [grid-area:1/1] group-data-[mark=cn]:opacity-100 mobile:h-5" />
    ),
  };
}
