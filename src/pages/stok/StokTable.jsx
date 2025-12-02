// pages/Stok/StokTable.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStok } from "../../store/stokSlice";
import Pagination from "../../components/Pagination";

const StokTable = ({ search }) => {
  const dispatch = useDispatch();
  const { list, loading, error, pagination } = useSelector(
    (state) => state.stok
  );

  const { page, totalPages, totalItems } = pagination;
  const [currentPage, setCurrentPage] = useState(page || 1);
  const limit = 20;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchStok({ page: currentPage, limit, search:search }));
    }, 400);

    return () => clearTimeout(delay);
  }, [dispatch, currentPage, search]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 border border-gray-200">No</th>
              <th className="px-4 py-3 border border-gray-200">Barang</th>
              <th className="px-4 py-3 border border-gray-200">ED</th>
              <th className="px-4 py-3 border border-gray-200">No Batch</th>
              <th className="px-4 py-3 border border-gray-200">Sisa</th>
              <th className="px-4 py-3 border border-gray-200">Terakhir diupdate</th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 ">
                    {item.barang_nama}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 ">
                    {item.ed ? new Date(item.ed).toLocaleDateString() : "-"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 ">
                    {item.nobatch || "-"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-right">
                    {item.sisa}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {item.updated_at
                      ? new Date(item.updated_at).toLocaleString("id-ID")
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 italic py-3">
                  Tidak ada barang atau stok kosong.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <br></br>
        <small><i>Stok barang diurutkan berdasarkan <b>sisa stok</b> yang akan habis, kemudian <b>expired date</b> terdekat</i></small>
      </div>

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

export default StokTable;
