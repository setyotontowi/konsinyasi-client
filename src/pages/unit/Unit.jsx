import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openEditModal,
  closeUnitModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} from "../../store/unitSlice";
import { deleteUnit } from "../../store/unitSlice";

import { PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import UnitTable from "./UnitTable";
import UnitModal from "./UnitModal";
import ConfirmModal from "../../components/ConfirmationModal";

export default function Unit() {
  const dispatch = useDispatch();
  const { modalOpen, confirmOpen, mode, selectedUnit, unitToDelete } =
    useSelector((state) => state.unit);

  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = () => {
    if (!unitToDelete) return;
    setDeleting(true);
    dispatch(deleteUnit({ id: unitToDelete.id })).finally(() => setDeleting(false));
  };

  return (
    <>
      <div className="rounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Data Unit"
          onAdd={() => dispatch(openAddModal())}
          search={search}
          setSearch={setSearch}
          addLabel="Tambah Unit"
          AddIcon={PlusIcon}
        />

        <UnitTable
          search={search}
          onEdit={(u) => dispatch(openEditModal(u))}
          onDelete={(u) => dispatch(openDeleteConfirm(u))}
        />

        <UnitModal
          open={modalOpen}
          mode={mode}
          unit={selectedUnit}
          onClose={() => dispatch(closeUnitModal())}
        />
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Hapus Unit"
        message={
          unitToDelete
            ? `Apakah Anda yakin ingin menghapus unit "${unitToDelete.nama}"?`
            : "Apakah Anda yakin ingin menghapus unit ini?"
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => dispatch(closeDeleteConfirm())}
        loading={deleting}
      />
    </>
  );
}
