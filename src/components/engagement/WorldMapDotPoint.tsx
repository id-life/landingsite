import { selectEngagementDotDataAtom } from '@/atoms/page';
import { MapDotData } from '@/constants/engagement';
import { cn } from '@/utils';
import { useAtom } from 'jotai';
import React, { Fragment, useCallback, useMemo } from 'react';
import FeatherImg from './FeatherImg';

export default function WorldMapDotPoint({ dot, index }: { dot: MapDotData; index: number }) {
  const { title, imgs, contentTransformStyle, period, country, label, lat, lng, key } = dot;

  const [selectEngagementDotData, setSelectEngagementDotData] = useAtom(selectEngagementDotDataAtom);
  const isSelected = useMemo(() => {
    return selectEngagementDotData?.key === key;
  }, [selectEngagementDotData, key]);

  const projectPoint = useCallback((lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  }, []);
  const point = projectPoint(lat, lng);

  return (
    <Fragment key={`points-group-${index}`}>
      <g
        className={`world-map-dot world-map-dot-${index} pointer-events-auto cursor-pointer opacity-0`}
        onClick={(e: React.MouseEvent) => {
          setSelectEngagementDotData(isSelected ? null : dot);
        }}
      >
        <circle cx={point.x} cy={point.y} r="2" fill="#C11111" />
        <circle cx={point.x} cy={point.y} r="2" fill="#C11111" opacity="0.5">
          <animate attributeName="r" from={2} to={6} dur="1s" begin="0s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="1s" begin="0s" repeatCount="indefinite" />
        </circle>
        <circle cx={point.x} cy={point.y} r="6" stroke="#C11111" strokeWidth="1" opacity="0.5" fill="none">
          <animate attributeName="r" from={6} to={10} dur="1s" begin="0s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="1s" begin="0s" repeatCount="indefinite" />
        </circle>
        <foreignObject x={point.x + 6} y={point.y - 6} width={120} height={20}>
          <div
            className="flex flex-col items-start font-oxanium text-xl/6 text-white"
            style={{
              transform: 'scale(var(--inverse-scale, 1))',
              transformOrigin: 'top left',
            }}
          >
            {country && <span className="mr-2 font-semibold">{country}</span>}
            {label}
          </div>
        </foreignObject>
      </g>
      <foreignObject
        x={point.x - 16}
        y={0}
        width={160}
        className={cn(
          `world-map-dot-content world-map-dot-content-${index} pointer-events-none flex h-[70vh] max-h-[42.5rem] flex-col overflow-visible opacity-0`,
          // 通过 gsap 控制动画
          //    isSelected ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div
          className={cn('absolute inset-0 top-4 flex h-full w-[20.25rem] flex-col items-center font-oxanium')}
          style={{
            transform: `scale(var(--inverse-scale, 1)) ${contentTransformStyle}`,
            transformOrigin: 'top left',
          }}
        >
          {title && (
            <h3 className="text-xl/6 font-semibold capitalize text-white">
              <span className="mr-2">{title}</span>
              {period}
            </h3>
          )}
          {imgs?.length ? (
            <div className="-ml-8 -mt-2 flex grow flex-col overflow-auto pb-12 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_75%,transparent)]">
              {imgs.map((img) => (
                <FeatherImg key={img.src} src={img.src} alt={img.alt} />
              ))}
            </div>
          ) : null}
        </div>
      </foreignObject>
    </Fragment>
  );
}
