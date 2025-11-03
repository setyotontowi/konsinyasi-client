import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/users/Users'
import Unit from './pages/unit/Unit'
import UserGroup from './pages/user-group/UserGroup'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />

          {/* Masterdata section */}
          <Route path="masterdata">
            <Route path="users" element={<Users />} />
            <Route path="units" element={<Unit />} />
            <Route path="privileges" element={<UserGroup />} />
          </Route>

          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </>
  )
}