function LightGroup(props: { ambientIntensity: number | undefined }) {
  return (
    <>
      <directionalLight color={'#ffaeae'} intensity={4.6} position={[4.8, 5.3, 4.1]} />
      <ambientLight color={'#ffffff'} intensity={props.ambientIntensity} />
    </>
  );
}

LightGroup.displayName = 'LightGroup';
export default LightGroup;
