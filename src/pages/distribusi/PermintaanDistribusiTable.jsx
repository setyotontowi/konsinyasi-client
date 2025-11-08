// /pages/distribusi/PermintaanDistribusiTable.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermintaanDistribusi } from "../../store/permintaanDistribusiSlice";
import Pagination from "../../components/Pagination";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function PermintaanDistribusiTable({ search, onDetail}) {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((state) => state.permintaanDistribusi);
  const { page, totalPages, totalItems } = pagination;
  const limit = 20;

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchPermintaanDistribusi({ page, limit, search }));
    }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, page, search]);

  if (loading)
    return (
      <div className="p-6">
        <p className="text-gray-500 animate-pulse">Loading permintaan distribusi...</p>
      </div>
    );

  return (
    <div className="m-6 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 overflow-hidden">
          <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-medium border border-gray-200 w-5">No</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Nomor RM</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Nama Pasien</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Waktu Permintaan</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Unit Asal</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Unit Tujuan</th>
              <th className="px-6 py-3 font-medium border border-gray-200 w-10">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d, index) => (
              <tr key={d.pd_id} className="hover:bg-gray-50 transition">
                <td className="border border-gray-200 px-6 py-2 text-center text-gray-600">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700 italic">
                  {d.nomor_rm}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {d.nama_pasien}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {new Date(d.waktu).toLocaleString("id-ID")}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {d.unit_asal}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {d.unit_tujuan}
                </td>

                {/* Actions */}
                <td className="border border-gray-200 px-6 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onDetail(d)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition"
                    >
                      <EyeIcon className="h-4 w-4" /> Lihat
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
          onPageChange={(p) => dispatch(fetchPermintaanDistribusi({ page: p, search }))}
        />
      </div>
    </div>
  );
}
