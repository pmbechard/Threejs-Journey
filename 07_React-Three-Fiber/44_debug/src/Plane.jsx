import { useControls } from 'leva';

const Plane = () => {
  const { yPos, xRot, scale, colour, visible } = useControls(
    'Plane',
    {
      yPos: { value: -1, min: -3, max: -1, step: 0.5 },
      xRot: {
        value: Math.PI / -2,
        min: Math.PI / -1.5,
        max: Math.PI / -2.5,
      },
      scale: { value: 10, min: 1, max: 15, step: 1 },
      colour: '#009900',
      visible: true,
    },
    { collapsed: true }
  );

  return (
    <mesh position-y={yPos} rotation-x={xRot} scale={scale}>
      <planeGeometry />
      <meshStandardMaterial color={colour} visible={visible} />
    </mesh>
  );
};

export default Plane;
