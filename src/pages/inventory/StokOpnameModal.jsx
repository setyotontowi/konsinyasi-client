import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { fetchStokOpnameById } from "../../store/stokOpnameSlice";
import axiosClient from "../../api/axiosClient";
import Select from "react-select";
import { toast } from "react-toastify";

export default function StokOpnameModal({ open, data, onClose, onSave }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    waktu_input: "",
    nama_unit: "",
    nama_user: "",
    details: [],
  });

  const [loading, setLoading] = useState({
    fetching: false,
    unit: false,
    barang: false,
  });
  const [units, setUnits] = useState([]);
  const [barang, setBarangOptions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);


  // --- Helper for datetime-local format ---
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  // --- Fetch detail data by ID ---
  useEffect(() => {
    if (!open) return;
    if (data?.id && !data?.details) {
      setLoading((l) => ({ ...l, fetching: true }));
      dispatch(fetchStokOpnameById(data.id))
        .unwrap()
        .then((res) => setForm(res))
        .catch((err) => toast.error("Gagal memuat data opname"))
        .finally(() => setLoading((l) => ({ ...l, fetching: false })));
    } else if (data?.details) {
      setForm(data);
    }
  }, [open, data?.id, dispatch]);

  // --- Fetch Units and Barang only once when modal opens ---
  useEffect(() => {
    if (!open) return;

    // Units
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

    // Barang
    setLoading((l) => ({ ...l, barang: true }));
    axiosClient
      .get("/barang/items")
      .then((res) => {
        setBarangOptions(
          (res.data?.data || []).map((b) => ({
            value: b.barang_id,
            label: b.barang_nama,
          }))
        );
      })
      .catch(() => toast.error("Gagal memuat daftar barang"))
      .finally(() => setLoading((l) => ({ ...l, barang: false })));
  }, [open]);

  // --- Reset form when modal closes ---
  useEffect(() => {
    if (!open) {
      setForm({
        waktu_input: "",
        nama_unit: "",
        nama_user: "",
        details: [],
      });
      setBarangOptions([]);
    }
  }, [open]);

  // --- Handlers ---
  const handleChangeHeader = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDetail = (index, fieldOrObject, value) => {
    setForm((prev) => {
        const updated = [...prev.details];
        if (typeof fieldOrObject === "object") {
        updated[index] = { ...updated[index], ...fieldOrObject };
        } else {
        updated[index] = { ...updated[index], [fieldOrObject]: value };
        }
        return { ...prev, details: updated };
    });
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-6xl rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh] animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Edit Stok Opname
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
                onChange={handleChangeHeader}
                className="border border-gray-300 rounded-lg w-full p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Unit</label>
              <Select
                isLoading={loading.unit}
                options={units}
                placeholder="Pilih unit asal..."
                value={units.find((u) => u.value === form.id_master_unit) || null}
                onChange={(opt) => handleSelectChange("id_master_unit", opt)}
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
                onChange={handleChangeHeader}
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
                  Barang yang sudah dipakai tidak dapat diedit
                </p>
              </div>
            </div>

            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 text-center">
                    No
                  </th>
                  <th className="border border-gray-200 w-50 px-3 py-2">
                    Nama Barang
                  </th>
                  <th className="border border-gray-200 px-3 py-2">No. Batch</th>
                  <th className="border border-gray-200 px-3 py-2">ED</th>
                  <th className="border border-gray-200 px-3 py-2">Sisa</th>
                  <th className="border border-gray-200 px-3 py-2">Kenyataan</th>
                  <th className="border border-gray-200 px-3 py-2">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                {form.details.map((d, index) => (
                  <tr key={d.id || index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {editingIndex === index ? (
                            // 🟢 Inline Select appears when editing this row
                            <Select
                            isLoading={loading.barang}
                            options={barang}
                            autoFocus
                            placeholder="Pilih barang"
                            onChange={(opt) => {
                                handleChangeDetail(index, {
                                id_master_barang: opt ? opt.value : "",
                                nama_barang: opt ? opt.label : "",
                                });
                                setEditingIndex(null); // ✅ exit edit mode
                            }}
                            onBlur={() => setEditingIndex(null)} // ✅ exit if user clicks away
                            className="react-select-container"
                            classNamePrefix="react-select"
                            />
                        ) : (
                            // 🧊 Display text + “Ganti” link when not editing
                            <div className="flex items-center justify-between">
                            <span>{d.nama_barang || "-"}</span>
                            <button
                                type="button"
                                onClick={() => setEditingIndex(index)}
                                className="text-blue-600 text-xs underline ml-2 hover:text-blue-800"
                            >
                                Ganti
                            </button>
                            </div>
                        )}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <input
                        type="text"
                        value={d.nobatch || ""}
                        onChange={(e) =>
                          handleChangeDetail(index, "nobatch", e.target.value)
                        }
                        className="border border-gray-300 rounded w-full p-1"
                      />
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <input
                        type="date"
                        value={d.ed ? d.ed.split("T")[0] : ""}
                        onChange={(e) =>
                          handleChangeDetail(index, "ed", e.target.value)
                        }
                        className="border border-gray-300 rounded w-full p-1"
                      />
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-center">
                        {d.sisa}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-center">
                        <input
                            type="number"
                            value={d.kenyataan || 0}
                            onChange={(e) =>
                                handleChangeDetail(index, "kenyataan", e.target.value)
                            }
                            placeholder="Kenyataan"
                            className="border border-gray-300 w-30 rounded p-1 text-center"
                        />
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <input
                        type="text"
                        value={d.keterangan || ""}
                        onChange={(e) =>
                          handleChangeDetail(index, "keterangan", e.target.value)
                        }
                        className="border border-gray-300 rounded w-full p-1"
                      />
                    </td>
                  </tr>
                ))}
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
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
