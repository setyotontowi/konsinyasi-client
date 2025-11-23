import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { 
  addPermintaanDistribusi,
  editPermintaanDistribusi,
  fetchPermintaanDistribusi,
  fetchPermintaanDistribusiById,
  pemakaianBarang,
} from "../../store/permintaanDistribusiSlice";
import { kirimDistribusi } from "../../store/distribusiSlice";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { formatToReadableLocal, getLocalNow } from "../../helper/helper";
import { createPurchaseOrder } from "../../store/purchaseSlice";

export default function PurchaseUsedModal({ open, data, onClose }) {
  const dispatch = useDispatch();

  useEffect(() => {
   if (open && data?.pd_id) {
    dispatch(fetchPermintaanDistribusiById(data.pd_id))
      .unwrap()
      .then((detail) => {
        // fill formData & items from API result
        setFormData({
          waktu: getLocalNow(),
          waktu_kirim: detail?.waktu_kirim ? formatToReadableLocal(detail.waktu_kirim) : getLocalNow(),
          id_master_unit: detail?.id_master_unit || "",
          id_master_unit_tujuan: detail?.id_master_unit_tujuan || "",
          nama_unit_asal: detail?.nama_unit_asal || "",
          nama_unit_tujuan: detail?.nama_unit_tujuan || "",
          nomor_rm: detail?.nomor_rm || "",
          nama_pasien: detail?.nama_pasien || "",
          nama_ruang: detail?.nama_ruang || "",
          diagnosa: detail?.diagnosa || "",
        });
        setItems(detail?.items || []);
      })
      .catch(() => {
        toast.error("Gagal memuat detail permintaan distribusi");
      });
  }

  
}, [data?.pd_id, open]);

  const [formData, setFormData] = useState({
    waktu: getLocalNow(),
    waktu_kirim: data?.waktu_kirim ? formatToReadableLocal(data.waktu_kirim) : getLocalNow(),
    id_master_unit: data?.id_master_unit || "",
    id_master_unit_tujuan: data?.id_master_unit_tujuan || "",
    nama_unit_asal: data?.nama_unit_asal || "",
    nama_unit_tujuan: data?.nama_unit_tujuan || "",
    nomor_rm: data?.nomor_rm || "",
    nama_pasien: data?.nama_pasien || "",
    nama_ruang: data?.nama_ruang || "",
    diagnosa: data?.diagnosa || "",
  });

  const [items, setItems] = useState(data?.items || []);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length === 0) {
        toast.error("Barang wajib diisi");
        return; // stop the function if no items
    }

    setSubmitting(true);

    // perlu diubah
    const payload = {
      waktu: new Date(formData.waktu),
      id_master_unit: parseInt(formData.id_master_unit),
      id_master_unit_tujuan: parseInt(formData.id_master_unit_tujuan),
      nomor_rm: formData.nomor_rm,
      nama_pasien: formData.nama_pasien,
      nama_ruang : formData.nama_ruang,
      diagnosa: formData.diagnosa,
      items: items.map((it) => ({
        pdd_id : parseInt(it.pdd_id),
        id_master_barang: parseInt(it.id_master_barang),
        id_master_satuan: parseInt(it.id_master_satuan),
        qty: it.qty,
        qty_real: it.qty_real,
      })),
    };


    dispatch(createPurchaseOrder({payload}))
        .unwrap()
        .then(() => {
          const distribusi = mode === "pemakaian"? false : mode === "distribusi"? true : null;
          dispatch(fetchPermintaanDistribusi({ page: 1, limit: 20, onDistribusi: distribusi }));
          onClose();
        })
        .catch((err) => {
        console.error("Save failed:", err);
        })
        .finally(() => setSubmitting(false));

  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}>
      <div 
        className="bg-white w-full max-w-6xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh] animate-fadeIn"
        onClick={(e) => {e.stopPropagation()}}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-lg font-semibold mb-4">Detail Pemakaian - Buat PO</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* === Section A: Header === */}
          <div className="grid grid-cols-2 gap-6">
            {/* Metadata */}
            <div>
              <h3 className="font-semibold text-sm mb-2 text-gray-600 uppercase">Unit</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium">Waktu PO</label>
                  <input
                    type="datetime"
                    name="waktu"
                    value={formData.waktu}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Waktu Pengiriman</label>
                  <input
                    type="datetime"
                    name="waktu"
                    disabled={true}
                    value={formData.waktu_kirim}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                {/* Unit Asal */}
                <div>
                  <label className="block text-sm font-medium">Unit Asal</label>
                  <input
                    type="text"
                    name="unit"
                    disabled={true}
                    value={formData.nama_unit_asal || ""}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>

                {/* Unit Tujuan */}
                <div>
                  <label className="block text-sm font-medium">Unit Tujuan</label>
                  <input
                    type="text"
                    name="unit_tujuan"
                    disabled={true}
                    value={formData.nama_unit_tujuan || ""}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
              </div>
            </div>

            {/* Data Pasien */}
            <div>
              <h3 className="font-semibold text-sm mb-2 text-gray-600 uppercase">Data Pasien</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium">No. RM</label>
                  <input
                    type="text"
                    name="nomor_rm"
                    disabled={true}
                    value={formData.nomor_rm}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Nama Pasien</label>
                  <input
                    type="text"
                    name="nama_pasien"
                    disabled={true}
                    value={formData.nama_pasien}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Nama Ruang</label>
                  <input
                    type="text"
                    name="nama_ruang"
                    disabled={true}
                    value={formData.nama_ruang}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Diagnosa</label>
                  <input
                    type="text"
                    name="diagnosa"
                    disabled={true}
                    value={formData.diagnosa}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* === Section B: Detail === */}
          <div className="mt-8">
            

            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 border border-gray-200">Barang</th>
                  <th className="px-3 py-2 border border-gray-200">Satuan</th>
                  <th className="px-3 py-2 border border-gray-200">Qty</th>
                  <th className="px-3 py-2 border border-gray-200 w-5">Pemakaian</th>
                  <th className="px-3 py-2 border border-gray-200 ">Hpp</th>
                  <th className="px-3 py-2 border border-gray-200 ">Total Harga</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500 py-3">
                      Belum ada item ditambahkan.
                    </td>
                  </tr>
                ) : (
                  items.map((item, i) => (
                    <tr key={i} className="border border-gray-200 hover:bg-gray-50">
                      <td className="border border-gray-200 px-3 py-2">{item.nama_barang}</td>
                      <td className="border border-gray-200 px-3 py-2">{item.nama_satuan}</td>
                      <td className="border border-gray-200 px-3 py-2">{item.qty}</td>
                      <td className="border border-gray-200 px-3 py-2">{item.qty_real}</td>
                      <td className="border border-gray-200 px-3 py-2">{item.barang_hpp}</td>
                      <td className="border border-gray-200 px-3 py-2">{item.total_harga}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
                type="submit"
                className={`
                  px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700
                `}
              >
              Buat PO
              </button>
          </div>
        </form>
        </div>


      </div>
  );
}
