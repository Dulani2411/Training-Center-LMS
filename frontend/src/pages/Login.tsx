import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import {
  AlertCircle, ArrowRight, BookOpen, CheckCircle2, GraduationCap, KeyRound,
  Loader2, ShieldCheck, Sparkles, Users
} from "lucide-react";
import logo from "../assets/cpc-logo.png";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api/students";

const ADMIN_CREDENTIALS = [
  { username: "Superadmin", password: "Admin@1234!", role: "admin" as const },
  { username: "Subadmin", password: "Subadmin@1234", role: "subadmin" as const },
];

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginStudent, loginAdmin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your username or registration number and password.");
      return;
    }

    setLoading(true);
    const adminMatch = ADMIN_CREDENTIALS.find(
      c => c.username.toLowerCase() === identifier.trim().toLowerCase() && c.password === password.trim()
    );

    if (adminMatch) {
      setTimeout(() => {
        loginAdmin({ role: adminMatch.role, username: adminMatch.username });
        navigate("/admin/dashboard");
      }, 450);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password: password.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }
      if (data.token && data.student) {
        loginStudent(data.token, data.student, rememberMe);
        if (data.requirePasswordChange) {
          setSuccess("Welcome! Please update your temporary password to continue.");
          setTimeout(() => navigate("/student/change-password-first-login", { state: { studentData: data.student } }), 800);
        } else {
          setSuccess("Login successful. Preparing your dashboard...");
          setTimeout(() => navigate("/student/dashboard"), 600);
        }
      } else {
        setError("Unexpected response from the authentication server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the LMS server. Please check that the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fffafa] px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rose-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-orange-100/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-rose-100 bg-white shadow-2xl shadow-rose-900/10 lg:grid-cols-[0.92fr_1.08fr]">
          {/* Brand panel */}
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-rose-50 via-white to-orange-50 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[36px] border-rose-100/80" />
            <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-rose-100/50" />
            <div className="relative">
              <Link to="/" className="inline-flex items-center gap-3">
                <img src={logo} alt="CPC Logo" className="h-16 w-16 object-contain" />
                <div>
                  <p className="text-sm font-black uppercase tracking-tight text-rose-700">Ceylon Petroleum</p>
                  <p className="text-xs font-semibold tracking-wide text-slate-500">Corporation Training Center</p>
                </div>
              </Link>
              <div className="mt-16 max-w-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" /> Learning Management System
                </span>
                <h1 className="mt-5 text-4xl font-black leading-tight text-slate-900">
                  Learn, grow and build your future.
                </h1>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Your central portal for training applications, technical courses and professional development at the CPC Training Center.
                </p>
              </div>
            </div>
            <div className="relative mt-12 grid gap-3">
              {[
                { icon: GraduationCap, title: "Technical learning", text: "Access your courses and resources" },
                { icon: Users, title: "One connected portal", text: "Stay close to your training center" },
                { icon: ShieldCheck, title: "Secure access", text: "Your learning journey, protected" },
              ].map(item => (
                <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 p-3.5 shadow-sm">
                  <div className="rounded-xl bg-rose-100 p-2.5 text-rose-700"><item.icon className="h-4 w-4" /></div>
                  <div><p className="text-xs font-extrabold text-slate-800">{item.title}</p><p className="mt-0.5 text-[11px] text-slate-500">{item.text}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Form panel */}
          <div className="p-6 sm:p-10 lg:p-14">
            <div className="mx-auto max-w-md">
              <div className="mb-8 text-center lg:text-left">
                <div className="mb-5 flex justify-center lg:hidden"><img src={logo} alt="CPC Logo" className="h-16 w-16 object-contain" /></div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700">
                  <BookOpen className="h-3.5 w-3.5" /> Welcome back
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Sign in to your account</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Use your username, email or registration number to continue.</p>
              </div>

              {error && <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-medium text-rose-700"><AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> <span>{error}</span></div>}
              {success && <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-medium text-emerald-700"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" /> <span>{success}</span></div>}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="identifier" className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600">Username / Registration number</label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input id="identifier" type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="e.g. REG/2026/001 or email" className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100" autoComplete="username" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600">Password</label>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100" autoComplete="current-password" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-700" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <HiEyeOff size={19} /> : <HiEye size={19} />}</button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-500"><input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-400" /> Remember me</label>
                  <span className="font-medium text-slate-400" title="Contact CPC Admin to reset credentials">Forgot password?</span>
                </div>
                <button type="submit" disabled={loading} className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-rose-600/20 transition-all hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-600/25 ${loading ? "cursor-not-allowed opacity-70" : ""}`}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying credentials...</> : <>Continue to portal <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>
              <p className="mt-8 text-center text-xs leading-5 text-slate-400">Need access help? Contact the CPC Training Center administrator.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
