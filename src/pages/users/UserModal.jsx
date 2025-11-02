import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

export default function UserFormModal({ 
  open, 
  onClose, 
  onSuccess, 
  mode = "add", // "add" or "edit"
  user = null   // existing user data for edit
}) {
  if (!open) return null;

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

  // Prefill data in edit mode
  useEffect(() => {
    if (isEdit && user) {
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
  }, [isEdit, user, open]);

  // Fetch groups
  useEffect(() => {
    if (!open) return;
    setLoading((l) => ({ ...l, group: true }));
    axiosClient
      .get("/user/group")
      .then((res) => {
        if (res.data?.data) {
          setGroups(res.data.data.map((g) => ({ value: g.id, label: g.group_nama })));
        }
      })
      .finally(() => setLoading((l) => ({ ...l, group: false })));
  }, [open]);

  // Fetch units
  useEffect(() => {
    if (!open) return;
    setLoading((l) => ({ ...l, unit: true }));
    axiosClient
      .get("/unit")
      .then((res) => {
        if (res.data?.data) {
          setUnits(res.data.data.map((u) => ({ value: u.id, label: u.nama })));
        }
      })
      .finally(() => setLoading((l) => ({ ...l, unit: false })));
  }, [open]);

  // Field change handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };
  const handleSelectChange = (name, opt) => {
    setFormData((p) => ({ ...p, [name]: opt?.value || "" }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username wajib diisi";
    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.grupUser) newErrors.grupUser = "Grup user wajib dipilih";

    // If ADD mode: password is required
    // If EDIT mode: password only validated if filled
    if (!isEdit && !formData.password.trim()) {
        newErrors.password = "Password wajib diisi";
    } else if (formData.password && !formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
    ) {
        newErrors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      username: formData.username,
      nama: formData.nama,
      id_users_group: formData.grupUser,
      id_master_unit: formData.unit || null,
      nip: formData.nip || "",
      keterangan: formData.keterangan || "",
    };

    // Only include password if it's filled in edit mode
    if (formData.password.trim()) {
        payload.password = formData.password;
    }

    const req = isEdit
      ? axiosClient.put(`/user/${user.id}`, payload)
      : axiosClient.post("/auth/register", payload);

    req
      .then((res) => {
        toast.success(
          isEdit
            ? "Pengguna berhasil diperbarui!"
            : "Pengguna berhasil ditambahkan!"
        );
        if (onSuccess) onSuccess();
        onClose();
      })
      .catch((err) => {
        console.error(err);
        const msg = err.response?.data?.message || "Terjadi kesalahan.";
        toast.error(`Gagal menyimpan: ${msg}`);
      })
      .finally(() => setSubmitting(false));
  };

  const customSelectStyle = {
    control: (base, state) => ({
      ...base,
      borderColor: "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 2px #93c5fd" : "none",
      "&:hover": { borderColor: "#93c5fd" },
      minHeight: "38px",
    }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
  };

  const handleModalClick = (e) => e.stopPropagation();

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
            {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition">
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
              className={`w-full mt-1 px-3 py-2 border rounded-md ${
                errors.username ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-500`}
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
              className={`w-full mt-1 px-3 py-2 border rounded-md ${
                errors.nama ? "border-red-500" : "border-gray-200"
              } focus:ring-2 focus:ring-blue-500`}
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
              isLoading={loading.group}
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
              isLoading={loading.unit}
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
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
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
            {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
