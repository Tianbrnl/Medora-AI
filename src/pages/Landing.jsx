import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Mic,
  ArrowUp,
  Menu
} from "lucide-react";
import medoraLogo from "../assets/medora_logo.png";
import { useChat } from "../context/ChatContext";
import Sidebar from "../components/layout/Sidebar";
import MobileSidebar from "../components/layout/MobileSidebar";
import AuthRequiredModal from "../components/chat/AuthRequiredModal";
import Button from "../components/ui/Button";

export default function Landing() {
  const { isAuthenticated, showToast } = useChat();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const textareaRef = useRef(null);

  // If already authenticated, redirect immediately to chat
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Adjust textarea height dynamically
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [prompt]);

  const handleSendPrompt = (e) => {
    e?.preventDefault();
    if (!prompt.trim()) return;
    // Trigger authentication modal
    setAuthModalOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const handleSelectSuggested = (text) => {
    setPrompt(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleMicClick = () => {
    showToast("Voice input simulated. Type your question or choose a prompt.", "info");
  };

  const handlePlusClick = () => {
    showToast("Sign in to attach medical records and lab reports.", "info");
  };

  const suggestedQuestions = [
    "What are common symptoms of dengue?",
    "What causes frequent headaches?",
    "What is paracetamol used for?",
    "When should I see a doctor for a fever?"
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-teal-500/30 transition-colors duration-200">
      {/* Desktop Persistent Logged-Out Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar onNewChatClick={() => {
          setPrompt("");
          if (textareaRef.current) textareaRef.current.focus();
        }} />
      </div>

      {/* Mobile Drawer */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-slate-50 dark:bg-black transition-colors duration-200">
        {/* Minimal Top Bar */}
        <header className="h-14 px-4 sm:px-6 flex items-center justify-between shrink-0 border-b border-slate-200 dark:border-[#1c1c1c] bg-white/90 dark:bg-black/90 backdrop-blur-md z-20 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Branding */}
            <div className="lg:hidden flex items-center gap-2">
              <img src={medoraLogo} alt="MedoraAI" className="w-7 h-7 object-contain" />
              <span className="font-bold text-slate-900 dark:text-white text-base">
                Medora<span className="text-teal-500 dark:text-teal-400">AI</span>
              </span>
            </div>
          </div>

          {/* Top-Right: Sign In / Get Started */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#181818] px-3 py-1.5"
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/register")}
              className="text-xs px-3.5 py-1.5 shadow-xs"
            >
              Get Started
            </Button>
          </div>
        </header>

        {/* Center Chat Area */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 overflow-y-auto chat-scroll bg-slate-50 dark:bg-black transition-colors duration-200">
          <div className="w-full max-w-3xl flex flex-col items-center my-auto animate-in fade-in duration-200">
            {/* Greeting */}
            <div className="text-center mb-7 sm:mb-8 space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-slate-900 dark:text-white">
                How can I help you today?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
                Ask about symptoms, medications, or health conditions.
              </p>
            </div>

            {/* Primary Chat Composer Container */}
            <form
              onSubmit={handleSendPrompt}
              className="w-full bg-white dark:bg-[#121212] rounded-2xl border border-slate-200 dark:border-[#242424] hover:border-slate-300 dark:hover:border-[#333333] focus-within:border-teal-500/60 dark:focus-within:border-[#444444] shadow-xl shadow-slate-200/50 dark:shadow-black/40 transition-all p-3 sm:p-3.5 mb-5"
            >
              {/* Text Input Area */}
              <div className="w-full flex items-start gap-2">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a medical question..."
                  rows={1}
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none py-1 px-1 focus:outline-none leading-relaxed max-h-40"
                />
              </div>

              {/* Bottom Control Bar */}
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100 dark:border-[#1f1f1f]">
                {/* Left: Plus icon for attachments */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePlusClick}
                    aria-label="Add attachment"
                    title="Add attachment (sign in required)"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1c1c1c] transition-colors cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Right: Mic & Send Button */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleMicClick}
                    aria-label="Voice input"
                    title="Voice input"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1c1c1c] transition-colors cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    aria-label="Send message"
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 ${prompt.trim()
                      ? "bg-teal-600 text-white hover:bg-teal-500 active:scale-95 shadow-sm shadow-teal-700/30 cursor-pointer"
                      : "bg-slate-100 dark:bg-[#1c1c1c] text-slate-400 dark:text-[#555555] cursor-not-allowed opacity-60"
                      }`}
                  >
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </form>

            {/* Suggested Questions Chips */}
            <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-2 px-1">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggested(q)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-[#141414] hover:bg-slate-100 dark:hover:bg-[#1e1e1e] border border-slate-200 dark:border-[#242424] hover:border-slate-300 dark:hover:border-[#333333] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-150 text-left cursor-pointer active:scale-[0.98] shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Medical Disclaimer at Bottom */}
          <div className="mt-auto pt-6 pb-2 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md mx-auto leading-relaxed">
              MedoraAI provides general medical information and is not a replacement for professional medical advice.
            </p>
          </div>
        </main>
      </div>

      {/* Auth Prompt Modal (triggered on unauthenticated send) */}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        pendingPrompt={prompt}
      />
    </div>
  );
}
