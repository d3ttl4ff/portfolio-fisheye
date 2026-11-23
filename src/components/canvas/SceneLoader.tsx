'use client';

import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
  loading: () => (
    <p className="flex items-center justify-center h-screen">L O A D I N G</p>
  ),
});

export default function SceneLoader() {
  return <Scene />;
}
