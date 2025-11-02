import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import Pagination from "../../components/Pagination";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function UserTable({ search, reloadTrigger, onEdit }) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);
  const limit = 20;

  useEffect(() => {
    const delay = setTimeout(() => fetchUsers(), 400);
    return () => clearTimeout(delay);
  }, [currentPage, search, reloadTrigger]);

  const fetchUsers = () => {
    setLoading(true);
    axiosClient
      .get(`/user?page=${currentPage}&limit=${limit}&user=${encodeURIComponent(search)}`)
      .then((res) => {
        setUsers(res.data.data);
        setTotalPages(res.data.pagination.total_pages);
        setTotalItems(res.data.pagination.total);
        setFade(true);
        setTimeout(() => setFade(false), 300); // remove fade after 0.3s
      })
      .finally(() => setLoading(false));
  };

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
              {users.map((u, index) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-200 px-6 py-2 text-gray-600 text-center">
                    {index + 1}
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
                      <button className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm transition">
                        <TrashIcon className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            perPage={limit}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
  );
}
