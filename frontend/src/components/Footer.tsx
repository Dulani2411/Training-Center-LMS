import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Phone, Mail, MapPin, ExternalLink, Shield } from "lucide-react";
import logo from "../assets/cpc-logo.png";

const socialLinks = [
  { icon: <FaFacebookF />, href: "https://www.facebook.com/CeyPetCo", label: "Facebook" },
  { icon: <FaTwitter />, href: "https://twitter.com/ceypetco", label: "Twitter" },
  { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/company/ceypetco", label: "LinkedIn" },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-300 border-t-4 border-red-700">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="CPC Logo" className="w-12 h-12 object-contain bg-white rounded-full p-1" />
              <div>
                <h3 className="text-white font-bold text-base uppercase leading-snug">
                  Ceylon Petroleum
                </h3>
                <p className="text-red-400 text-xs font-semibold">Training Center LMS</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering technical professionals and technicians in Sri Lanka’s petroleum and energy industry since 1967.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-red-700 transition-all transform hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold mb-4 text-base tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-4 bg-red-600 rounded"></span> Contact Info
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                <span>Sapugaskanda Refinery, Kelaniya, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href="tel:+94117296130" className="hover:text-white transition-colors">
                  +94 117 296 130
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href="mailto:secretariat@ceypetco.gov.lk" className="hover:text-white transition-colors">
                  secretariat@ceypetco.gov.lk
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-base tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-4 bg-red-600 rounded"></span> Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1.5">
                  › Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1.5">
                  › Available Courses
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1.5">
                  › Online Training Application
                </Link>
              </li>
              <li>
                <Link to="/student" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1.5">
                  › Student Portal
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1.5">
                  › Staff / Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Institutional Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-base tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-4 bg-red-600 rounded"></span> Official Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://ceypetco.gov.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  CEYPETCO Official Site <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://naita.gov.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  NAITA Apprenticeship <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tvec.gov.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  TVEC National Qualifications <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                </a>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-lg bg-gray-900/80 border border-gray-800 text-xs text-gray-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>Official training center portal of Ceylon Petroleum Corporation.</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Ceylon Petroleum Corporation Training Center. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">NVQ & SLQF Certified Programs</span>
            <span className="text-gray-700">|</span>
            <Link to="/admin-login" className="text-gray-500 hover:text-red-400">
              Staff Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
