import { X } from "lucide-react";
import medoraLogo from "../../assets/medora_logo.png";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import Button from "../ui/Button";

export default function AuthRequiredModal({ isOpen, onClose, pendingPrompt = "" }) {
  const navigate = useNavigate();
  const { login, startNewConversation } = useChat();

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    login({ name: "Google User", email: "user@gmail.com", initials: "GU" });
    onClose();
    if (pendingPrompt && pendingPrompt.trim()) {
      const newId = startNewConversation(pendingPrompt.trim());
      navigate(`/chat/${newId}`);
    } else {
      navigate("/chat");
    }
  };

  const handleEmailSignIn = () => {
    onClose();
    navigate("/login");
  };

  const handleSignUp = () => {
    onClose();
    navigate("/register");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm bg-[#111111] border border-[#242424] rounded-2xl shadow-2xl p-6 sm:p-7 text-center z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1f1f1f] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
          <img src={medoraLogo} alt="MedoraAI" className="w-12 h-12 object-contain" />
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl font-bold text-white tracking-tight mb-1.5">
          Sign in to MedoraAI
        </h3>
        <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed">
          Save conversations and continue chatting with MedoraAI.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-[#2c2c2c] bg-[#181818] hover:bg-[#202020] text-white font-medium text-sm transition-all duration-150 active:scale-[0.98]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Sign In button */}
          <Button
            variant="primary"
            size="md"
            onClick={handleEmailSignIn}
            className="w-full text-sm font-semibold"
          >
            Sign In
          </Button>
        </div>

        {/* Footer Link */}
        <p className="text-xs text-slate-400 mt-5">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={handleSignUp}
            className="text-teal-400 font-semibold hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
