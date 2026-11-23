import { useState } from 'react';
import { RoundedBox } from '@react-three/drei';

import PageTransition from './PageTransition';
import NavBar from './NavBar';
import Hero from './Hero';
import WorkHistory from './WorkHistory';

const Panel = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <group>
      {/* Panel */}
      {/* <RoundedBox args={[3.5, 2, 0.1]}>
        <meshBasicMaterial color="#060e17" />
      </RoundedBox> */}

      {/* Navigation */}
      <NavBar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

      <PageTransition activeIndex={activeIndex} />
    </group>
  );
};

export default Panel;
