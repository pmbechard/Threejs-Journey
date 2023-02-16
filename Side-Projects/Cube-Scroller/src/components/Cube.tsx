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
      let [x, y] = getXYRotation();
      gsap.to(cubeRef.current.rotation, { x, y, duration: 2 });
    }
  };

  const getXYRotation = () => {
    setSide((side + 1) % 6);
    if (side === 0) return [0, 0];
    else if (side === 3) return [0, Math.PI / 2];
    else if (side === 1) return [0, Math.PI];
    else if (side === 5) return [0, Math.PI * 1.5];
    else if (side === 2) return [Math.PI / 2, 0];
    else if (side === 4) return [-Math.PI / 2, 0];
    return [0, 0];
  };

  return (
    <>
      <mesh ref={cubeRef} receiveShadow>
        <RoundedBox radius={0.05} receiveShadow>
          <MeshReflectorMaterial
            blur={[50, 400]}
            resolution={4096}
            mixBlur={0.5}
            mixStrength={5}
            depthScale={2}
            minDepthThreshold={2}
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
