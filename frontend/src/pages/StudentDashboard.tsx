import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen, LayoutDashboard, LogOut, User, Bell, Award, FolderOpen,
  Download, Loader2, ChevronRight, FileText, BarChart3, Shield, ExternalLink
  , ArrowLeft, Link2, CheckCircle2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

interface Course { id?: number; courseName: string; description?: string; duration?: string; status?: string; }
interface Announcement { id?: number; title: string; content: string; courseId?: number | null; createdAt?: string; createdByUsername?: string; }
interface Material { id?: number; courseId: number; title: string; description?: string; fileUrl?: string; linkUrl?: string; fileName?: string; fileType?: string; createdAt?: string; }
interface Mark { id?: number; courseId: number; subject?: string; mark?: number; grade?: string; remarks?: string; courseName?: string; }

type Tab = "dashboard" | "courses" | "announcements" | "marks";

function formatDate(d?: string) { if (!d) return ""; return new Date(d).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" }); }

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { studentData, studentToken, logoutStudent } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
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

      case "courses": {
        const selectedCourse = activeCourses.find(course => course.id === selectedCourseId);
        if (selectedCourse) {
          const courseMaterials = materials.filter(material => material.courseId === selectedCourse.id);
          return (
            <div className="space-y-7">
              <button onClick={() => setSelectedCourseId(null)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700">
                <ArrowLeft className="h-4 w-4" /> Back to my courses
              </button>
              <section className="overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-2xl shadow-slate-300/30">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#741521] via-[#a91f2d] to-[#d04b4a] p-7 text-white sm:p-11">
                  <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[32px] border-white/10" />
                  <span className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-50"><BookOpen className="h-3.5 w-3.5" /> My learning course</span>
                  <h1 className="relative mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{selectedCourse.courseName}</h1>
                  <p className="relative mt-4 max-w-3xl text-sm leading-7 text-red-100 sm:text-base">{selectedCourse.description || "Explore your course information and study resources in one place."}</p>
                  <div className="relative mt-6 flex flex-wrap gap-3 text-xs font-bold"><span className="rounded-xl bg-white/15 px-4 py-2.5">{selectedCourse.duration || "Training programme"}</span><span className="rounded-xl bg-white/15 px-4 py-2.5">{courseMaterials.length} study resource{courseMaterials.length === 1 ? "" : "s"}</span></div>
                </div>
                <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Study resources</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Open your course files and links below to continue learning.</p>
                    {courseMaterials.length > 0 ? <div className="mt-6 space-y-3">{courseMaterials.map(material => {
                      const resourceUrl = material.linkUrl || `http://localhost:5000${material.fileUrl}`;
                      return <article key={material.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-red-200 hover:bg-red-50/40">
                        <div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-white p-2.5 text-red-700 shadow-sm">{material.linkUrl ? <Link2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}</div><div className="min-w-0"><p className="truncate text-sm font-extrabold text-slate-800">{material.title}</p><p className="mt-1 truncate text-xs text-slate-500">{material.description || material.fileName || (material.linkUrl ? "External learning link" : "Course file")}</p><p className="mt-1 text-[11px] font-semibold text-slate-400">{formatDate(material.createdAt)}</p></div></div>
                        <a href={resourceUrl} target="_blank" rel="noreferrer" className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-[#9f1d2b] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#7f1822]">{material.linkUrl ? <ExternalLink className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />} Open</a>
                      </article>;
                    })}</div> : <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center"><FolderOpen className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-3 font-bold text-slate-600">No resources available yet</p><p className="mt-1 text-sm text-slate-400">Your training center will add study material here.</p></div>}
                  </div>
                  <aside className="h-fit rounded-2xl border border-red-100 bg-red-50/70 p-5"><CheckCircle2 className="h-7 w-7 text-red-700" /><h3 className="mt-3 font-black text-slate-900">Ready to study?</h3><p className="mt-2 text-sm leading-6 text-slate-600">Review each resource carefully and keep up with your course learning.</p><div className="mt-5 rounded-xl bg-white p-3 text-center"><p className="text-2xl font-black text-red-700">{courseMaterials.length}</p><p className="text-xs font-bold text-slate-500">Available resources</p></div></aside>
                </div>
              </section>
            </div>
          );
        }
        return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">My Courses</h2>
            <p className="text-gray-500 text-sm mt-1">Training programs you are enrolled in</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeCourses.map(c => (
              <div key={c.id} onClick={() => setSelectedCourseId(c.id ?? null)} className="group cursor-pointer rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/60 transition-all hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-900/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="rounded-2xl bg-red-50 p-3 ring-1 ring-red-100">
                    <BookOpen className="h-6 w-6 text-red-700" />
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                </div>
                <h4 className="mb-2 text-lg font-black leading-snug text-slate-900 group-hover:text-red-700">{c.courseName}</h4>
                {c.description && <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-slate-500">{c.description}</p>}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-400"><span>{c.duration || "Training programme"}</span><span className="text-red-700">View course <ChevronRight className="inline h-4 w-4" /></span></div>
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
      }

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

      default: return null;
    }
  };

  return (
    <div className="industrial-page flex h-screen overflow-hidden">
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
