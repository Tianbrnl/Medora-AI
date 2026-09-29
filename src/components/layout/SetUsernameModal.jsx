import { useState, useEffect } from "react";
import { AtSign, Sparkles, Check, AlertCircle, ArrowRight } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useChat } from "../../context/ChatContext";

export default function SetUsernameModal({ isOpen, onClose }) {
  const { user, updateUser } = useChat();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedUsername, setSuggestedUsername] = useState("");

  // Suggest a username based on full name or email
  useEffect(() => {
    if (isOpen) {
      setError("");
      setIsSubmitting(false);

      let suggestion = "";
      if (user?.name && user.name !== "Doctor") {
        suggestion = user.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 18);
      } else if (user?.email) {
        suggestion = user.email
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "")
          .slice(0, 18);
      }

      setSuggestedUsername(suggestion);
      // Pre-fill with existing username if available, or the suggested username
      setUsername(user?.username || suggestion || "");
    }
  }, [isOpen, user]);

  const validateUsername = (val) => {
    const cleaned = val.trim().toLowerCase().replace(/^@/, "");
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

  const handleUsernameChange = (e) => {
    const raw = e.target.value.replace(/^@/, "").replace(/\s+/g, "").toLowerCase();
    setUsername(raw);
    if (error) {
      setError(validateUsername(raw));
    }
  };

  const handleApplySuggestion = () => {
    if (suggestedUsername) {
      setUsername(suggestedUsername);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");

    const success = await updateUser({
      username: cleanUsername,
    });

    setIsSubmitting(false);

    if (success !== false) {
      sessionStorage.removeItem("medora_skipped_username_prompt");
      onClose();
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem("medora_skipped_username_prompt", "true");
    onClose();
  };

  const isCurrentValid = !validateUsername(username);

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} maxWidth="max-w-md">
      <div className="space-y-6 pt-2">
        {/* Header with decorative badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/20 shadow-inner mb-1">
            <AtSign className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Choose Your Username
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Welcome to MedoraAI! Create your unique handle to personalize your medical consultations and profile.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Username
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-base font-semibold select-none">
                @
              </span>
              <input
                type="text"
                autoFocus
                value={username}
                onChange={handleUsernameChange}
                placeholder="yourhandle"
                className={`w-full pl-9 pr-10 py-3 rounded-xl text-sm font-medium transition-all ${
                  error
                    ? "bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    : "bg-slate-50 dark:bg-[#161616] border-slate-200 dark:border-[#2a2a2a] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                } border focus:outline-none`}
              />

              {isCurrentValid && username && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-500">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            {error ? (
              <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-2 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Use 3–24 characters: letters, numbers, and underscores.
              </p>
            )}
          </div>

          {/* Suggested username chip */}
          {suggestedUsername && suggestedUsername !== username && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">Suggestion:</span>
              <button
                type="button"
                onClick={handleApplySuggestion}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-medium border border-teal-500/20 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>@{suggestedUsername}</span>
              </button>
            </div>
          )}

          {/* Live Preview Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161616] border border-slate-200 dark:border-[#222222] flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Display handle:</span>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 font-mono">
              @{username || "yourhandle"}
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !isCurrentValid}
              className="w-full justify-center py-2.5 shadow-md shadow-teal-500/10"
            >
              {isSubmitting ? (
                <span>Saving Username...</span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Save Username</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 py-1.5 transition-colors cursor-pointer"
            >
              Set up later in profile
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
