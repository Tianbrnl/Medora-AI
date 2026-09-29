import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import { useChat } from "../../context/ChatContext";
import { AtSign, User as UserIcon, LogOut } from "lucide-react";
import { getInitials } from "../../utils/userUtils";

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser, logout } = useChat();

  const [displayName, setDisplayName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      setDisplayName(user.name || "");
      setUsername(user.username || "johndoe");
      setTouched({});
    }
  }, [isOpen, user]);

  const isNameValid = displayName.trim().length > 0;
  const isUsernameValid = username.trim().length > 0;
  const isFormValid = isNameValid && isUsernameValid;

  const liveInitials = getInitials(displayName || user.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const trimmedName = displayName.trim();
    const cleanUsername = username.trim().replace(/^@/, "");
    const initials = getInitials(trimmedName);

    updateUser({
      name: trimmedName,
      username: cleanUsername,
      initials
    });

    onClose();
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile" maxWidth="max-w-md">
      <div className="space-y-6">
        {/* User Card Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222]">
          <Avatar name={displayName || user.name} initials={liveInitials} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {displayName || user.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
              <span>@{username.replace(/^@/, "") || user.username || "johndoe"}</span>
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Display Name</span>
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            />
            {touched.name && !isNameValid && (
              <p className="text-[11px] text-rose-500 mt-1">Display name is required.</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <AtSign className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Username</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                @
              </span>
              <input
                type="text"
                required
                value={username.replace(/^@/, "")}
                onChange={(e) => setUsername(e.target.value.replace(/^@/, ""))}
                onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                placeholder="johndoe"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>
            {touched.username && !isUsernameValid && (
              <p className="text-[11px] text-rose-500 mt-1">Username is required.</p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#202020]">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium py-1.5 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!isFormValid}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
