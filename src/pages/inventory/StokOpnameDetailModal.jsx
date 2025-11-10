import { useEffect, useState } from "react";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

export default function StokOpnameDetailModal({ open, onClose, onAddDetail }) {
  const [barangOptions, setBarangOptions] = useState([]);
  const [edOptions, setEdOptions] = useState([]);
  const [nobatchOptions, setNobatchOptions] = useState([]);

  const [selectedBarang, setSelectedBarang] = useState(null);
  const [selectedEd, setSelectedEd] = useState(null);
  const [selectedNobatch, setSelectedNobatch] = useState(null);

  const [newEd, setNewEd] = useState("");
  const [newNoBatch, setNewNoBatch] = useState("");
  const [isNewEd, setIsNewEd] = useState(false);
  const [isNewNoBatch, setIsNewNoBatch] = useState(false);

  const [sisa, setSisa] = useState(null);
  const [kenyataan, setKenyataan] = useState("");
  const [keterangan, setKeterangan] = useState("");

  // 🧹 Reset all fields every time modal opens
  useEffect(() => {
    if (open) {
      setSelectedBarang(null);
      setSelectedEd(null);
      setSelectedNobatch(null);
      setNewEd("");
      setNewNoBatch("");
      setIsNewEd(false);
      setIsNewNoBatch(false);
      setSisa(null);
      setKenyataan("");
      setKeterangan("");
      setEdOptions([]);
      setNobatchOptions([]);
    }
  }, [open]);

  // Fetch barang list
  useEffect(() => {
    if (open) {
      axiosClient
        .get("/barang/items")
        .then((res) =>
          setBarangOptions(
            res.data.data.map((b) => ({
              value: b.barang_id,
              label: b.barang_nama,
            }))
          )
        )
        .catch(() => toast.error("Gagal memuat daftar barang"));
    }
  }, [open]);

  // Fetch ED options
  useEffect(() => {
    if (selectedBarang && !isNewEd) {
      axiosClient
        .get(`/inventory/barang/${selectedBarang.value}/eds`)
        .then((res) =>
          setEdOptions(res.data.data.map((e) => ({ value: e.ed, label: e.ed })))
        )
        .catch(() => toast.error("Gagal memuat ED"));
    } else {
      setEdOptions([]);
    }
  }, [selectedBarang, isNewEd]);

  // Fetch NoBatch options
  useEffect(() => {
    if (selectedBarang && selectedEd && !isNewNoBatch) {
      axiosClient
        .get(
          `/inventory/barang/${selectedBarang.value}/nobatch?ed=${selectedEd.value}`
        )
        .then((res) =>
          setNobatchOptions(
            res.data.data.map((nb) => ({ value: nb.nobatch, label: nb.nobatch }))
          )
        )
        .catch(() => toast.error("Gagal memuat No Batch"));
    } else {
      setNobatchOptions([]);
    }
  }, [selectedBarang, selectedEd, isNewNoBatch]);

  // Check stock
  useEffect(() => {
    const barang = selectedBarang?.value;
    const ed = isNewEd ? newEd : selectedEd?.value;
    const nobatch = isNewNoBatch ? newNoBatch : selectedNobatch?.value;

    if (barang && ed && nobatch && !isNewEd && !isNewNoBatch) {
      axiosClient
        .post("/inventory/check-stock", { barang, ed, nobatch })
        .then((res) => setSisa(res.data.data?.sisa ?? 0))
        .catch(() => toast.error("Gagal memeriksa stok"));
    } else {
      setSisa(null);
    }
  }, [
    selectedBarang,
    selectedEd,
    selectedNobatch,
    isNewEd,
    isNewNoBatch,
    newEd,
    newNoBatch,
  ]);

  const handleSave = () => {
    const barang = selectedBarang?.value;
    const ed = isNewEd ? newEd : selectedEd?.value;
    const nobatch = isNewNoBatch ? newNoBatch : selectedNobatch?.value;

    if (!barang || !ed || !nobatch)
      return toast.error("Barang, ED, dan NoBatch wajib diisi");
    if (kenyataan === "") return toast.error("Kenyataan wajib diisi");

    onAddDetail({
      id_master_barang: barang,
      nama_barang: selectedBarang.label,
      ed,
      nobatch,
      sisa,
      kenyataan,
      keterangan,
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-lg p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Tambah Detail Barang</h2>

        <div className="space-y-3">
          {/* Barang */}
          <div>
            <label className="block text-xs mb-1">Barang</label>
            <Select
              options={barangOptions}
              value={selectedBarang}
              onChange={(opt) => {
                setSelectedBarang(opt);
                setSelectedEd(null);
                setSelectedNobatch(null);
              }}
              placeholder="Pilih barang..."
            />
          </div>

          {/* ED */}
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-xs mb-1">ED</label>
              <label className="flex items-center gap-1 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={isNewEd}
                  onChange={(e) => {
                    setIsNewEd(e.target.checked);
                    setSelectedEd(null);
                    setNewEd("");
                  }}
                />
                Baru
              </label>
            </div>

            {isNewEd ? (
              <input
                type="date"
                value={newEd}
                onChange={(e) => setNewEd(e.target.value)}
                className="border border-gray-300 rounded w-full p-2 text-sm"
                placeholder="Masukkan ED baru"
              />
            ) : (
              <Select
                options={edOptions}
                value={selectedEd}
                onChange={(opt) => {
                  setSelectedEd(opt);
                  setSelectedNobatch(null);
                }}
                placeholder="Pilih ED..."
                isDisabled={!selectedBarang}
              />
            )}
          </div>

          {/* No Batch */}
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-xs mb-1">No Batch</label>
              <label className="flex items-center gap-1 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={isNewNoBatch}
                  onChange={(e) => {
                    setIsNewNoBatch(e.target.checked);
                    setSelectedNobatch(null);
                    setNewNoBatch("");
                  }}
                />
                Baru
              </label>
            </div>

            {isNewNoBatch ? (
              <input
                type="text"
                value={newNoBatch}
                onChange={(e) => setNewNoBatch(e.target.value)}
                className="border border-gray-300 rounded w-full p-2 text-sm"
                placeholder="Masukkan No Batch baru"
              />
            ) : (
              <Select
                options={nobatchOptions}
                value={selectedNobatch}
                onChange={setSelectedNobatch}
                placeholder="Pilih No Batch..."
                isDisabled={!selectedEd && !isNewEd}
              />
            )}
          </div>

          {/* Sisa */}
          {sisa !== null && (
            <div>
              <label className="block text-xs mb-1">Sisa</label>
              <input
                type="text"
                value={sisa}
                disabled
                className="border border-gray-300 rounded w-full p-2 bg-gray-100"
              />
            </div>
          )}

          {/* Kenyataan */}
          <div>
            <label className="block text-xs mb-1">Kenyataan</label>
            <input
              type="number"
              value={kenyataan}
              onChange={(e) => setKenyataan(e.target.value)}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs mb-1">Keterangan</label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="border border-gray-300 rounded w-full p-2"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4 pt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
