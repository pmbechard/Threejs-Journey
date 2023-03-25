import React from 'react';
import { OrbitControls } from '@react-three/drei';

function App() {
  return (
    <>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />

      <mesh scale={1.5}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  );
}

export default App;
