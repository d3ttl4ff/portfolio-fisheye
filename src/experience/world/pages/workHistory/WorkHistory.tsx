import {
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { COLORS } from '@/experience/lib/colors';
import { careers } from '@/experience/lib/careerData';
import CareerEntry from './CareerEntry';

const VIEWPORT_HEIGHT = 1.5;
const ENTRY_SPACING = 0.4;
const ENTRY_HEIGHT = 0.4;
const SCROLL_SPEED = 0.0015;
const SCROLL_SMOOTHING = 12;
const VISIBLE_BUFFER = 2;

const DOT_SPACING = 0.025;

const isCurrent = (career: (typeof careers)[number]) =>
  career.endDate.toLowerCase() === 'current';

// Individual meshes — simple, reliable per-dot color (gradient lerp works correctly)
const TimelineLine = ({
  height,
  color,
}: {
  height: number;
  color: 'colorI' | 'colorII' | 'gradient';
}) => {
  const dotCount = Math.floor(height / DOT_SPACING);

  const greenColor = useMemo(() => new THREE.Color(COLORS.COLORI), []);
  const redColor = useMemo(() => new THREE.Color(COLORS.COLORII), []);

  return (
    <group>
      {Array.from({ length: dotCount - 1 }, (_, i) => {
        const progress = (i + 1) / dotCount;
        const dotColor =
          color === 'gradient'
            ? greenColor.clone().lerp(redColor, progress)
            : color === 'colorI'
              ? greenColor
              : redColor;

        return (
          <mesh key={i} position={[0, -(i + 1) * DOT_SPACING, 0]}>
            <sphereGeometry args={[0.0025, 8, 8]} />
            <meshBasicMaterial color={dotColor} />
          </mesh>
        );
      })}
    </group>
  );
};

// --- Main ---
const WorkHistory = () => {
  const contentRef = useRef<THREE.Group>(null);
  const thumbRef = useRef<THREE.Mesh>(null);
  const entryRefs = useRef<(THREE.Group | null)[]>([]);

  const { gl } = useThree();

  const contentHeight =
    careers.length > 0
      ? ENTRY_HEIGHT + (careers.length + 1) * ENTRY_SPACING
      : 0;
  const maxScroll = Math.max(0, contentHeight - VIEWPORT_HEIGHT);

  const thumbHeight = Math.min(
    VIEWPORT_HEIGHT,
    (VIEWPORT_HEIGHT * VIEWPORT_HEIGHT) /
      Math.max(contentHeight, VIEWPORT_HEIGHT),
  );
  const trackTravel = VIEWPORT_HEIGHT - thumbHeight;

  const scrollPosition = useRef(0);
  const targetScroll = useRef(0);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  const clippingPlanes = useMemo(
    () => [
      new THREE.Plane(new THREE.Vector3(0, -1, 0), VIEWPORT_HEIGHT / 2),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), VIEWPORT_HEIGHT / 2),
    ],
    [],
  );

  const pointerYToScroll = useCallback(
    (y: number) => {
      if (trackTravel <= 0) return 0;
      return (
        THREE.MathUtils.clamp((trackTravel / 2 - y) / trackTravel, 0, 1) *
        maxScroll
      );
    },
    [trackTravel, maxScroll],
  );

  const handleThumbPointerDown = useCallback(
    (
      event: THREE.Event & {
        stopPropagation: () => void;
        point: THREE.Vector3;
      },
    ) => {
      event.stopPropagation();
      isDragging.current = true;
      dragStartY.current = event.point.y;
      dragStartScroll.current = targetScroll.current;
      const native = (event as unknown as { nativeEvent?: PointerEvent })
        .nativeEvent;
      if (native) gl.domElement.setPointerCapture(native.pointerId);
      gl.domElement.style.cursor = 'grabbing';
    },
    [gl],
  );

  useEffect(() => {
    const canvas = gl.domElement;
    const release = () => {
      if (isDragging.current) {
        isDragging.current = false;
        canvas.style.cursor = '';
      }
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    return () => {
      canvas.removeEventListener('pointerup', release);
      canvas.removeEventListener('pointercancel', release);
    };
  }, [gl]);

  const handleDragMove = useCallback(
    (event: { point: THREE.Vector3; stopPropagation: () => void }) => {
      if (!isDragging.current) return;
      event.stopPropagation();
      if (trackTravel > 0) {
        const scrollDelta =
          -((event.point.y - dragStartY.current) / trackTravel) * maxScroll;
        targetScroll.current = THREE.MathUtils.clamp(
          dragStartScroll.current + scrollDelta,
          0,
          maxScroll,
        );
      }
    },
    [trackTravel, maxScroll],
  );

  const handleDragUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      gl.domElement.style.cursor = '';
    }
  }, [gl]);

  const handleTrackClick = useCallback(
    (event: { point: THREE.Vector3; stopPropagation: () => void }) => {
      if (isDragging.current) return;
      event.stopPropagation();
      targetScroll.current = pointerYToScroll(event.point.y);
    },
    [pointerYToScroll],
  );

  const handleWheel = useCallback(
    (event: { deltaY: number; stopPropagation: () => void }) => {
      event.stopPropagation();
      targetScroll.current = THREE.MathUtils.clamp(
        targetScroll.current + event.deltaY * SCROLL_SPEED,
        0,
        maxScroll,
      );
    },
    [maxScroll],
  );

  const handleThumbHover = useCallback(() => {
    if (!isDragging.current) gl.domElement.style.cursor = 'grab';
  }, [gl]);

  const handleThumbUnhover = useCallback(() => {
    if (!isDragging.current) gl.domElement.style.cursor = '';
  }, [gl]);

  useLayoutEffect(() => {
    const prev = gl.localClippingEnabled;
    gl.localClippingEnabled = true;
    const content = contentRef.current;
    if (!content) return;
    content.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        m.clippingPlanes = clippingPlanes;
        m.clipIntersection = false;
        m.needsUpdate = true;
      });
    });
    return () => {
      content.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        const mats = Array.isArray(obj.material)
          ? obj.material
          : [obj.material];
        mats.forEach((m) => {
          m.clippingPlanes = null;
          m.needsUpdate = true;
        });
      });
      gl.localClippingEnabled = prev;
    };
  }, [gl, clippingPlanes]);

  useFrame((_, delta) => {
    scrollPosition.current +=
      (targetScroll.current - scrollPosition.current) *
      (1 - Math.exp(-SCROLL_SMOOTHING * delta));

    const s = scrollPosition.current;

    if (contentRef.current) contentRef.current.position.y = s;

    if (thumbRef.current) {
      const progress = maxScroll > 0 ? s / maxScroll : 0;
      const travel = (VIEWPORT_HEIGHT - thumbHeight) / 2;
      thumbRef.current.position.y = travel - progress * travel * 2;
    }

    const start = Math.max(0, Math.floor(s / ENTRY_SPACING) - VISIBLE_BUFFER);
    const end = Math.min(
      careers.length - 1,
      Math.ceil((s + VIEWPORT_HEIGHT) / ENTRY_SPACING) + VISIBLE_BUFFER,
    );
    for (let i = 0; i < entryRefs.current.length; i++) {
      const ref = entryRefs.current[i];
      if (ref) ref.visible = i >= start && i <= end;
    }
  });

  return (
    <group>
      {/* Invisible interaction surface */}
      <mesh
        position={[0, 0, 0.15]}
        onWheel={handleWheel}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragUp}
        renderOrder={999}
      >
        <planeGeometry args={[3.1, VIEWPORT_HEIGHT]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          colorWrite={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Scrollable content */}
      <group ref={contentRef}>
        {careers.map((career, index) => {
          const entryY =
            VIEWPORT_HEIGHT / 2 - ENTRY_HEIGHT / 2 - index * ENTRY_SPACING;
          const nextCareer = careers[index + 1];
          const lineColor: 'colorI' | 'colorII' | 'gradient' =
            isCurrent(career) && nextCareer && isCurrent(nextCareer)
              ? 'colorI'
              : isCurrent(career) && nextCareer && !isCurrent(nextCareer)
                ? 'gradient'
                : 'colorII';

          return (
            <group key={`${career.company}-${index}`}>
              {nextCareer && (
                <group position={[-1.04, entryY, 0.01]}>
                  <TimelineLine height={ENTRY_SPACING} color={lineColor} />
                </group>
              )}
              <group
                ref={(el) => {
                  entryRefs.current[index] = el;
                }}
              >
                <CareerEntry
                  index={index}
                  career={career}
                  y={entryY}
                  clippingPlanes={clippingPlanes}
                />
              </group>
            </group>
          );
        })}
      </group>

      {/* Scrollbar track */}
      <mesh position={[1.1, 0, 0.08]} onClick={handleTrackClick}>
        <planeGeometry args={[0.01, VIEWPORT_HEIGHT]} />
        <meshBasicMaterial color="#263329" />
      </mesh>

      {/* Scrollbar thumb */}
      <mesh
        ref={thumbRef}
        position={[1.1, 0, 0.1]}
        scale={[1, thumbHeight, 1]}
        onPointerDown={handleThumbPointerDown}
        onPointerOver={handleThumbHover}
        onPointerOut={handleThumbUnhover}
      >
        <planeGeometry args={[0.01, 1]} />
        <meshBasicMaterial color={COLORS.COLORI} />
      </mesh>
    </group>
  );
};

export default WorkHistory;
