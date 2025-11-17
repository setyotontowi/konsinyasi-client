import React, { useState, useEffect } from "react";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { formatToReadableDate } from "../../helper/helper";

export default function StokFilterModal({
  open,
  onClose,
  onApply,
  initialFilters = {},
}) {
  const [barangOptions, setBarangOptions] = useState([]);
  const [edOptions, setEdOptions] = useState([]);
  const [nobatchOptions, setNobatchOptions] = useState([]);

  const [selectedBarang, setSelectedBarang] = useState(null);
  const [selectedEd, setSelectedEd] = useState(null);
  const [selectedNobatch, setSelectedNobatch] = useState(null);

  // Restore filters when reopening
  useEffect(() => {
    if (!open) return;

    if (initialFilters.barang_id) {
      setSelectedBarang({
        value: initialFilters.barang_id,
        label: initialFilters.barang_nama || "",
      });
    }

    if (initialFilters.ed) {
      setSelectedEd({
        value: initialFilters.ed,
        label: initialFilters.ed,
      });
    }

    if (initialFilters.nobatch) {
      setSelectedNobatch({
        value: initialFilters.nobatch,
        label: initialFilters.nobatch,
      });
    }
  }, [open, initialFilters]);

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

  // Fetch ED options when barang selected
  useEffect(() => {
    if (selectedBarang) {
      axiosClient
        .get(`/inventory/barang/${selectedBarang.value}/eds`)
        .then((res) =>
          setEdOptions(
            res.data.data.map((e) => ({
              value: formatToReadableDate(e.ed),
              label: formatToReadableDate(e.ed),
            }))
          )
        )
        .catch(() => toast.error("Gagal memuat ED"));
    } else {
      setEdOptions([]);
    }
  }, [selectedBarang]);

  // Fetch batch options when ED selected
  useEffect(() => {
    if (selectedBarang && selectedEd) {
      axiosClient
        .get(
          `/inventory/barang/${selectedBarang.value}/nobatch?ed=${selectedEd.value}`
        )
        .then((res) =>
          setNobatchOptions(
            res.data.data.map((nb) => ({
              value: nb.nobatch,
              label: nb.nobatch,
            }))
          )
        )
        .catch(() => toast.error("Gagal memuat No Batch"));
    } else {
      setNobatchOptions([]);
    }
  }, [selectedBarang, selectedEd]);

  const handleApply = () => {
    const applied = {
      id_barang: selectedBarang?.value || "",
      ed: selectedEd?.value || "",
      nobatch: selectedNobatch?.value || "",
    };

    onApply(applied);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-6">Filter Stok</h2>

        {/* ================== BARANG SECTION ================== */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Barang
          </h3>

          <div className="space-y-4">
            {/* Barang */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Barang</label>
              <Select
                options={barangOptions}
                value={selectedBarang}
                onChange={(opt) => {
                  setSelectedBarang(opt);
                  setSelectedEd(null);
                  setSelectedNobatch(null);
                }}
                placeholder="Pilih barang..."
                isClearable
              />
            </div>

            {/* ED */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">ED</label>
              <Select
                options={edOptions}
                value={selectedEd}
                onChange={(opt) => {
                  setSelectedEd(opt);
                  setSelectedNobatch(null);
                }}
                placeholder="Pilih ED..."
                isDisabled={!selectedBarang}
                isClearable
              />
            </div>

            {/* Batch */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">No Batch</label>
              <Select
                options={nobatchOptions}
                value={selectedNobatch}
                onChange={setSelectedNobatch}
                placeholder="Pilih No Batch..."
                isDisabled={!selectedEd}
                isClearable
              />
            </div>
          </div>
        </div>

        {/* ================== BUTTONS ================== */}
        <div className="mt-8 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
