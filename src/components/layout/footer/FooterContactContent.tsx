import BilibiliSVG from '@/../public/svgs/bilibili.svg?component';
import ContactEmailSVG from '@/../public/svgs/contact-email.svg?component';
import HomeSVG from '@/../public/svgs/home.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import MediaSVG from '@/../public/svgs/media.svg?component';
import RedbookSVG from '@/../public/svgs/redbook.svg?component';
import SpotifySVG from '@/../public/svgs/spotify.svg?component';
import WechatSVG from '@/../public/svgs/wechat.svg?component';
import XiaoyuzhouSVG from '@/../public/svgs/xiaoyuzhou.svg?component';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import CornerBorder from '@/components/common/CornerBorder';
import InfoSVG from '@/../public/svgs/info.svg?component';
import { Links, MediaLinkType } from '@/constants/links';
import { ORG_ADDRESS_TEXT, ORG_EMAIL, ORG_MAILTO } from '@/constants/contact';
import type { NewsletterPlacement } from '@/utils/newsletter';
import FooterContactForm from './FooterContactForm';
import { clsx } from 'clsx';
import { PrivacyChoicesLink } from '@/components/consent/PrivacyChoicesLink';
import { SUBSCRIBE_PROMISE } from '@/content/subscribe';

/**
 * No hooks (PERF-10): on the news pages it renders on the server; the form is its one client island and channel links
 * are tracked by the page's delegated LinkTracker (data-channel). placement: 'connect' in the phone Connect contact panel, 'footer' at the foot of the news pages. */
export default function FooterContactContent({ placement = 'connect' }: { placement?: NewsletterPlacement }) {
  const mediaRows = [
    [
      { type: MediaLinkType.Youtube, label: 'YOUTUBE', Icon: YoutubeSVG, iconClassName: 'size-4' },
      {
        type: MediaLinkType.Linkedin,
        label: 'LINKEDIN',
        Icon: LinkedinSVG,
        iconClassName: '-mt-0.5 size-4',
      },
      { type: MediaLinkType.Spotify, label: 'SPOTIFY', Icon: SpotifySVG, iconClassName: 'size-4' },
      { type: MediaLinkType.Media, label: 'MEDIAKIT', Icon: MediaSVG, iconClassName: 'size-4' },
    ],
    [
      { type: MediaLinkType.Xiaoyuzhou, label: '小宇宙', Icon: XiaoyuzhouSVG, iconClassName: 'size-4' },
      { type: MediaLinkType.Bilibili, label: 'BILIBILI', Icon: BilibiliSVG, iconClassName: 'size-4' },
      { type: MediaLinkType.Redbook, label: '小红书', Icon: RedbookSVG, iconClassName: 'size-4' },
      { type: MediaLinkType.Wechat, label: '公众号', Icon: WechatSVG, iconClassName: 'size-4' },
    ],
  ];

  return (
    // A named region (the phone panel is portalled outside <main>): axe region rule. Not "Connect": the section already has that name.
    <section aria-label="Contact and subscribe" className="text-black">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-title font-bold uppercase">CONNECT</h3>
        <div className="flex flex-col items-end gap-1">
          <PrivacyChoicesLink className="font-display text-caption font-bold underline opacity-60" />
        </div>
      </div>
      <div className="mt-3">
        {mediaRows.map((row, rowIndex) => (
          <div key={rowIndex} className={clsx('flex justify-between gap-2', rowIndex === 1 && 'mt-4')}>
            {row.map(({ type, label, Icon, iconClassName }) => (
              <a
                key={type}
                data-channel={type}
                data-placement={placement}
                href={Links[type]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-center relative h-[25px] min-w-[77px] cursor-pointer gap-1 px-1 tap"
              >
                <CornerBorder hoverColor="#000" size="4px" color="#666" />
                <Icon className={clsx(iconClassName, 'fill-black')} />
                <span className="whitespace-nowrap font-display text-caption font-bold leading-none">{label}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
      {/* The email is a mailto link (it was the uppercase literal CONTACT@ID.LIFE in a span). */}
      <address className="mt-4 flex flex-col gap-1.5 font-display text-caption font-bold not-italic">
        <div className="flex items-center gap-1">
          <HomeSVG aria-hidden="true" className="size-5" />
          <span>{ORG_ADDRESS_TEXT}</span>
        </div>
        <a href={ORG_MAILTO} data-track-placement={placement} className="flex w-fit items-center gap-1 py-1 tap">
          <ContactEmailSVG aria-hidden="true" className="size-5" />
          <span>{ORG_EMAIL}</span>
        </a>
      </address>
      <div className="my-4 h-px w-full bg-black/20" />
      <FooterContactForm placement={placement} />
      {/* In the phone Connect panel the music player sits at the bottom right over this line: keep clear of it. */}
      <div
        className={clsx(
          'mt-3 flex gap-1.5 font-text text-caption font-semibold text-ink-muted',
          placement === 'connect' && 'max-w-[calc(100%_-_130px)]',
        )}
      >
        <InfoSVG className="size-4 shrink-0" />
        {SUBSCRIBE_PROMISE.priorityAccess}
      </div>
    </section>
  );
}
