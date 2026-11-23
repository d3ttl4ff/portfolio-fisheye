import { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

import { careers } from './pages/workHistory/careerData';
import CareerEntry from './pages/workHistory/CareerEntry';

const GREEN = '#729252';

const VIEWPORT_HEIGHT = 1.5;
const ENTRY_SPACING = 0.4;
const ENTRY_HEIGHT = 0.4;

const SCROLL_SPEED = 0.0015;
const SCROLL_SMOOTHING = 12;
const VISIBLE_BUFFER = 2;

const WorkHistory = () => {
  const contentRef = useRef<THREE.Group>(null);
  const thumbRef = useRef<THREE.Mesh>(null);
  const trackRef = useRef<THREE.Mesh>(null);
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

      // Top of track = travel/2, bottom = -travel/2
      // progress 0 (top) → scroll 0, progress 1 (bottom) → scroll maxScroll
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

      // Capture pointer so we receive move/up even outside the mesh
      const nativeEvent = (event as unknown as { nativeEvent?: PointerEvent })
        .nativeEvent;

      if (nativeEvent) {
        gl.domElement.setPointerCapture(nativeEvent.pointerId);
      }

      // Set grab cursor
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

      // Compute delta in world Y from drag start
      const deltaY = event.point.y - dragStartY.current;

      // Moving thumb down (negative deltaY) = scrolling content up (positive scroll)
      // Track travel maps to full maxScroll range
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

  useEffect(() => {
    gl.localClippingEnabled = true;

    return () => {
      gl.localClippingEnabled = false;
    };
  }, [gl]);

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
        {careers.map((career, index) => (
          <group
            key={career.company}
            ref={(el: THREE.Group | null) => {
              entryRefs.current[index] = el;
            }}
          >
            <CareerEntry
              career={career}
              y={VIEWPORT_HEIGHT / 2 - ENTRY_HEIGHT / 2 - index * ENTRY_SPACING}
              clippingPlanes={clippingPlanes}
            />
          </group>
        ))}
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
        <RoundedBox
          args={[0.015, 1, 0.01]}
          radius={0.005}
          smoothness={4}
          bevelSegments={4}
        >
          <meshBasicMaterial color={GREEN} />
        </RoundedBox>
      </mesh>
    </group>
  );
};

export default WorkHistory;
