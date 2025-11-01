import React from 'react'

export default function Dashboard() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Stats card 1</div>
        <div className="p-4 bg-white rounded shadow">Stats card 2</div>
        <div className="p-4 bg-white rounded shadow">Stats card 3</div>
      </div>

      <section className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Recent activity</h2>
        <p className="text-sm text-gray-600">No recent activity (this is the stub content).</p>
      </section>
    </div>
  )
}