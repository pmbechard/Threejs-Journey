import { Text } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Mesh } from 'three';
import Name from './pages/Name';
import About from './pages/About';
import Project1 from './pages/Project1';
import Project2 from './pages/Project2';
import Project3 from './pages/Project3';
import Contact from './pages/Contact';

interface Props {
  side: number;
}

const Contents: React.FC<Props> = ({ side }) => {
  const textRef = useRef<Mesh>(null);
  // const [text, setText] = useState<String>('Peyton Bechard');

  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current.position, { y: -3, duration: 0.5 });
      gsap.to(textRef.current.position, { y: 0, duration: 1, delay: 1.5 });
    }
    // setTimeout(() => {
    //   if (side == 0) setText('Peyton Bechard');
    //   else if (side == 1) setText('About Me');
    //   else if (side == 2) setText('Project 1');
    //   else if (side == 3) setText('Project 2');
    //   else if (side == 4) setText('Project 3');
    //   else setText('Contact');
    // }, 750);
  }, [side]);

  return (
    <>
      {/* <Text ref={textRef} fontSize={0.05} position={[0, -3, 0.8]}>
        {text}
        <meshStandardMaterial color={'mediumpurple'} />
      </Text> */}
      {side == 0 && <Name textRef={textRef} />}
      {side == 1 && <About textRef={textRef} />}
      {side == 2 && <Project1 textRef={textRef} />}
      {side == 3 && <Project2 textRef={textRef} />}
      {side == 4 && <Project3 textRef={textRef} />}
      {side == 5 && <Contact textRef={textRef} />}
    </>
  );
};

export default Contents;
