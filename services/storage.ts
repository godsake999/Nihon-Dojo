import { UserProfile } from '../types';

const STORAGE_KEY = 'jlpt_dojo_user';

const DEFAULT_PROFILE: UserProfile = {
  xp: 0,
  level: 1,
  streak: 1,
  lastLogin: new Date().toISOString(),
  verbsMastered: []
};

export const getProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const addXP = (amount: number): UserProfile => {
  const profile = getProfile();
  profile.xp += amount;
  
  // Simple leveling logic: Level up every 100 XP
  const calculatedLevel = Math.floor(profile.xp / 100) + 1;
  profile.level = Math.min(calculatedLevel, 10); // Cap at lvl 10
  
  saveProfile(profile);
  return profile;
};
