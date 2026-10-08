import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Lock, AlertCircle, CheckCircle, ShieldAlert, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ChangePasswordFirstLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentData: ctxStudent, updateStudentData } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Get student ID from location state or AuthContext or storage
  const studentData = location.state?.studentData || ctxStudent;
  const studentId = studentData?.id;
  const studentEmail = studentData?.email;
  const studentName = studentData?.name;

  const API_URL = "http://localhost:5000/api/students";

  // Redirect if no student data
  useEffect(() => {
    if (!studentId) {
      navigate("/student");
    }
  }, [studentId, navigate]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("All fields are required.");
      return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Enforce minimum password length
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!studentId) {
      setError("Student record not identified. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/change-password-first-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to change password.");
        return;
      }

      setSuccess("Password changed successfully! Redirecting to dashboard...");
      if (data.student) {
        updateStudentData({ ...data.student, isPasswordChanged: true });
      }
      setTimeout(() => {
        navigate("/student/dashboard");
      }, 1200);
    } catch (err) {
      setError("An error occurred while changing password. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="industrial-page min-h-screen flex items-center justify-center py-12 px-4">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white border-opacity-30">
                <ShieldAlert className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-center mb-2">Security Required</h1>
              <p className="text-red-100 text-center text-sm">Change your default password to continue</p>
              {studentName && (
                <div className="mt-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-sm text-red-100">Welcome, <span className="font-semibold text-white">{studentName}</span>!</p>
                  {studentEmail && <p className="text-xs text-red-100 mt-1">{studentEmail}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Warning Notice */}
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
              <div className="flex items-start gap-3">
                <KeyRound className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-900 mb-1">First Time Login Detected</h3>
                  <p className="text-xs text-amber-700">
                    For your security, you must change your password from the default one before accessing your dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-shake">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleChangePassword} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                  </button>
                </div>

              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="mt-2">
                    {newPassword === confirmPassword ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <p className="text-xs font-medium">Passwords match perfectly!</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-xs font-medium">Passwords do not match</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Changing Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Change Password & Continue</span>
                  </>
                )}
              </button>
            </form>

            {/* Security Tip */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">💡</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Security Tip</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Create a unique password you haven't used elsewhere. Include a mix of uppercase letters, lowercase letters, numbers, and special characters for maximum security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-6 text-white text-sm opacity-90">
          Having trouble? Contact your administrator for assistance.
        </p>
      </div>
    </div>
  );
};

export default ChangePasswordFirstLogin;
