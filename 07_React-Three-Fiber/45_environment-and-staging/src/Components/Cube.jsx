import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Cube = () => {
  const cubeRef = useRef();

  // useFrame((state, delta) => {
  //   cubeRef.current.rotation.y += Math.sin(delta * 0.2);
  // });

  return (
    <mesh ref={cubeRef} position-x={2} position-y={1} scale={1.5} castShadow>
      <boxGeometry />
      <meshStandardMaterial color='mediumpurple' />
    </mesh>
  );
};

export default Cube;
