import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function StokOpnameSerialNumberModal({
  open,
  onClose,
  initialData,
  onAddSerialNumber,
}) {
  console.log("initial data", initialData);
  const [rawText, setRawText] = useState("");

  // Prefill when editing existing SN
  useEffect(() => {
    if (open) {
      if (initialData?.serial_numbers?.length) {
        setRawText(initialData.serial_numbers.join("\n"));
      } else {
        setRawText("");
      }
    }
  }, [open, initialData]);

  const separateSerialNumbers = () => {
    return rawText
      .split(/\r?\n/)
      .map((sn) => sn.trim())
      .filter(Boolean);
  };

  const handleSave = () => {
    const serialNumbers = separateSerialNumbers();

    if (serialNumbers.length === 0) {
      toast.error("Minimal satu serial number harus diisi");
      return;
    }

    onAddSerialNumber(serialNumbers);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      //onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-lg p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700">
            Serial Number
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-600">
            Tambahkan beberapa serial number dengan <b>enter</b> atau baris baru.
            Satu baris = satu serial number.
          </p>

          <textarea
            rows={10}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`SN-001\nSN-002\nSN-003`}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <div className="text-xs text-gray-500">
            Total: {separateSerialNumbers().length} serial number
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
