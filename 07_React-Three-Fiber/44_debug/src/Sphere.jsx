import { useControls } from 'leva';

const Sphere = () => {
  const { pos, scale, colour } = useControls(
    'Sphere',
    {
      pos: {
        value: { x: -2, y: 0 },
        step: 0.05,
        joystick: 'invertY',
      },
      scale: { value: 1, min: 0.5, max: 5, step: 0.5 },
      colour: '#ee9900',
    },
    { collapsed: true }
  );

  return (
    <mesh position={[pos.x, pos.y, 0]} scale={scale}>
      <sphereGeometry />
      <meshStandardMaterial color={colour} />
    </mesh>
  );
};

export default Sphere;
