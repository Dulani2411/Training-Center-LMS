import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, IdCard, ArrowLeft, LogOut } from "lucide-react";

interface StudentData {
  id: number;
  email: string;
  name?: string;
  studentId?: string;
}

export default function StudentProfile() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get student data from localStorage or sessionStorage
    const token = localStorage.getItem("studentToken") || sessionStorage.getItem("studentToken");
    const storedData = localStorage.getItem("studentData") || sessionStorage.getItem("studentData");

    if (!token || !storedData) {
      // If no token or data, redirect to login
      navigate("/student");
      return;
    }

    try {
      const student: StudentData = JSON.parse(storedData);
      setStudentData(student);
    } catch (error) {
      console.error("Error parsing student data:", error);
      navigate("/student");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear tokens and data from both localStorage and sessionStorage
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentData");
    sessionStorage.removeItem("studentToken");
    sessionStorage.removeItem("studentData");
    // Navigate to home page
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-2 text-gray-700 hover:text-red-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 text-white font-medium hover:bg-red-800 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-red-700 to-red-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-12 w-12" />
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold mb-2 break-words">
                  Hi {studentData.name || "Student"}! 👋
                </h1>
                <p className="text-red-100 text-lg">Welcome to your profile</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
            
            <div className="space-y-6">
              {/* Name */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-3 bg-red-100 rounded-lg">
                  <User className="h-6 w-6 text-red-700" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Name with Initials
                  </label>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {studentData.name || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Mail className="h-6 w-6 text-red-700" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Email Address
                  </label>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {studentData.email}
                  </p>
                </div>
              </div>

              {/* Student ID */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-3 bg-red-100 rounded-lg">
                  <IdCard className="h-6 w-6 text-red-700" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Student ID
                  </label>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    {studentData.studentId || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Student ID (from backend) */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="p-3 bg-red-100 rounded-lg">
                  <IdCard className="h-6 w-6 text-red-700" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Student ID (System)
                  </label>
                  <p className="text-lg font-medium text-gray-800 mt-1">
                    #{studentData.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <Link
                to="/student/dashboard"
                className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors text-center"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 rounded-lg bg-red-700 text-white font-semibold hover:bg-red-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





