import Modal from "./Modal";
import { ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function HelpModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="DoctorAI Help & Support" maxWidth="max-w-lg">
      <div className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>What is DoctorAI?</span>
          </h4>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            MedoraAi is an AI-powered medical information assistant designed to help patients understand medical symptoms, pharmaceutical references, and general health concepts with clear language.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <span>Why do I need an account to chat?</span>
          </h4>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Signing in allows MedoraAi to securely maintain your consultation histories across sessions, remember your preferences, and maintain continuity in ongoing health discussions.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Emergency Guidance</span>
          </h4>
          <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60">
            MedoraAi is not an emergency response service. If you are experiencing chest pain, severe shortness of breath, sudden numbness, or heavy bleeding, please call emergency services (911) immediately.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
