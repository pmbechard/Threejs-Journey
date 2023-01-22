import { extend, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import CustomObject from './CustomObject';

extend({ OrbitControls });

const Experience = () => {
  const boxMeshRef = useRef();
  const groupRef = useRef();

  const { camera, gl } = useThree();

  useFrame((state, delta) => {
    boxMeshRef.current.rotation.y += delta;
    // const angle = state.clock.elapsedTime;
    // state.camera.position.x = Math.sin(angle) * 8;
    // state.camera.position.z = Math.cos(angle) * 8;
    // state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <orbitControls args={[camera, gl.domElement]} />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <group ref={groupRef}>
        <mesh
          ref={boxMeshRef}
          position-x={3}
          rotation-y={Math.PI / 4}
          scale={1.5}
        >
          <boxGeometry scale={1.5} />
          <meshStandardMaterial color='mediumpurple' />
        </mesh>
        <mesh position-x={-3} rotation-y={Math.PI / 4}>
          <sphereGeometry />
          <meshStandardMaterial color='orange' />
        </mesh>
      </group>
      <mesh position-y={-1} rotation-x={-Math.PI / 2} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>

      <CustomObject />
    </>
  );
};

export default Experience;
