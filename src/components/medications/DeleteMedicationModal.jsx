import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { AlertTriangle } from "lucide-react";

export default function DeleteMedicationModal({
  isOpen,
  medication,
  onClose,
  onConfirm
}) {
  if (!medication) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Medication" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-200">
              Are you sure you want to delete{" "}
              <strong className="text-white font-semibold">"{medication.name}"</strong>?
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              This action cannot be undone and will remove this medication from your reference library.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#202020]">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => onConfirm(medication.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
