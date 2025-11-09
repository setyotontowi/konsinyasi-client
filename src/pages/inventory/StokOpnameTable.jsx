// /pages/stokopname/StokOpnameTable.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStokOpname } from "../../store/stokOpnameSlice";
import Pagination from "../../components/Pagination";

export default function StokOpnameTable({ search, onView, onEdit, onDelete}) {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((state) => state.stokOpname);
  const { page, totalPages, totalItems } = pagination;
  const limit = 20;

  useEffect(() => {
    dispatch(fetchStokOpname({ page, limit }));
  }, [dispatch, page]);

  if (loading)
    return (
      <div className="p-6">
        <p className="text-gray-500 animate-pulse">Loading stok opname...</p>
      </div>
    );

  return (
    <div className="m-6 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 overflow-hidden">
          <thead className="bg-green-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-medium border border-gray-200 w-5 text-center">No</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Waktu Input</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Unit</th>
              <th className="px-6 py-3 font-medium border border-gray-200">User</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Jumlah Barang</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="border border-gray-200 px-6 py-2 text-center text-gray-600">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {new Date(item.waktu_input).toLocaleString("id-ID")}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {item.nama_unit}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {item.nama_user}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {item.jumlah_barang}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  
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
          onPageChange={(p) => dispatch(fetchStokOpname({ page: p }))}
        />
      </div>
    </div>
  );
}
