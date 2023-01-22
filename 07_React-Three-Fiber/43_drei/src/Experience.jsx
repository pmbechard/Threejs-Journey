import {
  Float,
  Html,
  MeshDistortMaterial,
  MeshReflectorMaterial,
  MeshWobbleMaterial,
  OrbitControls,
  PivotControls,
  Text,
  TransformControls,
} from '@react-three/drei';
import { useRef } from 'react';

const Experience = () => {
  const boxRef = useRef();
  const sphereRef = useRef();
  const planeRef = useRef();

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        lineWidth={2}
        axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
        scale={100}
        fixed={true}
      >
        <mesh ref={sphereRef} position-x={-2}>
          <sphereGeometry />
          <MeshDistortMaterial color='orange' speed={8} />
        </mesh>
      </PivotControls>

      <mesh ref={boxRef} position-x={2} scale={1.5}>
        <boxGeometry />
        <MeshWobbleMaterial color='mediumpurple' speed={8} />
        <Html
          wrapperClass='label'
          position={[0, 0.75, 0]}
          center
          distanceFactor={6}
        >
          That's a cube 👍
        </Html>
      </mesh>
      <TransformControls object={boxRef} mode='translate' />

      <mesh ref={planeRef} position-y={-1} rotation-x={Math.PI / -2} scale={10}>
        <planeGeometry />
        <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.5}
          color='greenyellow'
        />
      </mesh>

      <Float speed={5} floatIntensity={2}>
        <Text
          font='./bangers.woff'
          fontSize={1}
          color='salmon'
          position-y={2}
          maxWidth={2}
          textAlign='center'
        >
          I Love R3F
          <MeshDistortMaterial />
        </Text>
      </Float>
    </>
  );
};

export default Experience;
