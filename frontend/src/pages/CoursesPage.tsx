import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, ArrowRight, ChevronDown, ChevronUp, Info, Award, Users, BookMarked, Briefcase, CheckCircle2, Clock3 } from "lucide-react";
import { coursesData } from "../data/coursesData";

const CoursesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("course-content");

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
  };

  const AccordionHeader = ({ title, id, icon: Icon }: { title: string, id: string, icon: React.ElementType }) => (
    <button
      onClick={() => toggleSection(id)}
      className={`group w-full flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 transition-all focus:outline-none ${
        activeSection === id ? "bg-red-50/60" : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${activeSection === id ? 'bg-red-700 text-white shadow-lg shadow-red-700/20' : 'bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-700'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-left text-base font-extrabold text-slate-900 sm:text-xl">{title}</h2>
      </div>
      <span className={`rounded-full p-2 ${activeSection === id ? "bg-white text-red-700" : "text-slate-400"}`}>
        {activeSection === id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </span>
    </button>
  );

  return (
    <div className="industrial-page min-h-screen px-3 py-6 sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto w-full max-w-[1500px] space-y-8">
        
        {/* Hero Banner */}
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#7f1018] via-red-700 to-[#c52632] px-6 py-12 text-white shadow-2xl shadow-red-900/20 sm:px-12 lg:px-20 lg:py-16">
          <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-rose-300/10 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold tracking-wide text-red-50 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Sapugaskanda Refinery Training Center
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Training Programs & Guidelines
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-red-100 sm:text-lg">
              National Competency Standards & Curricula for Oil & Gas Technician Trades - NVQ Level 5 National Certificate Programmes
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-bold text-red-50">
              <span className="inline-flex items-center gap-2 rounded-xl bg-black/15 px-4 py-2.5"><CheckCircle2 className="h-4 w-4" /> 8 Technical Trades</span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-black/15 px-4 py-2.5"><Award className="h-4 w-4" /> NVQ Level 5</span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-black/15 px-4 py-2.5"><Clock3 className="h-4 w-4" /> 4-Year Programme</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/60 divide-y divide-slate-100 backdrop-blur">
          
          {/* Section 1: About */}
          <div>
            <AccordionHeader title="1. About the Refinery Training Center" id="about" icon={Info} />
            {activeSection === "about" && (
              <div className="space-y-6 border-t border-slate-100 bg-white px-5 py-7 text-sm leading-relaxed text-slate-600 sm:px-10 sm:py-10 sm:text-base animate-fadeIn">
                <p>
                  <strong className="text-gray-900 block mb-1">A Legacy of Excellence Since 1967</strong>
                  The Refinery Training Center was established during the construction period of the Sapugaskanda Refinery in 1967. Its primary mandate was to train the required employees to commission the refinery and maintain continuous training cycles, which commenced in 1969 with the Shell commissioning team.
                </p>
                <div className="space-y-3">
                  <strong className="text-gray-900 block">Evolution of Training</strong>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>1978:</strong> Recruitment of technical trainees through the National Apprentice Board (NAB) began. Trainees who successfully completed four years of training in various technical sections were issued craftsman certificates by the National Apprentice Board (now NAITA).</li>
                    <li><strong>1990s:</strong> The international qualification framework (IQF) was introduced by developed countries, providing access to qualifications and facilitating movement between education, training, and the labor market.</li>
                    <li><strong>2005:</strong> Sri Lanka introduced the National Vocational Qualification (NVQ) framework—a competency-based system with seven levels focusing on practical skills and knowledge for specific employment positions.</li>
                    <li><strong>2015:</strong> The Sri Lanka Qualifications Framework (SLQF) was introduced, integrating all national and international qualification frameworks for verification purposes.</li>
                    <li><strong>2016:</strong> Most Middle Eastern and European petroleum and petrochemical industries upgraded their qualification requirements, making internationally accepted certificates essential for employment.</li>
                  </ul>
                </div>
                <p>
                  <strong className="text-gray-900 block mb-1">A New Chapter</strong>
                  The Refinery Training Center has now developed and validated National Competency Standards and Curricula for eight technical trades, endorsed by TVEC as national documents. These curricula enable trainees to train under new National Competency Standards (NCS) and receive internationally recognized NVQ Level 5 qualifications.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: NVQ Framework */}
          <div>
            <AccordionHeader title="2. NVQ Framework and Qualification Trades" id="nvq" icon={Award} />
            {activeSection === "nvq" && (
              <div className="space-y-6 border-t border-slate-100 bg-white px-5 py-7 text-sm leading-relaxed text-slate-600 sm:px-10 sm:py-10 sm:text-base animate-fadeIn">
                <p>
                  <strong className="text-gray-900 block mb-1">What is NVQ?</strong>
                  The National Vocational Qualification (NVQ) Framework is a seven-level qualification system that serves as Sri Lanka's national benchmark for quality-assured technical and vocational education and training (TVET). It provides nationally and internationally recognized certification for individuals seeking employment and professional pursuits.
                </p>
                <div className="space-y-2">
                  <strong className="text-gray-900 block">NVQ Level 5 – Advanced Technical & Supervisory Skills</strong>
                  <p>Qualifications focus on advanced technical and supervisory competencies, enabling individuals to oversee operations, make strategic decisions, and drive organizational growth. At this level, candidates demonstrate:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Advanced practical skills in specialized technical areas</li>
                    <li>Supervisory and management capabilities</li>
                    <li>Ability to work independently and make informed decisions</li>
                    <li>Comprehensive understanding of industry standards and safety protocols</li>
                  </ul>
                </div>
                <p>
                  <strong className="text-gray-900 block mb-1">Integration with SLQF</strong>
                  The NVQ Framework integrates with the Sri Lanka Qualifications Framework (SLQF), allowing for flexible pathways between vocational and academic qualifications. NVQ certifications are respected by employers and offer pathways to further education, including potential credit transfers into the SLQF academic framework.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Entry Requirements */}
          <div>
            <AccordionHeader title="3. Entry Requirements and Career Paths" id="entry" icon={Users} />
            {activeSection === "entry" && (
              <div className="space-y-6 border-t border-slate-100 bg-white px-5 py-7 text-sm leading-relaxed text-slate-600 sm:px-10 sm:py-10 sm:text-base animate-fadeIn">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Entry Requirements</h3>
                  <p>Applications are invited through separate paper advertisements for each trade. Candidates must meet the following criteria:</p>
                  <ul className="list-disc pl-5 space-y-3">
                    <li><strong>Educational Qualifications:</strong> 
                      <ul className="list-circle pl-5 mt-1 space-y-1">
                        <li>Minimum of six subject passes in one sitting in GCE (O/L) examination, including credit passes in Sinhala/Tamil Language, Mathematics, and Science.</li>
                        <li>Minimum of three subject passes in Science stream in one sitting at GCE (A/L) Examination.</li>
                      </ul>
                    </li>
                    <li><strong>Age Limit:</strong> Not more than 24 years as at the closing date of the application.</li>
                    <li><strong>Written Test:</strong> Must pass a written test conducted for the respective trade.</li>
                  </ul>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Career Pathways & Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                      <strong className="text-gray-900 block mb-2">National Opportunities</strong>
                      <p className="text-sm">Upon successful completion of the program and absorption into the CPC permanent cadre, technicians can progress through various career paths, including senior technician positions, supervisory roles, and management positions such as Superintendent.</p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                      <strong className="text-gray-900 block mb-2">International Opportunities</strong>
                      <p className="text-sm">Trainees not absorbed by the refinery will have opportunities in overseas oil and gas industries and local industries, as the new curricula are multitasking and internationally aligned. With NVQ Level 5 certification, technicians can apply for highly paid foreign jobs.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Course Content */}
          <div>
            <AccordionHeader title="4. Course Content (The 8 Technical Trades)" id="course-content" icon={BookMarked} />
            {activeSection === "course-content" && (
              <div className="border-t border-slate-100 bg-white px-5 py-7 sm:px-10 sm:py-10 animate-fadeIn">
                <p className="mb-8 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  The Refinery Training Center offers NVQ Level 5 National Certificate programs in the following eight technical trades. Select a course below to view occupational definitions, key responsibilities, qualification packaging, and the full training curriculum.
                </p>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {coursesData.map((course) => (
                    <div key={course.id} className="group flex min-h-[285px] flex-col justify-between rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-red-50/40 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-900/10">
                      <div className="space-y-3">
                        {course.code && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-red-700">
                            <BookOpen className="h-3 w-3" />
                            {course.code}
                          </span>
                        )}
                        <h3 className="text-lg font-black leading-snug text-slate-900 transition-colors group-hover:text-red-700">
                          {course.title}
                        </h3>
                        <p className="line-clamp-4 text-sm leading-relaxed text-slate-500">
                          {course.occupationalDefinition}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400"><Award className="h-4 w-4 text-red-500" /> NVQ Level 5</span>
                        <Link
                          to={`/course/${course.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-700/20"
                        >
                          View Details <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Training and Recruitment Process */}
          <div>
            <AccordionHeader title="5. Training and Recruitment Process" id="process" icon={Briefcase} />
            {activeSection === "process" && (
              <div className="p-6 sm:p-10 bg-white space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-100 animate-fadeIn">
                <p>The training program is a comprehensive <strong>4-year full-time program</strong> structured into several key stages:</p>
                
                <div className="space-y-4 mt-4">
                  {[
                    { title: "1. Application & Selection", desc: "Advertisement, written test, and interview." },
                    { title: "2. Institutional Training", desc: "Theoretical and practical sessions with mainly in-house resources, with NAITA monitoring and regular assessments." },
                    { title: "3. On-the-Job Training", desc: "Focused training in each discipline, attached to respective departments of the refinery or other locations for practical experience." },
                    { title: "4. Final Assessment", desc: "Final examinations by NAITA and the Refinery Training Centre with viva and practical tests." },
                    { title: "5. Certification & Absorption", desc: "Issuance of NVQ Level 5 certificate and final absorption to CPC permanent cadre." },
                  ].map((stage, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{stage.title.replace(/^\d+\.\s*/, '')}</h4>
                        <p className="text-sm mt-1">{stage.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
