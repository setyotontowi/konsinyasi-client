import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  openAddModal,
  openEditModal,
  openViewModal,
  closeModal,
  openDeleteConfirm,
  closeDeleteConfirm,
  fetchStokOpname,
} from "../../store/stokOpnameSlice";
import PageHeader from "../../components/PageHeader";
import ConfirmModal from "../../components/ConfirmationModal";
import PermintaanDistribusiModal from "../distribusi/PermintaanDistribusiModal";
import { ArrowDownOnSquareIcon, CalendarIcon } from "@heroicons/react/24/outline";
import StokOpnameTable from "./StokOpnameTable";
import StokOpnameModal from "./StokOpnameModal";
import StokFilterModal from "../stok/StokFilterModal";
import axiosClient from "../../api/axiosClient";

export default function StokOpname() {
  const dispatch = useDispatch();
  const { modalOpen, confirmOpen, mode, selectedItem, itemToDelete } = useSelector((state) => state.stokOpname);


  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [unitsPBF, setUnitsPBF] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    id_master_unit: null,
    start_date: "",
    end_date: "",
  });


  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    setDeleting(true);
    // dispatch(deletePermintaanDistribusi(itemToDelete.pd_id)).finally(() =>
    //   setDeleting(false)
    // );
    setDeleting(false);
  };

  // LOAD UNITS
  useEffect(() => {
    axiosClient.get("/unit?.is_pbf=Ya").then((res) => {
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

      setUnitsPBF(pbfUnits);
    });
  }, []);

  return (
    <>
      <div className="masterdata rounded-2xl bg-white border border-gray-200">
        <PageHeader
          title="Stok Opname"
          onAdd={() => dispatch(openAddModal())}
          searchPlaceholder="Cari unit atau user"
          addLabel="Stok Opname"
          AddIcon={ArrowDownOnSquareIcon}
          disableFilter={false}
          disableSearch={true}
          onFilter={() => setFilterOpen(true)}
        />

        <StokOpnameTable
          search={search}
          filters = {filters}
          onEdit={(item) => dispatch(openEditModal(item))}
          onView={(item) => dispatch(openViewModal(item))}
          onDelete={(item) => dispatch(openDeleteConfirm(item))}
        />

        <StokOpnameModal
          open={modalOpen}
          data={selectedItem}
          onClose={() => dispatch(closeModal())}
          onSave={() => dispatch(fetchStokOpname({ page: 1, limit: 20 }))}
        />

        <StokFilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          data={selectedItem}
          filters={filters}
          setFilters={setFilters}
          unitsPBF={unitsPBF}
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
    </>
  );
}
