import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Experience from './Experience';
import './style.css';
import { Leva } from 'leva';

const created = (e) => {
  console.log('Access the renderer or scene to init properties here');
  // e.gl.setClearColor('#0044ee');
  // e.scene.background = new THREE.Color('#0044ee');
};

createRoot(document.getElementById('root')).render(
  <>
    <Leva collapsed />
    <Canvas
      shadows={false} // to use contact shadows
      onCreated={created}
      camera={{ fov: 45, near: 0.1, far: 200, position: [-5, 3, 6] }}
    >
      <Experience />
    </Canvas>
  </>
);
