import React from "react";
import { useParams, Link } from "react-router-dom";
import { coursesData } from "../data/coursesData";
import { ArrowLeft, CheckCircle2, Clock, BookOpen, Briefcase, Award } from "lucide-react";

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = coursesData.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-800 via-red-700 to-red-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-6">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-semibold border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Courses
            </Link>
            <div>
              {course.code && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-red-100 border border-white/20 uppercase tracking-wider">
                  {course.code}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                {course.title}
              </h1>
            </div>
            <p className="text-red-100 text-base sm:text-lg leading-relaxed font-medium bg-red-900/30 p-4 rounded-2xl border border-red-500/20 shadow-inner">
              {course.occupationalDefinition}
            </p>
            <div className="pt-4">
              <Link
                to={`/apply?preference=${encodeURIComponent(course.title)}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-red-800 font-bold hover:bg-red-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-base"
              >
                Apply Now <BookOpen className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {course.keyResponsibilities && course.keyResponsibilities.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
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
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-6 h-6 text-red-700" /> Qualification Packaging
                </h2>
                
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-200">Core Units</h3>
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
                    <h3 className="text-base font-bold text-gray-800 mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-200">Basic Units</h3>
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
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <BookOpen className="w-6 h-6 text-red-700" /> Training Curriculum Modules
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tl-xl">Code</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Module Title</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right rounded-tr-xl">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {course.modules.map((mod, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-4 text-sm font-semibold text-gray-700">{mod.code}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{mod.name}</td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">{mod.hours}h</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50/80 font-bold border-t-2 border-gray-200">
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
              <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-8 shadow-lg text-white border border-gray-700">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" /> Career Progression Paths
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-600 before:to-transparent">
                  {course.careerPaths.map((path, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-800 bg-gray-900 group-[.is-active]:bg-yellow-400 text-gray-500 group-[.is-active]:text-gray-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-gray-800 p-3 rounded-xl border border-gray-700 shadow-sm text-sm font-medium text-gray-200 group-hover:border-gray-500 transition-colors">
                        {path}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
               <h3 className="text-lg font-bold text-red-900 mb-2">Need More Information?</h3>
               <p className="text-sm text-red-700 mb-4">Contact our training center for detailed curriculum inquiries or admission guidelines.</p>
               <div className="text-sm font-semibold text-red-800">Hotline: 1951</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
