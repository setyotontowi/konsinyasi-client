import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${isActive ? 'bg-white shadow' : 'text-gray-700 hover:bg-white/50'}`

  return (
    <aside className="w-64 bg-gray-200 p-4 shrink-0">
      <div className="text-xl font-bold mb-6">Admin</div>
      <nav className="space-y-2">
        <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/users" className={linkClass}>Users</NavLink>
        <NavLink to="/settings" className={linkClass}>Settings</NavLink>
      </nav>

      <div className="mt-6">
        <button onClick={logout} className="w-full text-left px-4 py-2 rounded bg-red-500 text-white">Logout</button>
      </div>
    </aside>
  )
} 