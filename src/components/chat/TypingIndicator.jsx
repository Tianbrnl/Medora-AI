import medoraLogo from "../../assets/medora_logo.png";

export default function TypingIndicator() {
  return (
    <div className="py-3 px-4 sm:px-6">
      <div className="flex justify-start items-start gap-3.5 max-w-4xl mx-auto w-full animate-in fade-in duration-200">
        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#181818] border border-slate-200/80 dark:border-[#282828] flex items-center justify-center shadow-xs overflow-hidden p-1 shrink-0">
          <img src={medoraLogo} alt="MedoraAI" className="w-full h-full object-contain animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">MedoraAI Assistant</span>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/50 text-teal-700 dark:text-teal-300">AI</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">is thinking...</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-xs bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#202020] text-slate-500 dark:text-slate-400 shadow-md">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
