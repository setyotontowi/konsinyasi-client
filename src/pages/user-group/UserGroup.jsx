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
import UserGroupModal from "./UserGroupModal";
import ConfirmModal from "../../components/ConfirmationModal";
import UserGroupPrivilegeModal from "./UserGroupPrivilegeModal"; // new import

export default function UserGroup() {
  const dispatch = useDispatch();
  const { modalOpen, confirmOpen, mode, selectedGroup, groupToDelete } =
    useSelector((state) => state.userGroup);

  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [privilegeGroup, setPrivilegeGroup] = useState(null); // track privilege modal state

  // Handle delete
  const handleDeleteConfirm = () => {
    if (!groupToDelete) return;
    setDeleting(true);
    dispatch(deleteUserGroup({ id: groupToDelete.id })).finally(() =>
      setDeleting(false)
    );
  };

  // Handle privilege modal open
  const handleOpenPrivilege = (group) => {
    setPrivilegeGroup(group);
  };

  return (
    <>
      <div className="rounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Grup Pengguna dan Akses Menu"
          onAdd={() => dispatch(openAddModal())}
          addLabel="Tambah Grup"
          AddIcon={PlusIcon}
          disableSearch={true} // no search for user groups
        />

        <UserGroupTable
          search={search}
          onEdit={(g) => dispatch(openEditModal(g))}
          onPrivilege={handleOpenPrivilege} // pass callback for privilege modal
        />
      </div>

      {/* Add/Edit Modal */}
      <UserGroupModal
        open={modalOpen}
        mode={mode}
        group={selectedGroup}
        onClose={() => dispatch(closeUserGroupModal())}
      />

      {/* Privilege (Menu Access) Modal */}
      <UserGroupPrivilegeModal
        open={!!privilegeGroup}
        onClose={() => setPrivilegeGroup(null)}
        group={privilegeGroup}
      />

      {/* Delete Confirmation */}
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
