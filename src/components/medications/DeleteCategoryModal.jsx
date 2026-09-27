import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { AlertTriangle } from "lucide-react";

export default function DeleteCategoryModal({
  isOpen,
  category,
  medicationCount = 0,
  onClose,
  onConfirm
}) {
  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Category"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-800 dark:text-slate-200">
              Are you sure you want to delete the category{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">
                "{category}"
              </strong>
              ?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {medicationCount > 0 ? (
                <>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {medicationCount} {medicationCount === 1 ? "medication" : "medications"}
                  </span>{" "}
                  currently in this category will be reassigned to{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    "Other"
                  </span>
                  .
                </>
              ) : (
                "No medications are currently assigned to this category."
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#202020]">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => onConfirm(category)}
          >
            Delete Category
          </Button>
        </div>
      </div>
    </Modal>
  );
}
