import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { addUnit, editUnit } from "../../store/unitSlice";

export default function UnitModal({ open, onClose, mode, unit }) {
  const dispatch = useDispatch();
  const isEdit = mode === "edit";
  const { pagination } = useSelector((state) => state.unit);

  const [formData, setFormData] = useState({
    nama: "",
    keterangan: "",
    is_pbf: "Tidak",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Reset form on open/edit
  useEffect(() => {
    if (isEdit && unit) {
      setFormData({
        nama: unit.nama || "",
        keterangan: unit.keterangan || "",
        is_pbf: unit.is_pbf || "Tidak",
      });
    } else {
      setFormData({
        nama: "",
        keterangan: "",
        is_pbf: "Tidak",
      });
    }
    setErrors({});
  }, [isEdit, unit, open]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.nama.trim()) errs.nama = "Nama unit wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // raw JSON payload
    const payload = {
      nama: formData.nama.trim(),
      keterangan: formData.keterangan.trim(),
      is_pbf: formData.is_pbf,
    };

    const queryParams = {
      page: pagination.page,
      limit: 20,
    };

    setSubmitting(true);

    const action = isEdit
      ? editUnit({ id: unit.id, payload, queryParams })
      : addUnit({ payload, queryParams });

    dispatch(action)
      .unwrap()
      .then(() => {
        onClose(); // close modal after success
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
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 animate-fadeIn border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Unit" : "Tambah Unit"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Unit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md ${
                errors.nama ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.nama && (
              <p className="text-xs text-red-500 mt-1">{errors.nama}</p>
            )}
          </div>

          {/* PBF */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PBF
            </label>
            <select
              name="is_pbf"
              value={formData.is_pbf}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Keterangan
            </label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        {/* Footer */}
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
              submitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting
              ? "Menyimpan..."
              : isEdit
              ? "Simpan Perubahan"
              : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
