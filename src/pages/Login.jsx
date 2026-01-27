import React, { useState } from 'react'
import axios from "../api/axiosClient";
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    console.log("Submitting:", { username, password });

    try {
      const res = await axios.post("/auth/login", { username, password });
      console.log("Login successful:", res.data);
      localStorage.setItem("auth_token", res.data.token);
      navigate("/");
    } catch (err) {
      console.log(err);
      setErr(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 via-slate-50 to-indigo-100">
      <div className="flex flex-col md:flex-row shadow-xl rounded-2xl overflow-hidden bg-white w-full max-w-4xl">
        <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-blue-600 to-indigo-500 text-white flex-col justify-center p-8">
          <h2 className="text-4xl font-bold mb-3">Sistem Informasi Konsinyasi</h2>
          <p className="text-2xl opacity-90">PKU Gamping</p>
          <p className="mt-4 text-xs opacity-80">Jl. Wates, Jl. Nasional III KM.5,5, Bodeh, Ambarketawang, Kec. Gamping, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55294</p>
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Masuk ke Aplikasi</h2>
          {err && <div className="mb-3 text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded">{err}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} type="text" required placeholder="username" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium rounded-lg shadow-md">Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}
