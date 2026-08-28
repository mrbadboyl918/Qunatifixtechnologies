import { ArrowRight, MessageCircle, Code2, Brain, Cloud, Cpu, Database, Globe, Shield } from 'lucide-react';

const floatingItems = [
  { icon: Code2, label: 'Custom Software', color: 'from-violet-600 to-violet-500', delay: '0s' },
  { icon: Brain, label: 'AI & Automation', color: 'from-purple-600 to-violet-600', delay: '0.5s' },
  { icon: Cloud, label: 'Cloud Solutions', color: 'from-violet-500 to-violet-400', delay: '1s' },
  { icon: Database, label: 'ERP / CRM', color: 'from-violet-700 to-purple-600', delay: '1.5s' },
  { icon: Globe, label: 'Web Development', color: 'from-purple-500 to-violet-500', delay: '2s' },
  { icon: Shield, label: 'Enterprise Security', color: 'from-violet-600 to-purple-500', delay: '2.5s' },
];

const stats = [
  { value: '200+', label: 'Projects Delivered' },
  { value: '50+', label: 'Happy Clients' },
  { value: '15+', label: 'Technologies' },
  { value: '24/7', label: 'Support' },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-violet-900 via-violet-800 to-purple-900"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute top-20 left-20 w-3 h-3 bg-violet-300/40 rounded-full animate-pulse-slow" />
        <div className="absolute top-40 right-32 w-2 h-2 bg-white/30 rounded-full animate-pulse-slow animation-delay-300" />
        <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-violet-400/30 rounded-full animate-pulse-slow animation-delay-500" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-300/40 rounded-full animate-pulse-slow animation-delay-200" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-28 pb-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            {/* Logo mark — visible on mobile only */}
            <div className="flex lg:hidden justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-600/40 to-purple-600/40 rounded-3xl border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-violet-lg">
                <img
                  src="/file_0000000044e861fa873930d3fff21c26_20260413_072832_0000.png"
                  alt="Quantifix Technologies"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-violet-200">
              <Cpu className="w-4 h-4" />
              <span>Transforming Ideas into Intelligent Solutions.</span>
            </div>

            <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-[1.15]">
              Empowering Businesses with{' '}
              <span className="bg-gradient-to-r from-violet-300 to-purple-200 bg-clip-text text-transparent">
                Intelligent Technology
              </span>{' '}
              Solutions
            </h1>

            <p className="text-violet-100/80 text-base lg:text-lg leading-relaxed max-w-xl">
              Quantifix Technologies delivers innovative software development, AI automation, cloud computing, HRMS, CRM, ERP, telecom engineering, and enterprise solutions that help businesses grow faster and embrace digital transformation.
            </p>

            {/* Mobile service pills */}
            <div className="flex flex-wrap gap-2 lg:hidden">
              {floatingItems.map(item => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-violet-200 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
                >
                  <item.icon className="w-3 h-3" />
                  {item.label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Us
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 pt-2">
              {stats.map(stat => (
                <div key={stat.label} className="text-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 lg:p-4">
                  <div className="font-poppins font-bold text-xl lg:text-2xl text-white">{stat.value}</div>
                  <div className="text-violet-200 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating Cards Grid — desktop only */}
          <div className="hidden lg:block">
            <div className="relative w-full h-[520px]">
              {/* Central orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-violet-400/30 to-purple-400/30 rounded-full border border-white/20 backdrop-blur-sm flex items-center justify-center animate-float shadow-violet-lg">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  <img src="/file_0000000044e861fa873930d3fff21c26_20260413_072832_0000.png" alt="Quantifix Logo" className="w-16 h-16 object-contain" />
                </div>
              </div>

              {/* Orbit rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-violet-400/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-violet-400/10 rounded-full" />

              {/* Floating service cards */}
              {floatingItems.map((item, i) => {
                const angle = (i / floatingItems.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 190;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div
                    key={item.label}
                    className="absolute flex flex-col items-center gap-1.5 animate-float"
                    style={{
                      left: `calc(50% + ${x}px - 52px)`,
                      top: `calc(50% + ${y}px - 40px)`,
                      animationDelay: item.delay,
                      animationDuration: `${3 + i * 0.3}s`,
                    }}
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-violet border border-white/20`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs text-violet-200 font-medium whitespace-nowrap bg-black/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 fill-white">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
