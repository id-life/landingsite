import dynamic from 'next/dynamic';

// 使用动态导入确保 ReactP5Wrapper 只在客户端加载
const DynamicReactP5Wrapper = dynamic(() => import('./DynamicParticleGL').then((mod) => mod.default), {
  ssr: false,
});

const ParticleGL = ({
  activeAnim,
  imageIdx,
  id,
  getSourceImgInfos,
}: {
  activeAnim?: boolean;
  imageIdx: number;
  id?: string;
  getSourceImgInfos: (
    isMobile: boolean,
  ) => { scaleNum?: number; resize?: number[]; url: string; loadPercentage?: number; resolution?: number }[];
}) => {
  return <DynamicReactP5Wrapper activeAnim={activeAnim} imageIdx={imageIdx} id={id} getSourceImgInfos={getSourceImgInfos} />;
};

export default ParticleGL;
