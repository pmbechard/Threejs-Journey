import React, { useEffect, useMemo, useRef, useState } from 'react';
import { button, useControls } from 'leva';
import { Perf } from 'r3f-perf';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  InstancedRigidBodies,
  CylinderCollider,
  BallCollider,
  CuboidCollider,
  Debug,
  RigidBody,
  Physics,
} from '@react-three/rapier';

import * as THREE from 'three';

const App = () => {
  const sphereRef = useRef();
  const torusRef = useRef();
  const cubeRef = useRef();
  const twisterRef = useRef();

  const [hitSound] = useState(() => new Audio('./hit.mp3'));

  // const resetPositions = () => {
  //   sphereRef.current.setTranslation({ x: -1.5, y: 2, z: 0 });
  //   cubeRef.current.setTranslation({ x: 1.5, y: 2, z: 0 });
  // };

  const cubeJump = () => {
    const mass = cubeRef.current.mass();
    cubeRef.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 });
    cubeRef.current.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    });
  };

  const { showDebug } = useControls(
    {
      showDebug: { value: false },
      //   resetPositions: button(() => {
      //     resetPositions();
      //   }),
      //   gravity: { value: -9.08, min: -15, max: 15, step: 1 },
      //   bounciness: { value: 0.5, min: 0, max: 5, step: 0.25 },
    },
    { collapsed: true }
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const euler = new THREE.Euler(0, time * 3, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(euler);
    twisterRef.current.setNextKinematicRotation(quaternion);

    twisterRef.current.setNextKinematicTranslation({
      x: Math.cos(time) * 2,
      y: -0.8,
      z: Math.sin(time) * 2,
    });
  });

  const collisionEnter = () => {
    hitSound.currentTime = 0;
    hitSound.volume = Math.random();
    hitSound.play();
  };

  const hamburger = useGLTF('./hamburger.glb');

  // INSTANCED CUBES
  const cubesCount = 50;
  const cubesRef = useRef();
  const cubeTransforms = useMemo(() => {
    const scale = 0.2 + Math.random * 0.8;
    const instances = Array.from({ length: cubesCount }).map((_, index) => ({
      key: 'instance_' + index,
      position: [
        (Math.random() - 0.5) * 8,
        6 + index * 0.2,
        (Math.random() - 0.5) * 8,
      ],
      rotation: [Math.random(), Math.random(), Math.random()],
      scale: [scale, scale, scale],
    }));

    return { instances };
  }, []);

  // useEffect(() => {
  //   for (let i = 0; i < cubesCount; i++) {
  //     const matrix = new THREE.Matrix4();
  //     matrix.compose(
  //       new THREE.Vector3(i * 2, 0, 0),
  //       new THREE.Quaternion(),
  //       new THREE.Vector3(1, 1, 1)
  //     );
  //     cubesRef.current.setMatrixAt(i, matrix);
  //   }
  // }, []);

  return (
    <>
      <Perf position={'top-left'} />

      <OrbitControls makeDefault />

      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />

      <Physics gravity={[0, -9.08, 0]}>
        {showDebug && <Debug />}
        <RigidBody ref={sphereRef} colliders={'ball'} position={[-1.5, 2, 0]}>
          <mesh castShadow>
            <sphereGeometry />
            <meshStandardMaterial color={'yellow'} />
          </mesh>
        </RigidBody>

        {/* <RigidBody colliders={'trimesh'}>
          <mesh
            ref={torusRef}
            castShadow
            position={[0, 1, -0.25]}
            rotation={[Math.PI * 0.4, 0, 0]}
          >
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color={'mediumpurple'} />
          </mesh>
        </RigidBody> */}

        {/* <RigidBody
          colliders={false}
          position={[0, 1, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        > */}
        {/* <CuboidCollider args={[1.5, 1.5, 0.5]} />
          <CuboidCollider
            args={[0.25, 1, 0.25]}
            position={[0, 0, 1]}
            rotation={[-Math.PI * 0.35, 0, 0]}
          /> */}
        {/* <BallCollider args={[1.5]} />
          <mesh ref={torusRef} castShadow>
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color={'mediumpurple'} />
          </mesh> */}
        {/* </RigidBody> */}

        <RigidBody
          ref={cubeRef}
          position={[1.5, 2, 0]}
          gravityScale={1}
          restitution={0.5}
          friction={0.7}
          colliders={false}
        >
          <mesh castShadow onClick={() => cubeJump()}>
            <boxGeometry />
            <meshStandardMaterial color={'mediumpurple'} />
          </mesh>
          <CuboidCollider args={[0.5, 0.5, 0.5]} mass={0.5} />
        </RigidBody>

        <RigidBody
          type={'fixed'}
          friction={0.7}
          onCollisionEnter={collisionEnter}
          // onCollisionExit={() => console.log('exit')}
          onSleep={() => console.log('sleep')}
          onWake={() => console.log('wake')}
        >
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color={'greenyellow'} />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={twisterRef}
          position={[0, -0.8, 0]}
          friction={0}
          type='kinematicPosition'
        >
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color='red' />
          </mesh>
        </RigidBody>

        <RigidBody position={[0, 4, 0]} colliders={false}>
          <primitive object={hamburger.scene} scale={0.25} />
          <CylinderCollider args={[0.5, 1.25]} />
        </RigidBody>

        {/* WALLS */}
        <RigidBody type='fixed'>
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>

        {/* INSTANCED MESH */}
        <InstancedRigidBodies instances={cubeTransforms.instances}>
          <instancedMesh
            ref={cubesRef}
            castShadow
            receiveShadow
            args={[null, null, cubesCount]}
          >
            <boxGeometry />
            <meshStandardMaterial color='tomato' />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
};

export default App;
