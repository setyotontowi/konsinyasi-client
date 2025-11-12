import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import JournalTable from "./JournalTable";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export default function Journal() {
  const [search, setSearch] = useState("");

  return (
    <div className="rounded-2xl bg-white border border-gray-200">
      <PageHeader
        title="Log Inventory Journal"
        search={search}
        setSearch={setSearch}
        AddIcon={BookOpenIcon}
        addLabel="Log"
        disableAddButton // No add button since read-only
      />

      <JournalTable search={search} />
    </div>
  );
}
