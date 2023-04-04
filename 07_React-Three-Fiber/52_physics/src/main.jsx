import React from 'react';
import ReactDOM from 'react-dom/client';
import { Leva } from 'leva';
import { Canvas } from '@react-three/fiber';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <Leva />
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.01,
        far: 200,
        position: [4, 2, 6],
      }}
    >
      <App />
    </Canvas>
  </>
);
