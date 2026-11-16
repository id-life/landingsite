import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import CornerBorder from '@/components/common/CornerBorder';
import FooterContactContent from '@/components/layout/footer/FooterContactContent';
import { Links, MediaLinkType } from '@/constants/links';
import NewsFooterForm from './NewsFooterForm';
import { PrivacyChoicesLink } from '@/components/consent/PrivacyChoicesLink';
import { ORG_ADDRESS_TEXT, ORG_EMAIL, ORG_MAILTO } from '@/constants/contact';

// A server component (PERF-10): links, icons and contact are HTML; the form is the one client island, and channel
// links are tracked by the page's delegated LinkTracker (data-channel).
export default function NewsFooter() {
  return (
    <div className="relative z-10 -mx-5 flex flex-col pb-15 pt-30 mobile:mt-5 mobile:border-2 mobile:border-white mobile:bg-white/20 mobile:p-5 mobile:backdrop-blur-lg">
      {/* Desktop Layout */}
      {/* Wraps below about 1200 px (tablets) instead of overflowing; unchanged on wider screens. */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-10 mobile:hidden">
        <div className="flex flex-col items-start gap-5 self-stretch">
          <img className="h-12 w-auto" src="/svgs/logo-en.svg" alt="" />
          <div className="mt-auto flex items-center gap-5">
            <a
              href={Links[MediaLinkType.Youtube]}
              target="_blank"
              rel="noopener noreferrer"
              data-channel={MediaLinkType.Youtube}
              data-placement="footer"
              className="relative flex h-10 w-[7.7rem] cursor-pointer items-center justify-center gap-2"
            >
              <CornerBorder hoverColor="#000" size=".375rem" width=".125rem" />
              <YoutubeSVG className="size-6 fill-black" />
              <span className="font-display text-base font-bold uppercase">Youtube</span>
            </a>
            <a
              href={Links[MediaLinkType.Linkedin]}
              target="_blank"
              rel="noopener noreferrer"
              data-channel={MediaLinkType.Linkedin}
              data-placement="footer"
              className="relative flex h-10 w-[7.7rem] cursor-pointer items-center justify-center gap-2"
            >
              <CornerBorder hoverColor="#000" size=".375rem" width=".125rem" />
              <LinkedinSVG className="size-6 fill-black" />
              <span className="font-display text-base font-bold uppercase">LinkedIn</span>
            </a>
            <a
              href={Links[MediaLinkType.Media]}
              target="_blank"
              rel="noopener noreferrer"
              data-channel={MediaLinkType.Media}
              data-placement="footer"
              className="relative flex h-10 w-[7.7rem] cursor-pointer items-center justify-center gap-2"
            >
              <CornerBorder hoverColor="#000" size=".375rem" width=".125rem" />
              <MediaSVG className="size-6 fill-black" />
              <span className="font-display text-base font-bold uppercase">MediaKit</span>
            </a>
          </div>
        </div>
        <div className="font-display text-base/5 font-bold">
          {/* Only the label is set in capitals: the address and the email read as written (CON-20), and the email
              is a mailto link, as in the Connect footer. */}
          <div className="flex items-baseline justify-between gap-6">
            <p className="uppercase text-ink-muted">Contact</p>
            <div className="flex flex-col items-end gap-1">
              <PrivacyChoicesLink className="font-text text-xs font-semibold underline opacity-60 hover:opacity-100" />
            </div>
          </div>
          <address className="not-italic">
            <div className="mt-7 flex items-center justify-start gap-1.5 font-text font-semibold">
              <img className="size-5" src="/svgs/home.svg" alt="" />
              {ORG_ADDRESS_TEXT}
            </div>
            <a
              href={ORG_MAILTO}
              data-track-placement="footer"
              className="mt-3 flex w-fit items-center justify-start gap-1.5 font-text font-semibold hover:text-accent"
            >
              <img className="size-5" src="/svgs/contact-email.svg" alt="" />
              {ORG_EMAIL}
            </a>
          </address>
        </div>
        <div className="font-display text-base/5">
          <p className="font-bold uppercase text-ink-muted">SUBSCRIBE</p>
          <NewsFooterForm />
        </div>
      </div>

      {/* Mobile Layout - reuse FooterContactContent */}
      <div className="hidden mobile:block">
        <FooterContactContent placement="footer" />
      </div>
    </div>
  );
}
