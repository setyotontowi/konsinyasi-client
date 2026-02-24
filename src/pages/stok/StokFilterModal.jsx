import Select from "react-select";
import { XMarkIcon } from "@heroicons/react/24/outline";
import UnitSelect from "../../components/UnitSelect";

export default function StokFilterModal({
  open,
  onClose,
  filters,
  setFilters,
  unitsPBF,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-xl mx-4 animate-fadeIn border border-gray-200"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* === HEADER === */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Filter Stok Opname
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* === CONTENT === */}
        <div className="p-6 space-y-4">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
                value={filters.start_date}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, start_date: e.target.value }))
                }
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
                value={filters.end_date}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, end_date: e.target.value }))
                }
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <UnitSelect
                name="id_master_unit"
                unitSelected={{value: filters.id_master_unit}}
                onChange={(name, option) => {
                  setFilters((f) => ({...f, id_master_unit: option.value}))
                }}
                isPbf="ya"
              />
            </div>
          </div>
        </div>

        {/* === FOOTER === */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-3">
          <button
            type="button"
            onClick={() =>
              setFilters({
                id_master_unit: null,
                id_master_unit_tujuan: null,
                id_permintaan_distribusi: "",
                start_date: "",
                end_date: "",
              })
            }
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
