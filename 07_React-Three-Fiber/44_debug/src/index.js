import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';
import './style.css';
import { Leva } from 'leva';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Leva collapsed />
    <Canvas camera={{ fov: 45, near: 0.1, far: 200, position: [-5, 3, 6] }}>
      <Experience />
    </Canvas>
  </StrictMode>
);
