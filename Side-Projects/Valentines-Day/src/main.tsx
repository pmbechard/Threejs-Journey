import React from 'react';
import { Canvas } from '@react-three/fiber';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Canvas
    camera={{ fov: 45, near: 0.1, far: 2000, position: [4, 3, 12] }}
    gl={{
      antialias: true,
      toneMapping: THREE.ACESFilmicToneMapping,
      outputEncoding: THREE.sRGBEncoding,
    }}
  >
    <App />
  </Canvas>
);
