import React from 'react'

export default function Topbar() {
  return (
    <div className="flex items-center justify-between bg-white border-b border-b-gray-200 p-4">
      <h1 className="text-xl font-semibold">Welcome, Admin</h1>
      <div className="text-sm text-gray-600">Admin panel</div>
    </div>
  )
}