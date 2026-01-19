import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseOrders } from "../../store/purchaseSlice";
import Pagination from "../../components/Pagination";
import { formatToReadableLocal, formatRupiah } from "../../helper/helper";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";

export default function PurchaseOrderTable({ mode="purchase", filters, onPrint, onConfirm, refresh}) {
  const dispatch = useDispatch();

  const { list, pagination, loading } = useSelector(
    (state) => state.purchase.purchaseOrders
  );

  const { page, totalPages, totalItems } = pagination;
  const limit = 20;
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    if (sendingId) return;
    const delay = setTimeout(() => {
      dispatch(fetchPurchaseOrders({ page, limit, filters }));
    }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, page, filters, onConfirm, refresh, sendingId]);


  
  const handleSend = async (id_po) => {
    try {
      setSendingId(id_po);

      const res = await axiosClient.post(
        `/purchase/send_simrs/${id_po}`
      );

      toast.success("PO berhasil dikirim ke SIMRS");
      setItems(res.data.data || []);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Gagal mengirim ke SIMRS";

      toast.error(msg);
    } finally {
      setSendingId(null);
    }
  }


  return (
    <div className="m-6 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 overflow-hidden">
          <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 border border-gray-200">No</th>
              <th className="px-6 py-3 border border-gray-200">No. PO</th>
              <th className="px-6 py-3 border border-gray-200">Waktu Input</th>
              <th className="px-6 py-3 border border-gray-200">Waktu Distribusi</th>
              <th className="px-6 py-3 border border-gray-200">Waktu Penggunaan</th>
              <th className="px-6 py-3 border border-gray-200">PPN</th>
              <th className="px-6 py-3 border border-gray-200">Subtotal</th>
              <th className="px-6 py-3 border border-gray-200 w-50">Terkirim ke SIMRS</th>
              <th className="px-6 py-3 border border-gray-200">Cetak</th>
              {mode === "sale" && (
                <th className="px-6 py-3 border border-gray-200">Konfirmasi</th>
              )}
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
                  <td className="border border-gray-200 px-6 py-2 text-center text-gray-600">
                    #{po.id}
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
                    {po.ppn ?? 0}%
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700">
                    {formatRupiah(po.subtotal ?? 0)}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-gray-700 text-center">
                      {po.simrs_sync ? (
                        <p>Terkirim</p>
                      ) : (
                        <button
                          onClick={() => handleSend(po.id)}
                          disabled={sendingId === po.id}
                          className={`px-3 py-1 rounded text-sm flex items-center justify-center gap-2
                            ${
                              sendingId === po.id
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-green-100 hover:bg-green-200 text-gray-700"
                            }
                          `}
                        >
                          {sendingId === po.id && (
                            <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          )}
                          {sendingId === po.id ? "Mengirim..." : "Kirim SIMRS"}
                        </button>
                      )}
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

                  {mode === "sale" && (
                    <td className="border border-gray-200 px-6 py-2 text-center">

                      {po.vendor_confirmation_at ? (
                        // Already confirmed → show timestamp
                        <span className="text-green-700 font-medium">
                          {formatToReadableLocal(po.vendor_confirmation_at)}
                        </span>
                      ) : (
                        // Not confirmed → show button
                        <button
                          onClick={() => onConfirm(po)}
                          className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded text-sm"
                        >
                          Konfirmasi
                        </button>
                      )}

                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
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
