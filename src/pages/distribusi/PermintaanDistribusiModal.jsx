import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { 
  addPermintaanDistribusi,
  editPermintaanDistribusi,
  fetchPermintaanDistribusi,
  fetchPermintaanDistribusiById,
  pemakaianBarang,
} from "../../store/permintaanDistribusiSlice";
import { kirimDistribusi } from "../../store/distribusiSlice";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { formatToReadableLocal, getLocalNow } from "../../helper/helper";


// Mode
// add, edit, view [Permintaan Distribusi]
// distribusi, [Distribusi] 
// pemakaian, [Penggunaan Barang]
// purchase [Purchase Order]
// 
export default function PermintaanDistribusiModal({ open, mode, data, onClose }) {
  const isView = mode === "view" || mode === "purchase";
  const dispatch = useDispatch();

  useEffect(() => {
   if (open && (mode !== "add") && data?.pd_id) {
    dispatch(fetchPermintaanDistribusiById(data.pd_id))
      .unwrap()
      .then((detail) => {
        // fill formData & items from API result
        setFormData({
          waktu: detail?.waktu ? formatToReadableLocal(detail.waktu) : getLocalNow(),
          id_master_unit: detail?.id_master_unit || "",
          id_master_unit_tujuan: detail?.id_master_unit_tujuan || "",
          nomor_rm: detail?.nomor_rm || "",
          nama_pasien: detail?.nama_pasien || "",
          nama_ruang: detail?.nama_ruang || "",
          diagnosa: detail?.diagnosa || "",
        });
        setItems(detail?.items || []);
      })
      .catch(() => {
        toast.error("Gagal memuat detail permintaan distribusi");
      });
  }

  if (open && mode === "add") {
    setFormData({
      waktu: getLocalNow(),
      id_master_unit: "",
      id_master_unit_tujuan: "",
      nomor_rm: "",
      nama_pasien: "",
      nama_ruang: "",
      diagnosa: "",
    });
    setItems([]); 
  }
}, [data?.pd_id, open, mode]);

  const [formData, setFormData] = useState({
    pd_id: data?.pd_id,
    waktu: data?.waktu ? formatToReadableLocal(data.waktu) : getLocalNow(),
    id_master_unit: data?.id_master_unit || "",
    id_master_unit_tujuan: data?.id_master_unit_tujuan || "",
    nomor_rm: data?.nomor_rm || "",
    nama_pasien: data?.nama_pasien || "",
    nama_ruang: data?.nama_ruang || "",
    diagnosa: data?.diagnosa || "",
  });

  const [items, setItems] = useState(data?.items || []);
  const [units, setUnits] = useState([]);
  const [unitsPBF, setUnitsPBF] = useState([]);
  const [barang, setBarangOptions] = useState([]);
  const [satuan, setSatuanOptions] = useState([]);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [loading, setLoading] = useState({ unit: false, group: false });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [stockAvailable, setStockAvailable] = useState(null);
  const [qtyError, setQtyError] = useState("");

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
      const list = res.data?.data || [];

      const pbfUnits = [];
      const normalUnits = [];

      list.forEach((u) => {
        const item = { value: u.id, label: u.nama };

        if (String(u.is_pbf).toLowerCase() === "ya") {
          pbfUnits.push(item);
        } else {
          normalUnits.push(item);
        }
      });

      setUnitsPBF(pbfUnits);
      setUnits(normalUnits);
    })
    .catch((err) => {
      console.error("Failed to load units:", err);
      toast.error("Gagal memuat data unit");
    })

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

  useEffect(() => {
    if (!formData.id_master_unit_tujuan) return;

    axiosClient
      .get(`/barang/items?nama_pabrik=${formData.id_master_unit_tujuan}`)
      .then((res) => {
        setBarangOptions(
          (res.data?.data || []).map((b) => ({
            value: b.barang_id,
            label: b.barang_nama,
            id_satuan_kecil: b.id_satuan_kecil,
            nama_satuan : b.nama_satuan
          }))
        );
      })
      .catch((err) => {
        console.error("Failed to load filtered barang:", err);
        toast.error("Gagal memuat barang berdasarkan unit tujuan");
      });
  }, [formData.id_master_unit_tujuan]);

  // Use effect call get inventory/get-all-stok with filtered id_barang
  // it will return list of data on different ed and nobatch
  // sum it all, named it as stock_available

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
    if (newItem.qty <= 0) {
      toast.error("Tidak bisa meminta barang dengan qty 0 atau minus")
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

    if (items.length === 0) {
        toast.error("Barang wajib diisi");
        return; // stop the function if no items
    }

    setSubmitting(true);

    const payload = {
      waktu: new Date(formData.waktu),
      id_master_unit: parseInt(formData.id_master_unit),
      id_master_unit_tujuan: parseInt(formData.id_master_unit_tujuan),
      nomor_rm: formData.nomor_rm,
      nama_pasien: formData.nama_pasien,
      nama_ruang : formData.nama_ruang,
      diagnosa: formData.diagnosa,
      items: items.map((it) => ({
        pdd_id : parseInt(it.pdd_id),
        id_master_barang: parseInt(it.id_master_barang),
        id_master_satuan: parseInt(it.id_master_satuan),
        qty: it.qty,
        qty_real: it.qty_real,
      })),
    };


    console.log(mode);
    const action = mode === "add"
      ? addPermintaanDistribusi(payload)
      : mode === "edit"
      ? editPermintaanDistribusi({ id: data.pd_id, payload })
      : mode === "distribusi"
      ? kirimDistribusi({id: data.pd_id, payload})
      : mode === "pemakaian" 
      ? pemakaianBarang({id: data.pd_id, payload})
      : mode === "purchase"
      ? null
      : null

    dispatch(action)
        .unwrap()
        .then(() => {
          const distribusi = mode === "pemakaian"? false : mode === "distribusi"? true : null;
          dispatch(fetchPermintaanDistribusi({ page: 1, limit: 20, onDistribusi: distribusi }));
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
          {mode === "add" 
          ? "Tambah Permintaan Distribusi" 
          : mode === "edit"
          ? "Edit Permintaan Distribusi"
          : mode === "distribusi"
          ? "Pengiriman Barang"
          : mode === "pemakaian"
          ? "Pemakaian Barang"
          : mode === "purchase"
          ? "Detail Pemakaian - Buat PO"
          : "Permintaan Distribusi"
        }
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
                    type="datetime"
                    name="waktu"
                    disabled={isView}
                    value={formData.waktu}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                {/* Unit Asal */}
                <div>
                  <label className="block text-sm font-medium">Unit Asal</label>
                  <Select
                    options={units}
                    placeholder="Pilih unit asal..."
                    isDisabled={isView}
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
                    options={unitsPBF}
                    placeholder="Pilih unit tujuan..."
                    isDisabled={isView || items.length > 0} 
                    value={unitsPBF.find((u) => u.value === formData.id_master_unit_tujuan) || null}
                    onChange={(opt) => handleSelectChange("id_master_unit_tujuan", opt)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>

            {/* Data Pasien */}
            {mode !== "distribusi" && (
            <div>
              <h3 className="font-semibold text-sm mb-2 text-gray-600 uppercase">Data Pasien</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium">No. RM</label>
                  <input
                    type="text"
                    name="nomor_rm"
                    disabled={isView}
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
                    disabled={isView}
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
                    disabled={isView}
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
                    disabled={isView}
                    value={formData.diagnosa}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
              </div>
            </div>
            )}
          </div>

          {/* === Section B: Detail === */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm text-gray-600 uppercase">Detail Barang</h3>
              {!isView && mode !== "pemakaian" && mode !== "distribusi" && (
                <button
                    type="button"
                    onClick={() => {
                      if (!formData.id_master_unit_tujuan) {
                        toast.error("Pilih unit tujuan terlebih dahulu sebelum menambah item.");
                        return;
                      }
                      setStockAvailable(null);
                      setItemModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                    <PlusCircleIcon className="h-5 w-5" /> Tambah Item
                </button>
                )}
            </div>

            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 border border-gray-200">Barang</th>
                  <th className="px-3 py-2 border border-gray-200">Satuan</th>
                  <th className="px-3 py-2 border border-gray-200">Qty</th>
                  {mode === "pemakaian" ? (
                  <th className="px-3 py-2 border border-gray-200">Pemakaian</th>
                  ) : (
                    <th className="px-3 py-2 border border-gray-200 w-10">Aksi</th>
                  )}
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
                      {/* Input Pemakaian */}
                      {mode === "pemakaian" && (
                        <td className="border border-gray-200 px-3 py-2 w-50">
                          <input
                            key={`${open}-${i}-${item.qty_real ?? "empty"}`}
                            type="text"
                            defaultValue={item.qty_real}
                            onBlur={(e) => {
                              let val = parseFloat(e.target.value);

                              const max = Number(item.qty);

                              // Validation text (no toast)
                              if (val > max) {
                                setErrors((prev) => ({
                                  ...prev,
                                  [i]: `Pemakaian tidak boleh lebih dari ${max}`,
                                }));
                              }else if (val < 0 === true) {
                                setErrors((prev) => ({
                                  ...prev,
                                  [i]: `Pemakaian tidak boleh kurang dari 0`,
                                }));
                              } else {
                                setErrors((prev) => {
                                  const p = { ...prev };
                                  delete p[i];
                                  return p;
                                });
                              }

                              // Save the corrected value
                              setItems((prev) => 
                                prev.map((it, idx) =>
                                  idx === i ? { ...it, qty_real: val } : it
                                )
                              );
                            }}
                            className="w-full border border-blue-600 rounded p-1"
                          />

                          {/* Inline error text */}
                          {errors[i] && (
                            <p className="text-red-600 text-xs mt-1">{errors[i]}</p>
                          )}
                        </td>
                      )}
                      {!isView && mode !== "pemakaian" && mode !== "distribusi" && (
                      <td className="border border-gray-200 px-3 py-2 text-center">
                          <button
                          type="button"
                          onClick={() => handleRemoveItem(i)}
                          className="text-red-600 hover:underline"
                          >
                          Hapus
                          </button>
                      </td>
                      )}
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
            {!isView  && (
              <button
                type="submit"
                disabled={submitting || (mode === "pemakaian" && Object.keys(errors).length > 0)}
                className={`
                  px-4 py-2 rounded text-white
                  ${submitting || (mode === "pemakaian" && Object.keys(errors).length > 0)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"}
                `}
              >
                {mode === "add"
                  ? "Simpan"
                  : mode === "edit"
                  ? "Perbarui"
                  : mode === "distribusi"
                  ? "Kirim Barang"
                  : mode === "pemakaian"
                  ? "Simpan Transaksi"
                  : mode === "purchase"
                  ? "Buat PO"
                  : ""}
              </button>
            )}
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
                  <label className="block text-sm font-medium">Barang</label>
                  <Select
                    isLoading={loading.barang}
                    options={barang}
                    placeholder="Pilih barang"
                    isDisabled={isView}
                    value={barang.find((u) => u.value === newItem.id_master_barang) || null}
                    onChange={async (opt) => {
                        const id = opt ? opt.value : "";

                        handleItemOptionChange("id_master_barang", id);
                        handleItemOptionChange("nama_barang", opt ? opt.label : "");
                        handleItemOptionChange("id_master_satuan", opt ? opt.id_satuan_kecil : "");
                        handleItemOptionChange("nama_satuan", opt ? opt.nama_satuan : "");

                        setStockAvailable(null);   // reset before fetching
                        setQtyError("");

                        if (!id) return;

                        try {
                          const res = await axiosClient.get(`/inventory/get-all-stok?id_barang=${id}`);
                          const list = res.data?.data || [];

                          // sum sisa across all ed & batch
                          const total = list.reduce((sum, row) => sum + Number(row.sisa || 0), 0);

                          setStockAvailable(total);
                        } catch (err) {
                          console.error("failed to fetch stock:", err);
                          setStockAvailable(0);
                        }
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Satuan</label>
                  <Select
                    isLoading={loading.satuan}
                    options={satuan}
                    placeholder="Pilih satuan terkecil"
                    isDisabled={true}
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
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setNewItem((prev) => ({ ...prev, qty: val }));

                      if (stockAvailable !== null && val > stockAvailable) {
                        setQtyError(`Qty melebihi stok tersedia (${stockAvailable})`);
                      } else {
                        setQtyError("");
                      }
                    }}
                    className="w-full border border-gray-300 rounded p-2"
                  />

                  {/* add label stock_available and validation if newItem is exceeding stock_available */}
                  {stockAvailable !== null && (
                    <p className="text-xs text-gray-600 mt-1">
                      Stok tersedia: <span className="font-semibold">{stockAvailable}</span>
                    </p>
                  )}

                  {qtyError && (
                    <p className="text-xs text-red-600 mt-1">{qtyError}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setNewItem({ id_master_barang: "", id_master_satuan: "", qty: "" });
                    setItemModalOpen(false)}
                  }
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!!qtyError || newItem.qty <= 0}
                  className={`
                    px-3 py-1 rounded text-white
                    ${qtyError || newItem.qty <= 0 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700"}
                  `}
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
