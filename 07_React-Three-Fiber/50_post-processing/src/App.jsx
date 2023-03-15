import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';
import {
  EffectComposer,
  Glitch,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';

const App = () => {
  return (
    <>
      <Perf position={'top-left'} />
      <OrbitControls makeDefault />

      <color arg={['#ffffff']} attach={'background'} />

      <EffectComposer multisampling={8}>
        {/* <Vignette
          offset={0.3}
          darkness={0.9}
          blendFunction={BlendFunction.NORMAL}
        /> */}

        {/* <Glitch
          delay={[0.5, 1]}
          duration={[0.1, 0.3]}
          strength={[0.2, 0.4]}
          mode={GlitchMode.SPORADIC}
        /> */}

        {/* <Noise premultiply blendFunction={BlendFunction.AVERAGE} /> */}

        
      </EffectComposer>

      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />

      <mesh position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color={'mediumpurple'} />
      </mesh>

      <mesh position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color={'orange'} />
      </mesh>

      <mesh rotation-x={Math.PI / -2} position-y={-1} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color={'greenyellow'} />
      </mesh>
    </>
  );
};

export default App;
