// src/pages/users/UserModal.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { addUser, editUser, fetchUsers } from "../../store/userSlice";

export default function UserModal({ open, onClose, mode, user }) {
  if (!open) return null;
  const dispatch = useDispatch();
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    password: "",
    confirmPassword: "",
    nip: "",
    grupUser: "",
    unit: "",
    keterangan: "",
  });

  const [errors, setErrors] = useState({});
  const [units, setUnits] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState({ unit: false, group: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && user) {
      console.log(user)
      setFormData({
        username: user.username || "",
        nama: user.nama || "",
        password: "",
        confirmPassword: "",
        nip: user.nip || "",
        grupUser: user.id_users_group || "",
        unit: user.id_master_unit || "",
        keterangan: user.keterangan || "",
      });
    } else {
      setFormData({
        username: "",
        nama: "",
        password: "",
        confirmPassword: "",
        nip: "",
        grupUser: "",
        unit: "",
        keterangan: "",
      });
    }
    setErrors({});
  }, [isEdit, user, open]);

  // Load dropdowns
  useEffect(() => {
    if (!open) return;
    setLoading({ group: true, unit: true });

    axiosClient
      .get("/user/group")
      .then((res) => {
        setGroups(
          (res.data?.data || []).map((g) => ({ value: g.id, label: g.group_nama }))
        );
      })
      .catch((err) => {
        console.error("Failed to load groups:", err);
      })
      .finally(() => setLoading((l) => ({ ...l, group: false })));

    axiosClient
      .get("/unit")
      .then((res) => {
        setUnits((res.data?.data || []).map((u) => ({ value: u.id, label: u.nama })));
      })
      .catch((err) => {
        console.error("Failed to load units:", err);
      })
      .finally(() => setLoading((l) => ({ ...l, unit: false })));
  }, [open]);

  // ----- NEW: generic change handlers -----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSelectChange = (name, opt) => {
    setFormData((p) => ({ ...p, [name]: opt?.value || "" }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };
  // ---------------------------------------

  // Validate form
  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = "Username wajib diisi";
    if (!formData.nama.trim()) errs.nama = "Nama wajib diisi";
    if (!formData.grupUser) errs.grupUser = "Grup user wajib dipilih";

    if (!isEdit && !formData.password.trim()) errs.password = "Password wajib diisi";
    else if (formData.password && formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Konfirmasi password tidak cocok";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle save
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      username: formData.username,
      nama: formData.nama,
      id_users_group: formData.grupUser,
      id_master_unit: formData.unit || null,
      nip: formData.nip || "",
      keterangan: formData.keterangan || "",
    };

    if (formData.password && formData.password.trim()) payload.password = formData.password;

    setSubmitting(true);
    const action = isEdit ? editUser({ id: user.id, payload }) : addUser(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        // refresh first page (you can keep current page logic here if needed)
        dispatch(fetchUsers({ page: 1, limit: 20 }));
        onClose();
      })
      .catch((err) => {
        // note: thunks already show toast for errors; but you can map errors here if backend returns field errors
        console.error("Save failed:", err);
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
            {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-md ${
                errors.username ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-500`}
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap <span className="text-red-500">*</span>
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
            {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password {isEdit ? <span className="text-gray-500 text-sm">(opsional)</span> : <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-200"
                }`}
                placeholder={isEdit ? "Biarkan kosong jika tidak ingin mengubah" : ""}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Grup User */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grup User <span className="text-red-500">*</span>
            </label>
            <Select
              isSearchable
              isClearable
              isLoading={loading.group}
              options={groups}
              value={groups.find((g) => g.value === formData.grupUser) || null}
              onChange={(opt) => handleSelectChange("grupUser", opt)}
              placeholder="Pilih grup user..."
              styles={customSelectStyle}
            />
            {errors.grupUser && <p className="text-xs text-red-500 mt-1">{errors.grupUser}</p>}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <Select
              isSearchable
              isClearable
              isLoading={loading.unit}
              options={units}
              value={units.find((u) => u.value === formData.unit) || null}
              onChange={(opt) => handleSelectChange("unit", opt)}
              placeholder="Pilih unit..."
              styles={customSelectStyle}
            />
            {errors.unit && <p className="text-xs text-red-500 mt-1">{errors.unit}</p>}
          </div>

          {/* Keterangan */}
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
