import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { isAuthenticated } from '../helper/helper'

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content shifted to the right */}
      <div className="ml-64 flex flex-col min-h-screen">
        <Topbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
