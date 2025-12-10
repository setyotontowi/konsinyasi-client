import { useEffect, useState } from "react";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { formatToReadableDate, getLocalNow } from "../../helper/helper";

export default function PurchaseOrderBulkModal({ open, onClose }) {
  
  const [formData, setFormData] = useState({
    tanggal: getLocalNow(),
    id_unit: "",
  });

  const [units, setUnits] = useState([]);
  const [items, setItems] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  // Reset items when modal closes
  useEffect(() => {
    if (!open) {
      setItems([]);
      return;
    }

    // fetch PBF list
    setLoadingUnits(true);
    axiosClient
      .get("/unit?is_pbf=Ya")
      .then((res) => {
        setUnits(
          (res.data.data || []).map((u) => ({
            value: u.id,
            label: u.nama,
          }))
        );
      })
      .catch(() => toast.error("Gagal memuat data pabrik"))
      .finally(() => setLoadingUnits(false));
  }, [open]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnitChange = (opt) => {
    const id = opt?.value || "";
    setFormData((prev) => ({ ...prev, id_unit: id }));
    if (id) fetchPurchasedList(id);
  };


  const fetchPurchasedList = (unitId) => {
    setLoadingItems(true);
    axiosClient
      .get(`/purchase/used-items-bulk?id_unit=${unitId}`)
      .then((res) => {
        setItems(res.data.data || []); // backend returns rows, min_time, max_time
      })
      .catch(() => toast.error("Gagal memuat list pembelian"))
      .finally(() => setLoadingItems(false));
  };

  // -------------------------
  // Submit Form
  // -------------------------
  const handleSubmit = () => {
    if (!formData.tanggal) return toast.error("Tanggal wajib diisi");
    if (!formData.id_unit) return toast.error("PBF wajib dipilih");
    if (!items.rows || items.rows.length === 0) return toast.error("Tidak ada item");

    const payload = {
      tanggal: formData.tanggal,
      id_unit: formData.id_unit,
      items: items.rows.map((it) => it.pdd_id), // depends on your backend structure
    };

    axiosClient
      .post("/purchase_order/bulk", payload)
      .then(() => {
        toast.success("Berhasil membuat Purchase Order");
        onClose();
      })
      .catch(() => toast.error("Gagal membuat PO"));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Buat Purchase Order (Bulk)
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal</label>
              <input
                type="datetime-local"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 text-gray-500"
              />
            </div>

            {/* PBF */}
            <div>
              <label className="block text-sm font-medium mb-1">Pilih PBF</label>
              <Select
                options={units}
                isLoading={loadingUnits}
                onChange={handleUnitChange}
                placeholder="Pilih PBF..."
              />
            </div>

          </div>

          {/* === TABLE BELOW === */}
          <div className="max-h-80 overflow-auto">
            {loadingItems ? (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : !items.rows || items.rows.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm">
                Tidak ada data pembelian.
              </div>
            ) : (
              <>
                <table className="min-w-full text-sm border border-gray-200 mb-4">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="px-3 py-2 border border-gray-200">Barang</th>
                      <th className="px-3 py-2 border border-gray-200">Pemakaian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.rows.map((it, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-3 py-2 border border-gray-200">
                          {it.nama_barang}
                        </td>
                        <td className="px-3 py-2 border border-gray-200 text-right">
                          {it.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Date Range Label */}
                <small className="mt-12 block">
                  <i>
                    Data transaksi dari tanggal{" "}
                    {formatToReadableDate(items.min_time)} sampai{" "}
                    {formatToReadableDate(items.max_time)}
                  </i>
                </small>
              </>
            )}
          </div>

          {/* === Footer Button === */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Buat PO
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
