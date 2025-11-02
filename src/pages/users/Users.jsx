import { useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import UserTable from "./UserTable";
import UserModal from "./UserModal"

export default function Users() {
  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0); // 🔹 for forcing reload

  const handleAddUser = () => setOpenAddModal(true);

  const handleSuccess = () => {
    setReloadTrigger((prev) => prev + 1);
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
      <UserTable search={search} reloadTrigger={reloadTrigger} />

      <UserModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleSuccess} 
      />
    </div>
  );
}
