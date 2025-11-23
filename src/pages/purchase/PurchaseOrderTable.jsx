import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseOrders } from "../../store/purchaseSlice";
import Pagination from "../../components/Pagination";
import { formatToReadableLocal } from "../../helper/helper";

export default function PurchaseOrderTable({ filters, onPrint }) {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector(
    (state) => state.purchase.purchaseOrders
  );

  const { page, totalPages, totalItems } = pagination;
  const limit = 20;

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchPurchaseOrders({ page, limit, filters }));
    }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, page, filters]);

  return (
    <div className="m-6 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 overflow-hidden">
          <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 border border-gray-200">No</th>
              <th className="px-6 py-3 border border-gray-200">Tanggal</th>
              <th className="px-6 py-3 border border-gray-200">Tanggal Datang</th>
              <th className="px-6 py-3 border border-gray-200">Tanggal Entri</th>
              <th className="px-6 py-3 border border-gray-200">PPN</th>
              <th className="px-6 py-3 border border-gray-200">Subtotal</th>
              <th className="px-6 py-3 border border-gray-200">Cetak</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-4 border border-gray-200"
                >
                  Memuat data...
                </td>
              </tr>
            ) : list.length > 0 ? (
              list.map((po, index) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-6 py-2 text-center text-gray-600">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {po.tanggal ? formatToReadableLocal(po.tanggal) : "-"}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {po.tanggal_datang ? formatToReadableLocal(po.tanggal_datang) : "-"}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {po.tanggal_entri
                      ? formatToReadableLocal(po.tanggal_entri)
                      : "-"}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {po.ppn ?? 0}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {po.subtotal ?? 0}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700 text-center">
                    {po.print_path ? (
                      <a
                        href={po.print_path}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        Lihat PDF
                      </a>
                    ) : (
                      <button
                        onClick={() => onPrint(po)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        Cetak
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-4 border border-gray-200"
                >
                  Tidak ada data purchase order.
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
          onPageChange={(p) =>
            dispatch(fetchPurchaseOrders({ page: p, limit, filters }))
          }
        />
      </div>
    </div>
  );
}
