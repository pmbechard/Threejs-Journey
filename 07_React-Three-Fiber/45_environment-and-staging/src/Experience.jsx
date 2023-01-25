import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';
import Cube from './Cube';
import Sphere from './Sphere';
import Plane from './Plane';

const Experience = () => {
  return (
    <>
      <Perf position='top-left' />

      <OrbitControls />

      <directionalLight position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />

      <Cube />
      <Sphere />
      <Plane />
    </>
  );
};

export default Experience;
