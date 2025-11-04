// src/pages/satuan/Satuan.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openEditModal,
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} from "../../store/satuanSlice";
import { deleteSatuan } from "../../store/satuanSlice";
import PageHeader from "../../components/PageHeader";
import ConfirmModal from "../../components/ConfirmationModal";
import SatuanTable from "./SatuanTable";
import SatuanModal from "./SatuanModal";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Satuan() {
  const dispatch = useDispatch();
  const { modalOpen, confirmOpen, mode, selectedSatuan } = useSelector(
    (state) => state.satuan
  );

  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [satuanToDelete, setSatuanToDelete] = useState(null);

  const handleDeleteConfirm = () => {
    if (!satuanToDelete) return;
    setDeleting(true);
    dispatch(deleteSatuan(satuanToDelete.mst_id)).finally(() => setDeleting(false));
  };

  return (
    <>
      <div className="masterdata titlerounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Data Satuan"
          onAdd={() => dispatch(openAddModal())}
          search={search}
          setSearch={setSearch}
          addLabel="Tambah Satuan"
          AddIcon={PlusIcon}
        />

        <SatuanTable
          search={search}
          onEdit={(s) => dispatch(openEditModal(s))}
          onDelete={(s) => {
            setSatuanToDelete(s);
            dispatch(openDeleteConfirm(s));
          }}
        />

        <SatuanModal
          open={modalOpen}
          mode={mode}
          satuan={selectedSatuan}
          onClose={() => dispatch(closeModal())}
        />
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Hapus Satuan"
        message={
          satuanToDelete
            ? `Apakah Anda yakin ingin menghapus satuan "${satuanToDelete.mst_nama}"?`
            : "Apakah Anda yakin ingin menghapus satuan ini?"
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => dispatch(closeDeleteConfirm())}
        loading={deleting}
      />
    </>
  );
}
