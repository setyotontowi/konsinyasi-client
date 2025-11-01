import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Cog6ToothIcon, Squares2X2Icon, UserIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline'

export default function Sidebar() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-gray-100 text-gray-900 font-medium"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-r-gray-200">
      <div className="pr-4 pl-4 pt-4 text-xl font-bold font-sans"><BuildingOffice2Icon className="w-6 h-6 inline-block mr-2 text-black-900" />SI Konsinyasi</div>
      <p className="pr-4 pl-4 pb-4 text-sm italic">PKU Gamping</p>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-sm">
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-sm">
        <NavLink to="/" end className={linkClass}>
          <Squares2X2Icon className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink to="/users" className={linkClass}>
          <UserIcon className="w-5 h-5" />
          Users
        </NavLink>

        <NavLink to="/settings" className={linkClass}>
          <Cog6ToothIcon className="w-5 h-5" />
          Settings
        </NavLink>
      </nav>
      </nav>

    </aside>
  )
} 