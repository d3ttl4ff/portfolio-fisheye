'use client';

import { StrictMode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Fisheye } from '../../experience/lib/MyFisheye';
import { LevaPane } from '../../experience/common';
import PreloadCareerFonts from '../../experience/world/pages/workHistory/PreloadCareerFonts';
import Experience from '../../experience/Experience';

const Scene = () => {
  return (
    <div className="relative h-screen">
      <StrictMode>
        <LevaPane />
        <PreloadCareerFonts />

        <Canvas
          camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 2.8] }}
          gl={{ antialias: true, alpha: true }}
        >
          <Fisheye zoom={1.5} resolution={4096} segments={512}>
            <Experience />
          </Fisheye>
        </Canvas>
      </StrictMode>
    </div>
  );
};

export default Scene;
