import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Group } from 'three';

import { Lights } from './environment';
import { Panel } from './world';

const Experience = () => {
  const groupRef = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // mouse position (-1 to 1)
    const mouseX = pointer.x;
    const mouseY = pointer.y;

    // target rotation
    const targetRotationY = -mouseX * 0.08;
    const targetRotationX = mouseY * 0.08;

    // smooth interpolation
    const smoothness = 1 - Math.exp(-8 * delta);

    groupRef.current.rotation.y +=
      (targetRotationY - groupRef.current.rotation.y) * smoothness;

    groupRef.current.rotation.x +=
      (targetRotationX - groupRef.current.rotation.x) * smoothness;
  });

  return (
    <>
      {/* <color args={['#05070f']} attach="background" /> */}

      {/* <Effects /> */}

      {/* <PerformenceMonitor /> */}

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
      />

      {/* Environment */}
      {/* <Lights /> */}
      {/* <EnvironmentMap /> */}

      {/* World */}
      <group ref={groupRef}>
        <Panel />
      </group>
    </>
  );
};

export default Experience;
