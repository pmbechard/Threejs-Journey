import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Canvas
    shadows
    camera={{ fov: 45, near: 0.01, far: 2000, position: [-3, 1.5, 4] }}
  >
    <App />
  </Canvas>
);
