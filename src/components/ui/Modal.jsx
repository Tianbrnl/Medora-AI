import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={`relative w-full ${maxWidth} bg-white dark:bg-[#111111] text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-[#242424] z-10 overflow-hidden transform transition-all duration-200 my-auto`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#202020]">
            <h3 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
