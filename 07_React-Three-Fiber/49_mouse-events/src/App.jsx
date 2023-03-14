import { Perf } from 'r3f-perf';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, meshBounds, useGLTF } from '@react-three/drei';
import { useRef } from 'react';

export default function Experience() {
  const cube = useRef();
  const sphere = useRef();

  const hamburger = useGLTF('./hamburger.glb');

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  const clickHandler = (e) => {
    console.log(e.distance);
    cube.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  };

  const leftClickHandler = () => {
    // also works for long press on mobile
    console.log('left click');
  };

  const doubleClickHandler = () => {
    console.log('double click');
  };

  // --> CURSOR POINTER
  // -> Can also use useCursor helper from drei
  const cursorEnter = (e) => {
    document.body.style.cursor = 'pointer';
  };
  const cursorLeave = (e) => {
    document.body.style.cursor = 'default';
  };

  const hoverHandler = () => {
    // NOTE: can also use onPointerEnter={}
    sphere.current.material.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  };

  // --> OTHER INTERESTING EVENT LISTENERS
  // -> onPointerLeave
  // -> onPointerMiss (click event outside of target object)
  // -> onPointerMove

  // --> ADD CLICK LISTENER TO SPHERE TO STOP PROPAGATION OF EVENT
  // --> IN OTHER WORDS, IT WILL OCCLUDE THE CUBE WHEN IT'S COVERED
  // --> BY THE SPHERE
  const stopPropagationAtSphere = (e) => {
    e.stopPropagation();
  };

  // NOTE: use meshBounds helper from drei to improve performance on
  // complex object - it creates a bound sphere around the object that
  // is used for event listening instead of the object itself
  // less precision but better performance
  // Check cube raycast attribute for example
  // Use the useBVH helper from drei for VERY complex geometries that
  // require precision

  return (
    <>
      <Perf position={'top-left'} />

      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <mesh
        ref={sphere}
        position-x={-2}
        onClick={stopPropagationAtSphere}
        onPointerOver={hoverHandler}
      >
        <sphereGeometry />
        <meshStandardMaterial color='orange' />
      </mesh>

      <mesh
        ref={cube}
        raycast={meshBounds}
        position-x={2}
        scale={1.5}
        onPointerEnter={cursorEnter}
        onPointerLeave={cursorLeave}
        onClick={clickHandler}
        onContextMenu={leftClickHandler}
        onDoubleClick={doubleClickHandler}
      >
        <boxGeometry />
        <meshStandardMaterial color='mediumpurple' />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color='greenyellow' />
      </mesh>

      <primitive
        object={hamburger.scene}
        scale={0.25}
        position-y={1}
        onClick={(e) => {
          console.log(e.object.name);
          e.stopPropagation();
        }}
        onPointerEnter={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'default';
        }}
      />
    </>
  );
}
useGLTF.preload('./hamburger.glb');
