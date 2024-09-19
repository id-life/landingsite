import { useIsMobile } from '@/hooks/useIsMobile';

export default function ScrollDown() {
  const isMobile = useIsMobile();
  return (
    <div className="flex-center mobile:p-1.5 mobile:gap-1.5 mobile:rounded-lg absolute bottom-5 left-1/2 animate-scroll-down gap-2 rounded-xl bg-white/50 p-2 backdrop-blur-xl">
      <img
        className="mobile:h-6.5 h-[2.1875rem]"
        src={isMobile ? '/svgs/scroll-mobile.svg' : '/svgs/scroll-mouse.svg'}
        alt="scroll-down"
      />
      <p className="mobile:text-xs/5 text-base/6 font-bold uppercase text-gray-800">SCROLL</p>
    </div>
  );
}
