import {
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

import { COLORS } from '@/experience/lib/colors';
import { careers } from '@/experience/lib/careerData';
import CareerEntry from './CareerEntry';

const VIEWPORT_HEIGHT = 1.5;
const ENTRY_SPACING = 0.4;
const ENTRY_HEIGHT = 0.4;

const SCROLL_SPEED = 0.0015;
const SCROLL_SMOOTHING = 12;
const VISIBLE_BUFFER = 2;

// Supplements
const TimelineLine = ({
  height,
  color,
}: {
  height: number;
  color: 'colorI' | 'colorII' | 'gradient';
}) => {
  const dotSpacing = 0.025;
  const dotCount = Math.floor(height / dotSpacing);

  const greenColor = useMemo(() => new THREE.Color(COLORS.COLORI), []);
  const redColor = useMemo(() => new THREE.Color(COLORS.COLORII), []);

  return (
    <group>
      {Array.from({ length: dotCount - 1 }, (_, i) => {
        // Gradient transitions from green (top) to red (bottom)
        const progress = (i + 1) / dotCount;

        const dotColor =
          color === 'gradient'
            ? greenColor.clone().lerp(redColor, progress)
            : color === 'colorI'
              ? greenColor
              : redColor;

        return (
          <mesh key={i} position={[0, -(i + 1) * dotSpacing, 0]}>
            <sphereGeometry args={[0.0025, 8, 8]} />
            <meshBasicMaterial color={dotColor} />
          </mesh>
        );
      })}
    </group>
  );
};

// Main
const WorkHistory = () => {
  const contentRef = useRef<THREE.Group>(null);
  const thumbRef = useRef<THREE.Mesh>(null);
  const trackRef = useRef<THREE.Mesh>(null);
  const entryRefs = useRef<(THREE.Group | null)[]>([]);

  const { gl } = useThree();

  // Determine whether a career is current based on its end date
  const isCurrent = (career: (typeof careers)[number]) =>
    career.endDate.toLowerCase() === 'current';

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

  const scrollPosition = useRef(0);
  const targetScroll = useRef(0);

  // Drag state refs (no React re-renders)
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

  // The usable track travel distance (track height minus thumb height)
  const trackTravel = VIEWPORT_HEIGHT - thumbHeight;

  // Convert a pointer Y position in world space to a scroll value
  const pointerYToScroll = useCallback(
    (pointerY: number) => {
      if (trackTravel <= 0) return 0;

      const progress = THREE.MathUtils.clamp(
        (trackTravel / 2 - pointerY) / trackTravel,
        0,
        1,
      );

      return progress * maxScroll;
    },
    [trackTravel, maxScroll],
  );

  // --- Pointer event handlers for scrollbar dragging ---
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

      const nativeEvent = (event as unknown as { nativeEvent?: PointerEvent })
        .nativeEvent;

      if (nativeEvent) {
        gl.domElement.setPointerCapture(nativeEvent.pointerId);
      }

      gl.domElement.style.cursor = 'grabbing';
    },
    [gl],
  );

  // Fallback: release drag if pointer leaves the canvas entirely
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        canvas.style.cursor = '';
      }
    };

    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [gl]);

  // Track pointer movement on the invisible interaction area during drag
  const handleDragMove = useCallback(
    (event: { point: THREE.Vector3; stopPropagation: () => void }) => {
      if (!isDragging.current) return;
      event.stopPropagation();

      const deltaY = event.point.y - dragStartY.current;

      if (trackTravel > 0) {
        const scrollDelta = -(deltaY / trackTravel) * maxScroll;
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

  // Track click — jump scroll to clicked position
  const handleTrackClick = useCallback(
    (event: { point: THREE.Vector3; stopPropagation: () => void }) => {
      if (isDragging.current) return;
      event.stopPropagation();
      targetScroll.current = pointerYToScroll(event.point.y);
    },
    [pointerYToScroll],
  );

  useLayoutEffect(() => {
    const previousClippingState = gl.localClippingEnabled;

    gl.localClippingEnabled = true;

    const content = contentRef.current;

    if (!content) return;

    content.traverse((object) => {
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
      content.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          material.clippingPlanes = null;
          material.needsUpdate = true;
        });
      });

      gl.localClippingEnabled = previousClippingState;
    };
  }, [gl, clippingPlanes]);

  useFrame((_, delta) => {
    scrollPosition.current +=
      (targetScroll.current - scrollPosition.current) *
      (1 - Math.exp(-SCROLL_SMOOTHING * delta));

    const currentScroll = scrollPosition.current;

    if (contentRef.current) {
      contentRef.current.position.y = currentScroll;
    }

    if (thumbRef.current) {
      const progress = maxScroll > 0 ? currentScroll / maxScroll : 0;
      const travel = (VIEWPORT_HEIGHT - thumbHeight) / 2;

      thumbRef.current.position.y = travel - progress * travel * 2;
    }

    // Toggle visibility directly via refs — zero React re-renders
    const start = Math.max(
      0,
      Math.floor(currentScroll / ENTRY_SPACING) - VISIBLE_BUFFER,
    );

    const end = Math.min(
      careers.length - 1,
      Math.ceil((currentScroll + VIEWPORT_HEIGHT) / ENTRY_SPACING) +
        VISIBLE_BUFFER,
    );

    for (let i = 0; i < entryRefs.current.length; i++) {
      const ref = entryRefs.current[i];
      if (ref) ref.visible = i >= start && i <= end;
    }
  });

  const handleWheel = (event: {
    deltaY: number;
    stopPropagation: () => void;
  }) => {
    event.stopPropagation();

    targetScroll.current = THREE.MathUtils.clamp(
      targetScroll.current + event.deltaY * SCROLL_SPEED,
      0,
      maxScroll,
    );
  };

  const handleThumbHover = useCallback(() => {
    if (!isDragging.current) {
      gl.domElement.style.cursor = 'grab';
    }
  }, [gl]);

  const handleThumbUnhover = useCallback(() => {
    if (!isDragging.current) {
      gl.domElement.style.cursor = '';
    }
  }, [gl]);

  return (
    <group>
      {/* Invisible scroll interaction area (also captures drag moves) */}
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

      {/* Career content — all entries stay mounted, visibility toggled via refs */}
      <group ref={contentRef}>
        {careers.map((career, index) => {
          const entryY =
            VIEWPORT_HEIGHT / 2 - ENTRY_HEIGHT / 2 - index * ENTRY_SPACING;

          const nextCareer = careers[index + 1];

          // Determine the connecting line color from both adjacent careers
          const currentIsActive = isCurrent(career);
          const nextIsActive = nextCareer ? isCurrent(nextCareer) : false;

          const lineColor: 'colorI' | 'colorII' | 'gradient' =
            currentIsActive && nextIsActive
              ? 'colorI'
              : currentIsActive && !nextIsActive
                ? 'gradient'
                : 'colorII';

          return (
            <group key={`${career.company}-${index}`}>
              {/* Dotted connecting line */}
              {nextCareer && (
                <group position={[-1.04, entryY, 0.01]}>
                  <TimelineLine height={ENTRY_SPACING} color={lineColor} />
                </group>
              )}

              {/* Career entry */}
              <group
                ref={(el: THREE.Group | null) => {
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

      {/* Scrollbar track (clickable — jumps to position) */}
      <mesh ref={trackRef} position={[1.1, 0, 0.08]} onClick={handleTrackClick}>
        <planeGeometry args={[0.01, VIEWPORT_HEIGHT]} />
        <meshBasicMaterial color="#263329" />
      </mesh>

      {/* Scrollbar thumb (draggable) */}
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
