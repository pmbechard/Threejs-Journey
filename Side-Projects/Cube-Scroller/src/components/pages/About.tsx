import React from 'react';
import { Text } from '@react-three/drei';
import { BufferGeometry, Material, Mesh } from 'three';

interface Props {
  textRef: React.RefObject<Mesh<BufferGeometry, Material | Material[]>>;
}

const About: React.FC<Props> = ({ textRef }) => {
  return (
    <Text ref={textRef} fontSize={0.05} position={[0, -3, 0.8]}>
      a bit about me...
      <meshStandardMaterial color={'mediumpurple'} />
    </Text>
  );
};

export default About;
