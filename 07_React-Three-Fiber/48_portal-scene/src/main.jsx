import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Canvas
    flat
    shadows
    camera={{ fov: 75, near: 0.01, far: 200, position: [0, -0.6, 2.5] }}
  >
    <App />
  </Canvas>
);
