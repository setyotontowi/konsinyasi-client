import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openViewModal,
  openDistribusiModal,
  closeModal,
} from "../../store/permintaanDistribusiSlice";

import axiosClient from "../../api/axiosClient";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

import PageHeader from "../../components/PageHeader";
import PermintaanDistribusiTable from "./PermintaanDistribusiTable";
import PermintaanDistribusiModal from "./PermintaanDistribusiModal";
import DistribusiTable from "./DistribusiTable";
import DistribusiFilterModal from "./DistribusiFilterModal";

export default function Distribusi() {
  const dispatch = useDispatch();
  const { modalOpen, mode, selectedItem } = useSelector(
    (state) => state.permintaanDistribusi
  );

  const [showActive, setShowActive] = useState(true);
  const [permintaanCount, setPermintaanCount] = useState();

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
    <>
      <div className="masterdata rounded-2xl bg-white border border-gray-200">
        <button
          type="button"
          onClick={() => setShowActive((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100"
        >
          <h3 className="text-md font-semibold text-left">
            Permintaan Distribusi ({permintaanCount})
          </h3>
          {showActive ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            showActive ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4">
            <PermintaanDistribusiTable
              onView={(item) => dispatch(openDistribusiModal(item))}
              onDistribusi={true}
              filters={filters}
              onCountChange={setPermintaanCount}
            />
          </div>
        </div>
      </div>

      <div className="masterdata rounded-2xl bg-white border border-gray-200 mt-6">
        <PageHeader
          title="Distribusi"
          disableAdd={true}
          disableSearch={true}
          disableFilter={false}
          onFilter={() => setFilterOpen(true)}
        />

        <DistribusiFilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={filters}
          setFilters={setFilters}
          units={units}
          unitsPBF={unitsPBF}
        />

        <div>
          <DistribusiTable
            filters={filters}
            onView={(item) => dispatch(openViewModal(item))}
          />
        </div>
      </div>

      <PermintaanDistribusiModal
        open={modalOpen}
        mode={mode}
        data={selectedItem}
        onClose={() => dispatch(closeModal())}
      />
    </>
  );
}
