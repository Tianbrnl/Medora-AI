import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Mail, Eye, EyeOff } from "lucide-react";
import medoraLogo from "../assets/medora_logo.png";
import Button from "../components/ui/Button";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      navigate("/chat");
    } catch (error) {
      alert(error.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-950 text-white flex-col justify-between p-12 relative overflow-hidden border-r border-[#1c1c1c]">
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[500px] h-[500px] bg-teal-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img src={medoraLogo} alt="MedoraAI" className="w-10 h-10 object-contain drop-shadow" />
            <span className="text-2xl font-bold tracking-tight">
              Medora<span className="text-teal-300">AI</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md my-auto py-12 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-900/80 border border-teal-800 flex items-center justify-center text-teal-300 mb-6 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            clinical guidance, powered by artificial intelligence.
          </h1>

          <p className="text-teal-100/90 text-sm leading-relaxed">
            Review symptoms, explore medication, and access artificial intelligent clinical support built specifically for doctors.
          </p>

          <div className="pt-4 border-t border-teal-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs text-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>Tools and information designed around the everyday needs of healthcare professionals.</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>A purpose-built platform for the way doctors work.</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-teal-300/80">
          MedoraAI Clinical Decision Support
        </div>
      </div>

      {/* Right Sign-in Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
              <img src={medoraLogo} alt="MedoraAI" className="w-9 h-9 object-contain" />
              <span className="text-2xl font-bold tracking-tight">
                Medora<span className="text-teal-500">AI</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Access your clinical intelligence assistant
            </p>
          </div>

          <div className="space-y-4">
            {/* Email / Password Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="w-full font-semibold shadow-md"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialEmail={email}
      />
    </div>
  );
}
