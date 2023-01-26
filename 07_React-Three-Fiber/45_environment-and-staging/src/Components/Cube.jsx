import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Cube = ({ envMapIntensity }) => {
  const cubeRef = useRef();

  useFrame((state, delta) => {
    // const time = state.clock.elapsedTime;
    // cubeRef.current.position.x = 2 + Math.sin(time);
    cubeRef.current.rotation.y += Math.sin(delta * 0.2);
  });

  return (
    <mesh ref={cubeRef} position-x={2} position-y={1} scale={1.5} castShadow>
      <boxGeometry />
      <meshStandardMaterial
        color='mediumpurple'
        envMapIntensity={envMapIntensity}
      />
    </mesh>
  );
};

export default Cube;
