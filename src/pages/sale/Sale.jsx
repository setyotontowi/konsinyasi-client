import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader";
import PurchaseOrderTable from "../purchase/PurchaseOrderTable";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function Sale() {
  const dispatch = useDispatch();
  const [showUsed, setShowUsed] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // simple filters placeholder for future use
  const [filters] = useState({
    cetak: "Sudah",
    id_master_unit_supplier: "",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  const handleOpenConfirm = (po) => {
    setSelectedPO(po);
    setConfirmOpen(true);
  };

  return (
    <>
      <div className="masterdata rounded-2xl bg-white border border-gray-200 mt-6">
        <PageHeader
          title="Penjualan"
          disableAdd={true}
          disableSearch={true}
          disableFilter={true} // set to false when you add a filter modal
        />

        <div>
          <PurchaseOrderTable 
            mode="sale"
            filters={filters} 
            handlePrint={null}
            onConfirm={handleOpenConfirm}
          />
        </div>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        title="Konfirmasi Penjualan"
        message={`Apakah Anda yakin ingin mengonfirmasi PO #${selectedPO?.id}?`}
        onClose={() => setConfirmOpen(false)}
        mode="confirm"
        onConfirm={() => {
            dispatch(confirmPurchaseOrder({ id: selectedPO.id }))
            .unwrap()
            .then(() => setConfirmOpen(false));
        }}
      />
    </>
  );
}
