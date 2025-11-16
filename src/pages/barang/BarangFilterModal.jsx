import React, { useState, useEffect } from "react";
import Select from "react-select";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

export default function BarangFilterModal({ open, onClose, onApply, initialFilters }) {
  const [units, setUnits] = useState([]);
  const [satuan, setSatuan] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedSatuan, setSelectedSatuan] = useState(null);

  useEffect(() => {
    if (!open) return;

    // load pabrik / unit
    axiosClient
      .get("/unit?is_pbf=Ya")
      .then((res) => {
        setUnits(
          (res.data.data || []).map((u) => ({
            value: u.id,
            label: u.nama,
          }))
        );
      })
      .catch(() => toast.error("Gagal memuat data pabrik"));

    // load satuan
    axiosClient
      .get("/barang/satuan")
      .then((res) => {
        setSatuan(
          (res.data.data || []).map((s) => ({
            value: s.mst_id,
            label: s.mst_nama,
          }))
        );
      })
      .catch(() => toast.error("Gagal memuat data satuan"));
  }, [open]);

  // Prefill
  useEffect(() => {
    if (!open || !initialFilters) return;

    console.log("initialFilters", initialFilters);

    setSelectedUnit(
      initialFilters.nama_pabrik
        ? { value: initialFilters.nama_pabrik, label: initialFilters.label_pabrik }
        : null
    );
    setSelectedSatuan(
      initialFilters.satuan
        ? { value: initialFilters.satuan, label: initialFilters.label_satuan }
        : null
    );
  }, [open, initialFilters]);

  if (!open) return null;

  const handleApply = () => {
    onApply({
      nama_pabrik: selectedUnit?.value || "",
      satuan: selectedSatuan?.value || "",
      label_pabrik: selectedUnit?.label || "",
    label_satuan: selectedSatuan?.label || "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-6">Filter Barang</h2>

        {/* Nama Pabrik */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1">Nama Pabrik</label>
          <Select
            options={units}
            value={selectedUnit}
            onChange={setSelectedUnit}
            placeholder="Pilih Pabrik..."
            isClearable
          />
        </div>

        {/* Satuan */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1">Satuan</label>
          <Select
            options={satuan}
            value={selectedSatuan}
            onChange={setSelectedSatuan}
            placeholder="Pilih Satuan..."
            isClearable
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>

          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
