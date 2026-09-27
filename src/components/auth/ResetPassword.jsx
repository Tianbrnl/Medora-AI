import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import medoraLogo from "../../assets/medora_logo.png";
import Button from "../ui/Button";
import { supabase } from "../../lib/supabase";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });

            if (error) {
                throw error;
            }

            setIsSuccess(true);
        } catch (error) {
            setError(error.message || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img
                        src={medoraLogo}
                        alt="MedoraAI"
                        className="w-12 h-12 object-contain mx-auto mb-4"
                    />

                    <h1 className="text-2xl font-bold">
                        Reset your password
                    </h1>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Create a new password for your MedoraAI account.
                    </p>
                </div>

                <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#252525] rounded-2xl p-6 shadow-sm">
                    {isSuccess ? (
                        <div className="text-center space-y-5">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Password updated
                                </h2>

                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                    Your password has been successfully changed.
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="primary"
                                size="md"
                                onClick={() => navigate("/login")}
                                className="w-full"
                            >
                                Back to Sign In
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                                    New Password
                                </label>

                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs text-rose-500 font-medium">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Updating Password...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}