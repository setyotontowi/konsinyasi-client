import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import capitalizeFirstLetter from "capitalize-first-letter";

export default function PageHeader({
  title,
  onAdd,
  search,
  searchPlaceholder,
  setSearch,
  addLabel,
  AddIcon,
  onFilter,
  disableSearch = false,
  disableAdd = false,
  disableFilter = true,
}) {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  const justifyClass = disableAdd ? "justify-end" : "justify-between";

  return (
    <div>
      {/* Header title + breadcrumb */}
      <div className="p-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {title ? title : capitalizeFirstLetter(paths[paths.length - 1])}
        </h2>

        <nav className="flex items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-500 font-medium">
            Dashboard
          </Link>
          {paths.map((path, index) => {
            const routeTo = "/" + paths.slice(0, index + 1).join("/");
            const isLast = index === paths.length - 1;
            return (
              <div key={index} className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                {isLast ? (
                  <span className="text-gray-800 capitalize">{path}</span>
                ) : (
                  <Link
                    to={routeTo}
                    className="hover:text-blue-500 capitalize"
                  >
                    {path}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Buttons and Search */}
      <div
        className={`pt-6 pl-6 pr-6 flex ${justifyClass} items-center border-t border-gray-200 gap-3 flex-wrap`}
      >
        {/* Left controls (Add + Filter) */}
        {!disableAdd && (
          <div className="flex items-center gap-3">
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-md"
            >
              {AddIcon && <AddIcon className="w-5 h-5" />}
              <span>{addLabel}</span>
            </button>

            {!disableFilter && (
              <button
                onClick={onFilter}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg border"
              >
                <FunnelIcon className="w-5 h-5" />
                Filter
              </button>
            )}
          </div>
        )}

        {/* When add button is disabled, move filter beside search */}
        {disableAdd && (
          <div className="flex items-center gap-3">
            {!disableFilter && (
              <button
                onClick={onFilter}
                className="flex items-center gap-2 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white text-sm font-medium rounded-lg shadow-md"
              >
                <FunnelIcon className="w-5 h-5" />
                Filter
              </button>
            )}
            {!disableSearch && (
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={searchPlaceholder || "Search..."}
                  className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* Normal layout when add is enabled */}
        {!disableAdd && !disableSearch && (
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={searchPlaceholder || "Search..."}
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
