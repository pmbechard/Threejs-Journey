import { Float, Stars } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import './App.css';
import Contents from './components/Contents';
import { useFrame } from '@react-three/fiber';
import Cube from './components/Cube';

function App() {
  const [side, setSide] = useState<number>(0);

  useFrame((e) => {
    gsap.to(e.camera.position, {
      x: 0 + e.pointer.x * 0.1,
      y: 0 + e.pointer.y * 0.1,
      duration: 0.5,
    });
    e.camera.lookAt(new THREE.Vector3(0, 0, 0));
  });

  return (
    <>
      <Stars
        radius={1}
        depth={50}
        count={5000}
        factor={1}
        saturation={40}
        fade
        speed={1}
      />
      <color attach='background' args={['#121212']} />

      <pointLight
        castShadow
        color={'#fffddd'}
        position={[0, 0, 10]}
        intensity={0.01}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 2, 2]} intensity={1.5} castShadow />

      <Float>
        <Contents side={side} />
        <Cube side={side} setSide={setSide} />
      </Float>
    </>
  );
}

export default App;
