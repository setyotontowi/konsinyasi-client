import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJournal } from "../../store/journalSlice";
import Pagination from "../../components/Pagination";

const JournalTable = ({ search }) => {
  const dispatch = useDispatch();
  const { list, loading, error, pagination } = useSelector(
    (state) => state.journal
  );

  const { page, totalPages, totalItems } = pagination;
  const [currentPage, setCurrentPage] = useState(page || 1);
  const limit = 20;

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchJournal({ page: currentPage, limit, search }));
    }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, currentPage, search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

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
              <th className="px-4 py-3 border border-gray-200">Transaksi</th>
              <th className="px-4 py-3 border border-gray-200">Barang</th>
              <th className="px-4 py-3 border border-gray-200">Batch</th>
              <th className="px-4 py-3 border border-gray-200">ED</th>
              <th className="px-4 py-3 border border-gray-200">Masuk</th>
              <th className="px-4 py-3 border border-gray-200">Keluar</th>
              <th className="px-4 py-3 border border-gray-200">Sebelum</th>
              <th className="px-4 py-3 border border-gray-200">Sesudah</th>
              <th className="px-4 py-3 border border-gray-200">Keterangan</th>
              <th className="px-4 py-3 border border-gray-200">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 ? (
              list.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 border-gray-200 text-center">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="border px-4 py-2 border-gray-200">{item.transaksi}</td>
                  <td className="border px-4 py-2 border-gray-200">{item.id_barang}</td>
                  <td className="border px-4 py-2 border-gray-200">{item.nobatch || "-"}</td>
                  <td className="border px-4 py-2 border-gray-200">
                    {new Date(item.ed).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 border-gray-200 text-right">{item.masuk}</td>
                  <td className="border px-4 py-2 border-gray-200 text-right">{item.keluar}</td>
                  <td className="border px-4 py-2 border-gray-200 text-right">
                    {item.stok_sebelum}
                  </td>
                  <td className="border px-4 py-2 border-gray-200 text-right">
                    {item.stok_sesudah}
                  </td>
                  <td className="border px-4 py-2 border-gray-200">{item.keterangan}</td>
                  <td className="border px-4 py-2 border-gray-200">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="text-center text-gray-500 italic py-3"
                >
                  Tidak ada log
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default JournalTable;
