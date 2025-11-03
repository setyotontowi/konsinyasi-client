// src/components/UnitTable.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnits } from "../../store/unitSlice";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const UnitTable = () => {
  const dispatch = useDispatch();
  const { data: units, loading, error } = useSelector((state) => state.unit);

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-6 py-3 font-medium border border-gray-200 w-5">No</th>
            <th className="px-6 py-3 font-medium border border-gray-200">Nama</th>
            <th className="px-6 py-3 font-medium border border-gray-200">Keterangan</th>
            <th className="px-6 py-3 font-medium border border-gray-200">PBF</th>
            <th className="px-6 py-3 font-medium border border-gray-200 w-10">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {units.length > 0 ? (
            units.map((u, index) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-200 px-6 py-2 text-gray-600 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 ">
                    {u.nama}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700 italic">
                    {u.keterangan}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {u.is_pbf}
                  </td>

                  {/* Actions */}
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => ({})}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition">
                        <PencilIcon className="h-4 w-4" /> Edit
                      </button>
                      <button 
                        onClick={() => ({})}
                        className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm transition">
                        <TrashIcon className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-3 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UnitTable;
