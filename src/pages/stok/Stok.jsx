// pages/Stok/Stok.jsx
import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import StokTable from "./StokTable";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import StokFilterModal from "./StokFilterModal";

export default function Stok() {
  const [filters, setFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-gray-200">
      <PageHeader
        title="Stok Barang Gudang"
        AddIcon={ArchiveBoxIcon}
        addLabel="Stok"
        disableAdd={true}
        disableSearch={true}
        onFilter={() => setFilterOpen(true)}
        disableFilter={false}
      />

      <StokTable filters={filters} />

      <StokFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => setFilters(f)}
        initialFilters={filters}
        />
    </div>
  );
}



