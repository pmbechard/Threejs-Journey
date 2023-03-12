import React from 'react';
import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';

function App() {
  return (
    <>
      <Perf position={'top-left'} />

      <OrbitControls makeDefault />

      <mesh scale={1.5}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  );
}

export default App;
