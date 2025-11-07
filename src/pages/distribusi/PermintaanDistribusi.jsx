import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openEditModal,
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} from "../../store/permintaanDistribusiSlice";
import { deletePermintaanDistribusi } from "../../store/permintaanDistribusiSlice";

import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import PermintaanDistribusiTable from "./PermintaanDistribusiTable";
import ConfirmModal from "../../components/ConfirmationModal";
// import PermintaanDistribusiModal from "./PermintaanDistribusiModal";

export default function PermintaanDistribusi() {
  const dispatch = useDispatch();
  const {
    modalOpen,
    confirmOpen,
    mode,
    selectedItem,
    itemToDelete,
  } = useSelector((state) => state.permintaanDistribusi);

  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    setDeleting(true);
    dispatch(deletePermintaanDistribusi(itemToDelete.pd_id)).finally(() =>
      setDeleting(false)
    );
  };

  return (
    <>
      <div className="masterdata rounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Permintaan Distribusi"
          onAdd={() => dispatch(openAddModal())}
          search={search}
          setSearch={setSearch}
          addLabel="Tambah Permintaan"
          AddIcon={ClipboardDocumentListIcon}
        />

        <PermintaanDistribusiTable
          search={search}
          onEdit={(item) => dispatch(openEditModal(item))}
          onDelete={(item) => dispatch(openDeleteConfirm(item))}
        />

        {/* <PermintaanDistribusiModal
          open={modalOpen}
          mode={mode}
          data={selectedItem}
          onClose={() => dispatch(closeModal())}
        /> */}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Hapus Permintaan Distribusi"
        message={
          itemToDelete
            ? `Apakah Anda yakin ingin menghapus permintaan untuk pasien "${itemToDelete.nama_pasien}"?`
            : "Apakah Anda yakin ingin menghapus permintaan distribusi ini?"
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => dispatch(closeDeleteConfirm())}
        loading={deleting}
      />
    </>
  );
}
