import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openEditModal,
  openViewModal,
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} from "../../store/permintaanDistribusiSlice";
import { deletePermintaanDistribusi } from "../../store/permintaanDistribusiSlice";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import PermintaanDistribusiTable from "./PermintaanDistribusiTable";
import ConfirmModal from "../../components/ConfirmationModal";
import PermintaanDistribusiModal from "./PermintaanDistribusiModal";

export default function Distribusi() {
  const dispatch = useDispatch();
  const {
    modalOpen,
    confirmOpen,
    mode,
    selectedItem,
    itemToDelete,
  } = useSelector((state) => state.permintaanDistribusi);

  const [deleting, setDeleting] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const [permintaanCount, setPermintaanCount] = useState();

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    setDeleting(true);
    dispatch(deletePermintaanDistribusi(itemToDelete.pd_id)).finally(() =>
      setDeleting(false)
    );
  };

  return (
    <>
      {/* === Collapsible Section === */}
      <div className="masterdata rounded-2xl bg-white border border-gray-200">
        {/* Header */}
        <button
          type="button"
          onClick={() => setShowActive((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100 "
        >
          <h3 className="text-md font-semibold text-left">
            Permintaan Distribusi ({permintaanCount})
          </h3>
          {showActive ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Collapsible Content */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showActive ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4">
            <PermintaanDistribusiTable
              onView={(item) => dispatch(openViewModal(item))}
              onDistribusi={true}
              onCountChange={setPermintaanCount}
            />
          </div>
        </div>
      </div>



      <div className="masterdata rounded-2xl bg-white border border-gray-200 mt-6">
        <PageHeader
          title="Distribusi"
          onAdd={() => dispatch(openAddModal())}
          disableAdd = {true}
          disableSearch = {true}
          addLabel="Tambah Permintaan"
        />

      </div>

      <PermintaanDistribusiModal
          open={modalOpen}
          mode="distribusi"
          data={selectedItem}
          onClose={() => dispatch(closeModal())}
      />

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
