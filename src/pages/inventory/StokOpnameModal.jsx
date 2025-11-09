import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { fetchStokOpnameById } from "../../store/stokOpnameSlice";

export default function StokOpnameModal({ open, data, onClose, onSave }) {
  const [form, setForm] = useState({
    waktu_input: "",
    nama_unit: "",
    nama_user: "",
    details: [],
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ unit: false, group: false });

  useEffect(() => {
    if (open && data?.id) {
      setLoading(true);
      dispatch(fetchStokOpnameById(data.id))
        .unwrap()
        .then((res) => {
          setForm(res);
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, open, data]);

  if (!open) return null;

  const handleChangeHeader = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDetail = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.details];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, details: updated };
    });
  };

  const handleSubmit = () => {
    if (onSave) onSave(form);
  };

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
                value={form.waktu_input || ""}
                onChange={handleChangeHeader}
                className="border border-gray-300 rounded-lg w-full p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Unit
              </label>
              <input
                type="text"
                name="nama_unit"
                value={form.nama_unit || ""}
                onChange={handleChangeHeader}
                className="border border-gray-300 rounded-lg w-full p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                User
              </label>
              <input
                type="text"
                name="nama_user"
                value={form.nama_user || ""}
                onChange={handleChangeHeader}
                className="border border-gray-300 rounded-lg w-full p-2 text-sm"
              />
            </div>
          </div>

          {/* Detail items */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm text-gray-600 uppercase">Detail Barang</h3>
            </div>

            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 text-center">No</th>
                  <th className="border border-gray-200 px-3 py-2">Nama Barang</th>
                  <th className="border border-gray-200 px-3 py-2">Satuan</th>
                  <th className="border border-gray-200 px-3 py-2">Batch</th>
                  <th className="border border-gray-200 px-3 py-2">ED</th>
                  <th className="border border-gray-200 px-3 py-2">Sisa</th>
                  <th className="border border-gray-200 px-3 py-2">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {form.details.map((d, index) => (
                  <tr key={d.id || index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <input
                        type="text"
                        value={d.nama_barang || ""}
                        onChange={(e) =>
                          handleChangeDetail(index, "nama_barang", e.target.value)
                        }
                        className="border  border-gray-300 rounded w-full p-1"
                      />
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      <input
                        type="text"
                        value={d.nama_satuan || ""}
                        onChange={(e) =>
                          handleChangeDetail(index, "nama_satuan", e.target.value)
                        }
                        className="border border-gray-300 rounded w-full p-1"
                      />
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
                        className="border  border-gray-300 rounded w-full p-1"
                      />
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-center">
                      <input
                        type="number"
                        value={d.sisa || 0}
                        onChange={(e) =>
                          handleChangeDetail(index, "sisa", e.target.value)
                        }
                        className="border border-gray-300 rounded w-full p-1 text-center"
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

        {/* Footer buttons */}
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
