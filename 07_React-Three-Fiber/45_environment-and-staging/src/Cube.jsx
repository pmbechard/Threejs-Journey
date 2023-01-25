const Cube = () => {
  return (
    <mesh position-x={2} scale={1.5}>
      <boxGeometry />
      <meshStandardMaterial color='mediumpurple' />
    </mesh>
  );
};

export default Cube;
