import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Shield, LogOut } from "lucide-react";
import logo from "../assets/cpc-logo.png";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isStudentLoggedIn, isAdminLoggedIn, studentData, adminData, logoutStudent, logoutAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b-2 border-red-700 bg-white/95 shadow-sm backdrop-blur-md transition-all">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        {/* Logo + CPC Titles */}
        <Link to="/" className="flex items-center space-x-3.5 group">
          <img
            src={logo}
            alt="CPC Logo"
            className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="leading-tight">
            <h1 className="text-lg font-black uppercase tracking-tight text-red-700 transition-colors group-hover:text-red-800 sm:text-xl">
              Ceylon Petroleum Corporation
            </h1>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-600 sm:text-sm">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-600"></span>
              Training Center LMS
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-1 text-sm font-semibold text-gray-700 lg:flex">
          <Link
            to="/"
            className={`rounded-xl px-4 py-2.5 transition-all ${
              isActive("/") ? "bg-red-50 font-bold text-red-700" : "hover:bg-slate-100 hover:text-red-700"
            }`}
          >
            Home
          </Link>

          <Link
            to="/courses"
            className={`rounded-xl px-4 py-2.5 transition-all ${
              isActive("/courses") ? "bg-red-50 font-bold text-red-700" : "hover:bg-slate-100 hover:text-red-700"
            }`}
          >
            Courses
          </Link>

          <Link
            to="/signup"
            className={`rounded-xl px-4 py-2.5 transition-all ${
              isActive("/signup") || isActive("/apply") ? "bg-red-50 font-bold text-red-700" : "hover:bg-slate-100 hover:text-red-700"
            }`}
          >
            Sign Up
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
        <div className="animate-fadeIn space-y-3 border-t border-gray-100 bg-white px-6 py-5 shadow-xl lg:hidden">
          <Link
            onClick={() => setMenuOpen(false)}
            to="/"
            className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive("/") ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-slate-100"
            }`}
          >
            Home
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            to="/courses"
            className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive("/courses") ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-slate-100"
            }`}
          >
            Courses
          </Link>
          <Link
            onClick={() => setMenuOpen(false)}
            to="/signup"
            className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive("/signup") || isActive("/apply") ? "bg-red-50 text-red-700" : "text-gray-700 hover:bg-slate-100"
            }`}
          >
            Sign Up
          </Link>

          <div className="space-y-2 border-t border-gray-100 pt-3">
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
