// src/pages/user-group/UserGroup.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openEditModal,
  closeUserGroupModal,
  openDeleteConfirm,
  closeDeleteConfirm,
  deleteUserGroup,
} from "../../store/userGroupSlice";

import { PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import UserGroupTable from "./UserGroupTable";
import ConfirmModal from "../../components/ConfirmationModal";

export default function UserGroup() {
  const dispatch = useDispatch();
  const { modalOpen, confirmOpen, mode, selectedGroup, groupToDelete } =
    useSelector((state) => state.userGroup);

  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = () => {
    if (!groupToDelete) return;
    setDeleting(true);
    dispatch(deleteUserGroup({ id: groupToDelete.id })).finally(() =>
      setDeleting(false)
    );
  };

  return (
    <>
      <div className="rounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Grup Pengguna dan Akses Menu"
          onAdd={() => dispatch(openAddModal())}
          search={search}
          setSearch={setSearch}
          addLabel="Tambah Grup"
          AddIcon={PlusIcon}
        />

        <UserGroupTable
          search={search}
          onEdit={(g) => dispatch(openEditModal(g))}
          onDelete={(g) => dispatch(openDeleteConfirm(g))}
        />
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Hapus Grup"
        message={
          groupToDelete
            ? `Apakah Anda yakin ingin menghapus grup "${groupToDelete.group_nama}"?`
            : "Apakah Anda yakin ingin menghapus grup ini?"
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => dispatch(closeDeleteConfirm())}
        loading={deleting}
      />
    </>
  );
}
