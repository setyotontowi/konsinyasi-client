import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { addUserGroup, editUserGroup } from "../../store/userGroupSlice";

export default function UserGroupModal({ open, onClose, mode, group }) {
  const dispatch = useDispatch();
  const isEdit = mode === "edit";
  const [formData, setFormData] = useState({ group_nama: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && group) {
      setFormData({ group_nama: group.group_nama || "" });
    } else {
      setFormData({ group_nama: "" });
    }
    setErrors({});
  }, [isEdit, group, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.group_nama.trim()) errs.group_nama = "Nama grup wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { group_nama: formData.group_nama.trim() };
    setSubmitting(true);

    const action = isEdit
      ? editUserGroup({ id: group.id, payload })
      : addUserGroup({ payload });

    dispatch(action)
      .unwrap()
      .then(() => onClose())
      .catch((err) => console.error("Save failed:", err))
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
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Grup Pengguna" : "Tambah Grup Pengguna"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Grup <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="group_nama"
              value={formData.group_nama}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md ${
                errors.group_nama ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-500`}
              placeholder="Contoh: Administrator"
            />
            {errors.group_nama && (
              <p className="text-xs text-red-500 mt-1">{errors.group_nama}</p>
            )}
          </div>
        </form>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-4 py-2 rounded-md text-white transition ${
              submitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
