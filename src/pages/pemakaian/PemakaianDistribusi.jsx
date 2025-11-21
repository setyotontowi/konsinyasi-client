// /pages/distribusi/PemakaianDistribusi.jsx
import { useState, useEffect } from "react";
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
import DistribusiFilterModal from "../distribusi/DistribusiFilterModal";
import axiosClient from "../../api/axiosClient";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function PemakaianDistribusi() {
  const dispatch = useDispatch();
  const { modalOpen, mode, selectedItem } = useSelector((state) => state.permintaanDistribusi);

  const [search, setSearch] = useState("");
  // FILTER STATES
  const [filterOpen, setFilterOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [unitsPBF, setUnitsPBF] = useState([]);

  const [filters, setFilters] = useState({
    id_master_unit: null,
    id_master_unit_tujuan: null,
    id_permintaan_distribusi: "",
    start_date: "",
    end_date: "",
  });


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
    <div className="masterdata rounded-2xl bg-white border border-gray-200">
      <PageHeader
        title={`Penggunaan Barang`}
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Cari Nama atau RM Pasien"
        disableAdd={true}
        AddIcon={ClipboardDocumentCheckIcon}
        hideAdd={true}
        disableFilter={false}
        onFilter={() => setFilterOpen(true)}
      />

      <PermintaanDistribusiTable
        search={search}
        onView={(item) => dispatch(openDistribusiModal(item))}
        onDistribusi={false}
        filters={filters}
      />

      {/* Reuse the same modal, but we'll detect mode = 'pemakaian' inside it */}
      <PermintaanDistribusiModal
        open={modalOpen}
        mode={"pemakaian"}
        data={selectedItem}
        onClose={() => dispatch(closeModal())}
      />

      <DistribusiFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        units={units}
        unitsPBF={unitsPBF}
      />
    </div>
  );
}
