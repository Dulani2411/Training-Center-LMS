import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Send,
  User,
  GraduationCap,
  Briefcase,
  FileCheck2,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  FileText,
  HelpCircle,
  Upload,
  X
} from "lucide-react";


interface Course {
  id?: number;
  courseName: string;
  status?: string;
}

const SRI_LANKA_DISTRICTS = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
  "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
  "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const AL_STREAMS = [
  "Physical Science (Maths)",
  "Biological Science (Bio)",
  "Technology (Engineering/Bio Tech)",
  "Commerce",
  "Arts",
  "Other / Vocational"
];

const GRADE_OPTIONS = ["A", "B", "C", "S", "W", "Pass", "Credit", "Distinction"];

const API_URL = "http://localhost:5000/api";

const ApplyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedCourse = searchParams.get("preference") || "";

  const [activeStep, setActiveStep] = useState<number>(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // CV File Upload state (Optional, PDF only)
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileError, setCvFileError] = useState<string>("");

  // Real-time Field Errors
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    nameWithInitials?: string;
    traineeNumber?: string;
    mobile?: string;
    personalEmail?: string;
  }>({});

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: "",
    nameWithInitials: "",
    address: "",
    district: "Colombo",
    mobile: "",
    landline: "",
    dob: "",
    gender: "Male",
    civilStatus: "Single",
    nic: "",
    traineeNumber: "",
    personalEmail: "",

    // Step 2: Educational
    olYear: "",
    olResults: [
      { subject: "Mathematics", grade: "A" },
      { subject: "Science", grade: "A" },
      { subject: "English", grade: "B" },
      { subject: "Sinhala / Tamil Language", grade: "A" }
    ],
    alYear: "",
    alStream: "Physical Science (Maths)",
    alResults: [
      { subject: "Combined Mathematics / Biology", grade: "C" },
      { subject: "Physics", grade: "C" },
      { subject: "Chemistry / ICT / Technology", grade: "C" }
    ],

    // Step 3: Training & Experience
    trainingPreference: preselectedCourse || "",
    workExperience: [
      { designation: "", company: "", from: "", to: "" }
    ],
    specialAchievements: "",
    sportsAchievements: "",

    // Step 4: Referees & CV
    referees: [
      { name: "", designation: "", contact: "" },
      { name: "", designation: "", contact: "" }
    ],
    cvDriveLink: ""
  });

  // Fetch active courses to populate training preference dropdown
  useEffect(() => {
    const activeOnes = [
      "Refinery Operation Technician - C11S003",
      "Refinery Engineering Technician(Mechanical)-C11T004",
      "Refinery Engineering Technician(Electrical)",
      "Refinery Engineering Technician(Instrument)-C11S002",
      "Refinery Laboratory Analyst",
      "Industrial Boiler Operator(High Pressure)",
      "Oil and Gas Plant Inspection Technology",
      "6-G Industrial Welder"
    ].map(title => ({ courseName: title }));
    setCourses(activeOnes);
    if (!formData.trainingPreference && activeOnes.length > 0) {
      setFormData((prev) => ({
        ...prev,
        trainingPreference: preselectedCourse || activeOnes[0].courseName
      }));
    }
  }, [preselectedCourse]);

  // Handler for text inputs with real-time validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Trainee Number: numbers only (e.g. 3212) - characters cannot be added
    if (name === "traineeNumber") {
      const numericVal = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericVal }));
      if (numericVal) {
        setFieldErrors((prev) => ({ ...prev, traineeNumber: undefined }));
      }
      return;
    }

    // Full Name: letters and spaces only, no numbers or special characters
    if (name === "fullName") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value.trim() && !/^[A-Za-z\s]+$/.test(value)) {
        setFieldErrors((prev) => ({
          ...prev,
          fullName: "Numbers and special characters are not allowed. Only letters and spaces are allowed.",
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
      }
      return;
    }

    // Name with Initials: letters, dots, and spaces only (e.g. W. N. Fernando)
    if (name === "nameWithInitials") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value.trim() && !/^[A-Za-z\s.]+$/.test(value)) {
        setFieldErrors((prev) => ({
          ...prev,
          nameWithInitials: "Numbers and special characters are not allowed. Only letters, dots, and spaces are allowed (e.g. W. N. Fernando).",
        }));
      } else {
        setFieldErrors((prev) => ({ ...prev, nameWithInitials: undefined }));
      }
      return;
    }

    // Mobile Phone Number: digits only, 10 digits starting with 0
    if (name === "mobile") {
      const numericVal = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericVal }));
      if (numericVal.length === 10 && numericVal.startsWith("0")) {
        setFieldErrors((prev) => ({ ...prev, mobile: undefined }));
      } else if (numericVal.length > 0 && !numericVal.startsWith("0")) {
        setFieldErrors((prev) => ({ ...prev, mobile: "Mobile number must start with 0 (e.g. 0771234567)." }));
      } else if (numericVal.length > 0 && numericVal.length < 10) {
        setFieldErrors((prev) => ({ ...prev, mobile: "Mobile number must be exactly 10 digits." }));
      } else {
        setFieldErrors((prev) => ({ ...prev, mobile: undefined }));
      }
      return;
    }

    // Personal Email / Gmail: valid email format
    if (name === "personalEmail") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value.trim() && !emailRegex.test(value.trim())) {
        setFieldErrors((prev) => ({ ...prev, personalEmail: "Please enter a valid email address (e.g. user@gmail.com)." }));
      } else {
        setFieldErrors((prev) => ({ ...prev, personalEmail: undefined }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // CV PDF file input handler (Optional, PDF only)
  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvFileError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        setCvFileError("Only PDF files are supported (.pdf). Please choose a valid PDF file.");
        setCvFile(null);
        e.target.value = "";
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setCvFileError("File size exceeds 10MB limit. Please choose a smaller PDF file.");
        setCvFile(null);
        e.target.value = "";
        return;
      }

      setCvFile(file);
    }
  };

  // O/L Result Helpers
  const addOlSubject = () => {
    setFormData((prev) => ({
      ...prev,
      olResults: [...prev.olResults, { subject: "", grade: "C" }]
    }));
  };
  const updateOlSubject = (index: number, field: "subject" | "grade", val: string) => {
    setFormData((prev) => {
      const updated = [...prev.olResults];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, olResults: updated };
    });
  };
  const removeOlSubject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      olResults: prev.olResults.filter((_, i) => i !== index)
    }));
  };

  // A/L Result Helpers
  const addAlSubject = () => {
    setFormData((prev) => ({
      ...prev,
      alResults: [...prev.alResults, { subject: "", grade: "C" }]
    }));
  };
  const updateAlSubject = (index: number, field: "subject" | "grade", val: string) => {
    setFormData((prev) => {
      const updated = [...prev.alResults];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, alResults: updated };
    });
  };
  const removeAlSubject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      alResults: prev.alResults.filter((_, i) => i !== index)
    }));
  };

  // Work Experience Helpers
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, { designation: "", company: "", from: "", to: "" }]
    }));
  };
  const updateExperience = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.workExperience];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, workExperience: updated };
    });
  };
  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  // Referee Helpers
  const updateReferee = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.referees];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, referees: updated };
    });
  };

  // Step Validation
  const validateStep = (step: number) => {
    setSubmitError("");
    if (step === 1) {
      if (!formData.fullName.trim()) return "Full Name is required.";
      if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
        return "Full Name cannot contain numbers or special characters. Use English letters and spaces only.";
      }

      if (!formData.nameWithInitials.trim()) return "Name with Initials is required.";
      if (!/^[A-Za-z\s.]+$/.test(formData.nameWithInitials.trim())) {
        return "Name with Initials cannot contain numbers or special characters. Use letters, dots, and spaces only (e.g. W. N. Fernando).";
      }

      if (!formData.traineeNumber.trim()) return "Trainee Number is required.";
      if (!/^\d+$/.test(formData.traineeNumber.trim())) {
        return "Trainee Number must contain numbers only (e.g. 3212). Characters are not allowed.";
      }

      if (!formData.nic.trim()) return "National Identity Card (NIC) is required.";
      if (!formData.dob) return "Date of Birth is required.";

      // Mobile Phone Number validation (required, 10 digits starting with 0)
      if (!formData.mobile.trim()) return "Mobile Phone Number is required.";
      const cleanMobile = formData.mobile.trim().replace(/[\s-]/g, "");
      if (!/^0\d{9}$/.test(cleanMobile)) {
        return "Please enter a valid 10-digit mobile number starting with 0 (e.g. 0771234567).";
      }

      // Personal Email / Gmail validation (required, valid email address)
      if (!formData.personalEmail.trim()) return "Personal Email / Gmail is required.";
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.personalEmail.trim())) {
        return "Please enter a valid email address (e.g. nimal@gmail.com).";
      }

      if (!formData.address.trim()) return "Permanent address is required.";
    }
    if (step === 2) {
      if (!formData.olYear.trim()) return "G.C.E. O/L examination year is required.";
      if (formData.olResults.length === 0) return "Please enter at least one O/L subject.";
      if (!formData.alYear.trim()) return "G.C.E. A/L examination year is required.";
    }
    if (step === 3) {
      if (!formData.trainingPreference.trim()) return "Please select a training program / preference.";
    }
    if (step === 4) {
      if (cvFile && !cvFile.name.toLowerCase().endsWith(".pdf")) {
        return "Uploaded CV must be a PDF file (.pdf only).";
      }
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(activeStep);
    if (err) {
      setSubmitError(err);
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }
    setSubmitError("");
    setActiveStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  const handleBack = () => {
    setSubmitError("");
    setActiveStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  // Actual Submit Handler — only called from the Step 4 Submit button (type="button")
  const handleActualSubmit = async () => {
    const err = validateStep(1) || validateStep(2) || validateStep(3) || validateStep(4);
    if (err) {
      setSubmitError(err);
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      let uploadedCvUrl: string | null = null;

      // Upload CV if a PDF file was selected (Optional)
      if (cvFile) {
        const fileData = new FormData();
        fileData.append("cv", cvFile);

        const uploadRes = await fetch(`${API_URL}/applications/upload-cv`, {
          method: "POST",
          body: fileData
        });

        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json();
          throw new Error(uploadErr.message || "Failed to upload CV file.");
        }

        const uploadJson = await uploadRes.json();
        uploadedCvUrl = uploadJson.url;
      }

      // Map O/L and A/L array to object
      const olResultsObj: Record<string, string> = {};
      formData.olResults.forEach((item) => {
        if (item.subject.trim()) {
          olResultsObj[item.subject.trim()] = item.grade;
        }
      });

      const alResultsObj: Record<string, string> = {};
      formData.alResults.forEach((item) => {
        if (item.subject.trim()) {
          alResultsObj[item.subject.trim()] = item.grade;
        }
      });

      const payload = {
        fullName: formData.fullName.trim(),
        nameWithInitials: formData.nameWithInitials.trim(),
        address: formData.address.trim(),
        district: formData.district,
        mobile: formData.mobile.trim(),
        landline: formData.landline || null,
        dob: formData.dob,
        gender: formData.gender,
        civilStatus: formData.civilStatus,
        nic: formData.nic.trim(),
        traineeNumber: formData.traineeNumber.trim(),
        personalEmail: formData.personalEmail ? formData.personalEmail.trim() : null,
        olYear: formData.olYear,
        olResults: olResultsObj,
        alYear: formData.alYear,
        alStream: formData.alStream,
        alResults: alResultsObj,
        trainingPreference: formData.trainingPreference,
        workExperience: formData.workExperience.filter((w) => w.company.trim() || w.designation.trim()),
        specialAchievements: formData.specialAchievements || null,
        sportsAchievements: formData.sportsAchievements || null,
        referees: formData.referees.filter((r) => r.name.trim()),
        cvDriveLink: uploadedCvUrl || null
      };

      const res = await fetch(`${API_URL}/applications/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit application.");
      }

      setSubmittedSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Error submitting application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="industrial-page relative min-h-screen overflow-hidden px-3 py-6 sm:px-6 sm:py-10 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(15,31,38,0.94),rgba(89,29,35,0.86)_52%,rgba(20,43,49,0.92))]" />
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-red-700/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-amber-500/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1250px] space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center text-white">
          <span className="inline-flex items-center rounded-full border border-red-200/30 bg-red-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-100 backdrop-blur-sm">
            Official Application Portal
          </span>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Training & Apprenticeship Application
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-200">
            Ceylon Petroleum Corporation Training Center — Sapugaskanda Refinery. Complete all 4 sections carefully.
          </p>
        </div>

        {/* Success Modal / Card */}
        {submittedSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-green-200 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Application Successfully Submitted!
              </h2>
              <p className="text-gray-600 text-sm max-w-lg mx-auto">
                Thank you, <strong className="text-gray-900">{formData.nameWithInitials}</strong>. Your training application for{" "}
                <span className="text-red-700 font-semibold">{formData.trainingPreference}</span> has been received and logged in the CPC database.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2 text-gray-700">
              <p><strong className="text-gray-900">NIC:</strong> {formData.nic}</p>
              <p><strong className="text-gray-900">Contact:</strong> {formData.mobile}</p>
              <p><strong className="text-gray-900">Training Stream:</strong> {formData.trainingPreference}</p>
              <p><strong className="text-gray-900">Status:</strong> Under Administrative Review</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-700 text-white font-bold text-sm hover:bg-red-800 transition-colors shadow"
              >
                Return to Home
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Print Receipt
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-[#fffdfc] shadow-2xl shadow-black/30">
            {/* Step Progress Indicators */}
            <div className="border-b border-slate-200 bg-[#f1e8e5] p-4 sm:p-6">
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                {[
                  { step: 1, label: "Personal", icon: <User className="w-4 h-4 mx-auto mb-1" /> },
                  { step: 2, label: "Education", icon: <GraduationCap className="w-4 h-4 mx-auto mb-1" /> },
                  { step: 3, label: "Preference", icon: <Briefcase className="w-4 h-4 mx-auto mb-1" /> },
                  { step: 4, label: "Referees & CV", icon: <FileCheck2 className="w-4 h-4 mx-auto mb-1" /> }
                ].map((item) => (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => {
                      if (item.step < activeStep) setActiveStep(item.step);
                    }}
                    className={`py-2 px-1 rounded-xl transition-all ${
                      activeStep === item.step
                        ? "bg-red-700 text-white shadow-sm"
                        : item.step < activeStep
                        ? "text-red-700 hover:bg-red-50"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {item.icon}
                    <span className="hidden sm:inline">Step {item.step}: </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Form Steps */}
            <form
              onSubmit={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                  e.preventDefault();
                  if (activeStep < 4) {
                    handleNext();
                  }
                }
              }}
              className="p-6 sm:p-10 space-y-8"
            >
              {/* STEP 1: Personal Information */}
              {activeStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-red-700" /> 1. Personal Information
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Provide your verified identification details</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Warnakulasuriya Nishantha Fernando"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-colors ${
                          fieldErrors.fullName ? "border-red-500 bg-red-50/20" : "border-gray-300"
                        }`}
                        required
                      />
                      {fieldErrors.fullName ? (
                        <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.fullName}</p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">English letters and spaces only (no numbers or special characters).</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Name with Initials <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="nameWithInitials"
                        value={formData.nameWithInitials}
                        onChange={handleChange}
                        placeholder="e.g. W. N. Fernando"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-colors ${
                          fieldErrors.nameWithInitials ? "border-red-500 bg-red-50/20" : "border-gray-300"
                        }`}
                        required
                      />
                      {fieldErrors.nameWithInitials ? (
                        <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.nameWithInitials}</p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">Letters, dots, and spaces only (e.g. W. N. Fernando).</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        National Identity Card (NIC) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        placeholder="e.g. 200012345678 or 981234567V"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Date of Birth <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                          Civil Status
                        </label>
                        <select
                          name="civilStatus"
                          value={formData.civilStatus}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        District of Residence <span className="text-red-600">*</span>
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                      >
                        {SRI_LANKA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Mobile Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="e.g. 0771234567"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-colors ${
                          fieldErrors.mobile ? "border-red-500 bg-red-50/20" : "border-gray-300"
                        }`}
                        required
                      />
                      {fieldErrors.mobile ? (
                        <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.mobile}</p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">10-digit mobile number starting with 0 (e.g. 0771234567).</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Permanent Address <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. No. 45/A, Sapugaskanda Road, Kelaniya"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none resize-none"
                        required
                      />
                    </div>

                    {/* Trainee Number + Personal Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Trainee Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="traineeNumber"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.traineeNumber}
                        onChange={handleChange}
                        placeholder="e.g. 3212"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-colors ${
                          fieldErrors.traineeNumber ? "border-red-500 bg-red-50/20" : "border-gray-300"
                        }`}
                        required
                      />
                      {fieldErrors.traineeNumber ? (
                        <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.traineeNumber}</p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">Numbers only (e.g. 3212). Letters and special characters are not allowed.</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Personal Email / Gmail <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="personalEmail"
                        value={formData.personalEmail}
                        onChange={handleChange}
                        placeholder="e.g. nimal@gmail.com"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-colors ${
                          fieldErrors.personalEmail ? "border-red-500 bg-red-50/20" : "border-gray-300"
                        }`}
                        required
                      />
                      {fieldErrors.personalEmail ? (
                        <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.personalEmail}</p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">Active email address for notices & login credentials.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Educational Qualifications */}
              {activeStep === 2 && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-red-700" /> 2. Educational Qualifications
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">G.C.E. O/L and G.C.E. A/L Examination Results</p>
                  </div>

                  {/* G.C.E. O/L */}
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">G.C.E. Ordinary Level (O/L)</h3>
                        <p className="text-xs text-gray-500">Provide subjects and grades obtained</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-700">Exam Year:</label>
                        <input
                          type="text"
                          name="olYear"
                          value={formData.olYear}
                          onChange={handleChange}
                          placeholder="e.g. 2021"
                          className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {formData.olResults.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Subject Name"
                            value={item.subject}
                            onChange={(e) => updateOlSubject(idx, "subject", e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                          />
                          <select
                            value={item.grade}
                            onChange={(e) => updateOlSubject(idx, "grade", e.target.value)}
                            className="w-28 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                          >
                            {GRADE_OPTIONS.map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeOlSubject(idx)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addOlSubject}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-100/60 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Subject
                    </button>
                  </div>

                  {/* G.C.E. A/L */}
                  <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">G.C.E. Advanced Level (A/L)</h3>
                        <p className="text-xs text-gray-500">Provide examination stream and results</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-gray-700">Exam Year:</label>
                        <input
                          type="text"
                          name="alYear"
                          value={formData.alYear}
                          onChange={handleChange}
                          placeholder="e.g. 2023"
                          className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">A/L Study Stream</label>
                      <select
                        name="alStream"
                        value={formData.alStream}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white"
                      >
                        {AL_STREAMS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      {formData.alResults.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Subject Name"
                            value={item.subject}
                            onChange={(e) => updateAlSubject(idx, "subject", e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                          />
                          <select
                            value={item.grade}
                            onChange={(e) => updateAlSubject(idx, "grade", e.target.value)}
                            className="w-28 px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                          >
                            {GRADE_OPTIONS.map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeAlSubject(idx)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addAlSubject}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-100/60 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add A/L Subject
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Training Preference & Experience */}
              {activeStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-red-700" /> 3. Training Preference & Experience
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Choose your trade preference and background</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                      Training Preference / Program <span className="text-red-600">*</span>
                    </label>
                    {courses.length > 0 ? (
                      <select
                        name="trainingPreference"
                        value={formData.trainingPreference}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                        required
                      >
                        {courses.map((c) => (
                          <option key={c.id || c.courseName} value={c.courseName}>
                            {c.courseName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="trainingPreference"
                        value={formData.trainingPreference}
                        onChange={handleChange}
                        placeholder="e.g. Refinery Operation Technician / Mechanical Apprentice"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                        required
                      />
                    )}
                  </div>

                  {/* Work Experience */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Prior Technical / Work Experience</h3>
                        <p className="text-xs text-gray-500">Optional: If you have undertaken any industry training</p>
                      </div>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="px-3 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Experience
                      </button>
                    </div>

                    {formData.workExperience.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Company / Institution</label>
                            <input
                              type="text"
                              placeholder="e.g. Ceylon Electricity Board"
                              value={exp.company}
                              onChange={(e) => updateExperience(idx, "company", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Designation / Role</label>
                            <input
                              type="text"
                              placeholder="e.g. Trainee Technician"
                              value={exp.designation}
                              onChange={(e) => updateExperience(idx, "designation", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                            <input
                              type="text"
                              placeholder="e.g. Jan 2023"
                              value={exp.from}
                              onChange={(e) => updateExperience(idx, "from", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                            <input
                              type="text"
                              placeholder="e.g. Dec 2023"
                              value={exp.to}
                              onChange={(e) => updateExperience(idx, "to", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Special Academic / Technical Achievements
                      </label>
                      <textarea
                        name="specialAchievements"
                        rows={3}
                        value={formData.specialAchievements}
                        onChange={handleChange}
                        placeholder="e.g. Won 1st place in National School Science Exhibition..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                        Sports & Extracurricular Activities
                      </label>
                      <textarea
                        name="sportsAchievements"
                        rows={3}
                        value={formData.sportsAchievements}
                        onChange={handleChange}
                        placeholder="e.g. School Cricket Captain / Athletics Colorsman..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Referees & CV Link */}
              {activeStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-red-700" /> 4. Non-Related Referees & CV Upload
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Provide two reputable referees and your curriculum vitae</p>
                  </div>

                  {/* Two Referees */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {formData.referees.map((ref, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                        <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded">
                          Referee #{idx + 1}
                        </span>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Mr. K. Perera"
                            value={ref.name}
                            onChange={(e) => updateReferee(idx, "name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Designation & Institution</label>
                          <input
                            type="text"
                            placeholder="e.g. Principal / Senior Engineer"
                            value={ref.designation}
                            onChange={(e) => updateReferee(idx, "designation", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Phone Number</label>
                          <input
                            type="tel"
                            placeholder="e.g. 0719876543"
                            value={ref.contact}
                            onChange={(e) => updateReferee(idx, "contact", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CV File Upload (PDF Only, Optional) */}
                  <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
                        Curriculum Vitae (CV) <span className="text-gray-400 font-normal normal-case">(PDF format only)</span>
                      </label>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">
                        Optional
                      </span>
                    </div>

                    {!cvFile ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white hover:bg-red-50/30 hover:border-red-400 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                          <Upload className="w-8 h-8 mb-2 text-gray-400 group-hover:text-red-600 transition-colors" />
                          <p className="text-sm font-medium text-gray-700">
                            <span className="text-red-700 font-semibold underline underline-offset-2">Click to select PDF</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Only .pdf files are accepted (Max 10MB)</p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={handleCvFileChange}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs uppercase shadow-sm">
                            PDF
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{cvFile.name}</p>
                            <p className="text-xs text-gray-400">
                              {(cvFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCvFile(null);
                            setCvFileError("");
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove file"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {cvFileError && (
                      <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {cvFileError}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      Uploading a CV is optional. If you choose to upload, it must be in PDF format.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                {activeStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous Step
                  </button>
                ) : (
                  <div></div>
                )}

                {activeStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-700 text-white font-bold text-sm hover:bg-red-800 transition-colors shadow-md hover:shadow"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleActualSubmit}
                    disabled={submitting}
                    className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-red-700 text-white font-bold text-sm hover:bg-red-800 transition-all shadow-lg hover:shadow-xl ${
                      submitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyPage;
