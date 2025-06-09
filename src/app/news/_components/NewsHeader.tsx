import Logo from '@/components/nav/Logo';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';

export default function NewsHeader() {
  return (
    <div className="flex items-center justify-between py-10">
      <Logo />
      <div className="group relative flex h-10 w-34 cursor-pointer items-center justify-center text-sm font-semibold uppercase duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-24 mobile:text-xs/5">
        <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-foreground duration-300 group-hover:stroke-red-600" />
        Subscribe
      </div>
    </div>
  );
}
