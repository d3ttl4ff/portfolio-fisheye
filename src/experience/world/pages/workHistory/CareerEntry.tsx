import { memo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

import { COLORS } from '@/experience/lib/colors';
import { CareerEntry as CareerEntryType } from '@/experience/lib/careerData';
import CareerText from './CareerText';

type Props = {
  index: number;
  career: CareerEntryType;
  y: number;
  clippingPlanes: THREE.Plane[];
};

// Suppliments
const PulsatingDot = () => {
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;

    const duration = 1.5; // Time for one complete pulse
    const progress = (clock.getElapsedTime() % duration) / duration;

    // Expand from original size to maximum size
    const scale = 0 + progress * 4.5;
    pulseRef.current?.scale.setScalar(scale);

    // Fade out as it expands
    const material = pulseRef.current?.material as THREE.MeshBasicMaterial;
    material.opacity = 0.7 * (1 - progress);

    if (pulseRingRef.current) {
      pulseRingRef.current.rotation.z += 0.03;
    }
  });

  return (
    <group>
      {/* Expanding, fading ring */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.009, 16, 16]} />
        <meshBasicMaterial
          color={COLORS.COLORI}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* Solid center dot */}
      <mesh ref={pulseRingRef}>
        <ringGeometry args={[0.0145, 0.018, 8, 8, 1, 5]} />
        <meshBasicMaterial color={COLORS.COLORI} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.006, 16, 16]} />
        <meshBasicMaterial color={COLORS.COLORI} />
      </mesh>
    </group>
  );
};

const TimelineDot = ({ active }: { active: boolean }) => {
  return active ? (
    <PulsatingDot />
  ) : (
    <group>
      <mesh>
        <ringGeometry args={[0.0145, 0.018, 8, 8, 1]} />
        <meshBasicMaterial color={COLORS.COLORII} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.006, 16, 16]} />
        <meshBasicMaterial color={COLORS.COLORII} />
      </mesh>
    </group>
  );
};

// Main
const CareerEntry = memo(({ index, career, y, clippingPlanes }: Props) => {
  const entryRef = useRef<THREE.Group>(null);
  const companyTextWidth = Math.max(0.1, career.company.length * 0.0185 + 0.08);

  const zPos = -0.01;

  const positionWidth = 0.9;
  const positionDividerWidth = 0.35;
  const dateWidth = 0.5;
  const companyWidth = 0.6;

  const descriptionText = career.desc
    .map((description) => `•  ${description}`)
    .join('\n');

  return (
    <group ref={entryRef} position={[0, y, 0]}>
      {/* Position and dates */}
      <group>
        <group position={[-1.04, 0, 0.01]}>
          <TimelineDot active={career.endDate.toLowerCase() == 'current'} />
        </group>

        <mesh position={[positionWidth / 2 - 1, 0, zPos]}>
          <RoundedBox
            args={[positionWidth, 0.08, 0.01]}
            radius={0.005}
            smoothness={2}
            bevelSegments={2}
          >
            <meshBasicMaterial
              color={
                career.endDate.toLowerCase() == 'current'
                  ? COLORS.COLORI
                  : COLORS.COLORII
              }
            />
          </RoundedBox>
        </mesh>

        <CareerText
          position={[-0.97, 0, 0]}
          fontSize={0.06}
          color={COLORS.BLACK}
        >
          {career.position.toUpperCase()}
        </CareerText>

        <mesh position={[positionDividerWidth / 2 - 0.05, 0, -0.01]}>
          <planeGeometry args={[positionDividerWidth, 0.005]} />
          <meshBasicMaterial
            color={
              career.endDate.toLowerCase() == 'current'
                ? COLORS.COLORI
                : COLORS.COLORII
            }
          />
        </mesh>

        <CareerText
          position={[dateWidth / 2 + 0.6, 0, -0.05]}
          fontSize={0.055}
          color={
            career.endDate.toLowerCase() == 'current'
              ? COLORS.COLORI
              : COLORS.COLORII
          }
          anchorX="right"
        >
          {`${career.startDate.toUpperCase()}  -  ${career.endDate.toUpperCase()}`}
        </CareerText>
      </group>

      {/* Company and work mode */}
      <group position={[-0.99, -0.075, 0]}>
        <CareerText
          font="Blender Pro Medium.ttf"
          fontSize={0.05}
          color={
            career.endDate.toLowerCase() == 'current'
              ? COLORS.COLORI
              : COLORS.COLORII
          }
        >
          {`@`}
        </CareerText>

        <mesh position={[companyTextWidth / 2 + 0.04, 0, zPos]}>
          <RoundedBox
            args={[companyTextWidth, 0.05, 0.01]}
            radius={0.005}
            smoothness={2}
            bevelSegments={2}
          >
            <meshBasicMaterial color={COLORS.WHITE} />
          </RoundedBox>
        </mesh>

        <group position={[0.065, 0, 0]}>
          <CareerText fontSize={0.045} color={COLORS.BLACK}>
            {career.company}
          </CareerText>
        </group>

        {/* Work mode */}
        <group position={[0.08 + companyTextWidth, 0, 0]}>
          <CareerText
            position={[-0.015, 0, 0]}
            font="Blender Pro Medium.ttf"
            fontSize={0.045}
            color={COLORS.WHITE}
          >
            {career.mode.toLowerCase() === 'remote'
              ? '📡'
              : career.mode.toLowerCase() === 'hybrid'
                ? '🛸'
                : '🚕'}
          </CareerText>

          <group position={[0.055, 0, 0]}>
            <CareerText
              font="Blender Pro Medium.ttf"
              fontSize={0.045}
              color={COLORS.WHITE}
            >
              {`${career.mode}`}
            </CareerText>
          </group>
        </group>

        <group position={[dateWidth / 2 + 0.6 + 1, 0, -0.05]}>
          <CareerText
            position={[0, 0, 0]}
            font={'Blender Pro Medium.ttf'}
            fontSize={0.045}
            color={
              career.endDate.toLowerCase() == 'current'
                ? COLORS.COLORI
                : COLORS.COLORII
            }
            anchorX="right"
          >
            {`${career.location.toUpperCase()} ◌ ${career.country}`}
          </CareerText>
        </group>
      </group>

      {/* Description - one text mesh instead of several */}
      <group position={[-1, -0.14, 0]}>
        <CareerText
          position={[0.05, 0, 0]}
          font="Blender Pro Medium.ttf"
          fontSize={0.04}
          color={COLORS.WHITE}
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
