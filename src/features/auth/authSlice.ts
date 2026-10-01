import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

type AuthState = { [Key in keyof AuthTokens]: string | null };

const storageKey = 'acw3-auth';
const signedOut: AuthState = { accessToken: null, refreshToken: null };

function loadAuth(): AuthState {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return signedOut;
    const value: unknown = JSON.parse(saved);
    if (
      typeof value !== 'object' ||
      value === null ||
      !('accessToken' in value) ||
      !('refreshToken' in value) ||
      typeof value.accessToken !== 'string' ||
      typeof value.refreshToken !== 'string'
    )
      return signedOut;
    return { accessToken: value.accessToken, refreshToken: value.refreshToken };
  } catch {
    return signedOut;
  }
}

export function saveAuth(state: AuthState) {
  try {
    if (state.accessToken) localStorage.setItem(storageKey, JSON.stringify(state));
    else localStorage.removeItem(storageKey);
  } catch {
    /* Storage may be unavailable. */
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuth(),
  reducers: {
    tokensReceived: (_state, action: PayloadAction<AuthTokens>) => ({
      accessToken: action.payload.accessToken,
      refreshToken: action.payload.refreshToken,
    }),
    loggedOut: () => signedOut,
  },
});

export const { tokensReceived, loggedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectIsAuthenticated = (state: RootState) => state.auth.accessToken !== null;
