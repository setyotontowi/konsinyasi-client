import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axiosClient from "../../api/axiosClient";
import Select from "react-select";
import { toast } from "react-toastify";

export default function AddUserModal({ open, onClose, onSuccess }) {
  if (!open) return null;

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
  const [unitLoading, setUnitLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Units
  useEffect(() => {
    if (!open) return;
    setUnitLoading(true);
    axiosClient
      .get("/unit")
      .then((res) => {
        if (res.data?.data) {
          setUnits(res.data.data.map((u) => ({ value: u.id, label: u.nama })));
        }
      })
      .catch((err) => console.error("Failed to fetch units:", err))
      .finally(() => setUnitLoading(false));
  }, [open]);

  // Fetch Groups
  useEffect(() => {
    if (!open) return;
    setGroupLoading(true);
    axiosClient
      .get("/user/group")
      .then((res) => {
        if (res.data?.data) {
          setGroups(
            res.data.data.map((g) => ({ value: g.id, label: g.group_nama }))
          );
        }
      })
      .catch((err) => console.error("Failed to fetch groups:", err))
      .finally(() => setGroupLoading(false));
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name, option) => {
    setFormData((prev) => ({ ...prev, [name]: option?.value || "" }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username wajib diisi";
    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.password.trim()) newErrors.password = "Password wajib diisi";
    if (!formData.grupUser) newErrors.grupUser = "Grup user wajib dipilih";

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Prepare request payload
    const payload = {
      username: formData.username,
      password: formData.password,
      nama: formData.nama,
      id_users_group: formData.grupUser,
      id_master_unit: formData.unit || null,
      keterangan: formData.keterangan || "",
    };

    axiosClient
      .post("/auth/register", payload)
      .then((res) => {
        toast.success("Pengguna berhasil ditambahkan!");
        if (onSuccess) onSuccess(); // optional: reload table
        onClose();
      })
      .catch((err) => {
        if (err.response?.data?.message) {
          toast.error(`Gagal menyimpan: ${err.response.data.message}`);
        } else {
          toast.error("Terjadi kesalahan saat menyimpan data.");
        }
      })
      .finally(() => setSubmitting(false));
  };

  const handleModalClick = (e) => e.stopPropagation();

  const customSelectStyle = {
    control: (base, state) => ({
      ...base,
      borderColor:
        errors.unit || errors.grupUser ? "#ef4444" : "#e5e7eb", // red-500 / gray-200
      boxShadow: state.isFocused ? "0 0 0 2px #93c5fd" : "none",
      "&:hover": { borderColor: "#93c5fd" },
      minHeight: "38px",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 animate-fadeIn border border-gray-200"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Tambah Pengguna
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
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
              className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.username ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            )}
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
              className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.nama ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.nama && (
              <p className="text-xs text-red-500 mt-1">{errors.nama}</p>
            )}
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Konfirmasi Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
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
              isLoading={groupLoading}
              options={groups}
              value={groups.find((g) => g.value === formData.grupUser) || null}
              onChange={(opt) => handleSelectChange("grupUser", opt)}
              placeholder="Pilih grup user..."
              styles={customSelectStyle}
            />
            {errors.grupUser && (
              <p className="text-xs text-red-500 mt-1">{errors.grupUser}</p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <Select
              isSearchable
              isClearable
              isLoading={unitLoading}
              options={units}
              value={units.find((u) => u.value === formData.unit) || null}
              onChange={(opt) => handleSelectChange("unit", opt)}
              placeholder="Pilih unit..."
              styles={customSelectStyle}
            />
            {errors.unit && (
              <p className="text-xs text-red-500 mt-1">{errors.unit}</p>
            )}
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
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition border border-gray-200"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-4 py-2 rounded-md text-white transition border border-gray-200 ${
              submitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
