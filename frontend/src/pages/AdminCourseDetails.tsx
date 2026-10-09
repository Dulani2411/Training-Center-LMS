import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, BookOpen, CheckCircle2, FileText, Link2, Loader2, Pencil,
  Plus, Save, Trash2, Upload, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RichTextEditor, { RichTextContent } from "../components/RichTextEditor";

const API = "http://localhost:5000/api";

interface Course {
  id: number;
  courseName: string;
  description?: string;
  duration?: string;
  status?: "ACTIVE" | "INACTIVE";
}

interface Material {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  fileUrl?: string;
  linkUrl?: string;
  fileName?: string;
}

const AdminCourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { adminData } = useAuth();
  const isAdmin = adminData?.role === "admin";
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCourse, setEditingCourse] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [courseForm, setCourseForm] = useState({ courseName: "", description: "", duration: "", status: "ACTIVE" });
  const [materialForm, setMaterialForm] = useState({ title: "", description: "", linkUrl: "" });

  const showNotice = (text: string, error = false) => {
    setNotice({ text, error });
    window.setTimeout(() => setNotice(null), 3500);
  };

  const load = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const [courseResponse, materialsResponse] = await Promise.all([
        fetch(`${API}/courses/${courseId}`),
        fetch(`${API}/materials?courseId=${courseId}`),
      ]);
      if (!courseResponse.ok) throw new Error("Course not found.");
      const courseData = await courseResponse.json() as Course;
      setCourse(courseData);
      setCourseForm({
        courseName: courseData.courseName,
        description: courseData.description ?? "",
        duration: courseData.duration ?? "",
        status: courseData.status ?? "ACTIVE",
      });
      setMaterials(await materialsResponse.json() as Material[]);
    } catch (error) {
      showNotice(error instanceof Error ? error.message : "Unable to load course.", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [courseId]);

  const saveCourse = async () => {
    if (!course || !courseForm.courseName.trim()) return showNotice("Course name is required.", true);
    setSaving(true);
    const response = await fetch(`${API}/courses/${course.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(courseForm),
    });
    setSaving(false);
    if (!response.ok) return showNotice("Course update failed.", true);
    showNotice("Course updated successfully.");
    setEditingCourse(false);
    load();
  };

  const deleteCourse = async () => {
    if (!course || !window.confirm("Delete this course and its management entry?")) return;
    const response = await fetch(`${API}/courses/${course.id}`, { method: "DELETE" });
    if (!response.ok) return showNotice("Course deletion failed.", true);
    navigate("/admin/dashboard");
  };

  const openNewMaterial = () => {
    setEditingMaterial(null);
    setFile(null);
    setMaterialForm({ title: "", description: "", linkUrl: "" });
    setShowMaterialForm(true);
  };

  const openMaterialEditor = (material: Material) => {
    setEditingMaterial(material);
    setFile(null);
    setMaterialForm({ title: material.title, description: material.description ?? "", linkUrl: material.linkUrl ?? "" });
    setShowMaterialForm(true);
  };

  const saveMaterial = async () => {
    if (!course || !materialForm.title.trim()) return showNotice("Resource title is required.", true);
    setSaving(true);
    let response: Response;
    if (editingMaterial) {
      const form = new FormData();
      form.append("title", materialForm.title);
      form.append("description", materialForm.description);
      form.append("linkUrl", materialForm.linkUrl);
      if (file) form.append("file", file);
      response = await fetch(`${API}/materials/${editingMaterial.id}`, { method: "PUT", body: form });
    } else {
      if (!file && !materialForm.linkUrl.trim()) {
        setSaving(false);
        return showNotice("Select a file or add an external link.", true);
      }
      const form = new FormData();
      form.append("courseId", String(course.id));
      form.append("title", materialForm.title);
      form.append("description", materialForm.description);
      form.append("linkUrl", materialForm.linkUrl);
      form.append("uploadedBy", adminData?.username ?? "Superadmin");
      if (file) form.append("file", file);
      response = await fetch(`${API}/materials`, { method: "POST", body: form });
    }
    setSaving(false);
    if (!response.ok) return showNotice(editingMaterial ? "Resource update failed." : "Resource add failed.", true);
    showNotice(editingMaterial ? "Resource updated successfully." : "Resource added successfully.");
    setShowMaterialForm(false);
    setEditingMaterial(null);
    load();
  };

  const deleteMaterial = async (material: Material) => {
    if (!window.confirm(`Delete "${material.title}"?`)) return;
    const response = await fetch(`${API}/materials/${material.id}`, { method: "DELETE" });
    if (!response.ok) return showNotice("Resource deletion failed.", true);
    showNotice("Resource deleted successfully.");
    load();
  };

  if (loading) return <div className="industrial-page flex min-h-[calc(100vh-73px)] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-red-700" /></div>;
  if (!course) return <div className="industrial-page flex min-h-[calc(100vh-73px)] items-center justify-center"><div className="text-center"><p className="font-bold text-slate-800">Course not found.</p><Link to="/admin/dashboard?tab=courses" className="mt-3 inline-block text-sm font-bold text-red-700">Back to courses</Link></div></div>;

  return (
    <div className="industrial-page min-h-[calc(100vh-73px)] px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1500px] space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-red-700">Admin portal / Courses / Course details</p>
            <button onClick={() => navigate("/admin/dashboard?tab=courses")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"><ArrowLeft className="h-4 w-4" /> Back to courses</button>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${course.status === "INACTIVE" ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-700"}`}>{course.status ?? "ACTIVE"}</span>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-2xl shadow-slate-400/20">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#741521] via-[#a91f2d] to-[#d04b4a] p-8 text-white sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border-[42px] border-white/10" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="rounded-2xl bg-white/15 p-3"><BookOpen className="h-8 w-8" /></div>
                <div><p className="text-xs font-extrabold uppercase tracking-widest text-red-100">Course management</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">{course.courseName}</h1><p className="mt-3 text-sm font-medium text-red-100">{course.duration || "Training programme"} · {materials.length} resources</p></div>
              </div>
              {isAdmin && <div className="flex gap-2"><button onClick={() => setEditingCourse(true)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-red-800 hover:bg-red-50"><Pencil className="h-4 w-4" /> Edit course</button><button onClick={deleteCourse} className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-black/15 px-4 py-2.5 text-sm font-bold text-white hover:bg-black/25"><Trash2 className="h-4 w-4" /> Delete</button></div>}
            </div>
          </div>
          <div className="grid gap-6 border-t border-slate-100 p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">Course description</p>
              <div className="max-w-4xl text-base leading-8 text-slate-600">{course.description ? <RichTextContent value={course.description} /> : "No course description has been added yet."}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-red-50 p-4"><p className="text-2xl font-black text-red-700">{materials.length}</p><p className="mt-1 text-xs font-bold text-slate-500">Resources</p></div>
              <div className="rounded-2xl bg-slate-100 p-4"><p className="truncate text-lg font-black text-slate-800">{course.duration || "—"}</p><p className="mt-1 text-xs font-bold text-slate-500">Duration</p></div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-400/15 sm:p-10 lg:p-12">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black text-slate-900">Course resources</h2><p className="mt-1 text-sm text-slate-500">Review every file and link assigned to this course.</p></div>{isAdmin && <button onClick={openNewMaterial} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9f1d2b] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-700/15 hover:bg-[#7f1822]"><Plus className="h-4 w-4" /> Add resource</button>}</div>
          {materials.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center"><FileText className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 font-bold text-slate-600">No resources added yet</p><p className="mt-1 text-sm text-slate-400">Add a PDF, document, presentation, or external link.</p></div> : <div className="grid gap-4 lg:grid-cols-2">{materials.map(material => <article key={material.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-red-200 hover:bg-red-50/30"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 gap-3"><div className="rounded-xl bg-white p-2.5 text-red-700 shadow-sm">{material.linkUrl ? <Link2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}</div><div className="min-w-0"><a href={material.linkUrl || `http://localhost:5000${material.fileUrl}`} target="_blank" rel="noreferrer" className="block truncate font-extrabold text-blue-700 hover:underline">{material.title}</a>{material.description ? <RichTextContent value={material.description} className="mt-1 line-clamp-2 text-xs text-slate-500" /> : <p className="mt-1 text-xs text-slate-500">{material.fileName || (material.linkUrl ? "External link" : "Uploaded file")}</p>}</div></div>{isAdmin && <div className="flex gap-1"><button onClick={() => openMaterialEditor(material)} className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-blue-700" aria-label="Edit resource"><Pencil className="h-4 w-4" /></button><button onClick={() => deleteMaterial(material)} className="rounded-lg p-2 text-slate-500 hover:bg-red-100 hover:text-red-700" aria-label="Delete resource"><Trash2 className="h-4 w-4" /></button></div>}</div><a href={material.linkUrl || `http://localhost:5000${material.fileUrl}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:underline">Review resource <CheckCircle2 className="h-3.5 w-3.5" /></a></article>)}</div>}
        </section>
      </div>

      {editingCourse && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"><div className="my-8 w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black text-slate-900">Edit course</h2><button onClick={() => setEditingCourse(false)}><X /></button></div><div className="space-y-4"><input value={courseForm.courseName} onChange={e => setCourseForm({ ...courseForm, courseName: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" placeholder="Course name" /><input value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" placeholder="Duration" /><div><label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Course description / important notices</label><RichTextEditor value={courseForm.description} onChange={description => setCourseForm({ ...courseForm, description })} placeholder="Add course details, deadlines, or important notices..." /></div><select value={courseForm.status} onChange={e => setCourseForm({ ...courseForm, status: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select><button onClick={saveCourse} disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 py-3 font-bold text-white">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save course</button></div></div></div>}
      {showMaterialForm && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"><div className="my-8 w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black text-slate-900">{editingMaterial ? "Edit resource" : "Add resource"}</h2><button onClick={() => setShowMaterialForm(false)}><X /></button></div><div className="space-y-4"><input value={materialForm.title} onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" placeholder="Resource title / topic" /><div><label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">Topic description / notice</label><RichTextEditor value={materialForm.description} onChange={description => setMaterialForm({ ...materialForm, description })} placeholder="Add details, deadlines, or important student notices..." minHeight="120px" /></div><input value={materialForm.linkUrl} onChange={e => setMaterialForm({ ...materialForm, linkUrl: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" placeholder="Google Form or external link (optional)" type="url" /><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 text-sm font-bold text-slate-500 hover:border-red-300 hover:bg-red-50"><Upload className="h-5 w-5" />{file ? file.name : editingMaterial?.fileName ? `Replace file (${editingMaterial.fileName})` : "Choose PDF, Word, PowerPoint, or image"}<input type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label><button onClick={saveMaterial} disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 py-3 font-bold text-white">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {editingMaterial ? "Save changes" : "Add resource"}</button></div></div></div>}
      {notice && <div className={`fixed bottom-6 right-6 z-[60] rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-xl ${notice.error ? "bg-red-600" : "bg-slate-900"}`}>{notice.text}</div>}
    </div>
  );
};

export default AdminCourseDetails;
