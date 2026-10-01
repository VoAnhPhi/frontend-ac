import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { fullName, type User } from '../auth/authApi';

export interface Profile {
  name: string;
  biography: string;
  twitter: string;
  github: string;
  telegram: string;
}

// DummyJSON has no endpoint for these fields, so edits stay in this browser, per user.
type ProfileState = Record<number, Profile>;

const storageKey = 'acw3-profiles';

function readString(value: object, key: keyof Profile) {
  const field: unknown = (value as Record<string, unknown>)[key];
  return typeof field === 'string' ? field : '';
}

function loadProfiles(): ProfileState {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return {};
    const value: unknown = JSON.parse(saved);
    if (typeof value !== 'object' || value === null) return {};
    const profiles: ProfileState = {};
    for (const [userId, profile] of Object.entries(value)) {
      if (typeof profile !== 'object' || profile === null) continue;
      const name = readString(profile, 'name');
      if (!name) continue;
      profiles[Number(userId)] = {
        name,
        biography: readString(profile, 'biography'),
        twitter: readString(profile, 'twitter'),
        github: readString(profile, 'github'),
        telegram: readString(profile, 'telegram'),
      };
    }
    return profiles;
  } catch {
    return {};
  }
}

export function saveProfiles(state: ProfileState) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    /* Storage may be unavailable. */
  }
}

function defaultProfile(user: User): Profile {
  return { name: fullName(user), biography: '', twitter: '', github: '', telegram: '' };
}

const profileSlice = createSlice({
  name: 'profile',
  initialState: loadProfiles(),
  reducers: {
    updateProfile: (state, action: PayloadAction<{ userId: number; profile: Profile }>) => {
      state[action.payload.userId] = action.payload.profile;
    },
  },
});

export const { updateProfile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;

/** The user's saved profile, or one built from their account until they edit it. */
export function useProfile(user: User): Profile {
  const saved = useSelector((state: RootState) => state.profile[user.id]);
  return saved ?? defaultProfile(user);
}
