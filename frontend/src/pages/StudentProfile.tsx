import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, IdCard, ArrowLeft, LogOut, Camera, MapPin, Phone, CalendarDays,
  GraduationCap, BriefcaseBusiness, Trophy, Users, FileText, ShieldCheck,
  Loader2, ExternalLink, CheckCircle2, AlertCircle
} from "lucide-react";

const API = "http://localhost:5000/api";
const FILES = "http://localhost:5000";

interface Application {
  fullName?: string; nameWithInitials?: string; address?: string; district?: string;
  mobile?: string; landline?: string; dob?: string; gender?: string; civilStatus?: string;
  nic?: string; traineeNumber?: string; personalEmail?: string; olYear?: string;
  olResultsJSON?: string; alYear?: string; alStream?: string; alResultsJSON?: string;
  trainingPreference?: string; workExperienceJSON?: string; specialAchievements?: string;
  sportsAchievements?: string; refereesJSON?: string; cvDriveLink?: string;
}
interface StudentData {
  id: number; email: string; name?: string; studentId?: string; enrolledCourse?: string;
  photoUrl?: string; application?: Application | null;
}

function text(value?: string) {
  if (!value?.trim()) return "Not provided";
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") {
      const entries = Array.isArray(parsed) ? parsed : [parsed];
      return entries.map(item => {
        if (item && typeof item === "object") {
          return Object.entries(item).map(([key, val]) => `${key}: ${String(val)}`).join(" • ");
        }
        return String(item);
      }).join(" | ");
    }
  } catch { /* regular text */ }
  return value;
}
function date(value?: string) { return value ? new Date(value).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" }) : "Not provided"; }

function Detail({ label, value, icon: Icon }: { label: string; value?: string; icon: typeof User }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-red-50 p-2.5 text-red-700"><Icon className="h-5 w-5" /></div>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-1 break-words text-sm font-semibold text-slate-800">{text(value)}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof User; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-red-100 p-2.5 text-red-700"><Icon className="h-5 w-5" /></div>
        <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function StudentProfile() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("studentToken") || sessionStorage.getItem("studentToken");
    const stored = localStorage.getItem("studentData") || sessionStorage.getItem("studentData");
    if (!token || !stored) { navigate("/student"); return; }
    try {
      const basic = JSON.parse(stored) as StudentData;
      fetch(`${API}/students/profile/${basic.id}`)
        .then(async res => { if (!res.ok) throw new Error("Profile unavailable"); return res.json(); })
        .then(setStudent)
        .catch(error => { console.error("Profile fetch error:", error); setStudent(basic); setNotice({ text: "Some application details could not be loaded.", error: true }); })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error parsing student data:", error);
      navigate("/student");
    }
  }, [navigate]);

  const app = student?.application;
  const initials = useMemo(() => (student?.name || app?.nameWithInitials || "S").slice(0, 1).toUpperCase(), [student, app]);
  const logout = () => {
    localStorage.removeItem("studentToken"); localStorage.removeItem("studentData");
    sessionStorage.removeItem("studentToken"); sessionStorage.removeItem("studentData");
    navigate("/login");
  };
  const uploadPhoto = async (file?: File) => {
    if (!file || !student) return;
    setUploading(true); setNotice(null);
    const form = new FormData(); form.append("photo", file);
    try {
      const res = await fetch(`${API}/students/${student.id}/photo`, { method: "POST", body: form });
      const responseText = await res.text();
      let data: { message?: string; photoUrl?: string };
      try {
        data = JSON.parse(responseText) as { message?: string; photoUrl?: string };
      } catch {
        throw new Error(res.ok
          ? "The server returned an invalid response."
          : `Photo upload failed (${res.status}). Please restart the backend server and try again.`);
      }
      if (!res.ok) throw new Error(data.message || "Upload failed");
      if (!data.photoUrl) throw new Error("The server did not return the uploaded photo.");
      setStudent(prev => prev ? { ...prev, photoUrl: data.photoUrl } : prev);
      setNotice({ text: "Profile photo updated successfully." });
    } catch (error) {
      setNotice({ text: error instanceof Error ? error.message : "Unable to upload photo.", error: true });
    } finally { setUploading(false); }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><Loader2 className="h-10 w-10 animate-spin text-red-700" /></div>;
  if (!student) return null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#fee2e2,_transparent_35%),#f8fafc] py-6 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/student/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-red-700"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-700/20 transition hover:bg-red-800"><LogOut className="h-4 w-4" /> Logout</button>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-xl shadow-slate-200/60">
          <div className="relative overflow-hidden bg-gradient-to-br from-red-800 via-red-700 to-rose-600 px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-white/20 text-4xl font-black shadow-xl">
                  {student.photoUrl ? <img src={`${FILES}${student.photoUrl}`} alt="Profile" className="h-full w-full object-cover" /> : initials}
                </div>
                <button onClick={() => inputRef.current?.click()} disabled={uploading} className="absolute -bottom-1 -right-1 rounded-full border-4 border-red-700 bg-white p-2.5 text-red-700 shadow-lg transition hover:bg-red-50" title="Change profile photo">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </button>
                <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => uploadPhoto(e.target.files?.[0])} />
              </div>
              <div className="min-w-0">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-100">Student Profile</p>
                <h1 className="break-words text-2xl font-black sm:text-4xl">Hi {text(student.name || app?.nameWithInitials)}! <span aria-hidden>👋</span></h1>
                <p className="mt-2 text-sm text-red-100">Your Training & Apprenticeship Application profile</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold"><ShieldCheck className="mr-1 inline h-3.5 w-3.5" /> Verified student</span>
                  {student.enrolledCourse && <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold"><GraduationCap className="mr-1 inline h-3.5 w-3.5" /> {student.enrolledCourse}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-10">
            {notice && <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${notice.error ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>{notice.error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />} {notice.text}</div>}
            <Section title="Identity & Contact" icon={User}>
              <div className="grid gap-4 md:grid-cols-2">
                <Detail label="Full name" value={app?.fullName || student.name} icon={User} />
                <Detail label="Name with initials" value={app?.nameWithInitials || student.name} icon={User} />
                <Detail label="Email address" value={app?.personalEmail || student.email} icon={Mail} />
                <Detail label="Student / Trainee number" value={app?.traineeNumber || student.studentId} icon={IdCard} />
                <Detail label="NIC number" value={app?.nic} icon={IdCard} />
                <Detail label="Mobile number" value={app?.mobile} icon={Phone} />
                <Detail label="Landline number" value={app?.landline} icon={Phone} />
                <Detail label="Date of birth" value={date(app?.dob)} icon={CalendarDays} />
                <Detail label="Gender" value={app?.gender} icon={User} />
                <Detail label="Civil status" value={app?.civilStatus} icon={User} />
                <Detail label="District" value={app?.district} icon={MapPin} />
                <Detail label="Address" value={app?.address} icon={MapPin} />
              </div>
            </Section>

            <Section title="Training & Apprenticeship Application" icon={GraduationCap}>
              <div className="grid gap-4 md:grid-cols-2">
                <Detail label="Preferred training course" value={app?.trainingPreference || student.enrolledCourse} icon={GraduationCap} />
                <Detail label="Current enrolled course" value={student.enrolledCourse} icon={GraduationCap} />
              </div>
            </Section>

            <Section title="Education" icon={FileText}>
              <div className="grid gap-4 md:grid-cols-2">
                <Detail label="G.C.E. O/L year" value={app?.olYear} icon={FileText} />
                <Detail label="G.C.E. O/L results" value={app?.olResultsJSON} icon={FileText} />
                <Detail label="G.C.E. A/L year" value={app?.alYear} icon={FileText} />
                <Detail label="A/L stream" value={app?.alStream} icon={GraduationCap} />
                <Detail label="G.C.E. A/L results" value={app?.alResultsJSON} icon={FileText} />
              </div>
            </Section>

            <Section title="Experience & Achievements" icon={BriefcaseBusiness}>
              <div className="grid gap-4 md:grid-cols-2">
                <Detail label="Work experience" value={app?.workExperienceJSON} icon={BriefcaseBusiness} />
                <Detail label="Special achievements" value={app?.specialAchievements} icon={Trophy} />
                <Detail label="Sports achievements" value={app?.sportsAchievements} icon={Trophy} />
                <Detail label="Referees" value={app?.refereesJSON} icon={Users} />
              </div>
              {app?.cvDriveLink && <a href={app.cvDriveLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-800"><ExternalLink className="h-4 w-4" /> View submitted CV</a>}
            </Section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
              <Link to="/student/dashboard" className="flex-1 rounded-xl bg-slate-100 px-6 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-200">Go to Dashboard</Link>
              <button onClick={logout} className="flex-1 rounded-xl bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800">Sign out securely</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
