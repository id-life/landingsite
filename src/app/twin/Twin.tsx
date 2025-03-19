import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useSetAtom } from 'jotai';
import { memo, useRef } from 'react';

function Twin() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const imageContainerRef = useRef<HTMLDivElement>(null);

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
          gsap.set('#twin-three-wrapper', { visibility: 'visible', zIndex: 10 });
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[3]);
          gsap.set('#twin-three-wrapper', { visibility: 'visible', zIndex: 10 });
        },
        onLeaveBack: () => {
          const smoother = ScrollSmoother.get();
          smoother?.scrollTo(`#map-container`, true, `bottom bottom`);
          gsap.set('#twin-three-wrapper', { visibility: 'hidden', zIndex: 0 });
        },
        onLeave: () => {
          gsap.set('#twin-three-wrapper', { visibility: 'hidden', zIndex: 0 });
        },
      },
    });
    tl.to(imageContainerRef.current, { height: '100svh' });
    tl.to('#twin-three-wrapper', { opacity: 1, duration: 6 });
    tl.to('#switch-model', { opacity: 1, duration: 6 }, '<');
    tl.to('#switch-skin', { opacity: 1, duration: 6 }, '<');
    tl.to('#switch-anatomy-camera', { opacity: 1, duration: 6 }, '<');
    // tl.to('.twin-title-wrapper', { left: '4rem', ease: 'power2.inOut' });
    // tl.to('.twin-title-wrapper', { left: '-30rem', ease: 'power2.inOut', duration: 2, delay: 2 });
    tl.to('#twin-three-wrapper', { opacity: 0, duration: 2 });
  }, []);

  return (
    <div id={NAV_LIST[3].id} className="page-container twin">
      <div ref={imageContainerRef} className="absolute left-0 top-0 h-0 overflow-hidden">
        <img className="relative right-0 top-0 h-screen w-screen" src="/svgs/twin-bg.svg" alt="" />
      </div>
      <div className="twin-title-wrapper relative h-screen">
        <div className="twin-title absolute left-10 top-40 w-screen">
          <p className="font-oxanium text-[11.875rem]/[11.25rem] font-bold uppercase text-red-600">DIGITAL TWIN</p>
          <p className="font-oxanium text-[10.5rem]/[10.25rem] font-bold uppercase">BIOMARKER</p>
          <p className="font-oxanium text-[10.5rem]/[10.25rem] font-bold uppercase">VISUALIZATION</p>
        </div>
        <div className="twin-title absolute bottom-20 right-32 text-right text-base font-medium">
          <p>- High-Precision Custom Digital Twin Creation</p>
          <p>- AI Health Prediction Clones</p>
          <p>- Long-Term Health Tracking & Personalized Guidance</p>
          <p>- Continuous Digital Twin Upgrades & Optimization</p>
          <p>高精度数字孪生/AI预测克隆体/健康跟踪与个性化指导/持续升级和优化</p>
        </div>
        <div className="twin-title-item twin-title-M0 absolute left-[-80rem] top-64">
          <p className="font-oxanium text-[1.75rem]/[1.75rem] font-bold uppercase text-red-600">organization</p>
          <div className="font-oxanium text-[7.5rem]/[7.5rem] font-bold uppercase">
            <p>DIGITAL</p>
            <p>TWIN</p>
          </div>
        </div>
        <div className="twin-title-item twin-title-M0 absolute bottom-32 left-[-80rem] max-w-[31.25rem]">
          <p className="text-xl/6 font-semibold">Appearance & Biomarkers 外形采集&健康数据</p>
          <p className="mt-5 text-base font-medium">
            Create from Personal Biomarkers & Generate Clones Based on Time, Environment, and Habits.
          </p>
          <p className="mt-2 text-base font-medium">根据个人生物指标创建 & 根据时间、环境和习惯生成克隆</p>
        </div>
        <div className="twin-title-item twin-title-M1 absolute left-[-80rem] top-64">
          <p className="font-oxanium text-[1.75rem]/[1.75rem] font-bold uppercase text-red-600">CLONE_01</p>
          <div className="font-oxanium text-[7.5rem]/[7.5rem] font-bold uppercase">
            <p>Unhealthy</p>
            <p>habits me</p>
          </div>
        </div>
        <div className="twin-title-item twin-title-M1 absolute bottom-32 left-[-80rem] max-w-[31.25rem]">
          <p className="text-xl/6 font-semibold">30 YEARS 30年后</p>
          <p className="mt-5 text-base font-medium">
            Living State:Gets up at 11 AM daily, continues sleeping after lunch until 2 PM before starting the day&apos;s
            activities. Long-term irregular living patterns, often staying up until ...
            <span className="cursor-auto text-red-600"> More &gt;</span>
          </p>
          <p className="mt-2 text-base font-medium">
            生活状态：每天早上11点起床，午饭后继续睡觉，直到下午2点才开始一天的活动。长期不规律的生活模式，经常熬夜到3-4点……
          </p>
        </div>
        <div className="twin-title-item twin-title-M2 absolute left-[-80rem] top-64">
          <p className="font-oxanium text-[1.75rem]/[1.75rem] font-bold uppercase text-red-600">CLONE_02</p>
          <div className="font-oxanium text-[7.5rem]/[7.5rem] font-bold uppercase">
            <p className="text-[6.25rem]/[6.25rem]">A Healthier</p>
            <p>Life</p>
          </div>
        </div>
        <div className="twin-title-item twin-title-M2 absolute bottom-32 left-[-80rem] max-w-[31.25rem]">
          <p className="text-xl/6 font-semibold">5 YEARS 5年后</p>
          <p className="mt-5 text-base font-medium">
            Maintains a balanced and healthy lifestyle. Starts the day at 7 AM with 500ml of warm water, followed by 15 minutes
            of room tidying and simple stretches before arriving at ...
            <span className="cursor-auto text-red-600"> More &gt;</span>
          </p>
          <p className="mt-2 text-base font-medium">
            保持均衡健康的生活方式。每天早上7点起床，先喝500ml温水，然后进行15分钟的房间整理和简单拉伸，8点左右到达办公室。
          </p>
        </div>
        <div className="twin-title-item twin-title-M3 absolute left-[-80rem] top-64">
          <p className="font-oxanium text-[1.75rem]/[1.75rem] font-bold uppercase text-red-600">CLONE_03</p>
          <div className="font-oxanium text-[7.5rem]/[7.5rem] font-bold uppercase">
            <p>FITNESS</p>
            <p>FITNESS FITNESS</p>
          </div>
        </div>
        <div className="twin-title-item twin-title-M3 absolute bottom-32 left-[-80rem] max-w-[31.25rem]">
          <p className="text-xl/6 font-semibold">3 MONTHS 3月后</p>
          <p className="mt-5 text-base font-medium">
            Living State: Wakes up at 7 AM, starts with 10-minute posture assessment and weight recording,Performs 30 minutes of
            fasted cardio, mainly running (maintaining heart ...
            <span className="cursor-auto text-red-600"> More &gt;</span>
          </p>
          <p className="mt-2 text-base font-medium">
            生活状态：早上7点起床，先进行10分钟姿势评估和体重记录，空腹进行30分钟有氧运动（主要是跑步，保持心率在140-160）
          </p>
        </div>
      </div>
    </div>
  );
}

export default memo(Twin);
