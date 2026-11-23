'use client';

import { StrictMode } from 'react';
import { Canvas } from '@react-three/fiber';
// import { Fisheye } from '@react-three/drei';
import { Fisheye } from '../../experience/lib/MyFisheye';

import Experience from '../../experience/Experience';
import { LevaPane } from '../../experience/common';
import { Effects } from '../../experience/post-process';

import PreloadCareerFonts from '../../experience/world/pages/workHistory/PreloadCareerFonts';

const Scene = () => {
  return (
    <div className="relative h-screen">
      <StrictMode>
        <LevaPane />

        <PreloadCareerFonts />

        <Canvas
          camera={{
            fov: 45,
            near: 0.1,
            far: 100,
            position: [0, 0, 3.5],
          }}
          gl={{ antialias: true }}
        >
          {/* experience */}
          <Fisheye zoom={2} resolution={4096} segments={512}>
            <Experience />
          </Fisheye>

          {/* post-process */}
          {/* <Effects /> */}
        </Canvas>
      </StrictMode>
    </div>
  );
};

export default Scene;
