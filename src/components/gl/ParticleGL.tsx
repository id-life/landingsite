import dynamic from 'next/dynamic';

// 使用动态导入确保 ReactP5Wrapper 只在客户端加载
const DynamicReactP5Wrapper = dynamic(() => import('./DynamicParticleGL').then((mod) => mod.default), {
  ssr: false,
});

const ParticleGL = ({ activeAnim }: { activeAnim?: boolean }) => {
  return <DynamicReactP5Wrapper activeAnim={activeAnim} />;
};

export default ParticleGL;