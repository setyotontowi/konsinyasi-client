// src/pages/barang/BarangModal.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-select";
import { addBarang, editBarang, fetchBarang } from "../../store/barangSlice";

export default function BarangModal({ open, onClose, mode, barang }) {
  if (!open) return null;
  const dispatch = useDispatch();
  const { satuanList } = useSelector((state) => state.barang);
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    nama: "",
    kode: "",
    satuan: "",
    keterangan: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && barang) {
      setFormData({
        nama: barang.nama || "",
        kode: barang.kode || "",
        satuan: barang.id_satuan || "",
        keterangan: barang.keterangan || "",
      });
    } else {
      setFormData({ nama: "", kode: "", satuan: "", keterangan: "" });
    }
    setErrors({});
  }, [isEdit, barang, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSelectChange = (opt) => {
    setFormData((p) => ({ ...p, satuan: opt?.value || "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.nama.trim()) errs.nama = "Nama barang wajib diisi";
    if (!formData.kode.trim()) errs.kode = "Kode wajib diisi";
    if (!formData.satuan) errs.satuan = "Satuan wajib dipilih";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      nama: formData.nama,
      kode: formData.kode,
      id_satuan: formData.satuan,
      keterangan: formData.keterangan || "",
    };
    setSubmitting(true);
    const action = isEdit
      ? editBarang({ id: barang.id, payload })
      : addBarang(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchBarang({ page: 1, limit: 20 }));
        onClose();
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 animate-fadeIn border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Barang" : "Tambah Barang"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md ${
                errors.nama ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Kode Barang</label>
            <input
              type="text"
              name="kode"
              value={formData.kode}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md ${
                errors.kode ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.kode && <p className="text-xs text-red-500 mt-1">{errors.kode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Satuan</label>
            <Select
              isSearchable
              isClearable
              options={(satuanList || []).map((s) => ({ value: s.id, label: s.nama }))}
              value={
                satuanList.find((s) => s.id === formData.satuan)
                  ? { value: formData.satuan, label: satuanList.find((s) => s.id === formData.satuan)?.nama }
                  : null
              }
              onChange={handleSelectChange}
              placeholder="Pilih satuan..."
            />
            {errors.satuan && <p className="text-xs text-red-500 mt-1">{errors.satuan}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Keterangan</label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-4 py-2 rounded-md text-white transition ${
              submitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
