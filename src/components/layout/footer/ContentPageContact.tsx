import { ORG_ADDRESS_TEXT, ORG_EMAIL, ORG_MAILTO } from '@/constants/contact';

// The contact row and the About link at the bottom of the podcast pages, which have no page footer of their own (the
// news, article and About pages show NewsFooter). Same content and style as the Contact column of the other footers
// (CON-01, CON-20: the address and the email read as written; the email is a mailto link). A server component: the
// podcast layout renders it into the HTML, unlike the SUBSCRIBE popup, which loads on first use.
export default function ContentPageContact() {
  return (
    // The same side padding as the podcast layout, so the row lines up with the episode column above it. The bottom
    // padding clears the episode player, fixed 30 px (phone 12 px) above the bottom edge and 40 px tall, which
    // otherwise covers the address and the email when the page is scrolled to its end.
    <footer className="mt-15 px-10 pb-28 font-oxanium text-base/5 font-bold mobile:mt-10 mobile:px-5 mobile:pb-20 mobile:text-xs/[15px]">
      <div className="reading-column mx-auto border-t border-black/10 pt-8">
        <div className="flex items-baseline justify-between gap-6">
          {/* 70%: at 60% the label measured 4.29:1 on white (axe color-contrast, WCAG AA needs 4.5:1 at this size). */}
          <p className="uppercase opacity-70">Contact</p>
          <a href="/about" className="font-poppins font-semibold hover:text-red-600">
            About Immortal Dragons <span aria-hidden="true">→</span>
          </a>
        </div>
        <address className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-poppins font-semibold not-italic mobile:mt-3 mobile:flex-col">
          <span className="flex items-center gap-1.5">
            <img className="size-5" src="/svgs/home.svg" alt="" />
            {ORG_ADDRESS_TEXT}
          </span>
          <a href={ORG_MAILTO} className="flex w-fit items-center gap-1.5 hover:text-red-600">
            <img className="size-5" src="/svgs/contact-email.svg" alt="" />
            {ORG_EMAIL}
          </a>
        </address>
      </div>
    </footer>
  );
}
