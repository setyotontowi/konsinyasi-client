import { useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import UserTable from "./UserTable";

export default function Users() {
  const [search, setSearch] = useState("");

  return (
    <div className="masterdata titlerounded-2xl bg-white border border-gray-200">
      <PageHeader
        title="Data Pengguna"
        search={search}
        setSearch={setSearch}
        addLabel="Tambah Pengguna"
        AddIcon={UserPlusIcon}
      />
      <UserTable search={search} />
    </div>
  );
}