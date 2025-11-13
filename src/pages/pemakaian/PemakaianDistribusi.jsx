// /pages/distribusi/PemakaianDistribusi.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openViewModal,
  openDistribusiModal,
  closeModal,
  fetchPermintaanDistribusi,
} from "../../store/permintaanDistribusiSlice";
import PageHeader from "../../components/PageHeader";
import PermintaanDistribusiTable from "../distribusi/PermintaanDistribusiTable";
import PermintaanDistribusiModal from "../distribusi/PermintaanDistribusiModal";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function PemakaianDistribusi() {
  const dispatch = useDispatch();
  const { modalOpen, mode, selectedItem } = useSelector((state) => state.permintaanDistribusi);

  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);

  return (
    <div className="masterdata rounded-2xl bg-white border border-gray-200">
      <PageHeader
        title={`Pemakaian Distribusi (${count})`}
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Cari Nama atau RM Pasien"
        disableAdd={true}
        AddIcon={ClipboardDocumentCheckIcon}
        hideAdd={true}
      />

      {/* Reuse the same table but pass onDistribusi = true to filter delivered ones */}
      <PermintaanDistribusiTable
        search={search}
        onView={(item) => dispatch(openDistribusiModal(item))}
        onDistribusi={false}
      />

      {/* Reuse the same modal, but we'll detect mode = 'pemakaian' inside it */}
      <PermintaanDistribusiModal
        open={modalOpen}
        mode={"pemakaian"}
        data={selectedItem}
        onClose={() => dispatch(closeModal())}
      />
    </div>
  );
}
