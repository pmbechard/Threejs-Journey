import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 200, position: [0.5, -0.5, 2] }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputEncoding: THREE.sRGBEncoding,
      }}
    >
      <App />
    </Canvas>
  </>
);
