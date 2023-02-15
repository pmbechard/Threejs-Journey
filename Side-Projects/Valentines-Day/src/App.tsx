import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect } from 'react';
import * as THREE from 'three';
import './App.css';
import Card from './components/Card';
import Hearts from './components/Hearts';

function App() {
  let introObj: { introAnimation: boolean } = {
    introAnimation: false,
  };

  useFrame((e) => {
    if (!introObj.introAnimation) {
      gsap.to(e.camera.position, { z: 12, duration: 2 });
      gsap.to(e.camera.position, { x: 2, y: 3, duration: 3 });
      gsap.to(introObj, { introAnimation: true, delay: 3 });
    } else {
      gsap.to(e.camera.position, {
        x: 2 + e.pointer.x,
        y: 3 + e.pointer.y,
        duration: 0.5,
      });
    }
    e.camera.lookAt(new THREE.Vector3(0, 0, 0));
  });
  return (
    <>
      <OrbitControls />
      <directionalLight position={[-3, -2, 1]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Float
        speed={1}
        rotationIntensity={1}
        floatIntensity={0.5}
        floatingRange={[-1, 1]}
      >
        <Card />
      </Float>
      <Hearts />
      <Sparkles speed={1} scale={20} size={10} color={'white'} />
    </>
  );
}

export default App;
