import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openEditModal,
  closeUserModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} from "../../store/userSlice";
import { deleteUser } from "../../store/userSlice";

import { UserPlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import ConfirmModal from "../../components/ConfirmationModal";

export default function Users() {
  const dispatch = useDispatch();
  const { modalOpen, confirmOpen, mode, selectedUser, userToDelete } = useSelector(
    (state) => state.user
  );

  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    setDeleting(true);
    dispatch(deleteUser(userToDelete.id)).finally(() => setDeleting(false));
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
          onEdit={(u) => dispatch(openEditModal(u))}
          onDelete={(u) => dispatch(openDeleteConfirm(u))}
        />

        <UserModal
          open={modalOpen}
          mode={mode}
          user={selectedUser}
          onClose={() => dispatch(closeUserModal())}
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