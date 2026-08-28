import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Industries from '@/components/Industries';
import Technologies from '@/components/Technologies';
import Automation from '@/components/Automation';
import HRMS from '@/components/HRMS';
import CRM from '@/components/CRM';
import SoftwareSolutions from '@/components/SoftwareSolutions';
import Careers from '@/components/Careers';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AdminPanel from '@/components/AdminPanel';

function AppContent() {
  const { user, isAdmin, loading } = useAuth();
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handler = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const isAdminRoute = route === '#admin';

  // Admin route: only admin users can access
  if (isAdminRoute) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-700 rounded-full animate-spin" />
        </div>
      );
    }

    if (!user) {
      return <AccessDenied message="You must be signed in to access this page." />;
    }

    if (!isAdmin) {
      return <AccessDenied message="Access Denied — You do not have administrator permissions." />;
    }

    return (
      <>
        <Navbar />
        <AdminPanel />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Industries />
        <Technologies />
        <Automation />
        <HRMS />
        <CRM />
        <SoftwareSolutions />
        <Careers />
        <Contact />
      </main>
      <Footer />
      <AuthModal />
    </>
  );
}

function AccessDenied({ message }: { message: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0112 2.25c2.122 0 4.25.5 6.244 1.5a.75.75 0 01.406 1.013l-6.543 13.093a.75.75 0 01-1.414 0L4.35 4.763a.75.75 0 01.406-1.013A11.959 11.959 0 0112 2.25z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v.01" />
          </svg>
        </div>
        <h1 className="font-poppins font-bold text-2xl text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-sm mb-1">{message}</p>
        <p className="text-gray-400 text-xs">Redirecting you to the homepage...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
