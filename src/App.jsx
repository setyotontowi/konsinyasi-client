import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/users/Users'
import Unit from './pages/unit/Unit'
import UserGroup from './pages/user-group/UserGroup'
import Settings from './pages/Settings'
import Barang from './pages/barang/Barang'
import ProtectedRoute from './components/ProtectedRoute'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Satuan from './pages/satuan/Satuan'

import PermintaanDistribusi from './pages/distribusi/PermintaanDistribusi'
import Distribusi from './pages/distribusi/Distribusi'
import StokOpname from './pages/inventory/StokOpname'
import PemakaianDistribusi from './pages/pemakaian/PemakaianDistribusi'
import Stok from './pages/stok/Stok'

import Journal from './pages/journal/Journal'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />

          {/* Masterdata section */}
          <Route path="masterdata">
            <Route path="users" element={<Users />} />
            <Route path="units" element={<Unit />} />
            <Route path="privileges" element={<UserGroup />} />
            <Route path="barang" element={<Barang />} />
            <Route path="satuan" element={<Satuan />} />
          </Route>

          <Route path="distribusi">
            <Route path="permintaan" element={<PermintaanDistribusi />} />
            <Route path="distribusi" element={<Distribusi />} />
            <Route path="penggunaan" element={<PemakaianDistribusi />} />
          </Route>

          <Route path="inventory">
            <Route path="stok-opname" element={<StokOpname />} />
            <Route path="journal" element={<Journal />} />
            <Route path="stok-barang" element={<Stok />} />
          </Route>

          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </>
  )
}