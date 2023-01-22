import { OrbitControls } from '@react-three/drei';

const Experience = () => {
  return (
    <>
      <OrbitControls />

      <directionalLight position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />

      <mesh position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color='orange' />
      </mesh>
      <mesh position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color='mediumpurple' />
      </mesh>
      <mesh position-y={-1} rotation-x={Math.PI / -2} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>
    </>
  );
};

export default Experience;
