import AboutHeader from './_components/AboutHeader';
import MediaSVG from '@/../public/svgs/media.svg?component';
import AboutFooter from '@/app/about/_components/AboutFooter';
import AboutCanvas from '@/app/about/_components/AboutCanvas';
import AboutFixedUI from '@/app/about/_components/AboutFixedUI';
import YoutubeSVG from '@/../public/svgs/youtube.svg?component';
import LinkedinSVG from '@/../public/svgs/linkedin.svg?component';
import Link from 'next/link';
import { Links } from '@/constants/links';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About us | Immortal Dragons',
  description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
  keywords: [
    'Longevity',
    'anti-aging',
    'life extension',
    'investment fund',
    'innovation',
    'biotech',
    'pharmaceutical',
    'healthcare',
    'Immortal Dragons',
  ],
  openGraph: {
    title: 'About us | Immortal Dragons',
    siteName: 'Immortal Dragons',
    description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div>
      <AboutHeader />
      <AboutFixedUI />
      <AboutFooter />
      <div className="grid h-screen grid-cols-2 mobile:grid-cols-1">
        <div className="relative mobile:fixed mobile:left-0 mobile:top-0 mobile:h-screen mobile:w-screen">
          <AboutCanvas />
        </div>
        <div className="relative z-10 mt-44 mobile:mt-28 mobile:p-4">
          <h1 className="font-oxanium text-6xl font-semibold mobile:text-3xl">ABOUT US</h1>
          <div className="mt-12 max-w-[50rem] text-2xl/9 font-semibold mobile:mt-6 mobile:text-sm">
            Immortal Dragons (<span className="text-red-600">https://www.id.life/</span>) is a purpose-driven longevity fund
            headquartered in Singapore. The fund invests in cutting-edge, high-impact technologies by supporting 15+ portfolio
            companies. Beyond conventional investments, the fund also puts effort into longevity advocacy, including: book
            translation and publishing, translation of longevity leader&apos;s talks, hosting leading chinese longevity podcast,
            sponsorships and grants to longevity initiatives and conferences.
          </div>
          <div className="mt-18 flex gap-10 mobile:mt-8 mobile:gap-4">
            <Link href={Links.youtube} target="_blank">
              <div className="flex-center group relative h-10 cursor-pointer gap-1.5">
                <YoutubeSVG className="size-6 fill-black group-hover:fill-red-600 mobile:size-4" />
                <span className="font-oxanium text-xl/5 font-bold group-hover:text-red-600 mobile:text-sm/4">YOUTUBE</span>
              </div>
            </Link>
            <Link href={Links.linkedin} target="_blank">
              <div className="flex-center group relative h-10 cursor-pointer gap-1.5">
                <LinkedinSVG className="size-6 fill-black group-hover:fill-red-600 mobile:size-4" />
                <span className="font-oxanium text-xl/5 font-bold group-hover:text-red-600 mobile:text-sm/4">LINKEDIN</span>
              </div>
            </Link>
            <Link href={Links.media} target="_blank">
              <div className="flex-center group relative h-10 cursor-pointer gap-1.5">
                <MediaSVG className="size-6 fill-black group-hover:fill-red-600 mobile:size-4" />
                <span className="font-oxanium text-xl/5 font-bold group-hover:text-red-600 mobile:text-sm/4">MEDIAKIT</span>
              </div>
            </Link>
          </div>
          <div className="mt-10 flex items-center text-xl/6 font-semibold mobile:mt-2 mobile:flex-col mobile:items-start mobile:text-sm">
            <span>Contact@id.life</span>
            <div className="mx-7 h-4 w-px bg-black mobile:hidden" />
            <span>3 Biopolis Dr, #01-15, Singapore 138623</span>
          </div>
        </div>
      </div>
    </div>
  );
}
