import { useEffect } from "react";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";

export default function MobileSidebar({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#090909] border-r border-[#1c1c1c] shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-in-out">
        <div className="absolute top-3 right-3 z-20">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Sidebar onSelectChat={onClose} />
        </div>
      </div>
    </div>
  );
}
