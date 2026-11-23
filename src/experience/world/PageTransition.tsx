import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { Group, Mesh } from 'three';

import Hero from './Hero';
import WorkHistory from './WorkHistory';

type Transition = {
  from: number | null;
  to: number | null;
};

const SLIDE_DISTANCE = 1;
const DURATION = 0.3;

const PageContent = ({ index }: { index: number }) => {
  switch (index) {
    case 0:
      return <Hero />;

    case 1:
      return <WorkHistory />;

    default:
      return null;
  }
};

const getMaterials = (group: Group) => {
  const materials: Mesh['material'][] = [];

  group.traverse((object) => {
    if ((object as Mesh).isMesh) {
      const mesh = object as Mesh;
      const meshMaterials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      meshMaterials.forEach((material) => {
        material.transparent = true;
        material.needsUpdate = true;
        materials.push(material);
      });
    }
  });

  return materials.flat();
};

const PageTransition = ({ activeIndex }: { activeIndex: number | null }) => {
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(null);
  const [transition, setTransition] = useState<Transition | null>(null);

  const currentIndex = useRef<number | null>(null);

  const outgoingRef = useRef<Group>(null);
  const incomingRef = useRef<Group>(null);

  // Detect navigation changes
  useEffect(() => {
    if (activeIndex === currentIndex.current) return;

    setTransition({
      from: currentIndex.current,
      to: activeIndex,
    });

    currentIndex.current = activeIndex;
  }, [activeIndex]);

  // Animate the page transition
  useLayoutEffect(() => {
    if (!transition) return;

    const outgoing = outgoingRef.current;
    const incoming = incomingRef.current;

    const outgoingMaterials = outgoing ? getMaterials(outgoing) : [];
    const incomingMaterials = incoming ? getMaterials(incoming) : [];

    // Determine transition direction
    const direction =
      transition.to !== null &&
      transition.from !== null &&
      transition.to > transition.from
        ? 1
        : -1;

    const timeline = gsap.timeline({
      onComplete: () => {
        setDisplayedIndex(transition.to);
        setTransition(null);
      },
    });

    // Incoming page starts outside the screen
    if (incoming) {
      gsap.set(incoming.position, {
        x: SLIDE_DISTANCE * direction,
      });

      gsap.set(incomingMaterials, {
        opacity: 0,
      });
    }

    // Outgoing page starts at its original position
    if (outgoing) {
      gsap.set(outgoing.position, {
        x: 0,
      });

      gsap.set(outgoingMaterials, {
        opacity: 1,
      });
    }

    // Incoming page slides in and fades in
    if (incoming) {
      timeline.to(
        incoming.position,
        {
          x: 0,
          duration: DURATION,
          ease: 'ease.in',
        },
        0,
      );

      timeline.to(
        incomingMaterials,
        {
          opacity: 1,
          duration: DURATION,
          ease: 'ease.out',
        },
        0,
      );
    }

    // Outgoing page slides out and fades out
    if (outgoing) {
      timeline.to(
        outgoing.position,
        {
          x: -SLIDE_DISTANCE * direction,
          duration: DURATION * 0.8,
          ease: 'ease.in',
        },
        0,
      );

      timeline.to(
        outgoingMaterials,
        {
          opacity: 0,
          duration: DURATION * 0.8,
          ease: 'ease.out',
        },
        0,
      );
    }

    return () => {
      timeline.kill();
    };
  }, [transition]);

  const incomingIndex = transition ? transition.to : displayedIndex;

  return (
    <group>
      {/* Previous page */}
      {transition?.from !== null && transition?.from !== undefined && (
        <group key={`page-${transition.from}`} ref={outgoingRef}>
          <PageContent index={transition.from} />
        </group>
      )}

      {/* Current / incoming page */}
      {incomingIndex !== null && (
        <group key={`page-${incomingIndex}`} ref={incomingRef}>
          <PageContent index={incomingIndex} />
        </group>
      )}
    </group>
  );
};

export default PageTransition;
