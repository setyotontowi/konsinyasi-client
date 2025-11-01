import React from 'react'

const sample = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
]

export default function Users() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="bg-white rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {sample.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}