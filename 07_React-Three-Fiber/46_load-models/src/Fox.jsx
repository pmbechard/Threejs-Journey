import React, { useEffect } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useControls } from 'leva';

const Fox = () => {
  const fox = useGLTF('/Fox/glTF-Binary/Fox.glb');
  const animation = useAnimations(fox.animations, fox.scene);

  const { animationName } = useControls({
    animationName: { options: animation.names },
  });

  useEffect(() => {
    const action = animation.actions[animationName];
    action.reset().fadeIn(0.5).play();
    return () => {
      action.fadeOut(0.5);
    };
  }, [animationName]);

  return (
    <primitive
      object={fox.scene}
      scale={0.02}
      position={[-2.5, -1, 2.5]}
      rotation-y={0.3}
    />
  );
};

export default Fox;
useGLTF.preload('/Fox/glTF-Binary/Fox.glb');
