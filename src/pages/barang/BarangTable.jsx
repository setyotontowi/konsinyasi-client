// src/pages/barang/BarangTable.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBarang } from "../../store/barangSlice";
import Pagination from "../../components/Pagination";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatRupiah } from "../../helper/helper";

export default function BarangTable({ search, onEdit, onDelete }) {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((state) => state.barang);
  const { page, totalPages, totalItems } = pagination;
  const limit = 20;

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchBarang({ page, limit, search }));
    }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, page, search]);

  if (loading)
    return (
      <div className="p-6">
        <p className="text-gray-500 animate-pulse">Loading barang...</p>
      </div>
    );

  return (
    <div className="m-6 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 overflow-hidden">
          <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-medium border border-gray-200 w-5">No</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Nama Barang</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Serial Number</th>
              <th className="px-6 py-3 font-medium border border-gray-200">PBF</th>
              <th className="px-6 py-3 font-medium border border-gray-200">HPP</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Satuan Terkecil</th>
              <th className="px-6 py-3 font-medium border border-gray-200">ID Barang SIMRS</th>
              <th className="px-6 py-3 font-medium border border-gray-200 w-10">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b, index) => (
              <tr key={b.barang_id} className="hover:bg-gray-50 transition">
                <td className="border border-gray-200 px-6 py-2 text-center">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="border border-gray-200 px-6 py-2">{b.barang_nama}</td>
                <td className="border border-gray-200 px-6 py-2">{b.serial_number}</td>
                <td className="border border-gray-200 px-6 py-2">{b.nama_pabrik}</td>
                <td className="border border-gray-200 px-6 py-2 text-right">{formatRupiah(b.barang_hpp)}</td>
                <td className="border border-gray-200 px-6 py-2">{b.nama_satuan}</td>
                <td className="border border-gray-200 px-6 py-2">{b.barang_id_simrs}</td>

                <td className="border border-gray-200 px-6 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(b)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition"
                    >
                      <PencilIcon className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(b)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm transition"
                    >
                      <TrashIcon className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          perPage={limit}
          totalItems={totalItems}
          onPageChange={(p) => dispatch(fetchBarang({ page: p, search }))}
        />
      </div>
    </div>
  );
}
