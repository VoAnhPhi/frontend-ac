import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Profile {
  name: string
  biography: string
  twitter: string
  github: string
  telegram: string
}

const defaultProfile: Profile = { name: 'John', biography: '', twitter: '', github: '', telegram: '' }

function loadProfile(): Profile {
  try {
    const saved = localStorage.getItem('acw3-profile')
    if (!saved) return defaultProfile
    const value: unknown = JSON.parse(saved)
    if (typeof value !== 'object' || value === null || !('name' in value) || typeof value.name !== 'string') return defaultProfile
    return {
      name: value.name,
      biography: 'biography' in value && typeof value.biography === 'string' ? value.biography : '',
      twitter: 'twitter' in value && typeof value.twitter === 'string' ? value.twitter : '',
      github: 'github' in value && typeof value.github === 'string' ? value.github : '',
      telegram: 'telegram' in value && typeof value.telegram === 'string' ? value.telegram : '',
    }
  } catch { return defaultProfile }
}

const profileSlice = createSlice({
  name: 'profile',
  initialState: loadProfile(),
  reducers: { updateProfile: (_state, action: PayloadAction<Profile>) => action.payload },
})

export const { updateProfile } = profileSlice.actions
export const profileReducer = profileSlice.reducer
