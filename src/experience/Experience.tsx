import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Group } from 'three';

import { Panel } from './world';

const Experience = () => {
  const groupRef = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const smoothness = 1 - Math.exp(-8 * delta);
    groupRef.current.rotation.y +=
      (-pointer.x * 0.08 - groupRef.current.rotation.y) * smoothness;
    groupRef.current.rotation.x +=
      (pointer.y * 0.08 - groupRef.current.rotation.x) * smoothness;
  });

  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
      />
      <group ref={groupRef}>
        <Panel />
      </group>
    </>
  );
};

export default Experience;
