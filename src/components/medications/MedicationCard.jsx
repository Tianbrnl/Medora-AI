import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import Button from "../ui/Button";

export default function MedicationCard({ medication, onViewDetails, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="flex flex-col justify-between bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] p-5 sm:p-6 hover:border-slate-300 dark:hover:border-[#333333] hover:shadow-xl transition-all duration-200 relative group">
      <div>
        {/* Top Header: Medicine Name & Three-dot menu */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
                {medication.category || "General"}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {medication.name}
            </h3>
          </div>

          {/* Three-dot dropdown menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Medication actions"
              aria-expanded={menuOpen}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1c1c1c] transition-colors focus:outline-none cursor-pointer"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#2a2a2a] shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(medication);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222222] transition-colors text-left cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(medication);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Generic Name */}
        {medication.genericName && (
          <div className="mb-3.5">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
              Generic name
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">
              {medication.genericName}
            </p>
          </div>
        )}

        {/* Common Uses */}
        <div className="mb-3.5">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
            Common uses
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {medication.commonUses}
          </p>
        </div>

        {/* Dosage */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
            Dosage
          </p>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {medication.dosage}
          </p>
        </div>
      </div>

      {/* Bottom Action: View Details */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onViewDetails(medication)}
        className="w-full justify-center text-xs sm:text-sm py-2"
      >
        View Details
      </Button>
    </div>
  );
}
