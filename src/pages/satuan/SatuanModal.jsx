// src/pages/satuan/SatuanModal.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { addSatuan, editSatuan, fetchSatuan } from "../../store/satuanSlice";

export default function SatuanModal({ open, onClose, mode, satuan }) {
  if (!open) return null;
  const dispatch = useDispatch();
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({ mst_nama: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && satuan) {
      setFormData({ mst_nama: satuan.mst_nama || "" });
    } else {
      setFormData({ mst_nama: "" });
    }
    setErrors({});
  }, [isEdit, satuan, open]);

  const handleChange = (e) => {
    setFormData({ mst_nama: e.target.value });
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.mst_nama.trim()) errs.mst_nama = "Nama satuan wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...formData };
    setSubmitting(true);

    const action = isEdit
      ? editSatuan({ mst_id: satuan.mst_id, payload })
      : addSatuan(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchSatuan({ page: 1, limit: 20 }));
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
        className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 animate-fadeIn border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Satuan" : "Tambah Satuan"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Satuan</label>
            <input
              type="text"
              name="mst_nama"
              value={formData.mst_nama}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md ${
                errors.mst_nama ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.mst_nama && (
              <p className="text-xs text-red-500 mt-1">{errors.mst_nama}</p>
            )}
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
