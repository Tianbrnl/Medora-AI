import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { useChat } from "../../context/ChatContext";

export default function ChatInput({ onSendMessage, disabled = false, initialText = "" }) {
  const [text, setText] = useState(initialText);
  const [attachedFile, setAttachedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { settings, showToast } = useChat();

  useEffect(() => {
    if (initialText) {
      setText(initialText);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialText]);

  // Adjust textarea height automatically
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;

    let fullPrompt = text.trim();
    if (attachedFile) {
      fullPrompt = `[Attached Medical Report: ${attachedFile.name}]\n${fullPrompt}`;
    }

    onSendMessage(fullPrompt);
    setText("");
    setAttachedFile(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (settings.enterToSend) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      showToast(`Attached report: ${file.name}`, "info");
    }
  };

  return (
    <div className="w-full bg-gradient-to-t from-slate-50 via-slate-50/95 dark:from-black dark:via-black/95 to-transparent pt-4 pb-3 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Attachment preview chip if selected */}
        {attachedFile && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs">
            <Paperclip className="w-3.5 h-3.5" />
            <span className="font-medium truncate max-w-xs">{attachedFile.name}</span>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className="hover:text-rose-500 transition-colors ml-1"
              aria-label="Remove attachment"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Card Container */}
        <div className="relative flex items-end gap-2 bg-white dark:bg-[#121212] rounded-2xl border border-slate-200 dark:border-[#242424] shadow-md focus-within:border-teal-500/50 dark:focus-within:border-[#383838] focus-within:ring-2 focus-within:ring-teal-500/20 transition-all p-2 sm:p-2.5">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            className="hidden"
          />

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach medical document or image"
            title="Attach lab report or symptom photo (mock)"
            className="p-2 rounded-xl text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Multi-line Text Area */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a medical question..."
            rows={1}
            disabled={disabled}
            className="flex-1 max-h-44 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none py-1.5 focus:outline-none leading-relaxed"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim() || disabled}
            aria-label="Send medical question"
            className={`p-2 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 ${text.trim() && !disabled
                ? "bg-teal-600 text-white hover:bg-teal-700 shadow-xs shadow-teal-700/20 active:scale-95"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Safety Disclaimer */}
        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 px-2 leading-relaxed">
          MedoraAI can make mistakes. Always verify important medical information with a qualified healthcare professional.
        </p>
      </div>
    </div>
  );
}
