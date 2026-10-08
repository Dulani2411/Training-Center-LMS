import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Sparkles, ArrowRight, Target, Eye, ChevronRight, BookOpen, Shield, TrendingUp, Cpu, Leaf } from "lucide-react";

const slides = [
  {
    title: "Welcome to the Ceylon Petroleum Corporation",
    subtitle: "Learning Management System",
    description: "Empowering the next generation of technical experts in Sri Lanka's petroleum industry."
  },
  {
    title: "Master Technical Excellence",
    subtitle: "With NVQ Level 5 Qualifications",
    description: "Rigorous competency-based training programs endorsed by NAITA and TVEC."
  },
  {
    title: "Global Energy Industry Standards",
    subtitle: "Ready for the Future",
    description: "Gain skills that meet local and international demands in the oil and gas sector."
  }
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-in-out" });
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 font-sans">
      {/* Hero Section with Slideshow */}
      <div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Background Image with Zoom Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear scale-110"
          style={{ 
            backgroundImage: `url('/bg.jpg')`,
            transform: `scale(${1.1 + (currentSlide * 0.02)})` 
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center sm:items-start text-center sm:text-left mt-20">
          
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/40 border border-red-500/30 backdrop-blur-md" data-aos="fade-down">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span className="text-xs sm:text-sm font-semibold text-red-100 tracking-wide uppercase">
              Sapugaskanda Refinery Training Center
            </span>
          </div>

          <div className="h-[240px] sm:h-[220px] flex flex-col justify-center w-full max-w-4xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute transition-all duration-1000 ease-in-out ${
                  index === currentSlide 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl mb-4 leading-tight">
                  {slide.title}
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500 drop-shadow-lg mb-6">
                  {slide.subtitle}
                </h2>
                <p className="text-base sm:text-xl text-gray-300 max-w-2xl leading-relaxed drop-shadow-md border-l-4 border-red-600 pl-4">
                  {slide.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto" data-aos="fade-up" data-aos-delay="300">
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transform hover:-translate-y-1"
            >
              Explore Courses <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all hover:-translate-y-1"
            >
              Apply Now
            </Link>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide 
                    ? "w-8 h-2 bg-red-500" 
                    : "w-2 h-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* About Section - Modernized */}
      <section className="py-24 px-6 bg-white relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 skew-x-12 -z-10 transform origin-top-right"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div data-aos="fade-right">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 relative inline-block">
                A Legacy of Excellence
                <div className="absolute -bottom-2 left-0 w-1/2 h-1.5 bg-red-600 rounded-full"></div>
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  Established in 1967 during the Sapugaskanda Refinery construction, the CPC Training Center has been a cornerstone of technical excellence in Sri Lanka's petroleum industry.
                </p>
                <p>
                  Since its inception, continuous training cycles began with the Shell commissioning team in 1969. In 1978, it partnered with NAITA for rigorous four-year training programs awarding craftsman certificates.
                </p>
                <p>
                  Adapting to global standards, NVQ framework (2005) and SLQF (2015) curricula for eight technical trades meet local and international petroleum, oil, gas, and energy-sector demands.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-aos="fade-left">
              {/* Vision Card */}
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl shadow-xl border border-gray-800 transform hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center mb-6 border border-red-500/30">
                  <Eye className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  To be the premier global hub for empowering technicians in the oil and gas industry with cutting-edge skills, fostering innovation, safety, and operational excellence.
                </p>
              </div>

              {/* Quick Stat or decorative element */}
              <div className="bg-red-600 p-8 rounded-3xl shadow-xl shadow-red-600/20 flex flex-col justify-between transform sm:translate-y-12 hover:-translate-y-2 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-white/50" />
                <div>
                  <div className="text-5xl font-black text-white mb-2">50+</div>
                  <div className="text-red-100 font-medium">Years of Technical Excellence & Innovation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Grid Layout */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Driving the future of the petroleum industry through five core pillars of excellence.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: BookOpen, 
                title: "Enhancing Technical Expertise", 
                desc: "Comprehensive, hands-on training programs to equip technicians with essential skills." 
              },
              { 
                icon: Shield, 
                title: "Promoting Safety Standards", 
                desc: "Instilling a strong culture of safety and adherence to industry regulations." 
              },
              { 
                icon: TrendingUp, 
                title: "Fostering Career Growth", 
                desc: "Supporting technicians to achieve professional growth with globally recognized certifications." 
              },
              { 
                icon: Cpu, 
                title: "Innovative Learning", 
                desc: "Utilizing advanced technologies, simulations, and practical methodologies for effective learning." 
              },
              { 
                icon: Leaf, 
                title: "Sustainability & Excellence", 
                desc: "Promoting environmentally responsible practices and delivering excellence in workforce readiness." 
              }
            ].map((mission, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                  <mission.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{mission.title}</h4>
                <p className="text-gray-600">{mission.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
