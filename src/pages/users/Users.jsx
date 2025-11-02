import { useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import UserTable from "./UserTable";
import UserModal from "./UserModal"

export default function Users() {
  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState("add");

  const handleAddUser = () => setOpenAddModal(true);

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setMode("edit");
    setOpenAddModal(true);
  };

  return (
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
        onEdit={handleEditUser} />

      <UserModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleSuccess}
        mode={mode}
        user={selectedUser}
      />
    </div>
  );
}
