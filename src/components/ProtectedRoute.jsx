import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Link, useLocation } from 'react-router-dom'
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

  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600 px-6 py-3 mt-6 mx-6">
          <Link to="/" className="hover:text-blue-500 font-medium">Dashboard</Link>
          {paths.map((path, index) => {
            const routeTo = "/" + paths.slice(0, index + 1).join("/");
            const isLast = index === paths.length - 1;

            return (
              <div key={index} className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                {isLast ? (
                  <span className="text-gray-800 capitalize">{path}</span>
                ) : (
                  <Link to={routeTo} className="hover:text-blue-500 capitalize">
                    {path}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Main Content */}
        <main className="m-6 mt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}