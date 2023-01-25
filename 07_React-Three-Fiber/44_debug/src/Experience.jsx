import { OrbitControls } from '@react-three/drei';
import { button, useControls } from 'leva';
import { Perf } from 'r3f-perf';

import Sphere from './Sphere';
import Cube from './Cube';
import Plane from './Plane';

const Experience = () => {
  const { myInterval, myButton, myDropdown, perfVisible } = useControls(
    'Other',
    {
      myInterval: {
        min: 0,
        max: 10,
        value: [4, 5],
      },
      myButton: button(() => console.log('clicked')),
      myDropdown: { options: ['a', 'b', 'c'] },
      perfVisible: true,
    },
    { collapsed: true }
  );

  return (
    <>
      {perfVisible && <Perf position='top-left' />}

      <OrbitControls />

      <directionalLight position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />

      <Sphere />
      <Cube />
      <Plane />
    </>
  );
};

export default Experience;
