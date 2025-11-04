// src/pages/barang/BarangModal.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { addBarang, editBarang, fetchBarang } from "../../store/barangSlice";

export default function BarangModal({ open, onClose, mode, barang }) {
  if (!open) return null;
  const dispatch = useDispatch();
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    barang_nama: "",
    serial_number: "",
    barang_hpp: "",
    id_satuan_kecil: "",
    barang_id_simrs: "",
  });

  const [errors, setErrors] = useState({});
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [loadingSatuan, setLoadingSatuan] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && barang) {
      setFormData({
        barang_nama: barang.barang_nama || "",
        serial_number: barang.serial_number || "",
        barang_hpp: barang.barang_hpp || "",
        id_satuan_kecil: barang.id_satuan_kecil || "",
        barang_id_simrs: barang.barang_id_simrs || "",
      });
    } else {
      setFormData({
        barang_nama: "",
        serial_number: "",
        barang_hpp: "",
        id_satuan_kecil: "",
        barang_id_simrs: "",
      });
    }
    setErrors({});
  }, [isEdit, barang, open]);

  // --- Load satuan on mount
  useEffect(() => {
    if (!open) return;
    fetchSatuanOptions("");
  }, [open]);

  const fetchSatuanOptions = (nama) => {
    setLoadingSatuan(true);
    axiosClient
      .get(`/barang/satuan?nama=${encodeURIComponent(nama)}`)
      .then((res) => {
        const list = res.data?.data || [];
        setSatuanOptions(list.map((s) => ({ value: s.mst_id, label: s.mst_nama })));
      })
      .finally(() => setLoadingSatuan(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSelectChange = (opt) => {
    setFormData((p) => ({ ...p, id_satuan_kecil: opt?.value || "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.barang_nama.trim()) errs.barang_nama = "Nama barang wajib diisi";
    if (!formData.id_satuan_kecil) errs.id_satuan_kecil = "Satuan wajib dipilih";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...formData };
    setSubmitting(true);
    const action = isEdit
      ? editBarang({ barang_id: barang.barang_id, payload })
      : addBarang(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchBarang({ page: 1, limit: 20 }));
        onClose();
      })
      .finally(() => setSubmitting(false));
  };

  const customSelectStyle = {
    control: (base) => ({
      ...base,
      borderColor: "#e5e7eb",
      boxShadow: "none",
      "&:hover": { borderColor: "#93c5fd" },
    }),
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
              name="barang_nama"
              value={formData.barang_nama}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md ${
                errors.barang_nama ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.barang_nama && (
              <p className="text-xs text-red-500 mt-1">{errors.barang_nama}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">HPP</label>
            <input
              type="number"
              name="barang_hpp"
              value={formData.barang_hpp}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Satuan</label>
            <Select
              isSearchable
              isClearable
              isLoading={loadingSatuan}
              options={satuanOptions}
              onInputChange={(v) => fetchSatuanOptions(v)}
              value={
                satuanOptions.find((s) => s.value === formData.id_satuan_kecil) || null
              }
              onChange={handleSelectChange}
              placeholder="Cari satuan..."
              styles={customSelectStyle}
            />
            {errors.id_satuan_kecil && (
              <p className="text-xs text-red-500 mt-1">{errors.id_satuan_kecil}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ID Barang SIMRS</label>
            <input
              type="text"
              name="barang_id_simrs"
              value={formData.barang_id_simrs}
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
