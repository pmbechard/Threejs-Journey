const Plane = ({ envMapIntensity }) => {
  return (
    <mesh position-y={0} rotation-x={Math.PI / -2} scale={10}>
      <planeGeometry />
      <meshStandardMaterial
        color='yellowgreen'
        envMapIntensity={envMapIntensity}
      />
    </mesh>
  );
};

export default Plane;
