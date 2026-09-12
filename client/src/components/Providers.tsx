'use client';

import React from 'react';
import { CharacterProvider } from '@/context/CharacterContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CharacterProvider>{children}</CharacterProvider>;
}
