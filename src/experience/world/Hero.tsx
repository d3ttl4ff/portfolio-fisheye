import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

const Hero = () => {
  const cubeRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!cubeRef.current) return;
    cubeRef.current.rotation.x += delta * 0.4;
    cubeRef.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[0.7, 0.7, 0.7]} />
      <meshNormalMaterial />
    </mesh>
  );
};

export default Hero;
