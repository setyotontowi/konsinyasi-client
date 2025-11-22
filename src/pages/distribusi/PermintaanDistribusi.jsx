import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openEditModal,
  openViewModal,
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
} from "../../store/permintaanDistribusiSlice";
import { deletePermintaanDistribusi } from "../../store/permintaanDistribusiSlice";

import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import PermintaanDistribusiTable from "./PermintaanDistribusiTable";
import ConfirmModal from "../../components/ConfirmationModal";
import PermintaanDistribusiModal from "./PermintaanDistribusiModal";
import DistribusiFilterModal from "./DistribusiFilterModal";
import axiosClient from "../../api/axiosClient";

export default function PermintaanDistribusi() {
  const dispatch = useDispatch();
  const {
    modalOpen,
    confirmOpen,
    mode,
    selectedItem,
    itemToDelete,
  } = useSelector((state) => state.permintaanDistribusi);

  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [units, setUnits] = useState([]);
  const [unitsPBF, setUnitsPBF] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    id_master_unit: null,
    id_master_unit_tujuan: null,
    id_permintaan_distribusi: "",
    start_date: "",
    end_date: "",
  });

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    setDeleting(true);
    dispatch(deletePermintaanDistribusi(itemToDelete.pd_id)).finally(() =>
      setDeleting(false)
    );
  };

  // LOAD UNITS
  useEffect(() => {
    axiosClient.get("/unit").then((res) => {
      const list = res.data?.data || [];

      const pbfUnits = [];
      const normalUnits = [];

      list.forEach((u) => {
        const item = { value: u.id, label: u.nama };

        if (String(u.is_pbf).toLowerCase() === "ya") {
          pbfUnits.push(item);
        } else {
          normalUnits.push(item);
        }
      });

      setUnits(normalUnits);
      setUnitsPBF(pbfUnits);
    });
  }, []);

  return (
    <>
      <div className="masterdata rounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Permintaan Distribusi"
          onAdd={() => dispatch(openAddModal())}
          search={search}
          searchPlaceholder= "Cari Nama atau RM Pasien"
          setSearch={setSearch}
          addLabel="Tambah Permintaan"
          AddIcon={ClipboardDocumentListIcon}
          disableFilter={false}
          onFilter={() => setFilterOpen(true)}
        />

        <PermintaanDistribusiTable
          search={search}
          onEdit={(item) => dispatch(openEditModal(item))}
          onView={(item) => dispatch(openViewModal(item))}
          onDelete={(item) => dispatch(openDeleteConfirm(item))}
          filters={filters}
          onDistribusi = {null}
        />

        <PermintaanDistribusiModal
          open={modalOpen}
          mode={mode}
          data={selectedItem}
          onClose={() => dispatch(closeModal())}
        />
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Hapus Permintaan Distribusi"
        message={
          itemToDelete
            ? `Apakah Anda yakin ingin menghapus permintaan untuk pasien "${itemToDelete.nama_pasien}"?`
            : "Apakah Anda yakin ingin menghapus permintaan distribusi ini?"
        }
        onConfirm={handleDeleteConfirm}
        onClose={() => dispatch(closeDeleteConfirm())}
        loading={deleting}
      />

      <DistribusiFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        units={units}
        unitsPBF={unitsPBF}
      />
    </>
  );
}
