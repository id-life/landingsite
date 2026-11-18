import LogoSVGcn from '@/components/svg/LogoSVGcn';
import LogoSVGen from '@/components/svg/LogoSVGen';

/**
 * The two marks of AlternatingLogo, built where the header is built: on the content pages that is the server, so the
 * marks' drawings travel as HTML and not in a client chunk (PERF-10). Which one shows follows the box's data-mark
 * (a group variant), so these classes never change on the client.
 */
export function alternatingMarks() {
  return {
    en: (
      <LogoSVGen className="h-10 w-auto max-w-full opacity-100 transition-opacity duration-500 [grid-area:1/1] group-data-[mark=cn]:opacity-0 mobile:h-5" />
    ),
    cn: (
      <LogoSVGcn className="h-8 w-auto max-w-full opacity-0 transition-opacity duration-500 [grid-area:1/1] group-data-[mark=cn]:opacity-100 mobile:h-5" />
    ),
  };
}
