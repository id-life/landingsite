import { memo } from "react";
import gsap from 'gsap';
import { NAV_LIST } from "@/components/nav/nav";
import { useGSAP } from "@gsap/react";
import { useSetAtom } from "jotai";
import { currentPageAtom } from "@/atoms";

function Engagement() {
  const setCurrentPage = useSetAtom(currentPageAtom);


  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[2]);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[2]);
        },
      },
    });
  }, []);
  return <div id={NAV_LIST[2].id} className="page-container engagement" />;
}

export default memo(Engagement);