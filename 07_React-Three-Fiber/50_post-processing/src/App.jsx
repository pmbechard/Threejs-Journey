import { Perf } from 'r3f-perf';
import { OrbitControls } from '@react-three/drei';
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Glitch,
  Noise,
  SSR,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { useControls } from 'leva';

const App = () => {
  const ssrProps = useControls(
    'SSR Effect',
    {
      temporalResolve: true,
      STRETCH_MISSED_RAYS: true,
      USE_MRT: true,
      USE_NORMALMAP: true,
      USE_ROUGHNESSMAP: true,
      ENABLE_JITTERING: true,
      ENABLE_BLUR: true,
      temporalResolveMix: { value: 0.9, min: 0, max: 1 },
      temporalResolveCorrectionMix: { value: 0.25, min: 0, max: 1 },
      maxSamples: { value: 0, min: 0, max: 1 },
      resolutionScale: { value: 1, min: 0, max: 1 },
      blurMix: { value: 0.5, min: 0, max: 1 },
      blurKernelSize: { value: 8, min: 0, max: 8 },
      blurSharpness: { value: 0.5, min: 0, max: 1 },
      rayStep: { value: 0.3, min: 0, max: 1 },
      intensity: { value: 1, min: 0, max: 5 },
      maxRoughness: { value: 0.1, min: 0, max: 1 },
      jitter: { value: 0.7, min: 0, max: 5 },
      jitterSpread: { value: 0.45, min: 0, max: 1 },
      jitterRough: { value: 0.1, min: 0, max: 1 },
      roughnessFadeOut: { value: 1, min: 0, max: 1 },
      rayFadeOut: { value: 0, min: 0, max: 1 },
      MAX_STEPS: { value: 20, min: 0, max: 20 },
      NUM_BINARY_SEARCH_STEPS: { value: 5, min: 0, max: 10 },
      maxDepthDifference: { value: 3, min: 0, max: 10 },
      maxDepth: { value: 1, min: 0, max: 1 },
      thickness: { value: 10, min: 0, max: 10 },
      ior: { value: 1.45, min: 0, max: 2 },
    },
    { collapsed: true }
  );

  return (
    <>
      <Perf position={'top-left'} />
      <OrbitControls makeDefault />

      <color args={['#ffffff']} attach={'background'} />

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

        {/* NOTE: must deactivate tone mapping and set rgb values > 1 
        on objects to see effect of Bloom */}
        {/* <Bloom mipmapBlur intensity={0.1} luminanceThreshold={0} /> */}

        {/* <DepthOfField
          focusDistance={0.025}
          focalLength={0.025}
          bokehScale={6}
        /> */}

        {/* <SSR {...ssrProps} /> */}
      </EffectComposer>

      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />

      <mesh position-x={2} scale={1.5}>
        <boxGeometry />

        <meshStandardMaterial color={'mediumpurple'} />

        {/* NOTE: For Bloom */}
        {/* <meshStandardMaterial
          color={'#ffffff'}
          emissive={'orange'}
          emissiveIntensity={10}
          toneMapped={false}
        /> */}

        {/* NOTE: Use with bloom to get uniform emission not effected by light sources */}
        {/* <meshBasicMaterial
          color={[1.5 * 10, 1 * 10, 4 * 10]}
          toneMapped={false}
        /> */}
      </mesh>

      <mesh position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color={'orange'} />
      </mesh>

      <mesh rotation-x={Math.PI / -2} position-y={-1} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color={'greenyellow'} />
        {/* NOTE: for SSR Reflections */}
        {/* <meshStandardMaterial color={'#000000'} roughness={0} metalness={0} /> */}
      </mesh>
    </>
  );
};

export default App;
