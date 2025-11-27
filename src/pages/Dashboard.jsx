import React from "react";

export default function Dashboard() {
  return (
    <div className="p-6">

      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-indigo-200 rounded-xl p-10 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          PKU Muhammadiyah Gamping
        </h1>

        <p className="mt-1 text-gray-700 text-sm">
          Jl. Wates KM 5,5, Gamping, Sleman, Yogyakarta
        </p>
        <p className="text-gray-700 text-sm">0274-6499704</p>

        <h2 className="mt-6 text-xl font-semibold text-indigo-700 tracking-wide">
          Sistem Konsinyasi PKU Gamping
        </h2>

        <p className="mt-3 text-gray-600 max-w-xl mx-auto text-sm">
          Selamat datang di sistem pengelolaan konsinyasi PKU Gamping. 
          Gunakan menu di samping untuk mengakses fitur distribusi barang, 
          pemakaian, purchase order, serta laporan terkait aktivitas logistik rumah sakit.
        </p>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">Distribusi Barang</h3>
          <p className="text-sm text-gray-600 mt-1">
            Kelola proses distribusi barang antar unit dengan cepat dan akurat.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">Purchase Order</h3>
          <p className="text-sm text-gray-600 mt-1">
            Lihat daftar PO, buat PO baru, cetak dokumen, dan kelola transaksi vendor.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800">Laporan</h3>
          <p className="text-sm text-gray-600 mt-1">
            Akses laporan stok, pemakaian, dan histori distribusi untuk keperluan audit.
          </p>
        </div>

      </div>
    </div>
  );
}
