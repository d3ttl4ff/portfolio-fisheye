import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { Group, Mesh } from 'three';

import Hero from './Hero';
import WorkHistory from '@/experience/world/pages/workHistory/WorkHistory';

type Transition = { from: number | null; to: number | null };

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
  group.traverse((obj) => {
    if (!(obj as Mesh).isMesh) return;
    const mesh = obj as Mesh;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      m.transparent = true;
      m.needsUpdate = true;
    });
    materials.push(...mats);
  });
  return materials;
};

const PageTransition = ({ activeIndex }: { activeIndex: number | null }) => {
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(null);
  const [transition, setTransition] = useState<Transition | null>(null);
  const currentIndex = useRef<number | null>(null);
  const outgoingRef = useRef<Group>(null);
  const incomingRef = useRef<Group>(null);

  useEffect(() => {
    if (activeIndex === currentIndex.current) return;
    setTransition({ from: currentIndex.current, to: activeIndex });
    currentIndex.current = activeIndex;
  }, [activeIndex]);

  useLayoutEffect(() => {
    if (!transition) return;

    const outgoing = outgoingRef.current;
    const incoming = incomingRef.current;
    const outMats = outgoing ? getMaterials(outgoing) : [];
    const inMats = incoming ? getMaterials(incoming) : [];
    const dir =
      transition.to !== null &&
      transition.from !== null &&
      transition.to > transition.from
        ? 1
        : -1;

    const tl = gsap.timeline({
      onComplete: () => {
        setDisplayedIndex(transition.to);
        setTransition(null);
      },
    });

    if (incoming) {
      gsap.set(incoming.position, { x: SLIDE_DISTANCE * dir });
      gsap.set(inMats, { opacity: 0 });
      tl.to(
        incoming.position,
        { x: 0, duration: DURATION, ease: 'ease.in' },
        0,
      );
      tl.to(inMats, { opacity: 1, duration: DURATION, ease: 'ease.out' }, 0);
    }
    if (outgoing) {
      gsap.set(outgoing.position, { x: 0 });
      gsap.set(outMats, { opacity: 1 });
      tl.to(
        outgoing.position,
        { x: -SLIDE_DISTANCE * dir, duration: DURATION * 0.8, ease: 'ease.in' },
        0,
      );
      tl.to(
        outMats,
        { opacity: 0, duration: DURATION * 0.8, ease: 'ease.out' },
        0,
      );
    }

    return () => {
      tl.kill();
    };
  }, [transition]);

  const incomingIndex = transition ? transition.to : displayedIndex;

  return (
    <group>
      {transition?.from != null && (
        <group key={`page-${transition.from}`} ref={outgoingRef}>
          <PageContent index={transition.from} />
        </group>
      )}
      {incomingIndex != null && (
        <group key={`page-${incomingIndex}`} ref={incomingRef}>
          <PageContent index={incomingIndex} />
        </group>
      )}
    </group>
  );
};

export default PageTransition;
