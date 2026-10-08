import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Send, User, Shield, Home, LogOut } from "lucide-react";
import logo from "../assets/cpc-logo.png";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isStudentLoggedIn, isAdminLoggedIn, studentData, adminData, logoutStudent, logoutAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-red-700 shadow-sm transition-all">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8">
        {/* Logo + CPC Titles */}
        <Link to="/" className="flex items-center space-x-3.5 group">
          <img
            src={logo}
            alt="CPC Logo"
            className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="leading-tight">
            <h1 className="text-red-700 text-lg sm:text-xl font-black tracking-tight uppercase group-hover:text-red-800 transition-colors">
              Ceylon Petroleum Corporation
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse"></span>
              Training Center LMS
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-gray-700">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              isActive("/") ? "text-red-700 font-bold bg-red-50" : "hover:text-red-700 hover:bg-gray-50"
            }`}
          >
            <Home className="w-4 h-4" /> Home
          </Link>

          <Link
            to="/courses"
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              isActive("/courses") ? "text-red-700 font-bold bg-red-50" : "hover:text-red-700 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Courses
          </Link>

          <Link
            to="/signup"
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              isActive("/signup") || isActive("/apply") ? "text-red-700 font-bold bg-red-50" : "hover:text-red-700 hover:bg-gray-50"
            }`}
          >
            <Send className="w-4 h-4" /> Sign Up
          </Link>

          {/* Unified Login Button */}
          {(!isStudentLoggedIn && !isAdminLoggedIn) && (
            <Link
              to="/login"
              className={`ml-2 px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 font-semibold text-sm ${
                isActive("/login")
                  ? "text-white bg-red-700 font-bold shadow-sm"
                  : "bg-gray-900 text-white hover:bg-black shadow-sm"
              }`}
            >
              <User className="w-4 h-4" /> Login
            </Link>
          )}

          {isStudentLoggedIn && (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <Link
                to="/student/dashboard"
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 font-semibold text-xs border ${
                  location.pathname.startsWith("/student")
                    ? "bg-red-700 text-white border-red-700 shadow-sm"
                    : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                {studentData?.name ? studentData.name.split(" ")[0] : "Dashboard"}
              </Link>
              <button
                onClick={logoutStudent}
                title="Logout Student"
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {isAdminLoggedIn && (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 font-semibold text-xs border ${
                  location.pathname.startsWith("/admin")
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-red-500" />
                {adminData?.role === "admin" ? "Superadmin" : "Subadmin"}
              </Link>
              <button
                onClick={logoutAdmin}
                title="Logout Staff"
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Sliding Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl px-6 py-5 space-y-3 animate-fadeIn">
          <Link
            onClick={() => setMenuOpen(false)}
            to="/"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isActive("/") ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            to="/courses"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isActive("/courses") ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Courses
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            to="/signup"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isActive("/signup") || isActive("/apply") ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Send className="w-4 h-4" /> Sign Up
          </Link>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            {!isStudentLoggedIn && !isAdminLoggedIn && (
              <Link
                onClick={() => setMenuOpen(false)}
                to="/login"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-bold bg-gray-900 text-white hover:bg-black"
              >
                <User className="w-4 h-4" /> Login
              </Link>
            )}

            {isStudentLoggedIn && (
              <div className="flex items-center justify-between bg-red-50 p-2.5 rounded-xl">
                <Link
                  onClick={() => setMenuOpen(false)}
                  to="/student/dashboard"
                  className="flex items-center gap-2 text-sm font-bold text-red-700"
                >
                  <User className="w-4 h-4" /> Student: {studentData?.name || "Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    logoutStudent();
                    setMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-semibold px-2 py-1 bg-white rounded border border-red-200"
                >
                  Logout
                </button>
              </div>
            )}

            {isAdminLoggedIn && (
              <div className="flex items-center justify-between bg-gray-100 p-2.5 rounded-xl">
                <Link
                  onClick={() => setMenuOpen(false)}
                  to="/admin/dashboard"
                  className="flex items-center gap-2 text-sm font-bold text-gray-900"
                >
                  <Shield className="w-4 h-4 text-red-600" /> Staff: {adminData?.username}
                </Link>
                <button
                  onClick={() => {
                    logoutAdmin();
                    setMenuOpen(false);
                  }}
                  className="text-xs text-gray-600 font-semibold px-2 py-1 bg-white rounded border border-gray-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
