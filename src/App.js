import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { BoxGeometry } from "three";

function Plane() {
  const mesh = useRef();
  useFrame((state, delta) => {
    // mesh.current.rotation.x += 0.001;
    mesh.current.rotation.y += 0.01;
  });
  const box = useRef(new BoxGeometry(6, 12, 1, 6, 8, 1));
  return (
    <mesh ref={mesh}>
      <edgesGeometry args={[box.current]} />
      <lineBasicMaterial color="white" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas camera={{ fov: 75, near: 2, far: 18, position: [0, 0, 10] }} frameloop="demand">
      <Plane />
    </Canvas>
  );
}
