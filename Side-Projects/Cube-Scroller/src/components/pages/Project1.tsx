import React from 'react';
import { Text } from '@react-three/drei';
import { BufferGeometry, Material, Mesh } from 'three';

interface Props {
  textRef: React.RefObject<Mesh<BufferGeometry, Material | Material[]>>;
}

const Project1: React.FC<Props> = ({ textRef }) => {
  return (
    <Text ref={textRef} fontSize={0.05} position={[0, -3, 0.8]}>
      The Alley Shop
      <meshStandardMaterial color={'mediumpurple'} />
    </Text>
  );
};

export default Project1;
