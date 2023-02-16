import { Center, Text3D } from '@react-three/drei';
import React from 'react';

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
          castShadow
        >
          Happy Valentine's Day, Allie!
          <meshNormalMaterial />
        </Text3D>
      </Center>
    </>
  );
};

export default Card;
