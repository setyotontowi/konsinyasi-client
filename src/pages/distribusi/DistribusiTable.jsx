import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDistribusi } from "../../store/distribusiSlice";
import Pagination from "../../components/Pagination";
import { EyeIcon } from "@heroicons/react/24/outline";
import { formatToReadableLocal } from "../../helper/helper";

export default function DistribusiTable({ onView, filters }) {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((state) => state.distribusi);
  const { page, totalPages, totalItems } = pagination;
  const limit = 20;

  useEffect(() => {
    console.log("filter", filters)
    dispatch(fetchDistribusi({ page, limit, filters }));
  }, [dispatch, page, filters]);

  return (
    <div className="m-6 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 overflow-hidden">
          <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 border border-gray-200">No</th>
              <th className="px-6 py-3 border border-gray-200">Unit Asal</th>
              <th className="px-6 py-3 border border-gray-200">Unit tujuan</th>
              <th className="px-6 py-3 border border-gray-200">Waktu Kirim</th>
              <th className="px-6 py-3 border border-gray-200">Oleh User</th>
              <th className="px-6 py-3 border border-gray-200 text-center w-20">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 ? (
              list.map((d, index) => (
                <tr key={d.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-200 px-6 py-2 text-center text-gray-600">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {d.nama_unit_tujuan}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {d.nama_unit}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {formatToReadableLocal(d.waktu_kirim)}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {d.nama_user}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    <button
                      onClick={() => onView(d)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition mx-auto"
                    >
                      <EyeIcon className="h-4 w-4" /> Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-4 border border-gray-200"
                >
                  Tidak ada data distribusi.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          perPage={limit}
          totalItems={totalItems}
          onPageChange={(p) => dispatch(fetchDistribusi({ page: p, limit, filters }))}
        />
      </div>
    </div>
  );
}
