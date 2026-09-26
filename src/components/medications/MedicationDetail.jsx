import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Pill, Edit2, Info } from "lucide-react";

export default function MedicationDetail({ medication, isOpen, onClose, onEdit }) {
  if (!medication) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Medication Details" maxWidth="max-w-xl">
      <div className="space-y-5">
        {/* Header: Name, Category, Icon */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#202020]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
                {medication.category || "General"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {medication.name}
            </h2>
            {medication.genericName && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Generic name: <span className="font-medium text-slate-700 dark:text-slate-200">{medication.genericName}</span>
              </p>
            )}
          </div>

          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-600/20 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5" />
          </div>
        </div>

        {/* Common Uses */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Common Uses
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222] text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
            {medication.commonUses}
          </div>
        </div>

        {/* Dosage */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Dosage (General Information)
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222] text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
            {medication.dosage}
          </div>
        </div>

        {/* Category Information */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Category
          </h4>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {medication.category}
          </p>
        </div>

        {/* Educational Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222] text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            This information is provided for general educational purposes and is not a personalized prescription or medical advice. Always follow the medication label and consult a qualified healthcare professional or pharmacist for personalized guidance.
          </p>
        </div>

        {/* Modal Actions: Edit Medication & Close */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#202020]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(medication);
            }}
            className="flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Medication</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
