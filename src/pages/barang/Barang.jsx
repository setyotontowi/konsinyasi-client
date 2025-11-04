// src/pages/barang/Barang.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openEditModal,
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
  fetchSatuan,
} from "../../store/barangSlice";
import { deleteBarang, fetchBarang } from "../../store/barangSlice";
import { PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import BarangTable from "./BarangTable";
import BarangModal from "./BarangModal";
import ConfirmModal from "../../components/ConfirmationModal";

export default function Barang() {
  const dispatch = useDispatch();
  const { modalOpen, confirmOpen, mode, selectedBarang } = useSelector((state) => state.barang);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [barangToDelete, setBarangToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchSatuan());
    dispatch(fetchBarang({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleDeleteConfirm = () => {
    if (!barangToDelete) return;
    setDeleting(true);
    dispatch(deleteBarang(barangToDelete.id))
      .finally(() => setDeleting(false));
  };

  return (
    <>
      <div className="masterdata titlerounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Data Barang"
          onAdd={() => dispatch(openAddModal())}
          search={search}
          setSearch={setSearch}
          addLabel="Tambah Barang"
          AddIcon={PlusIcon}
        />

        <BarangTable
          search={search}
          onEdit={(b) => dispatch(openEditModal(b))}
          onDelete={(b) => {
            setBarangToDelete(b);
            dispatch(openDeleteConfirm(b));
          }}
        />

        <BarangModal
          open={modalOpen}
          mode={mode}
          barang={selectedBarang}
          onClose={() => dispatch(closeModal())}
        />
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Hapus Barang"
        message={
          barangToDelete
            ? `Apakah Anda yakin ingin menghapus barang "${barangToDelete.nama}"?`
            : "Apakah Anda yakin ingin menghapus barang ini?"
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => dispatch(closeDeleteConfirm())}
        loading={deleting}
      />
    </>
  );
}
