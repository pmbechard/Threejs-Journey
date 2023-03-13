import React, { useRef } from 'react';
import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';
import {
  useGLTF,
  useTexture,
  Center,
  Sparkles,
  shaderMaterial,
} from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import portalVertexShader from './assets/shaders/portal/vertex.glsl';
import portalFragmentShader from './assets/shaders/portal/fragment.glsl';

// -> Set up custom shader material with GLSL files
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColourStart: new THREE.Color('#dfd6ff'),
    uColourEnd: new THREE.Color('#eeeeee'),
  },
  portalVertexShader,
  portalFragmentShader
);

// -> Creates a new tag for JSX based on custom material above
extend({ PortalMaterial });

function App() {
  const portalMaterial = useRef();

  // -> Animate
  useFrame((state, delta) => {
    portalMaterial.current.uTime += delta;
  });

  // -> Import the portal scene glb file as nodes in destructured object
  const { nodes } = useGLTF('./models/portal/portal.glb');

  // -> Load texture for baked object
  const bakedTexture = useTexture('./models/portal/baked.jpg');
  bakedTexture.flipY = false;

  return (
    <>
      <Perf position={'top-left'} />

      <OrbitControls makeDefault />

      <color args={['#000519']} attach={'background'} />

      <Center>
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} />
        </mesh>

        <mesh geometry={nodes.Lamp.geometry}>
          <meshBasicMaterial color='#ebd099' />
        </mesh>

        <mesh geometry={nodes.Lamp001.geometry}>
          <meshBasicMaterial color='#ebd099' />
        </mesh>

        <mesh geometry={nodes.Portal.geometry}>
          <portalMaterial ref={portalMaterial} />
        </mesh>

        <Sparkles
          speed={0.3}
          size={1}
          scale={[4, 2, 4]}
          position-y={1}
          count={60}
        />
      </Center>
    </>
  );
}
export default App;
