import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../store/userSlice";
import Pagination from "../../components/Pagination";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function UserTable({ search, onEdit, onDelete }) {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((state) => state.user);
  const { page, totalPages, totalItems } = pagination;
  const limit = 20;

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchUsers({ page, limit: limit, search }));
    }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, page, search]);

  if (loading)
    return (
      <div className="p-6">
        <p className="text-gray-500 animate-pulse">Loading users...</p>
      </div>
    );

  return (
    <div className="m-6 bg-white ">
        <div className="overflow-x-auto ">
          <table className="min-w-full text-sm text-left border border-gray-200 overflow-hidden">
            <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-medium border border-gray-200 w-5">No</th>
                <th className="px-6 py-3 font-medium border border-gray-200">Nama</th>
                <th className="px-6 py-3 font-medium border border-gray-200">Username</th>
                <th className="px-6 py-3 font-medium border border-gray-200">Role</th>
                <th className="px-6 py-3 font-medium border border-gray-200">Unit</th>
                <th className="px-6 py-3 font-medium border border-gray-200">Keterangan</th>
                <th className="px-6 py-3 font-medium border border-gray-200 w-10">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u, index) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-200 px-6 py-2 text-gray-600 text-center">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 ">
                    {u.nama}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700 italic">
                    {u.username}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {u.group_nama}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {u.nama_unit}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {u.keterangan}
                  </td>

                  {/* Actions */}
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => onEdit(u)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition">
                        <PencilIcon className="h-4 w-4" /> Edit
                      </button>
                      <button 
                        onClick={() => onDelete(u)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm transition">
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
            onPageChange={(p) => dispatch(fetchUsers({ page: p, search }))}
          />
        </div>
      </div>
  );
}
