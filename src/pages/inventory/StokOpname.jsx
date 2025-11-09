import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  openAddModal,
  openEditModal,
  openViewModal,
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} from "../../store/stokOpnameSlice";
import PageHeader from "../../components/PageHeader";
import ConfirmModal from "../../components/ConfirmationModal";
import PermintaanDistribusiModal from "../distribusi/PermintaanDistribusiModal";
import { ArrowDownOnSquareIcon, CalendarIcon } from "@heroicons/react/24/outline";
import StokOpnameTable from "./StokOpnameTable";
import StokOpnameModal from "./StokOpnameModal";

export default function StokOpname() {
  const dispatch = useDispatch();
  const { modalOpen, confirmOpen, mode, selectedItem, itemToDelete } = useSelector((state) => state.stokOpname);


  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    setDeleting(true);
    // dispatch(deletePermintaanDistribusi(itemToDelete.pd_id)).finally(() =>
    //   setDeleting(false)
    // );
    setDeleting(false);
  };

  return (
    <>
      <div className="masterdata rounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Stok Opname"
          onAdd={() => dispatch(openAddModal())}
          search={search}
          searchPlaceholder= "Cari Nama atau RM Pasien"
          setSearch={setSearch}
          addLabel="Stok Opname"
          AddIcon={ArrowDownOnSquareIcon}
        />

        <StokOpnameTable
          search={search}
          onEdit={(item) => dispatch(openEditModal(item))}
          onView={(item) => dispatch(openViewModal(item))}
          onDelete={(item) => dispatch(openDeleteConfirm(item))}
        />

        <StokOpnameModal
          open={modalOpen}
          data={selectedItem}
          onClose={() => dispatch(closeModal())}
          onSave={(updatedData) => console.log("Save data:", updatedData)}
        />
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
