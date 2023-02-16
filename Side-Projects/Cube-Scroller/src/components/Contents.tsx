import { Text3D } from '@react-three/drei';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Mesh } from 'three';

interface Props {
  side: number;
}

const Contents: React.FC<Props> = ({ side }) => {
  const textRef = useRef<Mesh>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current.position, { x: -3, duration: 1 });
      gsap.to(textRef.current.position, { x: -0.12, duration: 1.5, delay: 1 });
    }
  });

  return (
    <Text3D
      ref={textRef}
      font='./fonts/Zeyada_Regular.json'
      size={0.1}
      height={0.01}
      curveSegments={24}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.02}
      bevelOffset={0}
      bevelSegments={12}
      position={[0, 0, 1]}
      castShadow
    >
      {side}
      <meshStandardMaterial color='mediumpurple' />
    </Text3D>
  );
};

export default Contents;
