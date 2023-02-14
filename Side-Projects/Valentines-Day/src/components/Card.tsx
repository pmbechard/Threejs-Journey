import { Center, Text3D } from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';

const Card = () => {
  return (
    <>
      <Center>
        <Text3D
          font='./fonts/Zeyada_Regular.json'
          size={1}
          height={0.15}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Happy Valentine's Day, Allie!
          <meshStandardMaterial color={new THREE.Color('rgb(49, 0, 128)')} />
        </Text3D>
      </Center>
    </>
  );
};

export default Card;
