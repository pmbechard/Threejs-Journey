import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Instances,
  Instance,
  Float,
  MeshReflectorMaterial,
  MeshRefractionMaterial,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  MeshWobbleMaterial,
} from '@react-three/drei';
import gsap from 'gsap';
import { cloneUniformsGroups } from 'three';

const particles = Array.from({ length: 50 }, () => ({
  factor: THREE.MathUtils.randInt(1, 50),
  speed: THREE.MathUtils.randFloat(0.1, 2),
  xFactor: THREE.MathUtils.randFloatSpread(3000),
  yFactor: THREE.MathUtils.randFloatSpread(2000),
  zFactor: THREE.MathUtils.randFloatSpread(500),
}));

const heartShape = new THREE.Shape();

heartShape.moveTo(25, 25);
heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

const extrudeSettings = {
  depth: 8,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 2,
  bevelSize: 1,
  bevelThickness: 1,
};

const Hearts = () => {
  return (
    <Instances
      limit={particles.length}
      castShadow
      receiveShadow
      scale={0.01}
      rotation={[0, 0, Math.PI]}
      position={[0, 0, -5]}
    >
      <extrudeGeometry args={[heartShape, extrudeSettings]} />
      <meshStandardMaterial roughness={0} color='#ff0022' />
      {particles.map((data, i) => (
        <Heart key={i} {...data} />
      ))}
    </Instances>
  );
};

function Heart({ factor, speed, xFactor, yFactor, zFactor }) {
  const ref = useRef();
  useFrame((state) => {
    const t = factor + state.clock.elapsedTime * (speed / 4);
    ref.current.scale.setScalar(Math.max(1.1, Math.cos(t) * 1.5));
    ref.current.position.set(
      Math.cos(t) +
        Math.sin(t * 1) / 10 +
        xFactor +
        Math.cos((t / 10) * factor) +
        (Math.sin(t * 1) * factor) / 10,
      Math.sin(t) +
        Math.cos(t * 2) / 10 +
        yFactor +
        Math.sin((t / 10) * factor) +
        (Math.cos(t * 2) * factor) / 10,
      Math.sin(t) +
        Math.cos(t * 2) / 10 +
        zFactor +
        Math.cos((t / 10) * factor) +
        (Math.sin(t * 3) * factor) / 10
    );
    ref.current.rotation.y += 0.00001 * ref.current.position.z;
  });
  return (
    <Float
      speed={0.6}
      rotationIntensity={3}
      floatIntensity={1}
      floatingRange={[-0.1, 0.1]}
    >
      <Instance ref={ref} />
    </Float>
  );
}

export default Hearts;
