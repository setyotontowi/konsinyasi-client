import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openEditModal,
  closeUserModal,
  triggerReload,
  openDeleteConfirm,
  closeDeleteConfirm,
} from "../../store/userSlice"

import { useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import ConfirmModal from "../../components/ConfirmationModal";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

export default function Users() {
  const dispatch = useDispatch();
  const {
    modalOpen,
    confirmOpen,
    mode,
    selectedUser,
    userToDelete,
    listReload,
  } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    setDeleting(true);

    axiosClient
      .delete(`/user/${userToDelete.id}`)
      .then(() => {
        toast.success("Pengguna berhasil dihapus!");
        dispatch(triggerReload());
        dispatch(closeDeleteConfirm());
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Gagal menghapus pengguna.";
        toast.error(msg);
      })
      .finally(() => setDeleting(false));
  };

  return (
    <>
      <div className="masterdata titlerounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Data Pengguna"
          onAdd={() => dispatch(openAddModal())}
          search={search}
          setSearch={setSearch}
          addLabel="Tambah Pengguna"
          AddIcon={UserPlusIcon}
        />

        <UserTable
          search={search}
          reloadTrigger={listReload}
          onEdit={(user) => dispatch(openEditModal(user))}
          onDelete={(user) => dispatch(openDeleteConfirm(user))}
        />

        <UserModal
          open={modalOpen}
          mode={mode}
          user={selectedUser}
          onClose={() => dispatch(closeUserModal())}
          onSuccess={() => dispatch(triggerReload())}
        />
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Hapus Pengguna"
        message={
          userToDelete
            ? `Apakah Anda yakin ingin menghapus pengguna "${userToDelete.nama}"?`
            : "Apakah Anda yakin ingin menghapus pengguna ini?"
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => dispatch(closeDeleteConfirm())}
        loading={deleting}
      />
    </>
  );
}
