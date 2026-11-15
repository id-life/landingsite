import { ORG_ADDRESS_TEXT, ORG_EMAIL, ORG_MAILTO } from '@/constants/contact';

// The contact row and the About link at the bottom of the podcast pages, which have no page footer of their own (the
// news, article and About pages show NewsFooter). Same content and style as the Contact column of the other footers
// (CON-01, CON-20: the address and the email read as written; the email is a mailto link).
export default function ContentPageContact() {
  return (
    // The same side padding as the podcast layout, so the row lines up with the episode column above it.
    <footer className="mt-15 px-10 pb-15 font-oxanium text-base/5 font-bold mobile:mt-10 mobile:px-5 mobile:pb-10 mobile:text-xs/[15px]">
      <div className="mx-auto max-w-[50rem] border-t border-black/10 pt-8">
        <div className="flex items-baseline justify-between gap-6">
          <p className="uppercase opacity-60">Contact</p>
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
