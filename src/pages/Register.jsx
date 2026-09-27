import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, User, Mail, Lock, CheckCircle2 } from "lucide-react";
import medoraLogo from "../assets/medora_logo.png";
import Button from "../components/ui/Button";

import { supabase } from "../lib/supabase";
export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      // If email confirmation is enabled in Supabase
      if (data.user && !data.session) {
        alert("Account created! Please check your email to verify your account.");
        navigate("/login");
        return;
      }

      navigate("/chat");
    } catch (error) {
      alert(error.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-black text-slate-100">
      {/* Desktop Left Panel */}
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
            Medical knowledge, built around the way doctors work.
          </h1>

          <p className="text-teal-100/90 text-sm leading-relaxed">
            Create your account to save medical consultation histories and access health references from anywhere.
          </p>

          <div className="pt-4 border-t border-teal-800/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-teal-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Personalized chat history across all your devices</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-teal-200">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>No credit card required for standard access</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-teal-300/80">
          © {new Date().getFullYear()} MedoraAI. Educational AI platform.
        </div>
      </div>

      {/* Right Register Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 bg-black">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile branding header */}
          <div className="lg:hidden text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src={medoraLogo} alt="MedoraAI" className="w-9 h-9 object-contain" />
              <span className="text-2xl font-bold tracking-tight text-white">
                Medora<span className="text-teal-400">AI</span>
              </span>
            </Link>
          </div>

          <div className="bg-[#111111] rounded-3xl border border-[#242424] p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Create an account
              </h2>
              <p className="text-sm text-slate-400">
                Start your journey with your personal AI medical assistant.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="w-full font-semibold shadow-md mt-2"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
