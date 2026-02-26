// /pages/distribusi/PermintaanDistribusiTable.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermintaanDistribusi } from "../../store/permintaanDistribusiSlice";
import Pagination from "../../components/Pagination";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";


// onDistribusi
// true = dipakai di halaman distribusi. menampilkan data yang belum didistribusikan saja
// false = dipakai di halaman pemakaian distribusi. menampilkan data yang sudah didistribusikan saja.
// null = dipakai di halaman permintaan distribusi. menampilkan semua data, baik yang belum dan yang sudah.

// Definisi unit asal dan unit tujuan sempat terbalik.
// Unit asal adalah unit yang meminta (pbf nya), unit tujuan adalah non pbfnya
export default function PermintaanDistribusiTable({ search, filters, onView, onInput, onEdit, onDelete, onDistribusi, onCountChange}) {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((state) => state.permintaanDistribusi);
  const { page, totalPages, totalItems } = pagination;
  const [sendingId, setSendingId] = useState(null);
  const limit = 20;

  useEffect(() => {
    if (sendingId) return;

    const delay = setTimeout(() => {
      dispatch(fetchPermintaanDistribusi({ page, limit, search, filters, onDistribusi }));
    }, 400);
    return () => clearTimeout(delay);
  }, [dispatch, page, search, filters, sendingId]);

  useEffect(() => {
    if (onCountChange) {
      onCountChange(totalItems || 0);
    }
  }, [totalItems, onCountChange]);

  if (loading)
    return (
      <div className="p-6">
        <p className="text-gray-500 animate-pulse">Loading permintaan distribusi...</p>
      </div>
    );

  const handleSend = async (id_pd) => {
    try {
      setSendingId(id_pd);

      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // toast.success(`PO berhasil dikirim ke SIMRS (mock) ${id_pd}`);

      const res = await axiosClient.post(
        `/purchase/send_simrs/${id_pd}`
      );

      toast.success("PO berhasil dikirim ke SIMRS");
      
      // setItems(res.data.data || []);
    } catch (err) {
      console.log(err)
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
              <th className="px-6 py-3 font-medium border border-gray-200 w-5">No</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Nomor RM</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Nama Pasien</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Waktu Permintaan</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Unit Tujuan</th>
              <th className="px-6 py-3 font-medium border border-gray-200">Status</th>
              {
                onDistribusi === false && (
                  <>
                  <th className="px-6 py-3 font-medium border border-gray-200 w-10">Sudah dipakai</th>
                  <th className="px-6 py-3 font-medium border border-gray-200">Kirim Ke SIMRS</th>
                  </>
                )
              }
              <th className="px-6 py-3 font-medium border border-gray-200 w-10">Aksi</th>
            </tr>
          </thead>
          <tbody>
             {list.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center text-gray-500 py-6 italic"
                >
                  Tidak ada permintaan distribusi.
                </td>
              </tr>
            ) : (
            list.map((d, index) => (
              <tr key={`${d.pd_id}-${index}`} className="hover:bg-gray-50 transition">
                <td className="border border-gray-200 px-6 py-2 text-center text-gray-600">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700 italic">
                  {d.nomor_rm}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {d.nama_pasien}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {new Date(d.waktu).toLocaleString("id-ID")}
                </td>
                <td className="border border-gray-200 px-6 py-2 text-gray-700">
                  {d.unit_asal}
                </td>
                <td
                  className={`border border-gray-200 px-6 py-2 text-center ${
                    d.terdistribusi
                      ? "text-gray-700"
                      : "text-red-700"
                  }`}
                >
                  {d.status_distribusi || "Belum Didistribusikan"}
                </td>

                {onDistribusi === false && (
                  <>
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    {d.sudah_dipakai ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Ya
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        Belum
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    {d.simrs_sync ? (
                        <p>Terkirim</p>
                      ) : (
                    <button
                          onClick={() => handleSend(d.pd_id)}
                          disabled={sendingId === d.pd_id}
                          className={`px-3 py-1 rounded text-sm flex items-center justify-center gap-2
                            ${
                              sendingId === d.pd_id
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-green-100 hover:bg-green-200 text-gray-700"
                            }
                          `}
                        >
                          {sendingId === d.pd_id && (
                            <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          )}
                          {sendingId === d.pd_id ? "Mengirim..." : "Kirim SIMRS"}
                    </button>
                    )}
                  </td>
                  </>
                )}

                {/* Actions */}
                {!onDistribusi && (
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      {d.terdistribusi ? (
                        <>
                          {( !d.sudah_dipakai && onDistribusi === false ) ? (
                            // --- Input Button ---
                            <button
                              onClick={() => onInput(d)}
                              className="flex items-center gap-1 px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded text-sm transition"
                            >
                              <PencilIcon className="h-4 w-4" /> Input
                            </button>
                          ) : (
                            // --- Lihat Button ---
                            <button
                              onClick={() => onView(d)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition"
                            >
                              <EyeIcon className="h-4 w-4" /> Lihat
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => onEdit(d)}
                            className="flex items-center gap-1 px-3 py-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded text-sm transition"
                          >
                            <PencilIcon className="h-4 w-4" /> Edit
                          </button>

                          <button
                            onClick={() => onDelete(d)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm transition"
                          >
                            <TrashIcon className="h-4 w-4" /> Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                )}
                {onDistribusi && (
                  <td className="border border-gray-200 px-6 py-2 text-center">
                    <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onView(d)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm transition"
                        >
                          <EyeIcon className="h-4 w-4" /> Detail
                        </button>
                    </div>
                  </td>
                )}
              </tr>
            )))}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          perPage={limit}
          totalItems={totalItems}
          onPageChange={(p) => dispatch(fetchPermintaanDistribusi({ page: p, search }))}
        />
      </div>
    </div>
  );
}
