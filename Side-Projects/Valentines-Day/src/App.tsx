import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import './App.css';
import Card from './components/Card';
import Hearts from './components/Hearts';

function App() {
  return (
    <>
      <OrbitControls />
      <directionalLight position={[-3, -2, 1]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Float
        speed={1}
        rotationIntensity={1}
        floatIntensity={0.5}
        floatingRange={[-1, 1]}
      >
        <Card />
      </Float>
      <Hearts />
      <Sparkles speed={1} scale={20} size={10} color={'white'} />
    </>
  );
}

export default App;
