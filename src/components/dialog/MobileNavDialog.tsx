import { currentPageAtom, mobileNavOpenAtom } from '@/atoms';
import { useAtom, useAtomValue } from 'jotai';
import Dialog from '.';
import MenuCloseSVG from '@/../public/svgs/menu-close.svg?component';
import SubscribeDialog from './SubscribeDialog';
import SubscribeBorderSVG from '@/../public/svgs/subscribe-border.svg?component';
import { useState } from 'react';
import { NAV_LIST, NavItem } from '../nav/nav';
import { cn } from '@/utils';
import { smootherAtom } from '@/atoms/scroll';
import { usePageScrollHeight } from '@/hooks/usePageScrollHeight';

export default function MobileNavDialog() {
  const [open, setOpen] = useAtom(mobileNavOpenAtom);
  const [subsOpen, setSubOpen] = useState(false);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const smoother = useAtomValue(smootherAtom);
  const { scrollHeight, scrollPageId } = usePageScrollHeight();

  const handleNavClick = (item: NavItem) => {
    smoother?.scrollTo(scrollHeight?.get(item.id) ?? 0, true);
    setCurrentPage(item);
    setTimeout(() => {
      setOpen(false);
    }, 10);
  };

  return (
    <Dialog
      isDismiss
      showCloseButton={false}
      overlayClassName="bg-black/60 backdrop-blur-sm"
      open={open}
      onOpenChange={setOpen}
      contentClassName="absolute left-0 top-0 w-full"
      render={({ close }) => (
        <div className="flex w-full flex-col">
          <div className="flex flex-1 items-center justify-end gap-5 p-5">
            <div
              onClick={() => setSubOpen(true)}
              className="group relative flex h-12 w-51.5 cursor-pointer items-center justify-center text-sm font-semibold uppercase text-white duration-300 hover:stroke-red-600 hover:text-red-600 mobile:h-8 mobile:w-24 mobile:text-xs/5"
            >
              <SubscribeBorderSVG className="absolute left-0 top-0 size-full stroke-white duration-300 group-hover:stroke-red-600" />
              Subscribe
            </div>
            <MenuCloseSVG className="h-10 cursor-pointer" onClick={close} />
          </div>
          <Dialog open={subsOpen} onOpenChange={setSubOpen} render={() => <SubscribeDialog />} />
          <div className="font-tt mt-16">
            {NAV_LIST.map((item) => (
              <div onClick={() => handleNavClick(item)} className={cn('flex-center py-6 text-white')} key={item.id}>
                <div className="text-sm/3.5 relative w-fit text-center font-semibold uppercase">
                  {item.title}
                  {currentPage.id === item.id && <div className="absolute inset-x-0 -bottom-2.5 h-px w-full bg-white" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
