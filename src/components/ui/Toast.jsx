import { useChat } from "../../context/ChatContext";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function Toast() {
  const { toastMessage } = useChat();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-500 shrink-0" />
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#141414] text-slate-100 rounded-xl shadow-2xl border border-[#222222] max-w-sm">
        {icons[toastMessage.type] || icons.info}
        <p className="text-sm font-medium">{toastMessage.message}</p>
      </div>
    </div>
  );
}
