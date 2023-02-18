import { MeshTransmissionMaterial, Text } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Mesh } from 'three';

interface Props {
  side: number;
}

const Contents: React.FC<Props> = ({ side }) => {
  const textRef = useRef<Mesh>(null);
  const bgRef = useRef<Mesh>(null);
  const [text, setText] = useState<String>('Peyton Bechard');

  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current.position, { y: -3, duration: 0.5 });
      gsap.to(textRef.current.position, { y: 0, duration: 1, delay: 1.5 });
    }
    if (bgRef.current) {
      gsap.to(bgRef.current.scale, { x: 1, y: 0, duration: 0.1 });
      gsap.to(bgRef.current.scale, { x: 0, y: 0, duration: 0.1, delay: 0.1 });
      gsap.to(bgRef.current.scale, { x: 1, y: 1, duration: 0.1, delay: 1.8 });
    }
    if (side == 0) setText('Peyton Bechard');
    else if (side == 1) setText('About Me');
    else if (side == 2) setText('Project 1');
    else if (side == 3) setText('Project 2');
    else if (side == 4) setText('Project 3');
    else setText('Contact');
  }, [side]);

  return (
    <>
      <mesh ref={bgRef} position={[0, 0, 0.6]} rotation={[Math.PI * -2, 0, 0]}>
        <planeGeometry args={[1.1, 1.1, 16, 16]} />
        <MeshTransmissionMaterial
          transmission={3}
          distortionScale={3}
          temporalDistortion={3}
          wireframe
          color={'#003300'}
        />
      </mesh>
      <Text ref={textRef} fontSize={0.05} position={[0, -3, 0.8]}>
        {text}
        <meshStandardMaterial color={'mediumpurple'} />
      </Text>
    </>
  );
};

export default Contents;
