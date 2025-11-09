import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openAddModal,
  openViewModal,
  openDistribusiModal,
  closeModal,
} from "../../store/permintaanDistribusiSlice";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import PageHeader from "../../components/PageHeader";
import PermintaanDistribusiTable from "./PermintaanDistribusiTable";
import PermintaanDistribusiModal from "./PermintaanDistribusiModal";
import DistribusiTable from "./DistribusiTable";

export default function Distribusi() {
  const dispatch = useDispatch();
  const {
    modalOpen,
    mode,
    selectedItem,
  } = useSelector((state) => state.permintaanDistribusi);

  const [showActive, setShowActive] = useState(false);
  const [permintaanCount, setPermintaanCount] = useState();


  return (
    <>
      {/* === Collapsible Section === */}
      <div className="masterdata rounded-2xl bg-white border border-gray-200">
        {/* Header */}
        <button
          type="button"
          onClick={() => setShowActive((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100 "
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

        {/* Collapsible Content */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showActive ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4">
            <PermintaanDistribusiTable
              onView={(item) => dispatch(openDistribusiModal(item))}
              onDistribusi={true}
              onCountChange={setPermintaanCount}
            />
          </div>
        </div>
      </div>



      <div className="masterdata rounded-2xl bg-white border border-gray-200 mt-6">
        <PageHeader
          title="Distribusi"
          onAdd={() => dispatch(openAddModal())}
          disableAdd = {true}
          disableSearch = {true}
          addLabel="Tambah Permintaan"
        />

        <div>
          <DistribusiTable
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
