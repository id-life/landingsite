import { color } from '@/styles/tokens';
function LightGroup(props: { ambientIntensity: number | undefined }) {
  return (
    <>
      <directionalLight color={color['twin-light']} intensity={4.6} position={[4.8, 5.3, 4.1]} />
      <ambientLight color={color.white} intensity={props.ambientIntensity} />
    </>
  );
}

LightGroup.displayName = 'LightGroup';
export default LightGroup;
