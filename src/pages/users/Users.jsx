import { useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import UserTable from "./UserTable";
import UserModal from "./UserModal"
import ConfirmModal from "../../components/ConfirmationModal";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

export default function Users() {
  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState("add");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleAddUser = () => {
    setMode("add");
    setSelectedUser(null);
    setOpenAddModal(true);
  };

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setMode("edit");
    setOpenAddModal(true);
  };

  const handleDeleteRequest = (user) => {
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    setDeleting(true);

    axiosClient
      .delete(`/user/${userToDelete.id}`)
      .then(() => {
        toast.success("Pengguna berhasil dihapus!");
        setReloadTrigger((prev) => prev + 1); // refresh table
        setConfirmOpen(false);
      })
      .catch((err) => {
        console.error(err);
        const msg = err.response?.data?.message || "Gagal menghapus pengguna.";
        toast.error(msg);
      })
      .finally(() => setDeleting(false));
  };

  // add this in your component
  const closeModal = () => {
    setOpenAddModal(false);
    setMode("add");
    setSelectedUser(null);
  };

  return (
    <>
      <div className="masterdata titlerounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Data Pengguna"
          onAdd={handleAddUser}
          search={search}
          setSearch={setSearch}
          addLabel="Tambah Pengguna"
          AddIcon={UserPlusIcon}
        />

        {/* Pass reloadTrigger down to UserTable */}
        <UserTable 
          search={search} 
          reloadTrigger={reloadTrigger} 
          onEdit={handleEditUser} 
          onDelete={handleDeleteRequest}/>

        <UserModal
          open={openAddModal}
          onClose={closeModal}
          onSuccess={handleSuccess}
          mode={mode}
          user={selectedUser}
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
        onClose={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </>
  );
}
