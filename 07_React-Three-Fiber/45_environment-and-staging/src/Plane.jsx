const Plane = () => {
  return (
    <mesh position-y={-1} rotation-x={Math.PI / -2} scale={10}>
      <planeGeometry />
      <meshStandardMaterial color='yellowgreen' />
    </mesh>
  );
};

export default Plane;
