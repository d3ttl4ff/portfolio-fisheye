import { memo, useEffect, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

import { CareerEntry as CareerEntryType } from './careerData';
import CareerText from './CareerText';

const GREEN = '#729252';
const BLACK = '#060e17';
const WHITE = '#ffffff';

type Props = {
  career: CareerEntryType;
  y: number;
  clippingPlanes: THREE.Plane[];
};

const CareerEntry = memo(({ career, y, clippingPlanes }: Props) => {
  const entryRef = useRef<THREE.Group>(null);

  const zPos = -0.01;

  const positionWidth = 0.9;
  const positionDividerWidth = 0.35;
  const dateWidth = 0.5;
  const companyWidth = 0.6;

  useEffect(() => {
    const entry = entryRef.current;

    if (!entry) return;

    entry.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        material.clippingPlanes = clippingPlanes;
        material.clipIntersection = false;
        material.needsUpdate = true;
      });
    });

    return () => {
      entry.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          material.clippingPlanes = null;
          material.needsUpdate = true;
        });
      });
    };
  }, [clippingPlanes]);

  const descriptionText = career.desc
    .map((description) => `•  ${description}`)
    .join('\n');

  return (
    <group ref={entryRef} position={[0, y, 0]}>
      {/* Position and dates */}
      <group>
        <mesh position={[positionWidth / 2 - 1, 0, zPos]}>
          <RoundedBox
            args={[positionWidth, 0.08, 0.01]}
            radius={0.008}
            smoothness={2}
            bevelSegments={2}
          >
            <meshBasicMaterial color={GREEN} />
          </RoundedBox>
        </mesh>

        <CareerText position={[-0.95, 0, 0]} fontSize={0.06} color={BLACK}>
          {career.position.toUpperCase()}
        </CareerText>

        <mesh position={[positionDividerWidth / 2 - 0.05, 0, -0.01]}>
          <planeGeometry args={[positionDividerWidth, 0.005]} />
          <meshBasicMaterial color={GREEN} />
        </mesh>

        <CareerText
          position={[dateWidth / 2 + 0.6, 0, -0.05]}
          fontSize={0.055}
          color={GREEN}
          anchorX="right"
        >
          {`${career.startDate.toUpperCase()}  -  ${career.endDate.toUpperCase()}`}
        </CareerText>
      </group>

      {/* Company and work mode */}
      <group position={[-1, -0.08, 0]}>
        <CareerText font="Blender Pro Medium.ttf" fontSize={0.06} color={WHITE}>
          @
        </CareerText>

        <mesh position={[companyWidth / 2 + 0.05, 0, zPos]}>
          <RoundedBox
            args={[companyWidth, 0.06, 0.01]}
            radius={0.008}
            smoothness={2}
            bevelSegments={2}
          >
            <meshBasicMaterial color={WHITE} />
          </RoundedBox>
        </mesh>

        <group position={[0.08, 0, 0]}>
          <CareerText fontSize={0.05} color={BLACK}>
            {career.company}
          </CareerText>
        </group>

        <group position={[0.68, 0, 0]}>
          <CareerText
            font="Blender Pro Medium.ttf"
            fontSize={0.05}
            color={WHITE}
          >
            {career.mode}
          </CareerText>
        </group>
      </group>

      {/* Description - one text mesh instead of several */}
      <group position={[-1, -0.14, 0]}>
        <CareerText
          position={[0.05, 0, 0]}
          font="Blender Pro Medium.ttf"
          fontSize={0.04}
          color={WHITE}
          anchorY="top"
        >
          {descriptionText}
        </CareerText>
      </group>
    </group>
  );
});

CareerEntry.displayName = 'CareerEntry';

export default CareerEntry;
