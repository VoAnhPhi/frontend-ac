import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import { authReducer, saveAuth } from '../features/auth/authSlice';
import { profileReducer, saveProfiles } from '../features/profile/profileSlice';

export const store = configureStore({
  reducer: { auth: authReducer, profile: profileReducer, [api.reducerPath]: api.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

let persisted = store.getState();
store.subscribe(() => {
  const state = store.getState();
  if (state.auth !== persisted.auth) saveAuth(state.auth);
  if (state.profile !== persisted.profile) saveProfiles(state.profile);
  persisted = state;
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
