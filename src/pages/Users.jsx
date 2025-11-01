import React from 'react'
import { useState, useEffect } from 'react'
import axios from '../api/axiosClient'

export default function Users() {
  const [users, setUsers] = useState([])      // store fetched data
  const [loading, setLoading] = useState(true) // show loading state
  const [error, setError] = useState(null)     // handle errors

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
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="bg-white rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Unit</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.nama}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.group_nama}</td>
                <td className="p-3">{u.nama_unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}