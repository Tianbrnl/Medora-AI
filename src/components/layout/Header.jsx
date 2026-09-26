import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import medoraLogo from "../../assets/medora_logo.png";
import { useChat } from "../../context/ChatContext";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import ProfileModal from "./ProfileModal";
import { getInitials } from "../../utils/userUtils";

export default function Header({ onOpenMobileMenu, currentTitle }) {
  const { user, isAuthenticated } = useChat();
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-slate-200 dark:border-[#1c1c1c] bg-white/90 dark:bg-black/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 sticky top-0 z-30 transition-colors duration-200">
        {/* Left: Mobile hamburger & title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#181818] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile branding */}
          <Link to={isAuthenticated ? "/chat" : "/"} className="lg:hidden flex items-center gap-2">
            <img src={medoraLogo} alt="MedoraAI" className="w-7 h-7 object-contain" />
            <span className="font-bold text-slate-900 dark:text-white text-base">
              Medora<span className="text-teal-500 dark:text-teal-400">AI</span>
            </span>
          </Link>

          {/* Desktop title / location indicator */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {currentTitle || "MedoraAI"}
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                aria-label="View profile"
                title="View and edit profile"
                className="rounded-full ring-2 ring-transparent hover:ring-teal-500/40 transition-all ml-1 cursor-pointer"
              >
                <Avatar name={user.name} initials={user.initials || getInitials(user.name)} size="sm" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/register")}
                className="text-xs px-3 py-1.5"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}
