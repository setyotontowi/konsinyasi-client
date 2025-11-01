import React from 'react'
import { useState, useEffect } from 'react'
import axios from '../api/axiosClient'
import { MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline'

export default function Users() {
  const [users, setUsers] = useState([])      // store fetched data
  const [loading, setLoading] = useState(true) // show loading state
  const [error, setError] = useState(null)     // handle errors
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get('http://localhost:3000/user') // your backend URL
      .then(response => {
        setUsers(response.data.data)  // assuming response.data is an array
      })
      .catch(err => {
        console.error(err)
        setError('Failed to fetch users')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="rounded-2xl bg-white border border-gray-200">
      {/* Header */}
      <div className="p-6 flex items-center">
        <h2 className="text-lg font-semibold">Masterdata User</h2>
      </div>
      
      <div className="pt-6 pl-6 pr-6 flex justify-between items-center border-t border-gray-200">
        {/* Add Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-400 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md">
          <UserPlusIcon className="w-5 h-5" />
          Tambah Pengguna
        </button>
        {/* Search bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="m-6 bg-white shadow-sm border border-gray-100">
        <div className="overflow-x-auto ">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-50 text-black-600 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Username</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                      <div className="font-medium text-gray-700">{u.nama}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 italic">{u.username}</td>
                  <td className="px-6 py-4 text-gray-700">{u.group_nama}</td>
                  <td className="px-6 py-4 text-gray-700">{u.nama_unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}