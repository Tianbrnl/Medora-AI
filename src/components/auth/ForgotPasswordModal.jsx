import { useState, useEffect, useRef } from "react";
import { Mail, CheckCircle2, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { supabase } from "../../lib/supabase";
export default function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail = "",
  onSuccess
}) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setError("");
    setIsSubmitted(false);
    setIsLoading(false);
    onClose();
  };

  const validateEmail = (val) => {
    const trimmed = val.trim();
    if (!trimmed) {
      return "Email address is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        throw error;
      }

      setIsSubmitted(true);

      if (onSuccess) {
        onSuccess(email.trim());
      }
    } catch (error) {
      setError(error.message || "Failed to send password reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        throw error;
      }

      if (onSuccess) {
        onSuccess(email.trim());
      }
    } catch (error) {
      setError(error.message || "Failed to resend password reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSubmitted ? "Instructions Sent" : "Reset Password"}
      maxWidth="max-w-md"
    >
      {isSubmitted ? (
        <div className="space-y-5 text-center py-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Check your inbox
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
              We've sent password reset instructions to{" "}
              <strong className="font-semibold text-slate-900 dark:text-white">
                {email.trim()}
              </strong>
              .
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Please check your spam or junk folder if you don't see it in a few minutes.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Button
              variant="primary"
              size="md"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Button>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleResend}
              className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline disabled:opacity-50 cursor-pointer pt-1"
            >
              {isLoading ? "Resending..." : "Didn't receive the email? Click to resend"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Forgot your password?
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enter your account's email address and we'll send you a link to reset your password.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="forgot-email-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="forgot-email-input"
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161616] border text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors ${error
                  ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-200 dark:border-[#2a2a2a] focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  }`}
              />
            </div>
            {error && (
              <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#202020]">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading || !email.trim()}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
