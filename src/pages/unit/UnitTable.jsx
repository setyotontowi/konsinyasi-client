// src/components/UnitTable.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUnits,
  openEditModal,
  openDeleteConfirm,
} from "../../store/unitSlice";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Pagination from "../../components/Pagination";

const UnitTable = ({search}) => {
  const dispatch = useDispatch();
  const { list, loading, error, pagination } = useSelector(
    (state) => state.unit
  );

  const { page, totalPages, totalItems } = pagination;
  const [currentPage, setCurrentPage] = useState(page || 1);
  const limit = 20; // same default as fetchUnits

  useEffect(() => {
    const delay = setTimeout(() => {
          dispatch(fetchUnits({ page:currentPage, limit: limit, search }));
        }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, currentPage, search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="overflow-x-auto">
         <table className="min-w-full text-sm text-left border border-gray-200 overflow-hidden">
            <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-medium border border-gray-200 w-5">
                No
              </th>
              <th className="px-6 py-3 font-medium border border-gray-200">
                Nama
              </th>
              <th className="px-6 py-3 font-medium border border-gray-200">
                Keterangan
              </th>
              <th className="px-6 py-3 font-medium border border-gray-200">
                PBF
              </th>
              <th className="px-6 py-3 font-medium border border-gray-200 w-10">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((u, index) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-200 px-6 py-2 text-center text-gray-600">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="border border-gray-200 px-6 py-2">
                    {u.nama}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700 italic">
                    {u.keterangan || "-"}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {u.is_pbf}
                  </td>

                  {/* Actions */}
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => dispatch(openEditModal(u))}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition"
                      >
                        <PencilIcon className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => dispatch(openDeleteConfirm(u))}
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
                  colSpan="8"
                  className="py-3 text-center text-gray-500 italic"
                >
                  Tidak ada data unit
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            perPage={limit}
            totalItems={totalItems}
        />
    </div>
  );
};

export default UnitTable;
