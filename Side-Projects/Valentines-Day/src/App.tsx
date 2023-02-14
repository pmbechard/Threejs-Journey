import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import './App.css';
import Card from './components/Card';
import Hearts from './components/Hearts';

function App() {
  return (
    <>
      <OrbitControls />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Float
        speed={0.5} // Animation speed, defaults to 1
        rotationIntensity={1} // XYZ rotation intensity, defaults to 1
        floatIntensity={0.5} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
        floatingRange={[-1, 1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
      >
        <Card />
      </Float>
      <Hearts />
      <Sparkles speed={1} scale={20} size={10} color={'greenyellow'} />
    </>
  );
}

export default App;
