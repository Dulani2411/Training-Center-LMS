import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen, LayoutDashboard, LogOut, User, Bell, Award, FolderOpen,
  Download, Loader2, ChevronRight, FileText, BarChart3, Shield, ExternalLink
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

interface Course { id?: number; courseName: string; description?: string; duration?: string; status?: string; }
interface Announcement { id?: number; title: string; content: string; courseId?: number | null; createdAt?: string; createdByUsername?: string; }
interface Material { id?: number; courseId: number; title: string; description?: string; fileUrl?: string; linkUrl?: string; fileName?: string; fileType?: string; createdAt?: string; }
interface Mark { id?: number; courseId: number; subject?: string; mark?: number; grade?: string; remarks?: string; courseName?: string; }

type Tab = "dashboard" | "courses" | "announcements" | "marks" | "materials";

function formatDate(d?: string) { if (!d) return ""; return new Date(d).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" }); }

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { studentData, studentToken, logoutStudent } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentToken) { navigate("/login"); }
  }, [studentToken, navigate]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesRes, annsRes, matsRes, marksRes] = await Promise.all([
        fetch(`${API}/courses`),
        fetch(`${API}/announcements`),
        fetch(`${API}/materials`),
        fetch(`${API}/marks?studentId=${studentData?.id ?? 0}`),
      ]);
      setCourses(await coursesRes.json().catch(() => []));
      setAnnouncements(await annsRes.json().catch(() => []));
      setMaterials(await matsRes.json().catch(() => []));
      setMarks(await marksRes.json().catch(() => []));
    } catch { /* ignore */ }
    setLoading(false);
  }, [studentData?.id]);

  useEffect(() => { if (studentData) fetchAll(); }, [studentData, fetchAll]);

  const handleLogout = () => { logoutStudent(); navigate("/login"); };

  // The student's enrolled course from auth data
  const enrolledCourseName = studentData?.enrolledCourse ?? "";

  // Match from API courses list; fallback to a synthetic entry if API hasn't loaded yet
  const activeCourses: Course[] = enrolledCourseName
    ? (courses.filter(c => c.courseName === enrolledCourseName).length > 0
        ? courses.filter(c => c.courseName === enrolledCourseName)
        : [{ courseName: enrolledCourseName, status: "ACTIVE" }])
    : [];

  // Global announcements + announcements for student's enrolled course(s)
  const filteredAnnouncements = announcements.filter(a => {
    if (!a.courseId) return true; // global
    return activeCourses.some(c => c.id === a.courseId);
  });

  // Navigation items
  const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "courses", label: "My Courses", icon: <BookOpen className="w-4 h-4" /> },
    { id: "announcements", label: "Announcements", icon: <Bell className="w-4 h-4" /> },
    { id: "marks", label: "My Marks", icon: <Award className="w-4 h-4" /> },
    { id: "materials", label: "Materials", icon: <FolderOpen className="w-4 h-4" /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Header */}
      <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">Student Portal</p>
          <p className="text-gray-400 text-xs">CPC Training LMS</p>
        </div>
      </div>

      {/* Student info */}
      {studentData && (
        <div className="mx-3 my-3 p-3 bg-red-50 rounded-2xl border border-red-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {studentData.name?.[0]?.toUpperCase() ?? "S"}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-red-900 text-sm truncate">{studentData.name ?? "Student"}</p>
              {studentData.studentId && <p className="text-xs text-red-700">{studentData.studentId}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id
                ? "bg-red-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100 space-y-1">
        <Link to="/student/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
          <User className="w-4 h-4" /> My Profile
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  // ─── Tab Content ───
  const renderTab = () => {
    if (loading) return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );

    switch (activeTab) {
      case "dashboard": return (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 truncate" title={`Welcome back, ${studentData?.name ?? "Student"}! 👋`}>
              Welcome back, {studentData?.name ?? "Student"}! 👋
            </h2>
            <p className="text-gray-500 mt-1">Here's your learning overview.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Enrolled Courses", value: activeCourses.length, color: "text-blue-600", bg: "bg-blue-50", icon: <BookOpen className="w-6 h-6" /> },
              { label: "Marks Recorded", value: marks.length, color: "text-green-600", bg: "bg-green-50", icon: <Award className="w-6 h-6" /> },
              { label: "Announcements", value: filteredAnnouncements.length, color: "text-purple-600", bg: "bg-purple-50", icon: <Bell className="w-6 h-6" /> },
              { label: "Materials", value: materials.length, color: "text-orange-600", bg: "bg-orange-50", icon: <FolderOpen className="w-6 h-6" /> },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className={`w-11 h-11 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-3`}>{s.icon}</div>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Latest Announcements */}
          {filteredAnnouncements.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Bell className="w-5 h-5 text-purple-600" /> Announcements</h3>
                <button onClick={() => setActiveTab("announcements")} className="text-xs text-red-600 font-semibold hover:underline">View all →</button>
              </div>
              <div className="space-y-3">
                {filteredAnnouncements.slice(0, 2).map(a => (
                  <div key={a.id} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                    <p className="font-semibold text-sm text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{a.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(a.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Marks */}
          {marks.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Award className="w-5 h-5 text-green-600" /> Recent Marks</h3>
                <button onClick={() => setActiveTab("marks")} className="text-xs text-red-600 font-semibold hover:underline">View all →</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {marks.slice(0, 4).map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{m.subject ?? "General"}</p>
                      <p className="text-xs text-gray-500">{(m as any).courseName ?? `Course #${m.courseId}`}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-gray-900">{m.mark ?? "—"}</span>
                      {m.grade && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">{m.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );

      case "courses": return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">My Courses</h2>
            <p className="text-gray-500 text-sm mt-1">Training programs you are enrolled in</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeCourses.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-red-50 rounded-xl">
                    <BookOpen className="w-5 h-5 text-red-700" />
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{c.courseName}</h4>
                {c.description && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{c.description}</p>}
                {c.duration && <p className="text-xs text-gray-400">⏱ {c.duration}</p>}
                <button onClick={() => { setActiveTab("materials"); }} className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors">
                  <FolderOpen className="w-3.5 h-3.5" /> View Materials
                </button>
              </div>
            ))}
            {activeCourses.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No courses available yet.</p>
              </div>
            )}
          </div>
        </div>
      );

      case "announcements": return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Announcements</h2>
            <p className="text-gray-500 text-sm mt-1">Messages from your training center</p>
          </div>
          <div className="space-y-4">
            {filteredAnnouncements.map(a => (
              <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900">{a.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{a.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{formatDate(a.createdAt)}</span>
                      {a.createdByUsername && <span>by {a.createdByUsername}</span>}
                      {!a.courseId && <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full">General</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredAnnouncements.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                No announcements yet.
              </div>
            )}
          </div>
        </div>
      );

      case "marks": return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">My Marks & Grades</h2>
            <p className="text-gray-500 text-sm mt-1">Your academic performance records</p>
          </div>
          {marks.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Records", value: marks.length, color: "text-blue-600" },
                { label: "Avg Mark", value: marks.filter(m => m.mark).length > 0 ? (marks.reduce((s, m) => s + (m.mark ?? 0), 0) / marks.filter(m => m.mark).length).toFixed(1) : "—", color: "text-green-600" },
                { label: "Best Mark", value: marks.reduce((b, m) => Math.max(b, m.mark ?? 0), 0) || "—", color: "text-red-600" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Course", "Subject", "Mark", "Grade", "Remarks"].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {marks.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-xs text-gray-600">{(m as any).courseName ?? `#${m.courseId}`}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{m.subject ?? "—"}</td>
                    <td className="py-3 px-4 font-black text-gray-900">{m.mark ?? "—"}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">{m.grade ?? "—"}</span></td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{m.remarks ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {marks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
                No marks recorded yet.
              </div>
            )}
          </div>
        </div>
      );

      case "materials": return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Course Materials</h2>
            <p className="text-gray-500 text-sm mt-1">Download study resources and files</p>
          </div>
          {activeCourses.map(course => {
            const courseMats = materials.filter(m => m.courseId === course.id);
            if (courseMats.length === 0) return null;
            return (
              <div key={course.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-600" /> {course.courseName}
                </h3>
                <div className="space-y-2">
                  {courseMats.map(mat => (
                    <div key={mat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black ${
                          mat.fileType === "pdf" ? "bg-red-100 text-red-700" :
                          mat.fileType === "word" ? "bg-blue-100 text-blue-700" :
                          mat.fileType === "ppt" ? "bg-orange-100 text-orange-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {mat.fileType?.toUpperCase() ?? "FILE"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{mat.title}</p>
                          {mat.description && <p className="text-xs text-gray-500 truncate">{mat.description}</p>}
                          <p className="text-xs text-gray-400">{formatDate(mat.createdAt)}</p>
                        </div>
                      </div>
                      {(mat.fileUrl || mat.linkUrl) && (
                        <a href={mat.linkUrl || `http://localhost:5000${mat.fileUrl}`} target="_blank" rel="noreferrer"
                          className="ml-3 p-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex-shrink-0">
                          {mat.linkUrl ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {materials.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              No materials available yet.
            </div>
          )}
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 z-50 md:hidden transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between md:px-8">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
            <BookOpen className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 hidden md:block capitalize">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/student/profile" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" title="Profile">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
