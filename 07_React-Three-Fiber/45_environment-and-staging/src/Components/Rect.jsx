const Rect = () => {
  return (
    <mesh position-z={-5} scale={10}>
      <planeGeometry />
      <meshBasicMaterial color={[1, 0, 0]} />
    </mesh>
  );
};

export default Rect;
