'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserProfile } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Character, Attribute } from '@shared/types';
import { xpForLevel } from '@shared/constants';

interface CharacterContextType {
  character: Character | null;
  userEmail: string;
  userName: string;
  attributes: Attribute[];
  loading: boolean;
  refreshCharacter: () => Promise<void>;
  updateCharacter: (newChar: Character) => void;
  // Computed helpers
  level: number;
  totalXp: number;
  currency: number;
  streak: number;
  xpInCurrentLevel: number;
  xpNeededForCurrentLevel: number;
  xpProgress: number;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

import { clearAllCache } from '@/lib/cache';

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('Explorer');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      let email = '';
      let name = '';

      // 1. Fetch Supabase auth user directly for accurate real-time email & name
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        email = user.email;
        if (user.user_metadata?.name) {
          name = user.user_metadata.name;
        } else if (user.user_metadata?.full_name) {
          name = user.user_metadata.full_name;
        }
      } else {
        // No authenticated user
        setCharacter(null);
        setUserEmail('');
        setUserName('Explorer');
        setLoading(false);
        return;
      }

      // 2. Fetch backend profile, character stats & attributes catalog
      const res = await getUserProfile();
      if (res.character) {
        setCharacter(res.character);
      }
      if (res.attributes) {
        setAttributes(res.attributes);
      }
      if (res.user?.email && !email) {
        email = res.user.email;
      }

      if (!name && email) {
        const rawName = email.split('@')[0];
        name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      }

      if (email) setUserEmail(email);
      if (name) setUserName(name);
    } catch (err) {
      console.error('CharacterProvider failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      clearAllCache();
      if (event === 'SIGNED_OUT') {
        setCharacter(null);
        setUserEmail('');
        setUserName('Explorer');
      }
      fetchProfile();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateCharacter = (newChar: Character) => {
    setCharacter(newChar);
  };

  const level = character?.level || 1;
  const totalXp = character?.total_xp || 0;
  const currency = character?.currency || 0;
  const streak = character?.current_streak || 0;

  const currentLevelMinXp = xpForLevel(level);
  const nextLevelMinXp = xpForLevel(level + 1);
  const xpInCurrentLevel = Math.max(0, totalXp - currentLevelMinXp);
  const xpNeededForCurrentLevel = Math.max(1, nextLevelMinXp - currentLevelMinXp);
  const xpProgress = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForCurrentLevel) * 100));

  return (
    <CharacterContext.Provider
      value={{
        character,
        userEmail,
        userName,
        attributes,
        loading,
        refreshCharacter: fetchProfile,
        updateCharacter,
        level,
        totalXp,
        currency,
        streak,
        xpInCurrentLevel,
        xpNeededForCurrentLevel,
        xpProgress,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    return {
      character: null,
      userEmail: '',
      userName: 'Explorer',
      attributes: [],
      loading: false,
      refreshCharacter: async () => {},
      updateCharacter: () => {},
      level: 1,
      totalXp: 0,
      currency: 0,
      streak: 0,
      xpInCurrentLevel: 0,
      xpNeededForCurrentLevel: 100,
      xpProgress: 0,
    };
  }
  return context;
}
