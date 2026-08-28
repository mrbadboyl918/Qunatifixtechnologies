import {
  GitBranch, Users, TrendingUp, CheckSquare, Mail,
  Bot, MessageSquare, PieChart, FileBarChart, Plug,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const features = [
  { icon: GitBranch, title: 'Workflow Automation', desc: 'Automate complex multi-step business processes end-to-end.' },
  { icon: Users, title: 'Lead Automation', desc: 'Capture, qualify, and nurture leads automatically.' },
  { icon: TrendingUp, title: 'Sales Automation', desc: 'Streamline your sales pipeline with smart automation.' },
  { icon: CheckSquare, title: 'Approval Workflow', desc: 'Digitize approvals with role-based routing and notifications.' },
  { icon: Mail, title: 'Email Automation', desc: 'Trigger personalized emails based on user behavior.' },
  { icon: Bot, title: 'AI Assistants', desc: 'Deploy intelligent AI assistants to handle routine queries.' },
  { icon: MessageSquare, title: 'Chatbots', desc: 'AI-powered chatbots available 24/7 for your customers.' },
  { icon: PieChart, title: 'Business Intelligence', desc: 'Transform raw data into actionable business insights.' },
  { icon: FileBarChart, title: 'Reports & Analytics', desc: 'Real-time reporting dashboards for informed decisions.' },
  { icon: Plug, title: 'API Integration', desc: 'Seamlessly connect your tools and platforms via APIs.' },
];

export default function Automation() {
  const ref = useScrollAnimation();
  const gridRef = useScrollAnimation();

  return (
    <section id="automation" className="bg-gradient-to-br from-violet-900 via-violet-800 to-purple-900 section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className="animate-on-scroll text-center mb-14">
          <p className="text-violet-300 font-semibold text-sm uppercase tracking-widest mb-3">Intelligent Automation</p>
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-4">
            Automate Repetitive Operations with{' '}
            <span className="bg-gradient-to-r from-violet-300 to-purple-200 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h2>
          <p className="text-violet-100/70 max-w-2xl mx-auto text-lg">
            Free your team from repetitive tasks. Our AI-powered automation solutions handle workflows, approvals, communications, and analytics — so your people can focus on what matters.
          </p>
        </div>

        <div ref={gridRef} className="animate-on-scroll grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map(feat => (
            <div
              key={feat.title}
              className="group bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/15 hover:border-violet-400/40 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-violet-500/20 group-hover:bg-violet-500/30 rounded-xl flex items-center justify-center mb-3 transition-colors">
                <feat.icon className="w-5 h-5 text-violet-300" />
              </div>
              <h3 className="font-poppins font-semibold text-white text-sm mb-1.5">{feat.title}</h3>
              <p className="text-violet-200/70 text-xs leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-violet-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Automating Your Business
          </a>
        </div>
      </div>
    </section>
  );
}
