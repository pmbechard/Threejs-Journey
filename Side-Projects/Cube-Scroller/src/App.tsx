import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { cloneUniformsGroups, Mesh } from 'three';
import gsap from 'gsap';
import './App.css';
import Contents from './components/Contents';

function App() {
  const cubeRef = useRef<Mesh>(null);
  const [side, setSide] = useState<number>(1);

  useEffect(() => {
    window.addEventListener('click', rotate);
    return () => window.removeEventListener('click', rotate);
  });

  const rotate = () => {
    if (cubeRef.current) {
      gsap.to(cubeRef.current?.position, { z: -5, duration: 1 });
      gsap.to(cubeRef.current?.position, { z: 0, duration: 1, delay: 1 });
      let [x, y] = getXYRotation();
      gsap.to(cubeRef.current.rotation, { x, y, duration: 2 });
    }
  };

  const getXYRotation = () => {
    setSide((side + 1) % 6);
    if (side === 0) return [0, 0];
    else if (side === 3) return [0, Math.PI / 2];
    else if (side === 1) return [0, Math.PI];
    else if (side === 5) return [0, Math.PI * 1.5];
    else if (side === 2) return [Math.PI / 2, 0];
    else if (side === 4) return [-Math.PI / 2, 0];
    return [0, 0];
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-3, 2, 1]} intensity={1.5} />

      <mesh ref={cubeRef} receiveShadow>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
      <Contents side={side} />
    </>
  );
}

export default App;
