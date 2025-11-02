import { useState, useEffect, useRef } from 'react'
import axiosClient from '../api/axiosClient'
import { UserPlusIcon,  PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import PageHeader from '../components/PageHeader'
import Pagination from '../components/Pagination'


export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 500); // wait 0.5s after typing before fetching
    return () => clearTimeout(delay);
  }, [currentPage, search]);

  const fetchUsers = () => {
    setLoading(true);
    axiosClient
      .get(`/user?page=${currentPage}&limit=${limit}&user=${encodeURIComponent(search)}`)
      .then(response => {
        setUsers(response.data.data);
        setTotalPages(response.data.pagination.total_pages || 1);
        setTotalItems(response.data.pagination.total || 0);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch users');
      })
      .finally(() => setLoading(false));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddUser = () => {
    console.log("Add user clicked");
  };

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="masterdata titlerounded-2xl bg-white border border-gray-200">
      {/* Header Section */}
      <PageHeader
        title = "Data Pengguna"
        onAdd={handleAddUser}
        search={search}
        setSearch={setSearch}
        addLabel="Tambah Pengguna"
        AddIcon={UserPlusIcon}
      />

      {/* User Table */}
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

                  {/* Actions */}
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition">
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
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}