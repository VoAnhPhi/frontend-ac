import { configureStore } from '@reduxjs/toolkit'
import { profileReducer } from '../features/profile/profileSlice'

export const store = configureStore({ reducer: { profile: profileReducer } })
store.subscribe(() => {
  try { localStorage.setItem('acw3-profile', JSON.stringify(store.getState().profile)) } catch { /* Storage may be unavailable. */ }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
