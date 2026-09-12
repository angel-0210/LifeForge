'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface Character3DProps {
  height?: string;
  disciplineColor?: string;
}

const Character3DCanvas = dynamic(() => import('./Character3DCanvas'), {
  ssr: false,
  loading: ({ error }) => {
    if (error) {
      return (
        <div className="w-full h-full min-h-[300px] rounded-2xl bg-surface-container-lowest/50 border border-surface-container-high flex items-center justify-center text-outline text-xs">
          3D Canvas Fallback
        </div>
      );
    }
    return (
      <div className="w-full h-full min-h-[300px] rounded-2xl bg-surface-container-lowest/50 border border-surface-container-high flex flex-col items-center justify-center gap-2 animate-pulse">
        <div className="w-12 h-12 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
        <span className="font-label-telemetry text-[10px] text-outline uppercase tracking-wider">
          INITIALIZING 3D NEXUS...
        </span>
      </div>
    );
  },
});

export default function DynamicCharacter3DCanvas(props: Character3DProps) {
  return <Character3DCanvas {...props} />;
}
