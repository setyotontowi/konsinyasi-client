import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Cog6ToothIcon, 
  Squares2X2Icon, 
  UserIcon, 
  BuildingOffice2Icon,
  FolderIcon,
  ChevronDownIcon,
  ChevronRightIcon, } from '@heroicons/react/24/outline'

export default function Sidebar() {
  const navigate = useNavigate()
  const [openMasterdata, setOpenMasterdata] = useState(false);
  const contentRef = useRef(null);

  function logout() {
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

   // Auto-open if current route is under /users
  useEffect(() => {
    if (location.pathname.startsWith("/users")) {
      setOpenMasterdata(true);
    }
  }, [location]);

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
        {/* Dashboard */}
        <NavLink to="/" end className={linkClass}>
          <Squares2X2Icon className="w-5 h-5" />
          Dashboard
        </NavLink>

        {/* Masterdata */}
        <div>
          <button
            onClick={() => setOpenMasterdata(!openMasterdata)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            <span className="flex items-center gap-3">
              <FolderIcon className="w-5 h-5" />
              Masterdata
            </span>
            {openMasterdata ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </button>

          {/* Collapsible Submenu with animation */}
          <div
            ref={contentRef}
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: openMasterdata
                ? `${contentRef.current?.scrollHeight}px`
                : "0px",
            }}
          >
            <div className="pl-8 mt-1 space-y-1">
              <NavLink to="/users" className={linkClass}>
                <UserIcon className="w-5 h-5" />
                Users
              </NavLink>
            </div>
          </div>
        </div>

        {/* Settings */}
        <NavLink to="/settings" className={linkClass}>
          <Cog6ToothIcon className="w-5 h-5" />
          Settings
        </NavLink>
      </nav>
    </aside>
  )
} 