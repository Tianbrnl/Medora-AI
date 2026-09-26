import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Plus, Settings, HelpCircle, LogIn, Pill } from "lucide-react";
import medoraLogo from "../../assets/medora_logo.png";
import { useChat } from "../../context/ChatContext";
import ConversationList from "../chat/ConversationList";
import UserMenu from "./UserMenu";
import HelpModal from "../ui/HelpModal";
import Button from "../ui/Button";

export default function Sidebar({ onSelectChat, onNewChatClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useChat();
  const [helpOpen, setHelpOpen] = useState(false);

  const handleNewChat = () => {
    if (onSelectChat) onSelectChat();
    if (onNewChatClick) {
      onNewChatClick();
    } else {
      navigate(isAuthenticated ? "/chat" : "/");
    }
  };

  const isMedicationsActive = location.pathname.startsWith("/medications");
  const isSettingsActive = location.pathname.startsWith("/settings");

  return (
    <>
      <aside className="w-72 h-screen bg-slate-50 dark:bg-[#090909] text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-[#1c1c1c] flex flex-col shrink-0 select-none transition-colors duration-200">
        {/* Top Header & Logo */}
        <div className="p-4 pb-2">
          <Link
            to={isAuthenticated ? "/chat" : "/"}
            onClick={onSelectChat}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-[#161616] transition-colors group"
          >
            <img
              src={medoraLogo}
              alt="MedoraAI Logo"
              className="w-8 h-8 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  Medora<span className="text-teal-500 dark:text-teal-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/50 text-teal-800 dark:text-teal-300">
                  AI
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* New Chat Button */}
        <div className="px-4 py-2">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#141414] hover:bg-slate-100 dark:hover:bg-[#1a1a1a] text-slate-900 dark:text-slate-100 font-medium text-sm border border-slate-200 dark:border-[#222222] hover:border-slate-300 dark:hover:border-[#333333] transition-all duration-150 active:scale-[0.98] shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conditional Recent Conversations or Logged-Out Middle Area */}
        {isAuthenticated ? (
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2 sidebar-scroll">
            <div className="px-2">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1">
                Recent
              </p>
            </div>
            <ConversationList onSelect={onSelectChat} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-6 text-slate-500 dark:text-slate-400 text-xs sidebar-scroll">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#222222] space-y-1.5 leading-relaxed text-slate-600 dark:text-slate-400 shadow-xs">
              <p className="font-semibold text-slate-900 dark:text-slate-200">Chat History</p>
              <p className="text-[11px]">
                Sign in to automatically save your medical conversations and access them anytime.
              </p>
            </div>
          </div>
        )}

        {/* Tools Section */}
        <div className="px-3 py-3 border-t border-slate-200 dark:border-[#1c1c1c] space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase mb-1">
            Tools
          </p>

          <Link
            to="/medications"
            onClick={onSelectChat}
            className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${isMedicationsActive
              ? "bg-slate-200/70 dark:bg-[#1c1c1c] text-slate-900 dark:text-white font-medium shadow-xs border border-slate-300/80 dark:border-[#2a2a2a]"
              : "text-slate-700 dark:text-white hover:bg-slate-200/50 dark:hover:bg-[#151515] hover:text-black dark:hover:text-white"
              }`}
          >
            <Pill className={`w-4 h-4 shrink-0 transition-colors ${isMedicationsActive ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white"}`} />
            <span>Medications</span>
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-200 dark:border-[#1c1c1c] space-y-2 mt-auto bg-slate-100/60 dark:bg-black">
          {/* Settings & Help */}
          <div className="space-y-0.5">
            <Link
              to="/settings"
              onClick={onSelectChat}
              className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${isSettingsActive
                ? "bg-slate-200/70 dark:bg-[#1c1c1c] text-slate-900 dark:text-white font-medium shadow-xs border border-slate-300/80 dark:border-[#2a2a2a]"
                : "text-slate-700 dark:text-white hover:bg-slate-200/50 dark:hover:bg-[#151515] hover:text-black dark:hover:text-white"
                }`}
            >
              <Settings className={`w-4 h-4 shrink-0 transition-colors ${isSettingsActive ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white"}`} />
              <span>Settings</span>
            </Link>

            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="group w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-200/50 dark:hover:bg-[#151515] hover:text-black dark:hover:text-white transition-all duration-150 text-left cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
              <span>Help</span>
            </button>
          </div>

          {/* User profile (if authenticated) OR compact Sign In box (if logged out) */}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="p-3 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#222222] text-left space-y-2 shadow-xs">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                Get more from MedoraAI
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Sign in to save your conversations and access your medical chat history.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (onSelectChat) onSelectChat();
                  navigate("/login");
                }}
                className="w-full text-xs py-1.5"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span>Sign In</span>
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Help Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
