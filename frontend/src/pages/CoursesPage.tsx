import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, ArrowRight, ChevronDown, ChevronUp, Info, Award, Users, BookMarked, Briefcase } from "lucide-react";
import { coursesData } from "../data/coursesData";

const CoursesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("course-content");

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
  };

  const AccordionHeader = ({ title, id, icon: Icon }: { title: string, id: string, icon: any }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-6 bg-white border border-gray-100 hover:bg-gray-50 transition-colors focus:outline-none"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${activeSection === id ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {activeSection === id ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-800 via-red-700 to-red-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-4xl space-y-4 text-center mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-red-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> Sapugaskanda Refinery Training Center
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Training Programs & Guidelines
            </h1>
            <p className="text-red-100 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              National Competency Standards & Curricula for Oil & Gas Technician Trades - NVQ Level 5 National Certificate Programmes
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          
          {/* Section 1: About */}
          <div>
            <AccordionHeader title="1. About the Refinery Training Center" id="about" icon={Info} />
            {activeSection === "about" && (
              <div className="p-6 sm:p-10 bg-white space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-100 animate-fadeIn">
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
              <div className="p-6 sm:p-10 bg-white space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-100 animate-fadeIn">
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
              <div className="p-6 sm:p-10 bg-white space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-100 animate-fadeIn">
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
              <div className="p-6 sm:p-10 bg-white border-t border-gray-100 animate-fadeIn">
                <p className="text-gray-600 mb-8 text-sm sm:text-base">
                  The Refinery Training Center offers NVQ Level 5 National Certificate programs in the following eight technical trades. Select a course below to view occupational definitions, key responsibilities, qualification packaging, and the full training curriculum.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {coursesData.map((course) => (
                    <div key={course.id} className="bg-red-50/40 hover:bg-red-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-red-100 flex flex-col justify-between group">
                      <div className="space-y-3">
                        {course.code && (
                          <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100 uppercase">
                            {course.code}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-3">
                          {course.occupationalDefinition}
                        </p>
                      </div>
                      <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400">NVQ Level 5</span>
                        <Link
                          to={`/course/${course.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
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
