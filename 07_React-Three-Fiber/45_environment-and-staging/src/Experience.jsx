import { useRef } from 'react';
import * as THREE from 'three';
import {
  AccumulativeShadows,
  BakeShadows,
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  Sky,
  SoftShadows,
  Stage,
  useHelper,
} from '@react-three/drei';
import { Perf } from 'r3f-perf';
import { useControls } from 'leva';

import Cube from './Components/Cube';
import Sphere from './Components/Sphere';
import Plane from './Components/Plane';
import Rect from './Components/Rect';

const Experience = () => {
  const directionalLightRef = useRef();
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1);

  const { color, opacity, blur } = useControls(
    'Contact Shadows',
    {
      color: '#4b2709',
      opacity: { value: 0.4, min: 0, max: 1, step: 0.05 },
      blur: { value: 2.8, min: 0, max: 10, step: 0.5 },
    },
    { collapsed: 'true' }
  );

  const { sunPosition } = useControls(
    'Sky',
    {
      sunPosition: { value: [1, 2, 3] },
    },
    { collapsed: 'true' }
  );

  const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } =
    useControls(
      'Env Map',
      {
        envMapIntensity: { value: 3.5, min: 0, max: 12, step: 0.5 },
        envMapHeight: { value: 7, min: 0, max: 100, step: 0.5 },
        envMapRadius: { value: 20, min: 10, max: 1000, step: 0.5 },
        envMapScale: { value: 100, min: 10, max: 1000, step: 0.5 },
      },
      { collapsed: 'true' }
    );

  return (
    <>
      <Perf position='top-left' />

      <OrbitControls />

      {/* --> ENVIRONMENTS */}
      {/* <Environment
        background
        files={[
          './environmentMaps/1/px.jpg',
          './environmentMaps/1/nx.jpg',
          './environmentMaps/1/py.jpg',
          './environmentMaps/1/ny.jpg',
          './environmentMaps/1/pz.jpg',
          './environmentMaps/1/nz.jpg',
        ]}
      /> */}
      {/* <Environment
        background
        files={'./environmentMaps/the_sky_is_on_fire_2k.hdr'}
      /> */}
      {/* <Environment background preset='night' /> */}

      {/* <Environment
        ground={{
          height: envMapHeight,
          radius: envMapRadius,
          scale: envMapScale,
        }}
        preset='sunset'
      > */}
      {/* <color args={['#000000']} attach={'background'} /> */}
      {/* <Lightformer
          position-z={-5}
          scale={5}
          color={'red'}
          intensity={10}
          form={'ring'}
        /> */}
      {/* <Rect /> */}
      {/* </Environment> */}

      {/* <color args={['ivory']} attach={'background'} /> */}
      {/* <Sky sunPosition={sunPosition} /> */}

      {/* --> LIGHTS */}
      {/* <directionalLight
        ref={directionalLightRef}
        position={sunPosition}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      />
      <ambientLight intensity={0.5} /> */}

      {/* --> SHADOWS */}
      {/* <BakeShadows /> */}
      {/* <SoftShadows
        frustum={3.75}
        size={0.005}
        near={9.5}
        samples={17}
        rings={11}
      /> */}
      {/* <AccumulativeShadows
        position-y={-0.99}
        scale={10}
        color={'#316d39'}
        opacity={0.8}
        frames={Infinity}
        temporal
        blend={100}
      >
        <RandomizedLight
          position={[1, 2, 3]}
          amount={8}
          radius={1}
          intensity={1}
          ambient={0.5}
          bias={0.001}
        />
      </AccumulativeShadows> */}
      {/* <ContactShadows
        position-y={0}
        scale={10}
        resolution={512}
        far={5}
        color={color}
        opacity={opacity}
        blur={blur}
        // frames={1} // to bake
      /> */}

      {/* --> MESHES */}
      {/* <Cube envMapIntensity={envMapIntensity} /> */}
      {/* <Sphere envMapIntensity={envMapIntensity} /> */}
      {/* <Plane envMapIntensity={envMapIntensity} /> */}

      <Stage
        shadows={{ type: 'contact', opacity: 0.2, blur }}
        environment='sunset'
        preset='portrait'
        intensity={0.1}
      >
        <Cube envMapIntensity={envMapIntensity} />
        <Sphere envMapIntensity={envMapIntensity} />
      </Stage>
    </>
  );
};

export default Experience;
