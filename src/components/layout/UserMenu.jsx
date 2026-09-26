import { useState } from "react";
import { useChat } from "../../context/ChatContext";
import Avatar from "../ui/Avatar";
import ProfileModal from "./ProfileModal";
import { getInitials } from "../../utils/userUtils";

export default function UserMenu() {
  const { user } = useChat();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <>
      {/* User profile button in sidebar */}
      <button
        type="button"
        onClick={() => setProfileModalOpen(true)}
        aria-label="Open user profile"
        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-[#161616] transition-colors text-left group cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={user.name} initials={user.initials || getInitials(user.name)} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              @{user.username || "johndoe"}
            </p>
          </div>
        </div>
      </button>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}
