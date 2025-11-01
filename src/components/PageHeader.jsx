import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function PageHeader({ title, onAdd, search, setSearch, addLabel, AddIcon }) {
  return (
    <div>
      {/* Title */}
      <div className="p-6 flex items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="pt-6 pl-6 pr-6 flex justify-between items-center border-t border-gray-200">
        {/* Add Button */}
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-400 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md"
        >
          {AddIcon && <AddIcon className="w-5 h-5" />}
          <span className="relative top-px-1">{addLabel}</span>
        </button>

        {/* Search bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
  
}