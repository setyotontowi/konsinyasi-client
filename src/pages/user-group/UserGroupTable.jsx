// src/pages/user-group/UserGroupTable.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserGroups, openEditModal, openDeleteConfirm } from "../../store/userGroupSlice";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const UserGroupTable = ({ search }) => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.userGroup);

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;

  const filtered = list.filter((g) =>
    g.group_nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 border border-gray-200 w-5">No</th>
              <th className="px-6 py-3 border border-gray-200">Nama Grup</th>
              <th className="px-6 py-3 border border-gray-200">Jumlah User</th>
              <th className="px-6 py-3 border border-gray-200 w-10">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((g, index) => (
                <tr key={g.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-200 px-6 py-2">
                    {g.group_nama}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    {g.user_count}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => dispatch(openEditModal(g))}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition"
                      >
                        <PencilIcon className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => dispatch(openDeleteConfirm(g))}
                        className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm transition"
                      >
                        <TrashIcon className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-3 text-center text-gray-500 italic"
                >
                  Tidak ada grup pengguna
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserGroupTable;
