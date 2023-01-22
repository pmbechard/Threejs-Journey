import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';

import './style.css';

createRoot(document.getElementById('root')).render(
  <Canvas
    // dpr={[1, 2]} pixel ratio set by default by r3f
    camera={{ fov: 45, near: 0.1, far: 200, position: [3, 2, 6] }}
    gl={{
      antialias: true,
      toneMapping: THREE.ACESFilmicToneMapping,
      outputEncoding: THREE.sRGBEncoding,
    }}
  >
    <Experience />
  </Canvas>
);
