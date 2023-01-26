const Sphere = ({ envMapIntensity }) => {
  return (
    <mesh position-x={-2} position-y={1} castShadow>
      <sphereGeometry />
      <meshStandardMaterial color='orange' envMapIntensity={envMapIntensity} />
    </mesh>
  );
};

export default Sphere;
