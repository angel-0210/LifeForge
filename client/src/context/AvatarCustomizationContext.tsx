'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CharacterClass, WeaponType, HeadgearType, ActionState, CLASS_VISUALS } from '@/lib/classVisuals';
import { saveCustomization as saveCustomizationAPI } from '@/lib/api';

export interface AvatarCustomizationState {
  characterClass: CharacterClass;
  headgear: HeadgearType;
  weapon: WeaponType;
  auraColor: number; // 0 = use class default
  armorTheme: number; // 0 = use class default
  actionState: ActionState;
  isAutoRotating: boolean;
}

interface AvatarCustomizationContextType extends AvatarCustomizationState {
  setCharacterClass: (cls: CharacterClass) => void;
  setHeadgear: (headgear: HeadgearType) => void;
  setWeapon: (weapon: WeaponType) => void;
  setAuraColor: (color: number) => void;
  setArmorTheme: (theme: number) => void;
  setIsAutoRotating: (rotating: boolean) => void;
  triggerDance: () => void;
  triggerPowerUp: () => void;
  resetAction: () => void;
  setCustomization: (settings: Partial<AvatarCustomizationState>) => void;
}

const STORAGE_KEY = 'lifeforge_avatar_customization_v1';

const defaultState: AvatarCustomizationState = {
  characterClass: 'warrior',
  headgear: 'helm',
  weapon: 'greatsword',
  auraColor: 0,
  armorTheme: 0,
  actionState: 'idle',
  isAutoRotating: true,
};

const AvatarCustomizationContext = createContext<AvatarCustomizationContextType | undefined>(undefined);

export function AvatarCustomizationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AvatarCustomizationState>(defaultState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          ...parsed,
          actionState: 'idle', // Always start idle
        }));
      }
    } catch (e) {
      console.warn('Failed to parse avatar customization from storage', e);
    }
  }, []);

  const saveState = async (newState: AvatarCustomizationState) => {
    setState(newState);
    try {
      const { actionState, ...persisted } = newState;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

      // Validate & Sync with Backend API
      await saveCustomizationAPI({
        characterClass: newState.characterClass,
        weapon: newState.weapon,
        headgear: newState.headgear,
        auraColor: newState.auraColor,
        armorTheme: newState.armorTheme,
      }).catch((err) => {
        console.warn('Backend customization sync note:', err.message);
      });
    } catch (e) {
      console.warn('Failed to save avatar customization', e);
    }
  };

  const setCharacterClass = (cls: CharacterClass) => {
    const config = CLASS_VISUALS[cls] || CLASS_VISUALS.warrior;
    const newState: AvatarCustomizationState = {
      ...state,
      characterClass: cls,
      headgear: config.headgearDefault,
      weapon: config.weaponType,
      actionState: 'idle',
    };
    saveState(newState);
  };

  const setHeadgear = (headgear: HeadgearType) => {
    saveState({ ...state, headgear });
  };

  const setWeapon = (weapon: WeaponType) => {
    saveState({ ...state, weapon });
  };

  const setAuraColor = (color: number) => {
    saveState({ ...state, auraColor: color });
  };

  const setArmorTheme = (theme: number) => {
    saveState({ ...state, armorTheme: theme });
  };

  const setIsAutoRotating = (rotating: boolean) => {
    setState((prev) => ({ ...prev, isAutoRotating: rotating }));
  };

  const triggerDance = () => {
    setState((prev) => ({ ...prev, actionState: 'dance' }));
  };

  const triggerPowerUp = () => {
    setState((prev) => ({ ...prev, actionState: 'powerup' }));
  };

  const resetAction = () => {
    setState((prev) => ({ ...prev, actionState: 'idle' }));
  };

  const setCustomization = (settings: Partial<AvatarCustomizationState>) => {
    saveState({ ...state, ...settings });
  };

  return (
    <AvatarCustomizationContext.Provider
      value={{
        ...state,
        setCharacterClass,
        setHeadgear,
        setWeapon,
        setAuraColor,
        setArmorTheme,
        setIsAutoRotating,
        triggerDance,
        triggerPowerUp,
        resetAction,
        setCustomization,
      }}
    >
      {children}
    </AvatarCustomizationContext.Provider>
  );
}

export function useAvatarCustomization() {
  const context = useContext(AvatarCustomizationContext);
  if (!context) {
    return {
      ...defaultState,
      setCharacterClass: () => {},
      setHeadgear: () => {},
      setWeapon: () => {},
      setAuraColor: () => {},
      setArmorTheme: () => {},
      setIsAutoRotating: () => {},
      triggerDance: () => {},
      triggerPowerUp: () => {},
      resetAction: () => {},
      setCustomization: () => {},
    };
  }
  return context;
}
