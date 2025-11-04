import { useState, useEffect } from "react";
import { XMarkIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

export default function UserGroupPrivilegeModal({ open, onClose, group }) {
  const [menuList, setMenuList] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [expanded, setExpanded] = useState([]); // track expanded parents
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load menus + privileges
  useEffect(() => {
    if (!open || !group) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuRes, privRes] = await Promise.all([
          axiosClient.get("/menu/all"),
          axiosClient.get(`/user/group/${group.id}/privilege`),
        ]);

        setMenuList(menuRes.data.data || []);
        setSelectedMenus(privRes.data.data.menu_ids || []);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data menu atau privilege");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, group]);

  const toggleMenu = (menuId) => {
    setSelectedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!group) return;
    setSaving(true);
    try {
      await axiosClient.post(`/user/group/${group.id}/privilege`, {
        menu_ids: selectedMenus,
      });
      toast.success("Akses menu berhasil diperbarui!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan akses menu");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  // Recursive renderer
  const renderMenuTree = (menus, level = 0) => {
    return menus.map((menu) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const isExpanded = expanded.includes(menu.id);
      const isChecked = selectedMenus.includes(menu.id);

      return (
        <div key={menu.id} className="border-l border-gray-100 pl-3">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  type="button"
                  onClick={() => toggleExpand(menu.id)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-5" />} {/* spacer */}

              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleMenu(menu.id)}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{menu.nama}</span>
            </div>
            {menu.path && (
              <span className="text-xs text-gray-400 italic">{menu.path}</span>
            )}
          </div>

          {hasChildren && isExpanded && (
            <div className="ml-5">
              {renderMenuTree(menu.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 animate-fadeIn border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Kelola Akses Menu
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-500">Memuat menu...</div>
          ) : menuList.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 mb-3">
                Pilih menu yang dapat diakses oleh grup{" "}
                <span className="font-semibold text-gray-800">
                  {group?.group_nama}
                </span>
              </p>
              {renderMenuTree(menuList)}
            </>
          ) : (
            <p className="text-gray-500 italic text-sm text-center">
              Tidak ada menu terdaftar.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-md text-white transition ${
              saving
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Menyimpan..." : "Simpan Akses"}
          </button>
        </div>
      </div>
    </div>
  );
}
