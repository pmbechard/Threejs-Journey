import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Canvas
    shadows
    camera={{ fov: 45, near: 0.1, far: 200, position: [-4, -1.5, 3] }}
  >
    <App />
  </Canvas>
);
