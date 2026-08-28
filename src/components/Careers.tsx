import { useState } from 'react';
import {
  Code2, Cpu, Terminal, Coffee, TestTube, Palette,
  TrendingUp, Users, Megaphone, Rocket, BookOpen, Heart, CheckCircle2, Lock, AlertCircle, Upload, FileText, X,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import JobsBoard from '@/components/JobsBoard';

const openPositions = [
  { icon: Code2, title: 'Software Engineer', type: 'Full-time' },
  { icon: Terminal, title: 'Python Developer', type: 'Full-time' },
  { icon: Coffee, title: 'React Developer', type: 'Full-time' },
  { icon: Cpu, title: 'Java Developer', type: 'Full-time' },
  { icon: Code2, title: 'Node.js Developer', type: 'Full-time' },
  { icon: Cpu, title: 'AI Engineer', type: 'Full-time' },
  { icon: TestTube, title: 'QA Engineer', type: 'Full-time' },
  { icon: Palette, title: 'UI/UX Designer', type: 'Full-time' },
  { icon: TrendingUp, title: 'Business Development Executive', type: 'Full-time' },
  { icon: Users, title: 'HR Executive', type: 'Full-time' },
  { icon: Megaphone, title: 'Digital Marketing Executive', type: 'Full-time' },
];

const benefits = [
  { icon: Rocket, label: 'Career Growth', desc: 'Clear growth paths and regular promotions.' },
  { icon: BookOpen, label: 'Learning Programs', desc: 'Sponsored certifications and training.' },
  { icon: Heart, label: 'Flexible Work', desc: 'Hybrid and flexible work arrangements.' },
  { icon: Cpu, label: 'Innovation Culture', desc: 'Work on cutting-edge AI and tech projects.' },
];

const positionOptions = openPositions.map(p => p.title);

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  message: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export default function Careers() {
  const { user, openAuthModal, loading: authLoading } = useAuth();
  const ref = useScrollAnimation();
  const formRef = useScrollAnimation();
  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', phone: '', position: '', experience: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeError('');
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setResumeError('Please upload a PDF or Word document.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setResumeError('File must be under 5 MB.');
      return;
    }
    setResumeFile(file);
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    let resumeUrl: string | null = null;

    if (resumeFile) {
      setUploading(true);
      const safeName = resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${Date.now()}-${safeName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);
      setUploading(false);
      if (uploadError) {
        setSubmitError('Could not upload resume. Please try again.');
        setSubmitting(false);
        return;
      }
      resumeUrl = uploadData.path;
    }

    const { error } = await supabase.from('career_applications').insert({
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      position: form.position,
      experience: form.experience,
      message: form.message || null,
      resume_url: resumeUrl,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError('Something went wrong. Please try again.');
      return;
    }
    setSubmitted(true);
    setResumeFile(null);
  };

  return (
    <section id="careers" className="bg-violet-50 section-padding">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="animate-on-scroll text-center mb-14">
          <p className="section-subtitle">Join Our Team</p>
          <h2 className="section-title mb-4">
            Build the Future with <span className="gradient-text">Quantifix</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            We're always looking for talented individuals passionate about technology and innovation. Come help us shape the future of enterprise software.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {benefits.map(b => (
            <div key={b.label} className="card text-center group">
              <div className="w-12 h-12 bg-violet-100 group-hover:bg-violet-700 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                <b.icon className="w-6 h-6 text-violet-700 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-poppins font-semibold text-gray-900 mb-1">{b.label}</h3>
              <p className="text-gray-500 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {authLoading ? (
            /* Skeleton while auth resolves */
            <div className="lg:col-span-2 flex flex-col gap-3 py-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-14 bg-white rounded-xl shadow-card border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : user ? (
            <>
          {/* Open Positions — dynamic from database */}
          <div>
            <h3 className="font-poppins font-bold text-xl text-gray-900 mb-6">Open Positions</h3>
            <JobsBoard />
          </div>

          {/* Application Form */}
          <div ref={formRef} className="animate-on-scroll">
            <h3 className="font-poppins font-bold text-xl text-gray-900 mb-6">Apply Now</h3>

            {submitted ? (
              <div className="bg-white rounded-2xl p-10 shadow-card text-center border border-violet-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-poppins font-bold text-xl text-gray-900 mb-2">Application Submitted!</h4>
                <p className="text-gray-500">Thank you for your interest. We'll review your application and reach out shortly.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', phone: '', position: '', experience: '', message: '' }); setResumeFile(null); }}
                  className="mt-6 btn-outline text-sm py-2"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-card space-y-5 border border-violet-50">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXXXXXXX"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience</label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all bg-white"
                    >
                      <option value="">Select experience</option>
                      <option>Fresher (0-1 years)</option>
                      <option>Junior (1-3 years)</option>
                      <option>Mid-level (3-5 years)</option>
                      <option>Senior (5-8 years)</option>
                      <option>Lead (8+ years)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Position Applying For *</label>
                  <select
                    name="position"
                    required
                    value={form.position}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all bg-white"
                  >
                    <option value="">Select a position</option>
                    {positionOptions.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your skills, and why you want to join Quantifix..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                  />
                </div>

                {/* Resume upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume (PDF or Word, max 5 MB)</label>
                  {resumeFile ? (
                    <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-5 h-5 text-violet-700 shrink-0" />
                        <span className="text-sm text-gray-800 truncate">{resumeFile.name}</span>
                      </div>
                      <button type="button" onClick={removeResume} className="p-1 rounded-lg hover:bg-violet-100 transition-colors shrink-0">
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-violet-400 hover:bg-violet-50/50 transition-all">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-gray-500">Click to upload your resume</span>
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                  {resumeError && (
                    <p className="mt-1.5 text-xs text-red-600">{resumeError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {uploading ? 'Uploading resume...' : 'Submitting...'}
                    </>
                  ) : 'Submit Application'}
                </button>
                {submitError && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
              </form>
            )}
          </div>
            </>
          ) : (
            /* Auth gate — compact, full-width, always visible */
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-10">
              {/* Blurred preview strip — fixed height, no overflow */}
              <div className="w-full mb-0 relative overflow-hidden rounded-2xl" style={{ maxHeight: 220 }}>
                <div className="blur-sm pointer-events-none select-none space-y-2.5 px-1" aria-hidden>
                  {openPositions.slice(0, 5).map(pos => (
                    <div key={pos.title} className="flex items-center justify-between bg-white rounded-xl px-5 py-3.5 shadow-card border border-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                          <pos.icon className="w-4 h-4 text-violet-700" />
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{pos.title}</span>
                      </div>
                      <span className="text-xs text-violet-600 bg-violet-50 px-3 py-1 rounded-full font-medium border border-violet-100">{pos.type}</span>
                    </div>
                  ))}
                </div>
                {/* Fade-to-white gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-violet-50 to-transparent pointer-events-none" />
              </div>

              {/* Lock card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-violet-100 p-10 text-center w-full max-w-md -mt-4 relative z-10">
                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Lock className="w-8 h-8 text-violet-700" />
                </div>
                <h3 className="font-poppins font-bold text-xl text-gray-900 mb-2">
                  Sign in to Explore Careers
                </h3>
                <p className="text-gray-500 text-sm mb-7 leading-relaxed">
                  Create a free account to view all {openPositions.length} open positions and submit your application to join Quantifix Technologies.
                </p>
                <button
                  onClick={openAuthModal}
                  className="btn-primary w-full text-sm py-3 mb-3"
                >
                  Create Account / Sign In
                </button>
                <p className="text-xs text-gray-400">Sign in with Google or mobile OTP — it takes under a minute.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
