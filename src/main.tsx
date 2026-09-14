import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { store } from './app/store'
import { AppShell } from './components/layout/AppShell'
import { ProfilePage } from './pages/ProfilePage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Provider store={store}><BrowserRouter><AppShell><Routes><Route path="/profile/:category" element={<ProfilePage />} /><Route path="*" element={<Navigate to="/profile/tokens" replace />} /></Routes></AppShell></BrowserRouter></Provider></React.StrictMode>)
