import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MeshReflectorMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  side: number;
  setSide: React.Dispatch<React.SetStateAction<number>>;
}

const Cube: React.FC<Props> = ({ side, setSide }) => {
  const cubeRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    window.addEventListener('click', rotate);
    return () => window.removeEventListener('click', rotate);
  });

  const rotate = () => {
    if (cubeRef.current) {
      gsap.to(cubeRef.current?.position, {
        z: -5,
        duration: 1,
        ease: 'slow',
      });
      gsap.to(cubeRef.current?.position, {
        z: 0,
        duration: 1,
        delay: 1,
        ease: 'slow',
      });
      setSide((side + 1) % 6);
      gsap.to(cubeRef.current.rotation, {
        x: cubeRef.current.rotation.x + Math.PI,
        y: cubeRef.current.rotation.y + Math.PI,
        duration: 2,
      });
    }
  };

  const getXYRotation = (x: number, y: number) => {
    return [, y + Math.PI];
  };

  return (
    <>
      <mesh ref={cubeRef} receiveShadow>
        <RoundedBox radius={0.05} receiveShadow>
          <MeshReflectorMaterial
            blur={[500, 400]}
            resolution={1024}
            mixBlur={0.5}
            mixStrength={0.5}
            depthScale={2}
            minDepthThreshold={5}
            color='#444'
            metalness={0.4}
            roughness={0.1}
            mirror={0.6}
          />
        </RoundedBox>
      </mesh>
    </>
  );
};

export default Cube;
