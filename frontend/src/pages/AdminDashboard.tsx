import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, FileText, Search, X, BookOpen, Plus, Pencil, Trash2, LogOut,
  Loader2, ShieldCheck, Bell, Upload, ChevronDown, ChevronUp, Award,
  FolderOpen, AlertTriangle, CheckCircle2, BarChart3, Shield, Eye
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

// ─────────────────────────── Types ──────────────────────────────
interface Application {
  id: number; fullName: string; nameWithInitials: string; traineeNumber?: string;
  personalEmail?: string; trainingPreference?: string; createdAt?: string; isReviewed?: boolean;
  nic?: string; mobile?: string; district?: string; dob?: string; gender?: string;
  olYear?: string; alYear?: string; alStream?: string; specialAchievements?: string;
  sportsAchievements?: string; olResultsJSON?: string; alResultsJSON?: string;
  workExperienceJSON?: string; refereesJSON?: string; cvDriveLink?: string;
}
interface Course { id?: number; courseName: string; description?: string; duration?: string; status?: "ACTIVE" | "INACTIVE"; }
interface Student { id: number; email: string; name?: string; studentId?: string; enrolledCourse?: string; createdAt?: string; }
interface Announcement { id?: number; title: string; content: string; courseId?: number | null; createdAt?: string; createdByUsername?: string; }
interface Material { id?: number; courseId: number; title: string; description?: string; fileUrl?: string; linkUrl?: string; fileName?: string; fileType?: string; createdAt?: string; }
interface Mark { id?: number; studentId: number; courseId: number; subject?: string; mark?: number; grade?: string; remarks?: string; studentName?: string; studentRegId?: string; courseName?: string; }

type Tab = "dashboard" | "applications" | "courses" | "students" | "announcements" | "marks";

// ─────────────────────────── Helpers ────────────────────────────
function parseJSON(str?: string) { try { return str ? JSON.parse(str) : null; } catch { return null; } }
function formatDate(d?: string) { if (!d) return "—"; return new Date(d).toLocaleDateString("en-LK", { year: "numeric", month: "short", day: "numeric" }); }

// ─────────────────────────── Component ──────────────────────────
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { adminData, logoutAdmin } = useAuth();
  const isAdmin = adminData?.role === "admin";
  const isSubadmin = adminData?.role === "subadmin";
  const hasStaffAccess = isAdmin || isSubadmin;

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Data
  const [applications, setApplications] = useState<Application[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  // Selected application detail
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Form states
  const [courseForm, setCourseForm] = useState<Course>({ courseName: "", description: "", duration: "", status: "ACTIVE" });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);

  const [studentForm, setStudentForm] = useState({ email: "", name: "", studentId: "", tempPassword: "", enrolledCourse: "" });
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudentCourse, setEditingStudentCourse] = useState<{id: number; enrolledCourse: string} | null>(null);

  const [announcementForm, setAnnouncementForm] = useState<Announcement>({ title: "", content: "", courseId: null });
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [showAnnForm, setShowAnnForm] = useState(false);

  const [markForm, setMarkForm] = useState<Mark>({ studentId: 0, courseId: 0, subject: "", mark: undefined, grade: "", remarks: "" });
  const [showMarkForm, setShowMarkForm] = useState(false);

  const [materialForm, setMaterialForm] = useState({ courseId: "", title: "", description: "", linkUrl: "" });
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, coursesRes, studentsRes, annsRes, matsRes, marksRes] = await Promise.all([
        fetch(`${API}/applications`),
        fetch(`${API}/courses`),
        fetch(`${API}/students`),
        fetch(`${API}/announcements`),
        fetch(`${API}/materials`),
        fetch(`${API}/marks`),
      ]);
      setApplications(await appsRes.json().catch(() => []));
      setCourses(await coursesRes.json().catch(() => []));
      setStudents(await studentsRes.json().catch(() => []));
      setAnnouncements(await annsRes.json().catch(() => []));
      setMaterials(await matsRes.json().catch(() => []));
      setMarks(await marksRes.json().catch(() => []));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { if (!adminData) { navigate("/login"); return; } fetchAll(); }, [adminData, fetchAll, navigate]);

  // ── Course CRUD ──
  const saveCourse = async () => {
    const method = editingCourse?.id ? "PUT" : "POST";
    const url = editingCourse?.id ? `${API}/courses/${editingCourse.id}` : `${API}/courses`;
    const body = editingCourse?.id ? { ...editingCourse, ...courseForm } : courseForm;
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { showToast(editingCourse?.id ? "Course updated!" : "Course created!"); setShowCourseForm(false); setEditingCourse(null); setCourseForm({ courseName: "", description: "", duration: "", status: "ACTIVE" }); fetchAll(); }
    else showToast("Failed to save course.", "error");
  };
  const deleteCourse = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    const res = await fetch(`${API}/courses/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Course deleted."); fetchAll(); } else showToast("Failed to delete.", "error");
  };

  // ── Student CRUD ──
  const saveStudent = async () => {
    const res = await fetch(`${API}/students/admin-create`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(studentForm) });
    const data = await res.json();
    if (res.ok) { showToast("Student created! They can log in with their email and the temp password."); setShowStudentForm(false); setStudentForm({ email: "", name: "", studentId: "", tempPassword: "", enrolledCourse: "" }); fetchAll(); }
    else showToast(data.message || "Failed to create student.", "error");
  };
  const deleteStudent = async (id: number) => {
    if (!confirm("Delete this student?")) return;
    const res = await fetch(`${API}/students/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Student deleted."); fetchAll(); } else showToast("Failed.", "error");
  };

  const updateStudentCourse = async () => {
    if (!editingStudentCourse) return;
    const res = await fetch(`${API}/students/${editingStudentCourse.id}/update-course`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrolledCourse: editingStudentCourse.enrolledCourse })
    });
    const data = await res.json();
    if (res.ok) { showToast("Enrolled course updated!"); setEditingStudentCourse(null); fetchAll(); }
    else showToast(data.message || "Failed to update course.", "error");
  };

  // ── Add student from application ──
  const addStudentFromApp = (app: Application) => {
    if (!app.personalEmail) return showToast("Application has no email.", "error");
    setStudentForm({
      email: app.personalEmail,
      name: app.nameWithInitials, // Use shorter name!
      studentId: app.traineeNumber || "",
      tempPassword: "", // Let admin enter it
      enrolledCourse: app.trainingPreference || ""
    });
    setShowStudentForm(true);
    setActiveTab("students");
  };

  const deleteApplication = async (id: number) => {
    if (!confirm("Delete this application?")) return;
    const res = await fetch(`${API}/applications/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Application deleted."); fetchAll(); } else showToast("Failed.", "error");
  };

  const resetStudentPassword = async (id: number) => {
    const newPassword = prompt("Enter new password for the student (min 6 characters):");
    if (!newPassword) return;
    if (newPassword.length < 6) return showToast("Password must be at least 6 characters.", "error");

    const res = await fetch(`${API}/students/${id}/reset-password`, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ newPassword }) 
    });
    const data = await res.json();
    if (res.ok) { showToast("Password reset successfully."); fetchAll(); }
    else showToast(data.message || "Failed to reset password.", "error");
  };

  // ── Announcement CRUD ──
  const saveAnnouncement = async () => {
    const method = editingAnn?.id ? "PUT" : "POST";
    const url = editingAnn?.id ? `${API}/announcements/${editingAnn.id}` : `${API}/announcements`;
    const payload = editingAnn?.id ? { ...editingAnn, ...announcementForm } : { ...announcementForm, createdByUsername: adminData?.username };
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { showToast("Announcement saved!"); setShowAnnForm(false); setEditingAnn(null); setAnnouncementForm({ title: "", content: "", courseId: null }); fetchAll(); }
    else showToast("Failed to save.", "error");
  };
  const deleteAnnouncement = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API}/announcements/${id}`, { method: "DELETE" });
    showToast("Deleted."); fetchAll();
  };

  // ── Material Upload ──
  const saveMaterial = async () => {
    if (!materialForm.courseId || !materialForm.title) return showToast("Course and title required.", "error");
    if (editingMaterial?.id) {
      const res = await fetch(`${API}/materials/${editingMaterial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: materialForm.title, description: materialForm.description }),
      });
      if (res.ok) {
        showToast("Resource updated successfully.");
        setShowMaterialForm(false);
        setEditingMaterial(null);
        fetchAll();
      } else {
        showToast("Failed to update resource.", "error");
      }
      return;
    }
    const fd = new FormData();
    fd.append("courseId", materialForm.courseId);
    fd.append("title", materialForm.title);
    fd.append("description", materialForm.description);
    fd.append("linkUrl", materialForm.linkUrl);
    fd.append("uploadedBy", adminData?.username ?? "Superadmin");
    if (materialFile) fd.append("file", materialFile);
    const res = await fetch(`${API}/materials`, { method: "POST", body: fd });
    if (res.ok) { showToast("Resource added!"); setShowMaterialForm(false); setMaterialForm({ courseId: "", title: "", description: "", linkUrl: "" }); setMaterialFile(null); fetchAll(); }
    else showToast("Failed to upload.", "error");
  };
  const deleteMaterial = async (id: number) => {
    if (!confirm("Delete?")) return;
    const res = await fetch(`${API}/materials/${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Resource deleted."); fetchAll(); }
    else showToast("Failed to delete resource.", "error");
  };

  const openMaterialEditor = (material: Material) => {
    setEditingMaterial(material);
    setMaterialFile(null);
    setMaterialForm({
      courseId: String(material.courseId),
      title: material.title,
      description: material.description ?? "",
      linkUrl: material.linkUrl ?? "",
    });
    setShowMaterialForm(true);
  };

  // ── Mark CRUD ──
  const saveMark = async () => {
    const res = await fetch(`${API}/marks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...markForm, addedBy: adminData?.username }) });
    if (res.ok) { showToast("Mark added!"); setShowMarkForm(false); setMarkForm({ studentId: 0, courseId: 0, subject: "", mark: undefined, grade: "", remarks: "" }); fetchAll(); }
    else showToast("Failed.", "error");
  };
  const deleteMark = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API}/marks/${id}`, { method: "DELETE" });
    showToast("Deleted."); fetchAll();
  };

  const filteredApps = applications.filter(a =>
    (a.fullName + a.nameWithInitials + (a.traineeNumber ?? "") + (a.trainingPreference ?? ""))
      .toLowerCase().includes(searchQ.toLowerCase())
  );

  const handleLogout = () => { logoutAdmin(); navigate("/login"); };

  // ─────────────────────────── Sidebar ────────────────────────────
  const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "applications", label: "Applications", icon: <FileText className="w-4 h-4" /> },
    { id: "courses", label: "Courses", icon: <BookOpen className="w-4 h-4" /> },
    { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
    { id: "announcements", label: "Announcements", icon: <Bell className="w-4 h-4" /> },
    { id: "marks", label: "Marks & Grades", icon: <Award className="w-4 h-4" /> },
  ];

  const visibleNav = NAV_ITEMS.filter(n => !n.adminOnly || isAdmin);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">LMS Admin</p>
            <p className="text-gray-400 text-xs">Ceylon Petroleum Corp.</p>
          </div>
        </div>
      </div>

      {/* User Badge */}
      <div className="px-4 py-3 mx-3 mt-4 bg-gray-800 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            {adminData?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{adminData?.username}</p>
            <p className="text-gray-400 text-xs capitalize">{adminData?.role === "admin" ? "Super Admin" : "Sub Admin"}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleNav.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id
                ? "bg-red-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  // ─────────────────────────── TABS ────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      // ── Dashboard ──
      case "dashboard": return (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isAdmin ? "Admin Dashboard" : "Sub Admin Dashboard"}
            </h2>
            <p className="text-gray-500 mt-1">Welcome back, <strong>{adminData?.username}</strong></p>
          </div>
          <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Courses", value: courses.length, color: "bg-blue-600", icon: <BookOpen className="w-6 h-6" /> },
              { label: "Applications", value: applications.length, color: "bg-orange-500", icon: <FileText className="w-6 h-6" /> },
              { label: "Students", value: students.length, color: "bg-green-600", icon: <Users className="w-6 h-6" /> },
              { label: "Announcements", value: announcements.length, color: "bg-purple-600", icon: <Bell className="w-6 h-6" /> },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-4`}>{stat.icon}</div>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Latest Announcements */}
          {announcements.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-purple-600" /> Recent Announcements</h3>
              <div className="space-y-3">
                {announcements.slice(0, 3).map(a => (
                  <div key={a.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="font-semibold text-sm text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(a.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );

      // ── Applications (Admin and Subadmin) ──
      case "applications": return hasStaffAccess ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Training Applications</h2>
              <p className="text-gray-500 text-sm mt-1">{applications.length} total applications received</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search by name, trainee no..." className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["#", "Full Name", "Trainee No.", "Email", "Preference", "Date", "Actions"].map(h => (
                      <th key={h} className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredApps.map((app, idx) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{app.fullName}</td>
                      <td className="py-3 px-4 text-gray-600">{app.traineeNumber ?? "—"}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{app.personalEmail ?? "—"}</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-xs font-medium">{app.trainingPreference ?? "—"}</span></td>
                      <td className="py-3 px-4 text-gray-400 text-xs">{formatDate(app.createdAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedApp(app)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => addStudentFromApp(app)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 text-xs font-semibold flex items-center gap-1" title="Add as Student">
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                          <button onClick={() => deleteApplication(app.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Delete Application"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredApps.length === 0 && <div className="text-center py-12 text-gray-400">No applications found.</div>}
            </div>
          </div>

          {/* Application Detail Modal */}
          {selectedApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-3xl">
                  <h3 className="text-lg font-bold text-gray-900">Application Details</h3>
                  <button onClick={() => setSelectedApp(null)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      ["Full Name", selectedApp.fullName], ["Name with Initials", selectedApp.nameWithInitials],
                      ["Trainee Number", selectedApp.traineeNumber], ["NIC", selectedApp.nic],
                      ["Gender", selectedApp.gender], ["DOB", selectedApp.dob],
                      ["District", selectedApp.district], ["Mobile", selectedApp.mobile],
                      ["Email", selectedApp.personalEmail], ["Training Preference", selectedApp.trainingPreference],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                        <p className="font-medium text-gray-800 mt-0.5">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                  {selectedApp.cvDriveLink && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">CV</p>
                      <a href={`http://localhost:5000${selectedApp.cvDriveLink}`} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100">
                        <FolderOpen className="w-4 h-4" /> View CV
                      </a>
                    </div>
                  )}
                  <div className="flex gap-2 w-full">
                    <button onClick={() => { addStudentFromApp(selectedApp); setSelectedApp(null); }}
                      className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add as Student
                    </button>
                    <button onClick={() => { deleteApplication(selectedApp.id); setSelectedApp(null); }}
                      className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" /> Delete App
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null;

      // ── Courses ──
      case "courses": return (
        <div className="space-y-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-red-700">
                <BookOpen className="h-3.5 w-3.5" /> Learning catalogue
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Courses</h2>
              <p className="mt-1 text-sm text-slate-500">{courses.length} technical training {courses.length === 1 ? "course" : "courses"} available</p>
            </div>
            {isAdmin && (
              <button onClick={() => { setShowCourseForm(true); setEditingCourse(null); setCourseForm({ courseName: "", description: "", duration: "", status: "ACTIVE" }); }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9f1d2b] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-700/15 transition hover:bg-[#7f1822]">
                <Plus className="w-4 h-4" /> Add Course
              </button>
            )}
          </div>

          {showCourseForm && isAdmin && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900">{editingCourse ? "Edit Course" : "New Course"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input value={courseForm.courseName} onChange={e => setCourseForm(p => ({ ...p, courseName: e.target.value }))} placeholder="Course name *" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                <input value={courseForm.duration ?? ""} onChange={e => setCourseForm(p => ({ ...p, duration: e.target.value }))} placeholder="Duration (e.g. 4 Years)" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                <textarea value={courseForm.description ?? ""} onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" className="sm:col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" rows={2} />
                <select value={courseForm.status ?? "ACTIVE"} onChange={e => setCourseForm(p => ({ ...p, status: e.target.value as "ACTIVE" | "INACTIVE" }))} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={saveCourse} className="px-4 py-2 bg-red-700 text-white rounded-xl text-sm font-bold hover:bg-red-800">Save</button>
                <button onClick={() => { setShowCourseForm(false); setEditingCourse(null); }} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          )}

          {selectedCourseId && (() => {
            const selectedCourse = courses.find(course => course.id === selectedCourseId);
            if (!selectedCourse) return null;
            const courseMaterials = materials.filter(material => material.courseId === selectedCourse.id);
            return (
              <section className="overflow-hidden rounded-[1.5rem] border border-red-100 bg-white shadow-xl shadow-slate-200/60">
                <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-red-50 to-white p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-red-700">Course workspace</p>
                    <h3 className="text-2xl font-black text-slate-900">{selectedCourse.courseName}</h3>
                    <p className="mt-1 text-sm text-slate-500">{selectedCourse.duration || "Training programme"} · {courseMaterials.length} resource{courseMaterials.length === 1 ? "" : "s"}</p>
                  </div>
                  <button onClick={() => setSelectedCourseId(null)} className="self-start rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50">
                    Close course
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-slate-900">Course resources</h4>
                      <p className="mt-1 text-xs text-slate-500">Review the materials currently available for this course.</p>
                    </div>
                    {isAdmin && (
                      <button onClick={() => {
                        setEditingMaterial(null);
                        setMaterialFile(null);
                        setMaterialForm({ courseId: String(selectedCourse.id), title: "", description: "", linkUrl: "" });
                        setShowMaterialForm(true);
                      }} className="inline-flex items-center gap-1.5 rounded-xl bg-[#9f1d2b] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#7f1822]">
                        <Plus className="h-3.5 w-3.5" /> Add resource
                      </button>
                    )}
                  </div>
                  {courseMaterials.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {courseMaterials.map(material => (
                        <div key={material.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                          <div className="min-w-0">
                            {(material.linkUrl || material.fileUrl) ? (
                              <a href={material.linkUrl || `http://localhost:5000${material.fileUrl}`} target="_blank" rel="noreferrer" className="block truncate text-sm font-bold text-blue-700 hover:underline">{material.title}</a>
                            ) : <p className="truncate text-sm font-bold text-slate-800">{material.title}</p>}
                            <p className="mt-1 truncate text-xs text-slate-500">{material.description || material.fileName || "Course resource"}</p>
                          </div>
                          {isAdmin && (
                            <div className="flex flex-shrink-0 gap-1">
                              <button onClick={() => openMaterialEditor(material)} className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-blue-700" aria-label={`Edit ${material.title}`}><Pencil className="h-4 w-4" /></button>
                              <button onClick={() => deleteMaterial(material.id!)} className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${material.title}`}><Trash2 className="h-4 w-4" /></button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <FolderOpen className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-2 text-sm font-bold text-slate-600">No resources added yet</p>
                      <p className="mt-1 text-xs text-slate-400">Add a file or external link to make it available here.</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })()}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map(c => (
              <div key={c.id} onClick={() => setSelectedCourseId(c.id!)} className="group flex min-h-[285px] cursor-pointer flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-900/10">
                <div className="mb-5 flex items-start justify-between">
                  <div className="rounded-2xl bg-red-50 p-3 ring-1 ring-red-100 transition group-hover:bg-red-100">
                    <BookOpen className="h-6 w-6 text-red-700" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${c.status === "ACTIVE" || !c.status ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "bg-slate-100 text-slate-500"}`}>
                    {c.status ?? "ACTIVE"}
                  </span>
                </div>
                <h4 className="mb-2 text-lg font-black leading-snug text-slate-900 transition group-hover:text-red-700">{c.courseName}</h4>
                {c.description && <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-slate-500">{c.description}</p>}
                {c.duration && <p className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400"><span className="text-red-600">●</span> {c.duration}</p>}

                {/* Materials for this course */}
                {hasStaffAccess && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Resources ({materials.filter(m => m.courseId === c.id).length})</p>
                    {isAdmin && <button onClick={() => { setSelectedCourseFilter(c.id!); setMaterialForm(p => ({ ...p, courseId: String(c.id) })); setShowMaterialForm(true); }}
                      className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900">
                      <Upload className="w-3 h-3" /> Add Resource
                    </button>}
                    {materials.filter(m => m.courseId === c.id).map(mat => (
                      <div key={mat.id} className="mt-1.5 flex items-center justify-between rounded-lg bg-slate-50 p-2 ring-1 ring-slate-100">
                        {(mat.linkUrl || mat.fileUrl) ? <a href={mat.linkUrl || `http://localhost:5000${mat.fileUrl}`} target="_blank" rel="noreferrer" className="text-xs text-blue-700 truncate max-w-[180px] hover:underline">{mat.title}</a> : <span className="text-xs text-gray-700 truncate max-w-[180px]">{mat.title}</span>}
                        {isAdmin && <div className="flex gap-1"><button onClick={(event) => { event.stopPropagation(); openMaterialEditor(mat); }} className="text-slate-400 hover:text-blue-600" aria-label={`Edit ${mat.title}`}><Pencil className="w-3 h-3" /></button><button onClick={(event) => { event.stopPropagation(); deleteMaterial(mat.id!); }} className="text-red-400 hover:text-red-600" aria-label={`Delete ${mat.title}`}><X className="w-3 h-3" /></button></div>}
                      </div>
                    ))}
                  </div>
                )}

                {isAdmin && (
                  <div className="mt-auto flex gap-2 border-t border-slate-100 pt-4">
                    <button onClick={(event) => { event.stopPropagation(); setEditingCourse(c); setCourseForm({ courseName: c.courseName, description: c.description, duration: c.duration, status: c.status }); setShowCourseForm(true); }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={(event) => { event.stopPropagation(); deleteCourse(c.id!); }} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-red-100 text-xs text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

      // ── Students (Admin and Subadmin) ──
      case "students": return hasStaffAccess ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Students</h2>
              <p className="text-gray-500 text-sm mt-1">{students.length} registered students</p>
            </div>
            <button onClick={() => setShowStudentForm(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-xl text-sm font-bold hover:bg-red-800">
              <Plus className="w-4 h-4" /> Add Student
            </button>
          </div>

          {showStudentForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900">Add New Student</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input value={studentForm.email} onChange={e => setStudentForm(p => ({ ...p, email: e.target.value }))} placeholder="Email *" type="email" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                <input value={studentForm.name} onChange={e => setStudentForm(p => ({ ...p, name: e.target.value }))} placeholder="Name with Initials" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                <input value={studentForm.studentId} onChange={e => setStudentForm(p => ({ ...p, studentId: e.target.value }))} placeholder="Student ID / Reg. No." className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                <input value={studentForm.tempPassword} onChange={e => setStudentForm(p => ({ ...p, tempPassword: e.target.value }))} placeholder="Temporary Password *" type="text" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                <select value={studentForm.enrolledCourse} onChange={e => setStudentForm(p => ({ ...p, enrolledCourse: e.target.value }))} className="border border-gray-200 rounded-xl px-3 py-2 text-sm sm:col-span-2 bg-white">
                  <option value="">Select Enrolled Course</option>
                  {[
                    "Refinery Operation Technician - C11S003",
                    "Refinery Engineering Technician(Mechanical)-C11T004",
                    "Refinery Engineering Technician(Electrical)",
                    "Refinery Engineering Technician(Instrument)-C11S002",
                    "Refinery Laboratory Analyst",
                    "Industrial Boiler Operator(High Pressure)",
                    "Oil and Gas Plant Inspection Technology",
                    "6-G Industrial Welder"
                  ].map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={saveStudent} className="px-4 py-2 bg-red-700 text-white rounded-xl text-sm font-bold hover:bg-red-800">Create Student</button>
                <button onClick={() => setShowStudentForm(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          )}

          {/* Edit Course Modal */}
          {editingStudentCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
                <h3 className="font-bold text-gray-900">Assign Course to Student</h3>
                <select
                  value={editingStudentCourse.enrolledCourse}
                  onChange={e => setEditingStudentCourse(p => p ? { ...p, enrolledCourse: e.target.value } : null)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="">— No Course Assigned —</option>
                  {[
                    "Refinery Operation Technician - C11S003",
                    "Refinery Engineering Technician(Mechanical)-C11T004",
                    "Refinery Engineering Technician(Electrical)",
                    "Refinery Engineering Technician(Instrument)-C11S002",
                    "Refinery Laboratory Analyst",
                    "Industrial Boiler Operator(High Pressure)",
                    "Oil and Gas Plant Inspection Technology",
                    "6-G Industrial Welder"
                  ].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <button onClick={updateStudentCourse} className="flex-1 py-2 bg-red-700 text-white rounded-xl text-sm font-bold hover:bg-red-800">Save</button>
                  <button onClick={() => setEditingStudentCourse(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["#", "Name", "Student ID", "Enrolled Course", "Email", "Actions"].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{s.name ?? "—"}</td>
                    <td className="py-3 px-4 text-gray-600">{s.studentId ?? "—"}</td>
                    <td className="py-3 px-4">
                      {s.enrolledCourse
                        ? <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">{s.enrolledCourse}</span>
                        : <button onClick={() => setEditingStudentCourse({ id: s.id, enrolledCourse: "" })} className="px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium border border-orange-100 hover:bg-orange-100">⚠ Assign Course</button>
                      }
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{s.email}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditingStudentCourse({ id: s.id, enrolledCourse: s.enrolledCourse ?? "" })} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1.5 rounded-lg border border-indigo-100">Edit Course</button>
                        <button onClick={() => resetStudentPassword(s.id)} className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100">Reset Password</button>
                        <button onClick={() => deleteStudent(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && <div className="text-center py-12 text-gray-400">No students registered yet.</div>}
          </div>
        </div>
      ) : null;

      // ── Announcements (Admin only) ──
      case "announcements": return hasStaffAccess ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Announcements</h2>
              <p className="text-gray-500 text-sm mt-1">Create and manage announcements for all students</p>
            </div>
            <button onClick={() => { setShowAnnForm(true); setEditingAnn(null); setAnnouncementForm({ title: "", content: "", courseId: null }); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-xl text-sm font-bold hover:bg-red-800">
              <Plus className="w-4 h-4" /> New Announcement
            </button>
          </div>

          {showAnnForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900">{editingAnn ? "Edit Announcement" : "New Announcement"}</h3>
              <input value={announcementForm.title} onChange={e => setAnnouncementForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Title *" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              <textarea value={announcementForm.content} onChange={e => setAnnouncementForm(p => ({ ...p, content: e.target.value }))}
                placeholder="Content *" rows={4} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" />
              <select value={announcementForm.courseId ?? ""} onChange={e => setAnnouncementForm(p => ({ ...p, courseId: e.target.value ? parseInt(e.target.value) : null }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
                <option value="">Global (All Students)</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.courseName}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={saveAnnouncement} className="px-4 py-2 bg-red-700 text-white rounded-xl text-sm font-bold">Save</button>
                <button onClick={() => setShowAnnForm(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {announcements.map(a => (
              <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800">{a.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{a.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{formatDate(a.createdAt)}</span>
                      <span>by {a.createdByUsername}</span>
                      {a.courseId && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">Course #{a.courseId}</span>}
                      {!a.courseId && <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full">Global</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => { setEditingAnn(a); setAnnouncementForm({ title: a.title, content: a.content, courseId: a.courseId }); setShowAnnForm(true); }}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteAnnouncement(a.id!)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                No announcements yet.
              </div>
            )}
          </div>
        </div>
      ) : null;

      // ── Marks (Admin only) ──
      case "marks": return hasStaffAccess ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Marks & Grades</h2>
              <p className="text-gray-500 text-sm mt-1">Add and manage student marks</p>
            </div>
            <button onClick={() => setShowMarkForm(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-xl text-sm font-bold hover:bg-red-800">
              <Plus className="w-4 h-4" /> Add Mark
            </button>
          </div>

          {showMarkForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900">Add Mark</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <select value={markForm.studentId || ""} onChange={e => setMarkForm(p => ({ ...p, studentId: parseInt(e.target.value) }))} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
                  <option value="">Select Student *</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
                </select>
                <select value={markForm.courseId || ""} onChange={e => setMarkForm(p => ({ ...p, courseId: parseInt(e.target.value) }))} className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
                  <option value="">Select Course *</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.courseName}</option>)}
                </select>
                <input value={markForm.subject ?? ""} onChange={e => setMarkForm(p => ({ ...p, subject: e.target.value }))} placeholder="Subject / Module" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                <input value={markForm.mark ?? ""} onChange={e => setMarkForm(p => ({ ...p, mark: parseFloat(e.target.value) || undefined }))} placeholder="Mark (0-100)" type="number" min="0" max="100" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                <input value={markForm.grade ?? ""} onChange={e => setMarkForm(p => ({ ...p, grade: e.target.value }))} placeholder="Grade (A, B, C...)" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
                <input value={markForm.remarks ?? ""} onChange={e => setMarkForm(p => ({ ...p, remarks: e.target.value }))} placeholder="Remarks" className="border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2">
                <button onClick={saveMark} className="px-4 py-2 bg-red-700 text-white rounded-xl text-sm font-bold">Save Mark</button>
                <button onClick={() => setShowMarkForm(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Student", "Course", "Subject", "Mark", "Grade", "Remarks", ""].map(h => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {marks.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-800 text-sm">{(m as any).studentName ?? m.studentId}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{(m as any).courseName ?? m.courseId}</td>
                    <td className="py-3 px-4 text-gray-600">{m.subject ?? "—"}</td>
                    <td className="py-3 px-4"><span className="font-bold text-gray-900">{m.mark ?? "—"}</span></td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">{m.grade ?? "—"}</span></td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{m.remarks ?? "—"}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => deleteMark(m.id!)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {marks.length === 0 && <div className="text-center py-12 text-gray-400">No marks recorded yet.</div>}
          </div>
        </div>
      ) : null;

      default: return null;
    }
  };

  return (
    <div className="industrial-page flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-gray-900 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 flex flex-col lg:hidden transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <BarChart3 className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-900 capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-3">
            {loading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
            <button onClick={fetchAll} className="text-xs text-gray-400 hover:text-gray-600 font-medium">Refresh</button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold text-sm">
                {adminData?.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">{adminData?.username}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderTab()}
        </main>
      </div>

      {/* Material Upload Modal */}
      {showMaterialForm && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{editingMaterial ? "Edit Course Resource" : "Add Course Resource"}</h3>
              <button onClick={() => setShowMaterialForm(false)} className="p-2 rounded-xl hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <select value={materialForm.courseId} onChange={e => setMaterialForm(p => ({ ...p, courseId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
                <option value="">Select Course *</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.courseName}</option>)}
              </select>
              <input value={materialForm.title} onChange={e => setMaterialForm(p => ({ ...p, title: e.target.value }))}
                placeholder="Material Title *" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              <textarea value={materialForm.description} onChange={e => setMaterialForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Description (optional)" rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" />
              {!editingMaterial && <input value={materialForm.linkUrl} onChange={e => setMaterialForm(p => ({ ...p, linkUrl: e.target.value }))}
                placeholder="External link (e.g. Google Form URL)" type="url" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />}
              {!editingMaterial && <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">File (PDF, Word, PowerPoint)</label>
                {!materialFile ? (
                  <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition-all">
                    <Upload className="w-7 h-7 text-gray-300 mb-2" />
                    <span className="text-sm text-gray-500">Click to select file (or add a link above)</span>
                    <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png" className="hidden" onChange={e => setMaterialFile(e.target.files?.[0] ?? null)} />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-sm text-gray-700 truncate">{materialFile.name}</span>
                    <button onClick={() => setMaterialFile(null)} className="text-red-500"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </div>}
              <div className="flex gap-2 pt-2">
                <button onClick={saveMaterial} className="flex-1 py-2.5 bg-red-700 text-white rounded-xl font-bold text-sm hover:bg-red-800">{editingMaterial ? "Save changes" : "Add resource"}</button>
                <button onClick={() => { setShowMaterialForm(false); setEditingMaterial(null); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium transition-all ${toast.type === "success" ? "bg-gray-900" : "bg-red-600"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
