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

const PulsatingDot = () => {
  const pulseRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!pulseRef.current) return;
    const progress = (clock.getElapsedTime() % 1.5) / 1.5;
    pulseRef.current.scale.setScalar(progress * 4.5);
    (pulseRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.7 * (1 - progress);
    if (ringRef.current) ringRef.current.rotation.z += delta * 1.8; // delta-corrected
  });

  return (
    <group>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.009, 12, 12]} />
        <meshBasicMaterial
          color={COLORS.COLORI}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.0145, 0.018, 8, 8, 1, 5]} />
        <meshBasicMaterial color={COLORS.COLORI} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.006, 12, 12]} />
        <meshBasicMaterial color={COLORS.COLORI} />
      </mesh>
    </group>
  );
};

const TimelineDot = ({ active }: { active: boolean }) =>
  active ? (
    <PulsatingDot />
  ) : (
    <group>
      <mesh>
        <ringGeometry args={[0.0145, 0.018, 8, 8, 1]} />
        <meshBasicMaterial color={COLORS.COLORII} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.006, 12, 12]} />
        <meshBasicMaterial color={COLORS.COLORII} />
      </mesh>
    </group>
  );

const CareerEntry = memo(({ career, y, clippingPlanes }: Props) => {
  const active = career.endDate.toLowerCase() === 'current';
  const statusColor = active ? COLORS.COLORI : COLORS.COLORII;

  const companyTextWidth = Math.max(0.1, career.company.length * 0.0185 + 0.08);
  const positionWidth = 0.9;
  const positionDividerWidth = 0.35;
  const dateWidth = 0.5;
  const descriptionText = career.desc.map((d) => `•  ${d}`).join('\n');

  return (
    <group position={[0, y, 0]}>
      {/* Row 1: Position + dates */}
      <group>
        <group position={[-1.04, 0, 0.01]}>
          <TimelineDot active={active} />
        </group>

        <mesh position={[positionWidth / 2 - 1, 0, -0.01]}>
          <RoundedBox
            args={[positionWidth, 0.08, 0.01]}
            radius={0.005}
            smoothness={2}
            bevelSegments={2}
          >
            <meshBasicMaterial color={statusColor} />
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
          <planeGeometry args={[positionDividerWidth, 0.003]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>

        <CareerText
          position={[dateWidth / 2 + 0.6, 0, -0.05]}
          fontSize={0.055}
          color={statusColor}
          anchorX="right"
        >
          {`${career.startDate.toUpperCase()}  -  ${career.endDate.toUpperCase()}`}
        </CareerText>
      </group>

      {/* Row 2: Company + work mode */}
      <group position={[-0.99, -0.075, 0]}>
        <CareerText
          font="Blender Pro Medium.ttf"
          fontSize={0.05}
          color={statusColor}
        >
          {'@'}
        </CareerText>

        <mesh position={[companyTextWidth / 2 + 0.04, 0, -0.01]}>
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

        <group position={[0.08 + companyTextWidth, 0, 0]}>
          <CareerText
            position={[-0.015, 0, 0]}
            font="Blender Pro Medium.ttf"
            fontSize={0.045}
            color={COLORS.WHITE}
          >
            {career.mode === 'Remote'
              ? '📡'
              : career.mode === 'Hybrid'
                ? '🛸'
                : '🚕'}
          </CareerText>
          <group position={[0.055, 0, 0]}>
            <CareerText
              font="Blender Pro Medium.ttf"
              fontSize={0.045}
              color={COLORS.WHITE}
            >
              {career.mode}
            </CareerText>
          </group>
        </group>

        <CareerText
          position={[dateWidth / 2 + 0.6 + 1, 0, -0.05]}
          font="Blender Pro Medium.ttf"
          fontSize={0.045}
          color={statusColor}
          anchorX="right"
        >
          {`${career.location.toUpperCase()} ◌ ${career.country}`}
        </CareerText>
      </group>

      {/* Row 3: Description */}
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
