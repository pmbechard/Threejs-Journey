import { useControls } from 'leva';

const Cube = () => {
  const { pos, scale, colour } = useControls(
    'Cube',
    {
      pos: {
        value: { x: 2, y: 0 },
        step: 0.05,
        joystick: 'invertY',
      },
      scale: { value: 1.5, min: 0.5, max: 5, step: 0.5 },
      colour: '#990099',
    },
    { collapsed: true }
  );

  return (
    <mesh position={[pos.x, pos.y, 0]} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial color={colour} />
    </mesh>
  );
};

export default Cube;
