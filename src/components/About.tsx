import { Eye, Target, CheckCircle2, Lightbulb, ShieldCheck, Users, Star, BookOpen, Award } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const missionPoints = [
  'Deliver high-quality software solutions',
  'Accelerate digital transformation',
  'Simplify business operations',
  'Build long-term customer relationships',
  'Create innovative technology that solves real-world problems',
];

const coreValues = [
  { icon: Lightbulb, label: 'Innovation', desc: 'Constantly pushing the boundaries of what technology can do.' },
  { icon: ShieldCheck, label: 'Integrity', desc: 'Honest, transparent, and ethical in every engagement.' },
  { icon: Star, label: 'Customer Success', desc: 'Your success is our benchmark and our motivation.' },
  { icon: Award, label: 'Quality', desc: 'Delivering excellence at every stage of the project.' },
  { icon: Users, label: 'Transparency', desc: 'Open communication throughout the entire journey.' },
  { icon: BookOpen, label: 'Continuous Learning', desc: 'Evolving our skills to stay ahead of the technology curve.' },
];

const whyUs = [
  'Experienced Technology Experts',
  'AI-Driven Innovation',
  'Agile Development',
  'Enterprise Security',
  'Scalable Solutions',
  'Customer-Centric Approach',
  'Affordable Pricing',
  '24/7 Support',
  'End-to-End Development',
  'On-Time Delivery',
];

export default function About() {
  const ref1 = useScrollAnimation();
  const ref2 = useScrollAnimation();
  const ref3 = useScrollAnimation();
  const ref4 = useScrollAnimation();

  return (
    <section id="about" className="bg-white">
      {/* Who We Are */}
      <div className="section-padding max-w-7xl mx-auto">
        <div
          ref={ref1}
          className="animate-on-scroll grid lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <p className="section-subtitle">Who We Are</p>
            <h2 className="section-title mb-6">
              Driving Digital Excellence{' '}
              <span className="gradient-text">Across India & Beyond</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              Quantifix Technologies Pvt. Ltd. is a technology-driven software development and IT consulting company dedicated to building scalable digital solutions for startups, SMEs, and enterprises.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our experienced team specializes in custom software, web and mobile applications, enterprise systems, artificial intelligence, business automation, telecom engineering, and cloud technologies. We believe in innovation, quality, transparency, and delivering measurable business value through modern technology.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: 'Technology-Driven', icon: '⚡' },
                { label: 'Client-Focused', icon: '🎯' },
                { label: 'Scalable Solutions', icon: '📈' },
                { label: 'Innovation-First', icon: '🚀' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span>{item.icon}</span> {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Vision & Mission cards */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-violet-700 to-violet-600 rounded-2xl p-8 text-white shadow-violet-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-poppins font-bold text-xl">Our Vision</h3>
              </div>
              <p className="text-violet-100 leading-relaxed">
                To become one of India's leading technology companies by delivering innovative, scalable, and intelligent digital solutions that transform businesses worldwide.
              </p>
            </div>

            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-700 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-poppins font-bold text-xl text-gray-900">Our Mission</h3>
              </div>
              <ul className="space-y-2.5">
                {missionPoints.map(point => (
                  <li key={point} className="flex items-start gap-2.5 text-gray-700 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-violet-700 mt-0.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-violet-50 py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div ref={ref2} className="animate-on-scroll text-center mb-14">
            <p className="section-subtitle">What Drives Us</p>
            <h2 className="section-title">Core Values</h2>
          </div>
          <div ref={ref3} className="animate-on-scroll grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map(val => (
              <div key={val.label} className="card group">
                <div className="w-12 h-12 bg-violet-100 group-hover:bg-violet-700 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                  <val.icon className="w-6 h-6 text-violet-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-poppins font-semibold text-lg text-gray-900 mb-2">{val.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="section-padding max-w-7xl mx-auto">
        <div ref={ref4} className="animate-on-scroll">
          <div className="text-center mb-14">
            <p className="section-subtitle">Our Edge</p>
            <h2 className="section-title">Why Choose Quantifix?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {whyUs.map(item => (
              <div
                key={item}
                className="flex items-center gap-3 bg-white border border-violet-100 rounded-xl px-4 py-3.5 shadow-sm hover:shadow-violet hover:border-violet-300 transition-all duration-200 group"
              >
                <div className="w-6 h-6 bg-violet-100 group-hover:bg-violet-700 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-700 group-hover:text-white transition-colors duration-200" />
                </div>
                <span className="text-sm font-medium text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
