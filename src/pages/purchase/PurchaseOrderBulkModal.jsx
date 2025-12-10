import { useEffect, useState } from "react";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function PurchaseOrderBulkModal({ open, onClose }) {
  const [tanggal, setTanggal] = useState("");
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (!open) return;

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

  const fetchPurchasedList = (unitId) => {
    setLoadingItems(true);
    axiosClient
      .get(`/get_list_purchased?id_unit=${unitId}`)
      .then((res) => {
        setItems(res.data.data || []);
      })
      .catch(() => toast.error("Gagal memuat list pembelian"))
      .finally(() => setLoadingItems(false));
  };

  const handleUnitChange = (opt) => {
    setSelectedUnit(opt);
    if (opt) fetchPurchasedList(opt.value);
  };

  const handleSubmit = () => {
    if (!tanggal) return toast.error("Tanggal wajib diisi");
    if (!selectedUnit) return toast.error("PBF wajib dipilih");
    if (items.length === 0) return toast.error("Tidak ada item");

    const payload = {
      tanggal: tanggal,
      unit_id: selectedUnit.value,
      items: items.map((it) => it.id_purchase_used),
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
          
          {/* === Date + PBF NEXT TO EACH OTHER === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded p-2"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
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
          <div className="border rounded p-3 max-h-80 overflow-auto">
            {loadingItems ? (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm">
                Tidak ada data pembelian.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-2 text-left">Barang</th>
                    <th className="p-2 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{it.nama_barang}</td>
                      <td className="p-2 text-right">{it.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* === Footer Buttons === */}
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
