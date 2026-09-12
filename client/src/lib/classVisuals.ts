export type CharacterClass =
  | 'warrior'
  | 'mage'
  | 'rogue'
  | 'paladin'
  | 'bard'
  | 'cyberpunk'
  | 'necromancer';

export type WeaponType =
  | 'greatsword'
  | 'staff'
  | 'daggers'
  | 'shield_sword'
  | 'lute'
  | 'cyber_blade'
  | 'scythe'
  | 'none';

export type HeadgearType =
  | 'helm'
  | 'hood'
  | 'cowl'
  | 'halo'
  | 'crown'
  | 'visor'
  | 'horns'
  | 'none';

export type ActionState = 'idle' | 'dance' | 'powerup';

export interface ClassVisualConfig {
  id: CharacterClass;
  name: string;
  requiredLevel: number;
  primaryColor: number; // Hex
  secondaryColor: number;
  armorColor: number;
  trimColor: number;
  emissiveColor: number;
  auraParticleColor: number;
  weaponType: WeaponType;
  headgearDefault: HeadgearType;
  idleStyle: 'combat' | 'floating' | 'stealth' | 'noble' | 'rhythmic' | 'cyber' | 'hovering';
  powerUpStyle: string;
  description: string;
  icon: string;
}

export const CLASS_VISUALS: Record<CharacterClass, ClassVisualConfig> = {
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    requiredLevel: 1,
    primaryColor: 0xef4444, // Lava Red
    secondaryColor: 0xf97316, // Orange
    armorColor: 0x27272a, // Dark Obsidian
    trimColor: 0xd97706, // Bronze/Gold trim
    emissiveColor: 0xd97706,
    auraParticleColor: 0xf97316,
    weaponType: 'greatsword',
    headgearDefault: 'helm',
    idleStyle: 'combat',
    powerUpStyle: 'Flame burst aura with kinetic ground shockwave',
    description: 'Heavy armored berserker wielding a fiery greatsword with burning magma aura.',
    icon: 'swords',
  },
  mage: {
    id: 'mage',
    name: 'Mage',
    requiredLevel: 1,
    primaryColor: 0x38bdf8, // Arcane Cyan
    secondaryColor: 0xa855f7, // Cosmic Purple
    armorColor: 0x1e1b4b, // Deep Celestial Indigo
    trimColor: 0x38bdf8, // Silver/Arcane trim
    emissiveColor: 0x38bdf8,
    auraParticleColor: 0x38bdf8,
    weaponType: 'staff',
    headgearDefault: 'crown',
    idleStyle: 'floating',
    powerUpStyle: 'Arcane starburst vortex with levitating crystal energy',
    description: 'Master of arcane energy levitating with a crystalline staff and floating orb relics.',
    icon: 'auto_awesome',
  },
  rogue: {
    id: 'rogue',
    name: 'Rogue',
    requiredLevel: 3,
    primaryColor: 0x10b981, // Emerald Toxic
    secondaryColor: 0x06b6d4, // Shadow Cyan
    armorColor: 0x18181b, // Stealth Midnight
    trimColor: 0x10b981, // Poison Venom trim
    emissiveColor: 0x10b981,
    auraParticleColor: 0x10b981,
    weaponType: 'daggers',
    headgearDefault: 'hood',
    idleStyle: 'stealth',
    powerUpStyle: 'Shadow dash blade spin with smoke particle ring',
    description: 'Agile shadow assassin wielding dual toxic daggers surrounded by dark mist.',
    icon: 'flare',
  },
  paladin: {
    id: 'paladin',
    name: 'Paladin',
    requiredLevel: 6,
    primaryColor: 0xec4899, // Divine Sunburst
    secondaryColor: 0xf59e0b, // Radiant Gold
    armorColor: 0xe2e8f0, // White Platinum Steel
    trimColor: 0xf59e0b, // Bright Gold trim
    emissiveColor: 0xf59e0b,
    auraParticleColor: 0xfef08a,
    weaponType: 'shield_sword',
    headgearDefault: 'halo',
    idleStyle: 'noble',
    powerUpStyle: 'Divine pillar of holy light with golden orbital halo expand',
    description: 'Holy champion clad in white platinum plate with a golden halo & tower shield.',
    icon: 'shield',
  },
  bard: {
    id: 'bard',
    name: 'Bard',
    requiredLevel: 9,
    primaryColor: 0xf43f5e, // Vibrant Rose
    secondaryColor: 0xf59e0b, // Golden Melody
    armorColor: 0x3f2340, // Velvet Purple coat
    trimColor: 0xf43f5e, // Rose Gold trim
    emissiveColor: 0xf43f5e,
    auraParticleColor: 0xf43f5e,
    weaponType: 'lute',
    headgearDefault: 'crown',
    idleStyle: 'rhythmic',
    powerUpStyle: 'Sonic rhythmic shockwave with musical note particle burst',
    description: 'Charismatic weaver of sonic magic performing tunes with a glowing lute.',
    icon: 'music_note',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    requiredLevel: 12,
    primaryColor: 0x06b6d4, // Neon Cyan
    secondaryColor: 0xd946ef, // Hot Magenta
    armorColor: 0x0f172a, // Cyber Carbon Black
    trimColor: 0x06b6d4, // Neon Cyan LED trim
    emissiveColor: 0xd946ef,
    auraParticleColor: 0x06b6d4,
    weaponType: 'cyber_blade',
    headgearDefault: 'visor',
    idleStyle: 'cyber',
    powerUpStyle: 'Holographic cyber overdrive pulse with glitch neon light beam',
    description: 'Futuristic augmented cyber-blade operative with neon LED visor & cybernetic aura.',
    icon: 'memory',
  },
  necromancer: {
    id: 'necromancer',
    name: 'Necromancer',
    requiredLevel: 15,
    primaryColor: 0x8b5cf6, // Nether Violet
    secondaryColor: 0x22c55e, // Toxic Ghost Green
    armorColor: 0x09090b, // Bone Shadow Black
    trimColor: 0x8b5cf6, // Soul Shroud purple trim
    emissiveColor: 0x22c55e,
    auraParticleColor: 0x8b5cf6,
    weaponType: 'scythe',
    headgearDefault: 'cowl',
    idleStyle: 'hovering',
    powerUpStyle: 'Soul harvest void explosion with spectral flame eruptions',
    description: 'Wielder of nether magic carrying a soul scythe clad in dark bone cowl.',
    icon: 'skull',
  },
};

export const WEAPON_OPTIONS: { id: WeaponType; label: string; requiredLevel: number }[] = [
  { id: 'greatsword', label: 'Greatsword', requiredLevel: 1 },
  { id: 'staff', label: 'Wizard Staff', requiredLevel: 1 },
  { id: 'daggers', label: 'Dual Daggers', requiredLevel: 3 },
  { id: 'shield_sword', label: 'Shield & Sword', requiredLevel: 6 },
  { id: 'lute', label: 'Sonic Lute', requiredLevel: 9 },
  { id: 'cyber_blade', label: 'Cyber Katana', requiredLevel: 12 },
  { id: 'scythe', label: 'Soul Scythe', requiredLevel: 15 },
  { id: 'none', label: 'Unarmed', requiredLevel: 1 },
];

export const HEADGEAR_OPTIONS: { id: HeadgearType; label: string; requiredLevel: number }[] = [
  { id: 'helm', label: 'Iron Helm', requiredLevel: 1 },
  { id: 'hood', label: 'Shadow Hood', requiredLevel: 3 },
  { id: 'visor', label: 'Cyber Visor', requiredLevel: 5 },
  { id: 'crown', label: 'Arcane Crown', requiredLevel: 7 },
  { id: 'halo', label: 'Divine Halo', requiredLevel: 10 },
  { id: 'cowl', label: 'Skull Cowl', requiredLevel: 14 },
  { id: 'horns', label: 'Magma Horns', requiredLevel: 18 },
  { id: 'none', label: 'Bare Head', requiredLevel: 1 },
];

export const COLOR_THEMES = [
  { name: 'Class Default', primary: 0, aura: 0, requiredLevel: 1 },
  { name: 'Inferno Flame', primary: 0xef4444, aura: 0xf97316, requiredLevel: 2 },
  { name: 'Arcane Frost', primary: 0x38bdf8, aura: 0x0284c7, requiredLevel: 4 },
  { name: 'Toxic Emerald', primary: 0x10b981, aura: 0x34d399, requiredLevel: 7 },
  { name: 'Holy Gold', primary: 0xf59e0b, aura: 0xfef08a, requiredLevel: 10 },
  { name: 'Shadow Void', primary: 0x8b5cf6, aura: 0xa855f7, requiredLevel: 14 },
  { name: 'Neon Cyber', primary: 0xd946ef, aura: 0x06b6d4, requiredLevel: 18 },
];

// Helper functions to test level unlock status
export function isClassUnlocked(cls: CharacterClass, playerLevel: number): boolean {
  const config = CLASS_VISUALS[cls];
  return config ? playerLevel >= config.requiredLevel : true;
}

export function isWeaponUnlocked(weapon: WeaponType, playerLevel: number): boolean {
  const option = WEAPON_OPTIONS.find((w) => w.id === weapon);
  return option ? playerLevel >= option.requiredLevel : true;
}

export function isHeadgearUnlocked(headgear: HeadgearType, playerLevel: number): boolean {
  const option = HEADGEAR_OPTIONS.find((h) => h.id === headgear);
  return option ? playerLevel >= option.requiredLevel : true;
}

export function isThemeUnlocked(themeAura: number, themePrimary: number, playerLevel: number): boolean {
  const option = COLOR_THEMES.find((t) => t.aura === themeAura && t.primary === themePrimary);
  return option ? playerLevel >= option.requiredLevel : true;
}
