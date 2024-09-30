import { cn } from '@/utils';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import { useMeasure } from 'react-use';

const tags = [
  'Stem Cell Therapy',
  'Organ Cultivation and Transplantation',
  'Gene Therapy and Gene Editing',
  'Telomere Extension',
  'Senolytics',
  'Metabolic Modulation and Nutritional Interventions',
  'Biomarker Tracking',
  'Anti-aging Drugs',
];
const loop1Tags = tags.concat(tags);
// tags 从倒数第三个开始到结尾，在从开头到倒数第三个的数组
const tags2 = tags.slice(-3).concat(tags.slice(0, -3)); // 从倒数第三个开始到结尾，在从开头到倒数第三个的数组
const loop2Tags = tags2.concat(tags2);

const commonList: { tag: string; desc: string }[] = [
  {
    tag: 'Regulation and ethics',
    desc: 'the FDA + big pharma + big insurance tripolar structure is bad (e.g. pro treatment over cure, pro stagnant over approval)',
  },
  {
    tag: "It's learnable and therefore ",
    desc: 'participation from new comers are meaningful. Just like rocket science',
  },
  {
    tag: 'Selfish rich boys',
    desc: 'natural mechanism / rapid spread / own money+body+risk',
  },
  {
    tag: 'How about dictators',
    desc: 'perpendicular and irrelevant',
  },
  {
    tag: 'If the experiment fails, people will die',
    desc: 'reverse is more true, without longevity breakthrough people are dying everyday',
  },
  {
    tag: 'Positive impact on society of longer healthspan',
    desc: "longer term decisions and projects, trip to Mars doesn't seem long anymore",
  },
];
export default function Value() {
  const tagsRef1 = useRef<HTMLDivElement>(null);
  const tagsRef2 = useRef<HTMLDivElement>(null);
  const animationRef1 = useRef<GSAPTimeline | null>(null);
  const animationRef2 = useRef<GSAPTimeline | null>(null); // 添加第二个动画引用
  const [containerRef, { width: containerWidth }] = useMeasure<HTMLDivElement>();
  useEffect(() => {
    const tagsElement1 = tagsRef1.current;
    const tagsElement2 = tagsRef2.current;
    if (tagsElement1 && tagsElement2) {
      const totalWidth = tagsElement1.scrollWidth / 2; // 修改为总宽度的一半
      const duration = 140; // 设置动画持续时间

      animationRef1.current = gsap
        .timeline()
        .set(tagsElement1, { x: -totalWidth }) // 设置初始位置为 0
        .to(tagsElement1, {
          x: 0,
          duration,
          ease: 'none',
          repeat: -1,
        });

      animationRef2.current = gsap
        .timeline()
        // .set(tagsElement2, { x: -totalWidth + containerWidth }) // 设置初始位置为 0
        .to(tagsElement2, {
          x: -totalWidth,
          duration,
          ease: 'none',
          repeat: -1,
        });

      // 添加鼠标悬停事件
      const handleMouseEnter = () => {
        animationRef1.current?.pause();
        animationRef2.current?.pause(); // 暂停第二个动画
      };
      const handleMouseLeave = () => {
        animationRef1.current?.resume();
        animationRef2.current?.resume(); // 恢复第二个动画
      };

      tagsElement1.addEventListener('mouseenter', handleMouseEnter);
      tagsElement1.addEventListener('mouseleave', handleMouseLeave);
      tagsElement2.addEventListener('mouseenter', handleMouseEnter);
      tagsElement2.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        handleMouseLeave();
        tagsElement1.removeEventListener('mouseenter', handleMouseEnter);
        tagsElement1.removeEventListener('mouseleave', handleMouseLeave);
        tagsElement2.removeEventListener('mouseenter', handleMouseEnter);
        tagsElement2.removeEventListener('mouseleave', handleMouseLeave);
        animationRef1.current?.kill();
        animationRef2.current?.kill(); // 清理第二个动画
      };
    }
  }, [containerWidth]);

  return (
    <div className="pb-[11.25rem] text-gray-800">
      {/* <h3 className="font-migrena text-3xl font-bold uppercase">
        <span className="text-2xl/9">The Life Formula</span>
        <br />
        {"Life's Weight = (Experience + Emotions) × Lifespan"}
      </h3> 
      <div className="mb-14 mt-7.5 flex max-w-[67.5rem] flex-wrap gap-10 text-base/6 font-semibold capitalize">
        <p className="max-w-[32.5rem]">
          Humanity has invested heavily in enhancing experience and emotions, achieving remarkable breakthroughs
        </p>
        <p className="max-w-[32.5rem]">Time to focus on amplifying the other side of the equation</p>
      </div>*/}
      <div className="flex flex-wrap whitespace-nowrap font-migrena">
        <div className="relative mb-14 mr-12 pl-6">
          <img className="absolute left-0 top-0 w-4 mobile:w-2.5" src="/svgs/arrow-mark.svg" alt="arrow-mark" />
          <p className="text-2xl/12 font-bold uppercase">Aging is a disease, and it can be cured</p>
        </div>
        <div className="relative mb-14 pl-6">
          <img className="absolute left-0 top-0 w-4 mobile:w-2.5" src="/svgs/arrow-mark.svg" alt="arrow-mark" />
          <p className="text-2xl/12 font-bold uppercase">
            {"Longevity is right. It's righteous. Justice. Most important thing"}
          </p>
        </div>
      </div>
      <p className="font-migrena text-3xl/12 font-bold uppercase">{'What is worth seeing? '}</p>
      <div ref={containerRef} className="mt-5 w-full overflow-hidden">
        <div ref={tagsRef1} className="flex gap-7.5 whitespace-nowrap">
          {loop1Tags?.length ? loop1Tags.map((str, idx) => <TagItem key={idx}>{str}</TagItem>) : null}
        </div>
        <div ref={tagsRef2} className="mt-6 flex gap-7.5 whitespace-nowrap">
          {loop2Tags?.length ? loop2Tags.map((str, idx) => <TagItem key={idx}>{str}</TagItem>) : null}
        </div>
      </div>
      {/* Purpose-driven */}
      <h3 className="mt-[11.25rem] font-migrena text-3xl/12 font-bold uppercase">
        Purpose - driven fund - To extend human healthy lifespan
      </h3>
      <div className="-mx-12 mt-6 bg-gray-800/60 px-12 py-7.5 text-sm font-semibold capitalize text-white backdrop-blur-md">
        <ul className="grid list-disc grid-cols-4 gap-16 gap-y-7.5 whitespace-pre-wrap mobile:grid-cols-1">
          <li>{`We attract as much resources, capital, talent, attention, into longevity`}</li>
          <li>{`Combine the best from West and East - from capital, to researcher and founder`}</li>
          <li>{`Support the portfolio with business acumen, strategy, and commercialization.`}</li>
          <li>{`Audacity / moonshots / bold bets`}</li>
          <li>{`Flexibility to accommodate founders - whatever it takes`}</li>
        </ul>
      </div>
      {/* Common Criticisms */}
      <h3 className="mt-[11.25rem] font-migrena text-3xl/12 font-bold uppercase">Common Criticisms</h3>
      <div className="tablet:grid-cols-2 mt-12 grid grid-cols-4 gap-x-16 gap-y-12 mobile:grid-cols-1">
        {commonList?.length ? commonList.map(({ tag, desc }, idx) => <CommonItem key={idx} tag={tag} desc={desc} />) : null}
      </div>
    </div>
  );
}
function TagItem({ children }: { children?: JSX.Element | string }) {
  return (
    <div
      className={cn(
        'group relative inline-block min-w-max overflow-hidden',
        "after:contents-[''] after:value-tag-border-clip after:absolute after:inset-0 after:-z-10 after:block after:border after:border-gray-800 after:bg-white after:transition after:duration-300 hover:after:border-red-600",
      )}
    >
      <div className="absolute -left-6.5 -top-6.5 h-10 w-10 rotate-45 border border-gray-800 transition duration-300 group-hover:border-red-600"></div>
      <p className="px-3.5 py-2 text-base/5 font-semibold transition duration-300 group-hover:text-red-600">{children}</p>
    </div>
  );
}

function CommonItem({ tag, desc }: { tag: string; desc: string }) {
  return (
    <div className="relative z-0">
      <div className="flex w-min flex-col items-center gap-2">
        <TagItem>{tag}</TagItem>
        <img className="h-7.5" src="/svgs/arrow-down-red.svg" alt="" />
      </div>
      <p className="mt-1 text-sm font-semibold capitalize">{desc}</p>
    </div>
  );
}
