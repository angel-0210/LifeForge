'use client';

import React from 'react';
import { CharacterProvider } from '@/context/CharacterContext';
import { AvatarCustomizationProvider } from '@/context/AvatarCustomizationContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CharacterProvider>
      <AvatarCustomizationProvider>{children}</AvatarCustomizationProvider>
    </CharacterProvider>
  );
}
