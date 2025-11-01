import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from 'react-router-dom'

export default function PageHeader({ title, onAdd, search, setSearch, addLabel, AddIcon }) {
  
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <div>
      {/* Title */}
      <div className="p-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>

        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-500 font-medium">Dashboard</Link>
          {paths.map((path, index) => {
            const routeTo = "/" + paths.slice(0, index + 1).join("/");
            const isLast = index === paths.length - 1;

            return (
              <div key={index} className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                {isLast ? (
                  <span className="text-gray-800 capitalize">{path}</span>
                ) : (
                  <Link to={routeTo} className="hover:text-blue-500 capitalize">
                    {path}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
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