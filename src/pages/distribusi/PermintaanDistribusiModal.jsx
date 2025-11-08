import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { addPermintaanDistribusi, editPermintaanDistribusi, fetchPermintaanDistribusi } from "../../store/permintaanDistribusiSlice";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function PermintaanDistribusiModal({ open, mode, data, onClose }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    waktu: data?.waktu ? data.waktu.slice(0, 16) : new Date().toISOString().slice(0, 16),
    id_master_unit: data?.id_master_unit || "",
    id_master_unit_tujuan: data?.id_master_unit_tujuan || "",
    nomor_rm: data?.nomor_rm || "",
    nama_pasien: data?.nama_pasien || "",
    nama_ruang: data?.nama_ruang || "",
    diagnosa: data?.diagnosa || "",
  });

  const [items, setItems] = useState(data?.items || []);
  const [units, setUnits] = useState([]);
  const [barang, setBarangOptions] = useState([]);
  const [satuan, setSatuanOptions] = useState([]);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [loading, setLoading] = useState({ unit: false, group: false });
  const [newItem, setNewItem] = useState({
    id_master_barang: "",
    nama_barang : "",
    id_master_satuan: "",
    nama_satuan: "",
    qty: "",
  });

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
      .catch((err) => {
        console.error("Failed to load units:", err);
        toast.error("Gagal memuat data unit");
      })
      .finally(() => setLoading((l) => ({ ...l, unit: false })));

      // Fetch Barang
        setLoading((l) => ({ ...l, barang: true }));
        axiosClient
        .get("/barang/items")
        .then((res) => {
            setBarangOptions((res.data?.data || []).map((b) => ({ value: b.barang_id, label: b.barang_nama })));
        })
        .catch((err) => {
            console.error("Failed to load barang:", err);
            toast.error("Gagal memuat daftar barang");
        })
        .finally(() => setLoading((l) => ({ ...l, barang: false })));

        // Fetch Satuan
        setLoading((l) => ({ ...l, satuan: true }));
        axiosClient
        .get("/barang/satuan")
        .then((res) => {
            setSatuanOptions((res.data?.data || []).map((s) => ({ value: s.mst_id, label: s.mst_nama })));
        })
        .catch((err) => {
            console.error("Failed to load satuan:", err);
            toast.error("Gagal memuat daftar satuan");
        })
        .finally(() => setLoading((l) => ({ ...l, satuan: false })));
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, option) => {
    setFormData((prev) => ({ ...prev, [name]: option ? option.value : "" }));
  };

  const handleItemOptionChange = (name, value) => {
    setNewItem((prev) => ({
    ...prev, [name]: value,
    }))
  }


  const handleAddItem = () => {
    if (!newItem.id_master_barang || !newItem.id_master_satuan || !newItem.qty) {
      toast.error("Semua field barang wajib diisi.");
      return;
    }
    setItems([...items, newItem]);
    setNewItem({ id_master_barang: "", id_master_satuan: "", qty: "" });
    setItemModalOpen(false);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      waktu: new Date(formData.waktu),
      id_master_unit: parseInt(formData.id_master_unit),
      id_master_unit_tujuan: parseInt(formData.id_master_unit_tujuan),
      nomor_rm: formData.nomor_rm,
      nama_pasien: formData.nama_pasien,
      diagnosa: formData.diagnosa,
      items: items.map((it) => ({
        id_master_barang: parseInt(it.id_master_barang),
        id_master_satuan: parseInt(it.id_master_satuan),
        qty: parseInt(it.qty),
      })),
    };

    const action = mode === "add"
      ? addPermintaanDistribusi(payload)
      : editPermintaanDistribusi({ id: data.pd_id, payload })

    dispatch(action)
        .unwrap()
        .then(() => {
        // 🧠 same pattern as UserModal.jsx
        dispatch(fetchPermintaanDistribusi({ page: 1, limit: 20 }));
        onClose();
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
      onClick={onClose}>
      <div 
        className="bg-white w-full max-w-6xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh] animate-fadeIn"
        onClick={(e) => {e.stopPropagation()}}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {mode === "add" ? "Tambah Permintaan Distribusi" : "Edit Permintaan Distribusi"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* === Section A: Header === */}
          <div className="grid grid-cols-2 gap-6">
            {/* Metadata */}
            <div>
              <h3 className="font-semibold text-sm mb-2 text-gray-600 uppercase">Unit</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium">Waktu</label>
                  <input
                    type="datetime-local"
                    name="waktu"
                    value={formData.waktu}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                {/* Unit Asal */}
                <div>
                  <label className="block text-sm font-medium">Unit Asal</label>
                  <Select
                    isLoading={loading.unit}
                    options={units}
                    placeholder="Pilih unit asal..."
                    value={units.find((u) => u.value === formData.id_master_unit) || null}
                    onChange={(opt) => handleSelectChange("id_master_unit", opt)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                {/* Unit Tujuan */}
                <div>
                  <label className="block text-sm font-medium">Unit Tujuan</label>
                  <Select
                    isLoading={loading.unit}
                    options={units}
                    placeholder="Pilih unit tujuan..."
                    value={units.find((u) => u.value === formData.id_master_unit_tujuan) || null}
                    onChange={(opt) => handleSelectChange("id_master_unit_tujuan", opt)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>

            {/* Data Pasien */}
            <div>
              <h3 className="font-semibold text-sm mb-2 text-gray-600 uppercase">Data Pasien</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium">No. RM</label>
                  <input
                    type="text"
                    name="nomor_rm"
                    value={formData.nomor_rm}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Nama Pasien</label>
                  <input
                    type="text"
                    name="nama_pasien"
                    value={formData.nama_pasien}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Nama Ruang</label>
                  <input
                    type="text"
                    name="nama_ruang"
                    value={formData.nama_ruang}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Diagnosa</label>
                  <input
                    type="text"
                    name="diagnosa"
                    value={formData.diagnosa}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* === Section B: Detail === */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm text-gray-600 uppercase">Detail Barang</h3>
              <button
                type="button"
                onClick={() => setItemModalOpen(true)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <PlusCircleIcon className="h-5 w-5" /> Tambah Item
              </button>
            </div>

            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 border border-gray-200">Barang</th>
                  <th className="px-3 py-2 border border-gray-200">Satuan</th>
                  <th className="px-3 py-2 border border-gray-200">Qty</th>
                  <th className="px-3 py-2 border border-gray-200 w-10">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500 py-3">
                      Belum ada item ditambahkan.
                    </td>
                  </tr>
                ) : (
                  items.map((item, i) => (
                    <tr key={i} className="border border-gray-200 hover:bg-gray-50">
                      <td className="border border-gray-200 px-3 py-2">{item.nama_barang}</td>
                      <td className="border border-gray-200 px-3 py-2">{item.nama_satuan}</td>
                      <td className="border border-gray-200 px-3 py-2">{item.qty}</td>
                      <td className="border border-gray-200 px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(i)}
                          className="text-red-600 hover:underline"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {mode === "add" ? "Simpan" : "Perbarui"}
            </button>
          </div>
        </form>
        </div>


        {/* === Add Item Modal === */}
        {itemModalOpen && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div 
              className="bg-white rounded-lg p-6 w-full max-w-md animate-fadeIn"
              onClick={(e) => {e.stopPropagation()}}>
              <h3 className="text-md font-semibold mb-4">Tambah Item Barang</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">ID Barang</label>
                  <Select
                    isLoading={loading.barang}
                    options={barang}
                    placeholder="Pilih barang"
                    value={barang.find((u) => u.value === newItem.id_master_barang) || null}
                    onChange={(opt) => {
                        handleItemOptionChange("id_master_barang", opt ? opt.value : "")
                        handleItemOptionChange("nama_barang", opt ? opt.label : "")
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">ID Satuan</label>
                  <Select
                    isLoading={loading.satuan}
                    options={satuan}
                    placeholder="Pilih satuan terkecil"
                    value={satuan.find((u) => u.value === newItem.id_master_satuan) || null}
                    onChange={(opt) => {
                        handleItemOptionChange("id_master_satuan",  opt ? opt.value : "")
                        handleItemOptionChange("nama_satuan", opt ? opt.label : "")
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Qty</label>
                  <input
                    type="number"
                    value={newItem.qty}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        qty: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
