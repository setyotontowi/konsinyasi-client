import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from '../api/axiosClient'
import { MagnifyingGlassIcon, UserPlusIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import PageHeader from '../components/PageHeader'
import PopupMenuPortal from '../components/PopupPortal'

export default function Users() {
  const [users, setUsers] = useState([])      // store fetched data
  const [loading, setLoading] = useState(true) // show loading state
  const [error, setError] = useState(null)     // handle errors
  const [search, setSearch] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const buttonRef = useRef(null);

  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

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

  const handleAddUser = () => {
    console.log("Add user clicked");
  };

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="masterdata titlerounded-2xl bg-white border border-gray-200">
      {/* Header Section */}
      <PageHeader
        title="Masterdata User"
        onAdd={handleAddUser}
        search={search}
        setSearch={setSearch}
        addLabel="Tambah Pengguna"
        AddIcon={UserPlusIcon}
      />

      {/* User Table */}
      <div className="m-6 bg-white ">
        <div className="overflow-x-auto ">
          <table className="min-w-full text-sm text-left border border-gray-200 overflow-hidden">
            <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-medium border border-gray-200 w-5">No</th>
                <th className="px-6 py-3 font-medium border border-gray-200">User</th>
                <th className="px-6 py-3 font-medium border border-gray-200">Username</th>
                <th className="px-6 py-3 font-medium border border-gray-200">Role</th>
                <th className="px-6 py-3 font-medium border border-gray-200">Unit</th>
                <th className="px-6 py-3 font-medium border border-gray-200">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-200 px-6 py-4 text-gray-600 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-200 px-6 py-4 ">
                    {u.nama}
                  </td>
                  <td className="border border-gray-200 px-6 py-4 text-gray-700 italic">
                    {u.username}
                  </td>
                  <td className="border border-gray-200 px-6 py-4 text-gray-700">
                    {u.group_nama}
                  </td>
                  <td className="border border-gray-200 px-6 py-4 text-gray-700">
                    {u.nama_unit}
                  </td>

                  {/* Actions */}
                  <td className="border border-gray-200 px-6 py-4 text-center relative">
                    <div>
                      <button
                        ref={buttonRef}
                        onClick={() => toggleMenu(u.id)}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                      </button>

                    {/* Portal-based Pop-up menu */}
                    {menuOpenId === u.id && (
                      <PopupMenuPortal anchorRef={buttonRef}>
                        <button className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-50 text-gray-700 text-sm transition">
                          <PencilIcon className="h-4 w-4" /> Edit
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 w-full hover:bg-red-50 text-red-600 text-sm transition">
                          <TrashIcon className="h-4 w-4" /> Delete
                        </button>
                      </PopupMenuPortal>
                    )}
                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}