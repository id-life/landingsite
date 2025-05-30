import dynamic from 'next/dynamic';

// 使用动态导入确保 ReactP5Wrapper 只在客户端加载
const DynamicReactP5Wrapper = dynamic(() => import('./DynamicParticleGL').then((mod) => mod.default), {
  ssr: false,
});
const StaticReactP5Wrapper = dynamic(() => import('./StaticParticleGL').then((mod) => mod.default), {
  ssr: false,
});

const ParticleGL = ({
  activeAnim,
  imageIdx,
  id,
  getSourceImgInfos,
  isStatic,
}: {
  activeAnim?: boolean;
  imageIdx: number;
  id?: string;
  isStatic?: boolean;
  getSourceImgInfos: (
    isMobile: boolean,
  ) => { scaleNum?: number; resize?: number[]; url: string; loadPercentage?: number; resolution?: number }[];
}) => {
  return isStatic ? (
    <StaticReactP5Wrapper activeAnim={activeAnim} imageIdx={imageIdx} id={id} getSourceImgInfos={getSourceImgInfos} />
  ) : (
    <DynamicReactP5Wrapper activeAnim={activeAnim} imageIdx={imageIdx} id={id} getSourceImgInfos={getSourceImgInfos} />
  );
};

export default ParticleGL;
