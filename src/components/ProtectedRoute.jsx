import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

function isAuthenticated() {
  // simple mock: check localStorage for token
  return Boolean(localStorage.getItem('auth_token'))
}

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Topbar />
        <main className="mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}