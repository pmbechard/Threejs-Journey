import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Canvas
    shadows
    camera={{ fov: 75, near: 0.1, far: 200, position: [-1, 0, 2] }}
  >
    <App />
  </Canvas>
);
