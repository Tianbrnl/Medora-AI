import { useState } from "react";
import { Copy, Check, RotateCw, ThumbsUp, ThumbsDown } from "lucide-react";
import medoraLogo from "../../assets/medora_logo.png";
import Avatar from "../ui/Avatar";
import { useChat } from "../../context/ChatContext";
import { getInitials } from "../../utils/userUtils";
import { formatMessageTimestamp } from "../../utils/dateUtils";

export default function ChatMessage({ message, conversationId }) {
  const { user, regenerateMessage, toggleFeedback, showToast, isThinking } = useChat();
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const isUser = message.sender === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    showToast("Copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (isThinking || isRegenerating) return;
    setIsRegenerating(true);
    try {
      await regenerateMessage(conversationId, message.id);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Helper to format text with headings, bolding, lists, and warning callouts
  const renderFormattedText = (text) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Check for headings
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-base font-semibold text-slate-900 dark:text-white mt-3 mb-1">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">
            {line.replace("## ", "")}
          </h3>
        );
      }

      // Check for warning / emergency blocks
      if (line.includes("⚠️") || line.includes("🚨")) {
        return (
          <div
            key={idx}
            className="my-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-medium"
          >
            {renderInlineMarkdown(line)}
          </div>
        );
      }

      // Bullet items
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-300 my-0.5 leading-relaxed">
            {renderInlineMarkdown(line.trim().substring(2))}
          </li>
        );
      }

      // Numbered items
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-700 dark:text-slate-300 my-0.5 leading-relaxed">
            {renderInlineMarkdown(line.trim().replace(/^\d+\.\s/, ""))}
          </li>
        );
      }

      // Empty line spacing
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Regular line
      return (
        <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed my-0.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Helper for inline markdown like bold and italic
  const renderInlineMarkdown = (content) => {
    // Split by bold (**text**)
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  // User message: displayed on the RIGHT
  if (isUser) {
    return (
      <div className="py-2.5 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex justify-end items-start gap-3">
          {/* User Message Bubble & Meta */}
          <div className="flex flex-col items-end max-w-[85%] sm:max-w-xl md:max-w-2xl">
            {/* Header info */}
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {formatMessageTimestamp(message.timestamp)}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {user.name}
              </span>
            </div>

            {/* Bubble */}
            <div className="px-4 py-3 rounded-2xl rounded-tr-xs bg-slate-200/90 dark:bg-[#181818] border border-slate-300/80 dark:border-[#282828] text-slate-900 dark:text-slate-100 shadow-sm text-sm sm:text-[15px] leading-relaxed break-words whitespace-pre-wrap text-left">
              {message.text}
            </div>
          </div>

          {/* User Avatar on right */}
          <div className="shrink-0 pt-5">
            <Avatar name={user.name} initials={user.initials || getInitials(user.name)} size="sm" />
          </div>
        </div>
      </div>
    );
  }

  // AI Assistant message: displayed on the LEFT
  return (
    <div className="py-3 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex justify-start items-start gap-3.5">
        {/* MedoraAI Avatar on left */}
        <div className="shrink-0 pt-1">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#181818] border border-slate-200/80 dark:border-[#282828] flex items-center justify-center shadow-xs overflow-hidden p-1">
            <img src={medoraLogo} alt="MedoraAI" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* AI Message Content */}
        <div className="flex-1 min-w-0 max-w-3xl space-y-1.5">
          {/* Header Row */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
              MedoraAI Assistant
            </span>

            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {formatMessageTimestamp(message.timestamp)}
            </span>
          </div>

          {/* Body */}
          <div className="text-sm bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#202020] rounded-2xl rounded-tl-xs p-4 sm:p-5 text-slate-800 dark:text-slate-200 shadow-sm">
            {renderFormattedText(message.text)}
          </div>

          {/* Action Toolbar for AI message */}
          <div className="pt-1 flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy response"
              title="Copy response"
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isThinking || isRegenerating}
              aria-label="Regenerate response"
              title={isRegenerating ? "Regenerating response..." : "Regenerate response"}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin text-teal-600 dark:text-teal-400" : ""}`} />
              <span className="hidden sm:inline">
                {isRegenerating ? "Regenerating..." : "Regenerate"}
              </span>
            </button>

            <div className="h-3 w-px bg-slate-200 dark:bg-[#242424] mx-1" />

            <button
              type="button"
              onClick={() => toggleFeedback(conversationId, message.id, "up")}
              aria-label="Thumbs up"
              title="Helpful"
              className={`p-1.5 rounded-lg transition-colors ${message.feedback === "up"
                ? "text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#181818]"
                }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => toggleFeedback(conversationId, message.id, "down")}
              aria-label="Thumbs down"
              title="Not helpful"
              className={`p-1.5 rounded-lg transition-colors ${message.feedback === "down"
                ? "text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#181818]"
                }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
