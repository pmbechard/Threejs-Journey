import { Text3D } from '@react-three/drei';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Mesh } from 'three';

const Contents: React.FC<{ side: number }> = ({ side }) => {
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
      size={0.5}
      height={0.15}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.02}
      bevelOffset={0}
      bevelSegments={5}
      castShadow
      position={[-3, -0.2, 0.5]}
    >
      {side}
    </Text3D>
  );
};

export default Contents;
