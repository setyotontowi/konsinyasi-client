import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsedBarang } from "../../store/purchaseSlice";
import Pagination from "../../components/Pagination";
import { formatToReadableLocal } from "../../helper/helper";

export default function PurchaseUsedTable() {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector(
    (state) => state.purchase.used
  );

  const { page, totalPages, totalItems } = pagination;
  const limit = 20;

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchUsedBarang({ page, limit }));
    }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, page]);

  return (
    <div className="m-6 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 overflow-hidden">
          <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 border border-gray-200 w-5">No</th>
              <th className="px-6 py-3 border border-gray-200">Tanggal</th>
              <th className="px-6 py-3 border border-gray-200">Nama Pasien</th>
              <th className="px-6 py-3 border border-gray-200">No RM</th>
              <th className="px-6 py-3 border border-gray-200">Ruang</th>
              <th className="px-6 py-3 border border-gray-200">Jumlah Item</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-4 border border-gray-200"
                >
                  Memuat data...
                </td>
              </tr>
            ) : list.length > 0 ? (
              list.map((item, index) => (
                <tr key={item.id || item.pd_id || index} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-6 py-2 text-center text-gray-600 w-5">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {item.tanggal || item.created_at
                      ? formatToReadableLocal(item.tanggal || item.created_at)
                      : "-"}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {item.nama_pasien}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {item.nomor_rm}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {item.nama_ruang}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {item.jumlah}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-4 border border-gray-200"
                >
                  Tidak ada data barang terpakai.
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
          onPageChange={(p) => dispatch(fetchUsedBarang({ page: p, limit }))}
        />
      </div>
    </div>
  );
}
