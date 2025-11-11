import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient"; // ← import your axiosClient
import {
  Cog6ToothIcon,
  Squares2X2Icon,
  UserIcon,
  BuildingOffice2Icon,
  FolderIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  RectangleGroupIcon,
  UserGroupIcon,
  Square3Stack3DIcon,
  SwatchIcon,
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  CircleStackIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";

// Map DB icon names to Heroicons
const iconMap = {
  Cog6ToothIcon,
  Squares2X2Icon,
  UserIcon,
  FolderIcon,
  RectangleGroupIcon,
  UserGroupIcon,
  Square3Stack3DIcon,
  SwatchIcon, 
  ArrowLeftEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  CircleStackIcon,
  BookOpenIcon
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menus, setMenus] = useState([]);
  const [openMenu, setOpenMenu] = useState({});

  // Fetch menus dynamically based on role in JWT
  useEffect(() => {
    axiosClient
      .get("/menu") // baseURL will prepend automatically
      .then((res) => {
        const data = res.data;

        // ✅ Add default Dashboard menu (always visible)
        const dashboardMenu = {
          id: 0,
          nama: "Dashboard",
          path: "/",
          icon: "Squares2X2Icon",
          children: [],
        };

        // Merge default + backend menus
        const allMenus = [dashboardMenu, ...data];
        setMenus(allMenus);

        // auto-open current submenu based on current route
        allMenus.forEach((menu) => {
          if (
            menu.children?.some((child) =>
              location.pathname.startsWith(child.path)
            )
          ) {
            setOpenMenu((prev) => ({ ...prev, [menu.id]: true }));
          }
        });
      })
      .catch((err) => {
        console.error("Error loading menus:", err);
        if (err.response?.status === 401) navigate("/login");
      });
  }, [navigate, location.pathname]);

  function logout() {
    localStorage.removeItem("auth_token");
    navigate("/login");
  }

  function toggleMenu(id) {
    setOpenMenu((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-gray-100 text-gray-900 font-medium"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  const renderMenu = (menu) => {
    const Icon = iconMap[menu.icon] || FolderIcon;

    if (menu.children && menu.children.length > 0) {
      return (
        <div key={menu.id}>
          <button
            onClick={() => toggleMenu(menu.id)}
            className="flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            <span className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              {menu.nama}
            </span>
            {openMenu[menu.id] ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </button>

          {openMenu[menu.id] && (
            <div className="pl-8 mt-1 space-y-1">
              {menu.children.map((child) => renderMenu(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink to={menu.path} key={menu.id} className={linkClass}>
        <Icon className="w-5 h-5" />
        {menu.nama}
      </NavLink>
    );
  };

  return (
    <aside className="w-64 bg-white h-screen flex flex-col border-r border-r-gray-200">
      <div className="pr-4 pl-4 pt-4 text-xl font-bold font-sans">
        <BuildingOffice2Icon className="w-6 h-6 inline-block mr-2 text-black-900" />
        SI Konsinyasi
      </div>
      <p className="pr-4 pl-4 pb-4 text-sm italic">PKU Gamping</p>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-sm">
        {menus.length > 0 ? (
          menus.map((menu) => renderMenu(menu))
        ) : (
          <div className="text-gray-400 italic px-4">Loading menus...</div>
        )}
      </nav>

      <button
        onClick={logout}
        className="m-4 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        Logout
      </button>
    </aside>
  );
}
