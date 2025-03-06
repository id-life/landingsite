import { memo } from 'react';
import { gsap } from 'gsap';
import { NAV_LIST } from '@/components/nav/nav';
import { useGSAP } from '@gsap/react';
import { useSetAtom } from 'jotai';
import { currentPageAtom } from '@/atoms';

function Twin() {
  const setCurrentPage = useSetAtom(currentPageAtom);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[3].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[3]);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[3]);
        },
      },
    });
  }, []);
  return (
    <div id={NAV_LIST[3].id} className="page-container twin">
      <div>digital twin</div>
    </div>
  );
}

export default memo(Twin);
