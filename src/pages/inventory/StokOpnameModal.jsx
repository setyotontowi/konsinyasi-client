import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  fetchStokOpnameById,
  updateStokOpname,
  createStokOpname,
} from "../../store/stokOpnameSlice";
import axiosClient from "../../api/axiosClient";
import Select from "react-select";
import { formatToReadableDate, getAuthUser } from "../../helper/helper";
import { toast } from "react-toastify";
import StokOpnameDetailModal from "./StokOpnameDetailModal";

export default function StokOpnameModal({ open, data, onClose, onSave }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    waktu_input: "",
    id_master_unit: "",
    nama_unit: "",
    id_users: "",
    nama_user: "",
    details: [],
  });

  const [loading, setLoading] = useState({
    fetching: false,
    unit: false,
  });

  const [units, setUnits] = useState([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  // Fetch detail data by ID (edit/view mode)
  useEffect(() => {
    if (!open) return;
    if (data?.id && !data?.details) {
      setLoading((l) => ({ ...l, fetching: true }));
      dispatch(fetchStokOpnameById(data.id))
        .unwrap()
        .then((res) => setForm(res))
        .catch(() => toast.error("Gagal memuat data opname"))
        .finally(() => setLoading((l) => ({ ...l, fetching: false })));
    } else if (data?.details) {
      setForm(data);
    }
  }, [open, data?.id, dispatch]);

  // Prepare default form for new record
  useEffect(() => {
    if (!open) return;
    const authUser = getAuthUser();

    if (!data?.id) {
      const now = new Date();
      const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      const formattedNow = local.toISOString().slice(0, 16);

      setForm({
        waktu_input: formattedNow,
        id_users: authUser.id || "",
        nama_user: authUser.username || "",
        id_master_unit: authUser.id_master_unit || "",
        details: [],
      });
    } else if (data?.details) {
      setForm(data);
    }
  }, [open, data]);

  // Fetch unit list
  useEffect(() => {
    if (!open) return;

    setLoading((l) => ({ ...l, unit: true }));
    axiosClient
      .get("/unit")
      .then((res) => {
        setUnits(
          (res.data?.data || []).map((u) => ({
            value: u.id,
            label: u.nama,
          }))
        );
      })
      .catch(() => toast.error("Gagal memuat data unit"))
      .finally(() => setLoading((l) => ({ ...l, unit: false })));
  }, [open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setForm({
        waktu_input: "",
        nama_unit: "",
        nama_user: "",
        details: [],
      });
    }
  }, [open]);

  // Add new detail from child modal
  const handleAddDetail = (detail) => {
    setForm((prev) => ({
      ...prev,
      details: [...prev.details, detail],
    }));
  };

  

  const handleEditDetail = (index) => {
    setEditingIndex(index);
    setDetailModalOpen(true);
  };

    // Delete detail record directly via backend
  const handleDeleteDetail = async (id_detail) => {
    if (!id_detail) return toast.error("ID detail tidak ditemukan");

    const confirmDelete = window.confirm(
        "Apakah Anda yakin ingin menghapus detail stok opname ini?"
    );
    if (!confirmDelete) return;

    try {
        await axiosClient.delete(`/inventory/stok-opname/detail/${id_detail}`);

        // Remove it from current state
        setForm((prev) => ({
        ...prev,
        details: prev.details.filter((item) => item.id !== id_detail),
        }));

        toast.success("Detail stok opname berhasil dihapus");
    } catch (err) {
        console.error(err);
        toast.error("Gagal menghapus detail stok opname");
    }
  };


  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.waktu_input) return toast.error("Waktu input harus diisi");
    if (!form.id_master_unit) return toast.error("Unit harus dipilih");
    if (form.details.length === 0)
      return toast.error("Minimal satu barang harus ditambahkan");

    for (let i = 0; i < form.details.length; i++) {
      const d = form.details[i];
      if (!d.id_master_barang)
        return toast.error(`Barang ke-${i + 1} belum dipilih`);
      if (!d.nobatch)
        return toast.error(`No. batch barang ke-${i + 1} belum diisi`);
      if (!d.ed) return toast.error(`ED barang ke-${i + 1} belum diisi`);
      if (!d.kenyataan)
        return toast.error(`Kenyataan barang ke-${i + 1} belum diisi`);
    }

    const action = form.id ? updateStokOpname(form) : createStokOpname(form);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          form.id
            ? "Perubahan stok opname disimpan"
            : "Stok opname berhasil dibuat"
        );
        onSave(form);
        onClose();
      })
      .catch(() => toast.error("Gagal menyimpan stok opname"));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-6xl rounded-lg shadow-lg relative max-h-[90vh] animate-fadeIn "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {form.id ? "Edit Stok Opname" : "Tambah Stok Opname"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Header fields */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Waktu Input
              </label>
              <input
                type="datetime-local"
                name="waktu_input"
                value={formatDateTimeLocal(form.waktu_input)}
                onChange={(e) =>
                  setForm((p) => ({ ...p, waktu_input: e.target.value }))
                }
                className="border border-gray-300 rounded-lg w-full p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Unit</label>
              <Select
                isLoading={loading.unit}
                options={units}
                placeholder="Pilih unit asal..."
                value={
                  units.find((u) => u.value === form.id_master_unit) || null
                }
                onChange={(opt) =>
                  setForm((p) => ({
                    ...p,
                    id_master_unit: opt ? opt.value : "",
                  }))
                }
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">User</label>
              <input
                type="text"
                name="nama_user"
                disabled={true}
                value={form.nama_user || ""}
                className="border border-gray-300 bg-gray-100 rounded-lg w-full p-2 text-sm"
              />
            </div>
          </div>

          {/* Detail items */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold text-sm text-gray-600 uppercase">
                  Detail Barang
                </h3>
                <p className="text-gray-500 text-xs italic">
                  Barang yang sudah ditambahkan dapat dilihat di tabel
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalOpen(true)}
                className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                + Tambah Barang
              </button>
            </div>

            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 text-center w-5">
                    No
                  </th>
                  <th className="border border-gray-200 px-3 py-2">
                    Nama Barang
                  </th>
                  <th className="border border-gray-200 px-3 py-2">ED</th>
                  <th className="border border-gray-200 px-3 py-2">
                    No. Batch
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-center">
                    Sisa
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-center">
                    Kenyataan
                  </th>
                  <th className="border border-gray-200 px-3 py-2">
                    Keterangan
                  </th>
                  <th className="border border-gray-200 px-3 py-2">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {form.details.length > 0 ? (
                    form.details.map((d, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-3 py-2 text-center">
                        {index + 1}
                        </td>
                        <td className="border border-gray-200 px-3 py-2">
                        {d.nama_barang}
                        </td>
                        <td className="border border-gray-200 px-3 py-2">
                        {formatToReadableDate(d.ed)}
                        </td>
                        <td className="border border-gray-200 px-3 py-2">
                        {d.nobatch}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-center">
                        {d.sisa}
                        </td>
                        <td className="border border-gray-200 px-3 py-2 text-center">
                        {d.kenyataan}
                        </td>
                        <td className="border border-gray-200 px-3 py-2">
                        {d.keterangan || "-"}
                        </td>

                        {/* Action buttons */}
                        <td className="border border-gray-200 px-3 py-2 text-center">
                        {d.editable ? (
                            <div className="flex justify-center gap-2">
                            <button
                                onClick={() => handleEditDetail(index)}
                                type="button"
                                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteDetail(d.id)}
                                type="button"
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                                Hapus
                            </button>
                            </div>
                        ) : (
                            <span className="text-gray-400 text-xs italic">Locked</span>
                        )}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td
                        colSpan="8"
                        className="text-center text-gray-400 py-3 italic"
                    >
                        Belum ada barang ditambahkan
                    </td>
                    </tr>
                )}
              </tbody>

            </table>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>

        {/* Detail modal */}
        <StokOpnameDetailModal
            open={detailModalOpen}
            onClose={() => {
                setDetailModalOpen(false);
                setEditingIndex(null);
            }}
            onAddDetail={(newDetail) => {
                if (editingIndex !== null) {
                    setForm((prev) => {
                        const updated = [...prev.details];
                        updated[editingIndex] = { ...updated[editingIndex], ...newDetail };
                        return { ...prev, details: updated };
                    });
                } else {
                    handleAddDetail(newDetail);
                }
            }}
            initialData={editingIndex !== null ? form.details[editingIndex] : null}
        />

      </div>
    </div>
  );
}
