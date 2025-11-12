import React, { useState, useEffect } from "react";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

export default function JournalFilterModal({
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

  const [filters, setFilters] = useState({
    id_barang: "",
    nobatch: "",
    ed: "",
    start_date: "",
    end_date: "",
  });

  // 🧹 Prefill when re-opened
  useEffect(() => {
    if (initialFilters) setFilters(initialFilters);
  }, [initialFilters]);

  // 🧠 Fetch barang list
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

  // 🔁 Fetch EDs when barang selected
  useEffect(() => {
    if (selectedBarang) {
      axiosClient
        .get(`/inventory/barang/${selectedBarang.value}/eds`)
        .then((res) =>
          setEdOptions(
            res.data.data.map((e) => ({
              value: e.ed,
              label: new Date(e.ed).toLocaleDateString("id-ID"),
            }))
          )
        )
        .catch(() => toast.error("Gagal memuat ED"));
    } else {
      setEdOptions([]);
    }
  }, [selectedBarang]);

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

  // 🧾 Apply filters
  const handleApply = () => {
    const applied = {
      id_barang: selectedBarang?.value || "",
      ed: selectedEd?.value || "",
      nobatch: selectedNobatch?.value || "",
      start_date: filters.start_date,
      end_date: filters.end_date,
    };
    onApply(applied);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-6">Filter Journal (Dev)</h2>

        {/* ================== Section 1: Barang ================== */}
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
              <label className="block text-sm text-gray-600 mb-1">ED (Expired Date)</label>
              <Select
                options={edOptions}
                value={selectedEd}
                onChange={(opt) => {
                  setSelectedEd(opt);
                  setSelectedNobatch(null);
                }}
                placeholder="Pilih tanggal ED..."
                isDisabled={!selectedBarang}
                isClearable
              />
            </div>

            {/* No Batch */}
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

        {/* ================== Section 2: Waktu ================== */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Waktu
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={(e) =>
                  setFilters({ ...filters, start_date: e.target.value })
                }
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={(e) =>
                  setFilters({ ...filters, end_date: e.target.value })
                }
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ================== Footer Buttons ================== */}
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
