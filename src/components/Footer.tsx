import { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, Twitter, Github, X } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Automation', href: '#automation' },
  { label: 'HRMS', href: '#hrms' },
  { label: 'CRM', href: '#crm' },
  { label: 'Software Solutions', href: '#software-solutions' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/quantifix-technologies/' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/quantifixtechnologies' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/quantifixtechnologies' },
  { icon: Twitter, label: 'X (Twitter)', href: 'https://twitter.com/quantifixtec' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/quantifixtechnologies' },
];

export default function Footer() {
  const [modal, setModal] = useState<'privacy' | 'terms' | null>(null);
  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src="/file_0000000044e861fa873930d3fff21c26_20260413_072832_0000.png" alt="Quantifix Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-poppins font-bold text-lg text-white">Quantifix Technologies</div>
                <div className="text-xs text-violet-400">Pvt. Ltd.</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Empowering businesses through innovative software development, AI automation, HRMS, CRM, ERP, cloud computing, telecom engineering, and digital transformation.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 bg-gray-800 hover:bg-violet-700 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-white mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-gray-400 hover:text-violet-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 bg-violet-600 rounded-full group-hover:scale-150 transition-transform" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-poppins font-semibold text-white mb-5">Contact Us</h3>
            <div className="space-y-4">
              <a
                href="mailto:quantifixtechnologies@outlook.com"
                className="flex items-start gap-3 group"
              >
                <div className="w-8 h-8 bg-violet-700/20 group-hover:bg-violet-700 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                  <Mail className="w-4 h-4 text-violet-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors break-all">
                  quantifixtechnologies@outlook.com
                </span>
              </a>
              <a
                href="tel:+919014786159"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 bg-violet-700/20 group-hover:bg-violet-700 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                  <Phone className="w-4 h-4 text-violet-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">+91 9014786159</span>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-violet-700/20 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-violet-400" />
                </div>
                <span className="text-sm text-gray-400">
                  Floor No: 7, Flat No: 604,<br />DSL Building, Survey Colony,<br />IADA, Uppal, Hyderabad,<br />Telangana 500039
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Quantifix Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => setModal('privacy')} className="text-gray-500 hover:text-violet-400 transition-colors">Privacy Policy</button>
              <span className="text-gray-700">·</span>
              <button onClick={() => setModal('terms')} className="text-gray-500 hover:text-violet-400 transition-colors">Terms of Service</button>
              <span className="text-gray-700">·</span>
              <p className="text-gray-500">Transforming Ideas into Intelligent Solutions.</p>
            </div>
          </div>
        </div>

        {/* Privacy / Terms modal */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-8 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setModal(null)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              {modal === 'privacy' ? (
                <>
                  <h2 className="font-poppins font-bold text-xl text-gray-900 mb-4">Privacy Policy</h2>
                  <p className="text-sm text-gray-600 mb-3">Last updated: {new Date().getFullYear()}</p>
                  <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                    <p>Quantifix Technologies Pvt. Ltd. (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your personal information.</p>
                    <h3 className="font-semibold text-gray-900">Information We Collect</h3>
                    <p>We collect information you provide directly, such as your name, email address, phone number, and any messages you send via our contact or careers forms.</p>
                    <h3 className="font-semibold text-gray-900">How We Use It</h3>
                    <p>We use your information to respond to inquiries, process job applications, and improve our services. We do not sell or share your data with third parties for marketing purposes.</p>
                    <h3 className="font-semibold text-gray-900">Data Security</h3>
                    <p>Your data is stored securely and access is restricted to authorised personnel only.</p>
                    <h3 className="font-semibold text-gray-900">Contact</h3>
                    <p>For any privacy-related queries, reach us at info@quantifixtechnologies.com.</p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="font-poppins font-bold text-xl text-gray-900 mb-4">Terms of Service</h2>
                  <p className="text-sm text-gray-600 mb-3">Last updated: {new Date().getFullYear()}</p>
                  <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                    <p>By accessing or using our website, you agree to be bound by these Terms of Service.</p>
                    <h3 className="font-semibold text-gray-900">Use of Website</h3>
                    <p>You may use this website for lawful purposes only. You must not misuse or attempt to gain unauthorised access to any part of the site.</p>
                    <h3 className="font-semibold text-gray-900">Intellectual Property</h3>
                    <p>All content on this site — including text, graphics, logos, and software — is the property of Quantifix Technologies Pvt. Ltd. and protected by applicable intellectual property laws.</p>
                    <h3 className="font-semibold text-gray-900">Limitation of Liability</h3>
                    <p>Quantifix Technologies shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website.</p>
                    <h3 className="font-semibold text-gray-900">Contact</h3>
                    <p>For any questions about these terms, contact us at info@quantifixtechnologies.com.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
