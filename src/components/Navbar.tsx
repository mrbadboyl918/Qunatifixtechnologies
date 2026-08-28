import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Automation', href: '#automation' },
  { label: 'HRMS', href: '#hrms' },
  { label: 'CRM', href: '#crm' },
  { label: 'Software Solutions', href: '#software-solutions' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact Us', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin, signOut, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = navLinks.map(l => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || user?.phone || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => handleNavClick('#home')} className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl overflow-hidden group-hover:scale-105 transition-transform shrink-0">
            <img src="/file_0000000044e861fa873930d3fff21c26_20260413_072832_0000.png" alt="Quantifix Logo" className="w-full h-full object-contain" />
          </div>
          <div className="leading-tight">
            <div className={`font-poppins font-bold text-base tracking-tight transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Quantifix <span className={`transition-colors ${isScrolled ? 'text-violet-700' : 'text-violet-300'}`}>Technologies</span>
            </div>
            <div className={`text-[9px] italic leading-none mt-0.5 transition-colors ${isScrolled ? 'text-gray-400' : 'text-violet-300/80'}`}>
              Transforming Ideas into Intelligent Solutions.
            </div>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSection === link.href.replace('#', '')
                  ? 'bg-violet-700 text-white'
                  : isScrolled
                  ? 'text-gray-700 hover:text-violet-700 hover:bg-violet-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA / Auth + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                  isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                }`}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                )}
                <span className={`text-sm font-medium max-w-[100px] truncate transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  {displayName}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{user.email || user.phone}</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => { setUserMenuOpen(false); window.location.hash = 'admin'; }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-violet-700 hover:bg-violet-50 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Job Management
                    </button>
                  )}
                  <button
                    onClick={() => { setUserMenuOpen(false); signOut(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className={`hidden md:flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border-2 transition-all ${
                isScrolled
                  ? 'border-violet-600 text-violet-700 hover:bg-violet-50'
                  : 'border-white/50 text-white hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}

          <button
            onClick={() => handleNavClick('#contact')}
            className="hidden md:block btn-primary text-sm py-2 px-5"
          >
            Get Started
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-t border-gray-100 shadow-lg px-4 py-4 flex flex-col gap-1">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === link.href.replace('#', '')
                  ? 'bg-violet-700 text-white'
                  : 'text-gray-700 hover:bg-violet-50 hover:text-violet-700'
              }`}
            >
              {link.label}
            </button>
          ))}

          {user ? (
            <div className="mt-2 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-2 px-4 py-2 mb-1">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-800 truncate">{displayName}</span>
              </div>
              {isAdmin && (
                <button
                  onClick={() => { setMobileOpen(false); window.location.hash = 'admin'; }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-violet-700 hover:bg-violet-50 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Job Management
                </button>
              )}
              <button
                onClick={() => { setMobileOpen(false); signOut(); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setMobileOpen(false); openAuthModal(); }}
              className="mt-2 flex items-center justify-center gap-2 border-2 border-violet-600 text-violet-700 rounded-xl py-2.5 text-sm font-medium hover:bg-violet-50 transition-colors"
            >
              <User className="w-4 h-4" />
              Sign In / Create Account
            </button>
          )}

          <button
            onClick={() => handleNavClick('#contact')}
            className="btn-primary mt-1 text-sm text-center"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
