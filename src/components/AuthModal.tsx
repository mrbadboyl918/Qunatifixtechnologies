import { useState, useRef, useEffect } from 'react';
import { X, Phone, ChevronLeft, AlertCircle, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Step = 'method' | 'email' | 'phone' | 'otp';

export default function AuthModal() {
  const {
    authModalOpen, closeAuthModal,
    signInWithGoogle, signInWithEmail, signUpWithEmail,
    sendOtp, verifyOtp,
  } = useAuth();
  const [step, setStep] = useState<Step>('method');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!authModalOpen) {
      setTimeout(() => {
        setStep('method');
        setPhone('');
        setOtp(['', '', '', '', '', '']);
        setEmail('');
        setPassword('');
        setIsSignUp(false);
        setError('');
        setLoading(false);
      }, 300);
    }
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  const fullPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const { error: err } = await signInWithGoogle();
    if (err) { setError(err); setLoading(false); }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Enter email and password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    const { error: err } = isSignUp
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);
    setLoading(false);
    if (err) {
      setError(
        err.includes('Invalid login')
          ? 'Invalid email or password.'
          : err.includes('already registered')
          ? 'This email is already registered. Try signing in instead.'
          : err
      );
      return;
    }
    if (isSignUp) {
      setError('');
      setStep('method');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) { setError('Enter a valid 10-digit mobile number.'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await sendOtp(fullPhone);
    setLoading(false);
    if (err) { setError(err); return; }
    setStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length < 6) { setError('Enter the complete 6-digit code.'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await verifyOtp(fullPhone, token);
    setLoading(false);
    if (err) {
      setError(err);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  const stepIndex = (['method', 'email', 'phone', 'otp'] as Step[]).indexOf(step);
  const showSteps = step !== 'method';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeAuthModal} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-600 px-8 pt-8 pb-10">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {showSteps && (
            <button
              onClick={() => { setStep(step === 'otp' ? 'phone' : step === 'email' ? 'method' : 'method'); setError(''); }}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
          )}

          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-3">
              <img
                src="/file_0000000044e861fa873930d3fff21c26_20260413_072832_0000.png"
                alt="Quantifix"
                className="w-8 h-8 object-contain"
              />
            </div>
            <h2 className="font-poppins font-bold text-2xl text-white mb-1">
              {step === 'method' && 'Create Account'}
              {step === 'email' && (isSignUp ? 'Sign Up with Email' : 'Sign In with Email')}
              {step === 'phone' && 'Enter Mobile Number'}
              {step === 'otp' && 'Verify Your Number'}
            </h2>
            <p className="text-violet-200 text-sm">
              {step === 'method' && 'Sign in to access career opportunities at Quantifix'}
              {step === 'email' && (isSignUp ? 'Create an account with your email' : 'Enter your credentials to continue')}
              {step === 'phone' && "We'll send a 6-digit OTP to your mobile number"}
              {step === 'otp' && `OTP sent to +91 ${phone.replace(/\D/g, '')}`}
            </p>
          </div>
        </div>

        {showSteps && (
          <div className="flex gap-1.5 justify-center -mt-2 mb-1 relative z-10">
            {(['method', 'email', 'phone', 'otp'] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-6 bg-violet-600' : i < stepIndex ? 'w-3 bg-violet-300' : 'w-3 bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}

        <div className="px-8 pb-8 pt-4">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1 — Choose method */}
          {step === 'method' && (
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center gap-3 border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 rounded-2xl px-5 py-3.5 transition-all group disabled:opacity-60"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-medium text-gray-700 group-hover:text-violet-700 text-sm flex-1 text-left">
                  Continue with Google
                </span>
                {loading && <span className="w-4 h-4 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />}
              </button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                onClick={() => { setStep('email'); setIsSignUp(false); setError(''); }}
                className="w-full flex items-center gap-3 border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 rounded-2xl px-5 py-3.5 transition-all group"
              >
                <Mail className="w-5 h-5 text-gray-500 group-hover:text-violet-600 shrink-0" />
                <span className="font-medium text-gray-700 group-hover:text-violet-700 text-sm flex-1 text-left">
                  Continue with Email
                </span>
              </button>

              <button
                onClick={() => setStep('phone')}
                className="w-full flex items-center gap-3 border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 rounded-2xl px-5 py-3.5 transition-all group"
              >
                <Phone className="w-5 h-5 text-gray-500 group-hover:text-violet-600 shrink-0" />
                <span className="font-medium text-gray-700 group-hover:text-violet-700 text-sm flex-1 text-left">
                  Continue with Mobile OTP
                </span>
              </button>

              <p className="text-center text-xs text-gray-400 pt-2">
                By signing in you agree to our terms of service and privacy policy.
              </p>
            </div>
          )}

          {/* STEP 2 — Email sign in / sign up */}
          {step === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="At least 6 characters"
                    className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {isSignUp ? 'Creating account...' : 'Signing in...'}</>
                ) : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="w-full text-sm text-violet-600 hover:text-violet-700 font-medium py-1"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </form>
          )}

          {/* STEP 3 — Phone number */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 bg-gray-50 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 shrink-0">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                    placeholder="XXXXXXXXXX"
                    className="flex-1 border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    autoFocus
                    inputMode="numeric"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || phone.replace(/\D/g, '').length < 10}
                className="w-full bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending OTP...</>
                ) : 'Send OTP'}
              </button>
            </form>
          )}

          {/* STEP 4 — OTP verify */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Enter 6-digit OTP</label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl outline-none transition-all"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || otp.join('').length < 6}
                className="w-full bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
                ) : 'Verify & Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setOtp(['', '', '', '', '', '']); handleSendOtp({ preventDefault: () => {} } as React.FormEvent); }}
                className="w-full text-sm text-violet-600 hover:text-violet-700 font-medium py-1"
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
