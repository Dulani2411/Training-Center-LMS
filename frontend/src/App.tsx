import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedStudentRoute from "./components/ProtectedStudentRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Pages
import Home from "./pages/Home";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import ApplyPage from "./pages/ApplyPage";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import ChangePasswordFirstLogin from "./pages/ChangePasswordFirstLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourseDetails from "./pages/AdminCourseDetails";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 selection:bg-red-700 selection:text-white">
          <Header />

          <main className="flex-1 w-full">
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/course/:courseId" element={<CourseDetailsPage />} />
              <Route path="/apply" element={<ApplyPage />} />
              <Route path="/signup" element={<ApplyPage />} />

              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              
              {/* Backward compatibility */}
              <Route path="/student" element={<Login />} />
              <Route path="/student/login" element={<Login />} />
              <Route path="/admin-login" element={<Login />} />
              <Route
                path="/student/change-password-first-login"
                element={<ChangePasswordFirstLogin />}
              />
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedStudentRoute>
                    <StudentDashboard />
                  </ProtectedStudentRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedStudentRoute>
                    <StudentProfile />
                  </ProtectedStudentRoute>
                }
              />

              {/* Admin / Staff Portal Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/course/:courseId"
                element={
                  <ProtectedAdminRoute>
                    <AdminCourseDetails />
                  </ProtectedAdminRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
