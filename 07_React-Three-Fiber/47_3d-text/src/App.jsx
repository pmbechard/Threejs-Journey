import React, { useEffect, useRef } from 'react';
import { Perf } from 'r3f-perf';
import { useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Text3D,
  Center,
  useMatcapTexture,
  Sky,
} from '@react-three/drei';
import * as THREE from 'three';

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
const torusMaterial = new THREE.MeshMatcapMaterial();

function App() {
  const donuts = useRef([]);

  const [textMatcapTexture] = useMatcapTexture(
    '2E763A_78A0B7_B3D1CF_14F209',
    256
  );
  const [donutMatcapTexture] = useMatcapTexture(
    '394641_B1A67E_75BEBE_7D7256',
    256
  );

  useEffect(() => {
    donutMatcapTexture.encoding = THREE.sRGBEncoding;
    donutMatcapTexture.needsUpdate = true;

    torusMaterial.matcap = donutMatcapTexture;
    torusMaterial.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    for (const donut of donuts.current) {
      donut.rotation.y += delta * 0.2;
    }
  });

  return (
    <>
      <Perf position={'top-left'} />

      <OrbitControls makeDefault />

      <Sky />

      <Center>
        <Text3D
          font={'./fonts/Zeyada_Regular.json'}
          size={0.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          hello r3f
          <meshMatcapMaterial matcap={textMatcapTexture} />
        </Text3D>
      </Center>

      {[...Array(100)].map((_, i) => (
        <mesh
          ref={(el) => (donuts.current[i] = el)}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          key={i}
          geometry={torusGeometry}
          material={torusMaterial}
        />
      ))}
    </>
  );
}

export default App;
