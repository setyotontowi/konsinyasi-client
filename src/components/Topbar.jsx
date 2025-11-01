import React from 'react'

export default function Topbar() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <div className="text-sm text-gray-600">Admin panel</div>
    </div>
  )
}