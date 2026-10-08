import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { UserCheck, AlertCircle, CheckCircle2, ArrowRight, Loader2, Sparkles, KeyRound } from "lucide-react";
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
      setError("Please enter your Username/Registration Number and Password.");
      return;
    }

    setLoading(true);

    // Check Admin credentials first
    const adminMatch = ADMIN_CREDENTIALS.find(
      (c) =>
        c.username.toLowerCase() === identifier.trim().toLowerCase() &&
        c.password === password.trim()
    );

    if (adminMatch) {
      setTimeout(() => {
        loginAdmin({ role: adminMatch.role, username: adminMatch.username });
        navigate("/admin/dashboard");
      }, 500);
      return;
    }

    // Proceed to student login if not admin
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid Credentials.");
        setLoading(false);
        return;
      }

      if (data.token && data.student) {
        loginStudent(data.token, data.student, rememberMe);

        if (data.requirePasswordChange) {
          setSuccess("Welcome! Since this is your first login, please update your temporary password.");
          setTimeout(() => {
            navigate("/student/change-password-first-login", {
              state: { studentData: data.student }
            });
          }, 800);
        } else {
          setSuccess("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/student/dashboard");
          }, 600);
        }
      } else {
        setError("Unexpected response from authentication server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the LMS server. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <Link to="/" className="inline-block transform hover:scale-105 transition-transform">
              <img src={logo} alt="CPC Logo" className="w-16 h-16 object-contain mx-auto" />
            </Link>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                <Sparkles className="w-3 h-3" /> Learning Management System
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-2">
                Sign In to Your Account
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your Username or Registration Number
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3.5 bg-green-50 border border-green-200 rounded-2xl text-xs text-green-700 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Username / Reg Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. Superadmin or REG/2026/001"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-all pr-11"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                />
                Remember me
              </label>

              <span className="text-gray-400 hover:text-gray-600 cursor-pointer" title="Contact CPC Admin to reset credentials">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-white text-sm bg-red-700 hover:bg-red-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
