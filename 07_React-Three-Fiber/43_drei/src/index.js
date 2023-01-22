import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';

import './style.css';

createRoot(document.getElementById('root')).render(
  <Canvas camera={{ fov: 45, near: 0.1, far: 200, position: [-5, 3, 6] }}>
    <Experience />
  </Canvas>
);
