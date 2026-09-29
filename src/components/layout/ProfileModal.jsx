import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import { useChat } from "../../context/ChatContext";
import {
  AtSign,
  User as UserIcon,
  LogOut,
  Check,
  AlertCircle,
} from "lucide-react";
import { getInitials } from "../../utils/userUtils";

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateUser, logout } = useChat();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [touched, setTouched] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(user.name || "");
      setUsername(user.username || user.email?.split("@")[0] || "");
      setUsernameError("");
      setTouched({});
      setIsSaving(false);
    }
  }, [isOpen, user]);

  // =========================
  // VALIDATION
  // =========================

  const validateUsername = (value) => {
    const cleaned = value.trim().toLowerCase().replace(/^@/, "");

    if (!cleaned) {
      return "Username cannot be empty.";
    }

    if (cleaned.length < 3) {
      return "Username must be at least 3 characters.";
    }

    if (cleaned.length > 24) {
      return "Username must be 24 characters or less.";
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleaned)) {
      return "Only letters, numbers, and underscores are allowed.";
    }

    return "";
  };

  const isNameValid = displayName.trim().length > 0;
  const isUsernameValid = !validateUsername(username);
  const isFormValid = isNameValid && isUsernameValid;

  const liveInitials = getInitials(displayName || user.name);

  // =========================
  // USERNAME CHANGE
  // =========================

  const handleUsernameChange = (e) => {
    const value = e.target.value
      .replace(/^@/, "")
      .replace(/\s+/g, "")
      .toLowerCase();

    setUsername(value);

    if (touched.username) {
      setUsernameError(validateUsername(value));
    }
  };

  // =========================
  // SAVE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateUsername(username);

    setTouched({
      name: true,
      username: true,
    });

    setUsernameError(validationError);

    if (!isNameValid || validationError) {
      return;
    }

    setIsSaving(true);

    const trimmedName = displayName.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");

    const success = await updateUser({
      name: trimmedName,
      username: cleanUsername,
    });

    setIsSaving(false);

    if (success !== false) {
      onClose();
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profile"
      maxWidth="max-w-md"
    >
      <div className="space-y-6">

        {/* User Card Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#222222]">
          <Avatar
            name={displayName || user.name}
            initials={liveInitials}
            size="lg"
          />

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {displayName || user.name}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
              @{username.replace(/^@/, "") || "user"}
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
              onBlur={() =>
                setTouched((prev) => ({
                  ...prev,
                  name: true,
                }))
              }
              placeholder="e.g. Dr. Alex Morgan"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#2a2a2a] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            />

            {touched.name && !isNameValid && (
              <p className="text-[11px] text-rose-500 mt-1">
                Display name is required.
              </p>
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
                onChange={handleUsernameChange}
                onBlur={() => {
                  setTouched((prev) => ({
                    ...prev,
                    username: true,
                  }));
                  setUsernameError(validateUsername(username));
                }}
                placeholder="alexmorgan"
                className={`w-full pl-8 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 transition-colors ${usernameError
                    ? "border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-rose-500"
                    : "border-slate-200 dark:border-[#2a2a2a] focus:border-teal-500 focus:ring-teal-500"
                  }`}
              />

              {isUsernameValid && username && (
                <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500" />
              )}
            </div>

            {usernameError ? (
              <p className="flex items-center gap-1.5 text-[11px] text-rose-500 mt-1">
                <AlertCircle className="w-3 h-3" />
                {usernameError}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                3–24 characters: letters, numbers, and underscores.
              </p>
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
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!isFormValid || isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

          </div>
        </form>
      </div>
    </Modal>
  );
}