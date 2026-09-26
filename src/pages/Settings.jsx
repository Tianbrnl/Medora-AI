import { useState } from "react";
import {
  Sun,
  Moon,
  Laptop,
  Shield,
  Trash2,
  AlertTriangle,
  Info
} from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

export default function Settings() {
  const { clearAllConversations } = useChat();
  const { theme, setTheme } = useTheme();

  const [showClearModal, setShowClearModal] = useState(false);

  const handleConfirmClear = () => {
    clearAllConversations();
    setShowClearModal(false);
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-black p-4 sm:p-6 lg:p-8 overflow-y-auto chat-scroll font-sans transition-colors duration-200">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings & Preferences
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your interface theme, privacy controls, and application preferences.
          </p>
        </div>

        {/* 1. Appearance Section */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] p-6 shadow-xs space-y-6 transition-colors duration-200">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Sun className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Appearance & Theme
            </h2>
          </div>

          <div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
              Select your interface color preference. Choose between clean light mode, high-contrast dark mode, or follow your operating system.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {/* Light */}
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${theme === "light"
                  ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold ring-2 ring-teal-500/20 shadow-xs"
                  : "border-slate-200 dark:border-[#2a2a2a] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#181818]"
                  }`}
              >
                <Sun className={`w-5 h-5 mb-2 ${theme === "light" ? "text-teal-600 dark:text-teal-400" : ""}`} />
                <span className="text-sm">Light</span>
              </button>

              {/* Dark */}
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${theme === "dark"
                  ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold ring-2 ring-teal-500/20 shadow-xs"
                  : "border-slate-200 dark:border-[#2a2a2a] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#181818]"
                  }`}
              >
                <Moon className={`w-5 h-5 mb-2 ${theme === "dark" ? "text-teal-600 dark:text-teal-400" : ""}`} />
                <span className="text-sm">Dark</span>
              </button>

              {/* System */}
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${theme === "system"
                  ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold ring-2 ring-teal-500/20 shadow-xs"
                  : "border-slate-200 dark:border-[#2a2a2a] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#181818]"
                  }`}
              >
                <Laptop className={`w-5 h-5 mb-2 ${theme === "system" ? "text-teal-600 dark:text-teal-400" : ""}`} />
                <span className="text-sm">System</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Privacy Section */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] p-6 shadow-xs space-y-6 transition-colors duration-200">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Privacy & Data Controls
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Clear Conversation History
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Permanently deletes all saved local conversations and messages from this browser.
              </p>
            </div>

            <Button
              variant="subtleDanger"
              size="sm"
              onClick={() => setShowClearModal(true)}
              className="border border-rose-200 dark:border-rose-900/60 self-start sm:self-auto shrink-0"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              <span>Clear History</span>
            </Button>
          </div>
        </div>

        {/* 3. About Section */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] p-6 shadow-xs space-y-4 transition-colors duration-200">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Info className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              About MedoraAI
            </h2>
          </div>

          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">Software Version</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 dark:bg-[#1a1a1a] rounded-md text-slate-800 dark:text-slate-200">
                MedoraAI v1.0.0 (Frontend Demo)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200/80 dark:border-[#222222] text-xs leading-relaxed space-y-1.5">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Medical Information Assistant Disclaimer:
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                MedoraAI is an artificial intelligence health education platform designed to make medical terminology and evidence-based guidance easily accessible. It is not licensed to practice medicine and cannot provide clinical diagnoses or prescriptions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Clearing History */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear conversation history?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This action will permanently delete all your recent conversations and consultation records from this device. This cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowClearModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmClear}
            >
              Yes, Clear All History
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
