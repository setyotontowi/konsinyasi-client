import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import JournalTable from "./JournalTable";
import JournalFilterModal from "./JournalFilterModal";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default function Journal() {
  const [filters, setFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-gray-200">
      <PageHeader
        title="Log Inventory Journal"
        AddIcon={BookOpenIcon}
        addLabel="Log"
        disableAdd={true}
        disableSearch={true}
        onFilter={() => setFilterOpen(true)}
        disableFilter={false}
      />

      <JournalTable filter={filters} />

      <JournalFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => setFilters(f)}
        initialFilters={filters}
      />
    </div>
  );
}
