import React from "react";
import { useParams, Link } from "react-router-dom";
import { coursesData } from "../data/coursesData";
import { ArrowLeft, CheckCircle2, Clock, BookOpen, Briefcase, Award } from "lucide-react";

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = coursesData.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="industrial-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <Link to="/courses" className="text-red-700 hover:underline">
            Return to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="industrial-page min-h-screen px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1500px] space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#761421] via-[#a91f30] to-[#c54a4b] p-7 text-white shadow-2xl shadow-red-950/20 sm:p-12 lg:p-16">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-5xl space-y-6">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/10 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/15"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Courses
            </Link>
            <div>
              {course.code && (
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-50 backdrop-blur-md">
                  {course.code}
                </span>
              )}
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                {course.title}
              </h1>
            </div>
            <p className="max-w-4xl rounded-2xl border border-white/15 bg-black/15 p-4 text-base font-medium leading-relaxed text-red-50 shadow-inner sm:text-lg">
              {course.occupationalDefinition}
            </p>
            <div className="pt-4">
              <Link
                to={`/apply?preference=${encodeURIComponent(course.title)}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-red-800 shadow-md transition-all hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-lg"
              >
                Apply Now <BookOpen className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {course.keyResponsibilities && course.keyResponsibilities.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-300/20 sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-slate-900">
                  <Briefcase className="w-6 h-6 text-red-700" /> Key Responsibilities
                </h2>
                <ul className="space-y-3">
                  {course.keyResponsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.qualificationPackaging && (course.qualificationPackaging.coreUnits.length > 0) && (
              <div className="space-y-8 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-300/20 sm:p-8">
                <h2 className="flex items-center gap-2 text-2xl font-black text-slate-900">
                  <Award className="w-6 h-6 text-red-700" /> Qualification Packaging
                </h2>
                
                <div>
                  <h3 className="mb-4 rounded-xl border border-red-100 bg-red-50 p-2.5 text-base font-bold text-red-900">Core Units</h3>
                  <ul className="space-y-3 px-2">
                    {course.qualificationPackaging.coreUnits.map((unit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm font-medium">{unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {course.qualificationPackaging.basicUnits && course.qualificationPackaging.basicUnits.length > 0 && (
                  <div>
                    <h3 className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-2.5 text-base font-bold text-blue-900">Basic Units</h3>
                    <ul className="space-y-3 px-2">
                      {course.qualificationPackaging.basicUnits.map((unit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm font-medium">{unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {course.modules && course.modules.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-300/20 sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-black text-slate-900">
                  <BookOpen className="w-6 h-6 text-red-700" /> Training Curriculum Modules
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/80">
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tl-xl">Code</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Module Title</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right rounded-tr-xl">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {course.modules.map((mod, idx) => (
                        <tr key={idx} className="transition-colors hover:bg-red-50/40">
                          <td className="py-3 px-4 text-sm font-semibold text-gray-700">{mod.code}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{mod.name}</td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">{mod.hours}h</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-red-100 bg-red-50/70 font-bold">
                        <td className="py-3 px-4 text-sm text-gray-800" colSpan={2}>Total Hours</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">
                          {course.modules.reduce((acc, curr) => acc + curr.hours, 0)}h
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {course.careerPaths && course.careerPaths.length > 0 && (
              <div className="rounded-3xl border border-slate-700 bg-gradient-to-br from-[#17212b] via-[#223746] to-[#31505c] p-6 text-white shadow-xl shadow-slate-900/20 sm:p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" /> Career Progression Paths
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-600 before:to-transparent">
                  {course.careerPaths.map((path, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-slate-700 bg-amber-400 text-slate-900 shadow md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-[calc(100%-2.5rem)] rounded-xl border border-white/10 bg-white/10 p-3 text-sm font-medium text-slate-100 shadow-sm transition-colors group-hover:border-white/30 md:w-[calc(50%-1.5rem)]">
                        {path}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-6 shadow-lg shadow-red-900/5">
               <h3 className="mb-2 text-lg font-black text-red-950">Need More Information?</h3>
               <p className="mb-4 text-sm leading-relaxed text-red-800">Contact our training center for detailed curriculum inquiries or admission guidelines.</p>
               <div className="text-sm font-bold text-red-900">Hotline: 1951</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
