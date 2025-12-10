import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader";
import PurchaseUsedTable from "./PurchaseUsedTable";
import PurchaseOrderTable from "./PurchaseOrderTable";
import PermintaanDistribusiModal from "../distribusi/PermintaanDistribusiModal";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import PurchaseUsedModal from "./PurchaseUsedModal";
import { fetchPurchaseOrders, printPurchaseOrder } from "../../store/purchaseSlice";
import PurchaseOrderBulkModal from "./PurchaseOrderBulkModal";

export default function Purchase() {
  const dispatch = useDispatch();
  const [showUsed, setShowUsed] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshUsed, setRefreshUsed] = useState(false);
  const [poModalOpen, setPoModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
    setRefreshUsed(prev => !prev); // toggle to force refresh
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // simple filters placeholder for future use
  const [filters] = useState({
    cetak: "",
    id_master_unit_supplier: "",
  });

  const handlePrint = (po) => {
    dispatch(printPurchaseOrder({ id: po.id }))
      .unwrap()
      .then(() => dispatch(fetchPurchaseOrders({ page: 1, limit: 20 })));
  };

  return (
    <>
      {/* Segment 1: Used items (like first card in Distribusi) */}
      <div className="masterdata rounded-2xl bg-white border border-gray-200">
        <button
          type="button"
          onClick={() => setShowUsed((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100"
        >
          <h3 className="text-md font-semibold text-left">
            Barang yang Sudah Digunakan
          </h3>
          {showUsed ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            showUsed ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <button
            onClick={() => setPoModalOpen(true)}
            className="ml-10 mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-md"
          >
            <span>Buat Purchase Order</span>
          </button>

          <div className="p-4">
            <PurchaseUsedTable 
              onDetail={openDetailModal}
              refresh={refreshUsed}
            />
          </div>
        </div>
      </div>

      {/* Segment 2: Purchase orders (like Distribusi card) */}
      <div className="masterdata rounded-2xl bg-white border border-gray-200 mt-6">
        <PageHeader
          title="Purchase Order"
          disableAdd={true}
          disableSearch={true}
          disableFilter={true} // set to false when you add a filter modal
        />

        <div>
          <PurchaseOrderTable 
            filters={filters} 
            onPrint={handlePrint}
            refresh={refreshUsed}
          />
        </div>
      </div>

      {/* Modal */}
      <PurchaseUsedModal
        open={modalOpen}
        data={selectedItem}
        onClose={closeModal}
      />

      <PurchaseOrderBulkModal
        open={poModalOpen}
        onSuccess={refreshUsed}
        onClose={() => setPoModalOpen(false)}
      />
    </>
  );
}
