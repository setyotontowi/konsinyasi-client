import { createPortal } from "react-dom";

export default function PopupMenuPortal({ anchorRef, children }) {
  if (!anchorRef.current) return null;

  const rect = anchorRef.current.getBoundingClientRect();

  const style = {
    position: "absolute",
    top: rect.bottom + window.scrollY + 4, // slight gap
    left: rect.right - 150 + window.scrollX, // adjust width/alignment
    zIndex: 9999,
  };

  return createPortal(
    <div
      style={style}
      className="w-36 bg-white border border-gray-200 rounded-lg shadow-lg"
    >
      {children}
    </div>,
    document.body
  );
}