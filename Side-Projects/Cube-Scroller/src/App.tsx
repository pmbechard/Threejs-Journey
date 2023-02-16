import {
  Environment,
  Float,
  OrbitControls,
  Sky,
  Stars,
} from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import './App.css';
import Contents from './components/Contents';
import { useFrame } from '@react-three/fiber';
import Cube from './components/Cube';

function App() {
  const [side, setSide] = useState<number>(1);
  const [inDarkMode, setInDarkMode] = useState<Boolean>(true);

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
      {inDarkMode ? (
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={7}
          saturation={40}
          fade
          speed={1}
        />
      ) : (
        <Sky />
      )}
      <color attach='background' args={['#000000']} />

      <pointLight castShadow color={'#ffffff'} position={[-10, -10, -10]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 2, 1]} intensity={1.5} />

      <Float>
        <Cube side={side} setSide={setSide} />
        <Contents side={side} />
      </Float>
    </>
  );
}

export default App;
