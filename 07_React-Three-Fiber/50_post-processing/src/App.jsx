import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';

const App = () => {
  const cube = useRef();

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      <Perf position={'top-left'} />
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />

      <mesh ref={cube} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color={'mediumpurple'} />
      </mesh>

      <mesh position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color={'orange'} />
      </mesh>

      <mesh rotation-x={Math.PI / -2} position-y={-1} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color={'greenyellow'} />
      </mesh>
    </>
  );
};

export default App;
