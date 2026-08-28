import {
  UserCheck, TrendingUp, Database, Target,
  Megaphone, Headphones, PieChart, Lock,
  FileText, CheckSquare,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const features = [
  { icon: UserCheck, title: 'Lead Management', desc: 'Capture, assign, and track leads through the full funnel.' },
  { icon: TrendingUp, title: 'Sales Pipeline', desc: 'Visualize and manage every stage of your sales process.' },
  { icon: Database, title: 'Customer Database', desc: 'Centralized, searchable records for every customer.' },
  { icon: Target, title: 'Opportunity Tracking', desc: 'Never miss a deal with intelligent opportunity management.' },
  { icon: Megaphone, title: 'Marketing Automation', desc: 'Automated campaigns, segmentation, and follow-ups.' },
  { icon: Headphones, title: 'Support Tickets', desc: 'Resolve customer issues faster with structured ticketing.' },
  { icon: PieChart, title: 'Analytics', desc: 'Detailed dashboards for sales performance and trends.' },
  { icon: Lock, title: 'Role-Based Access', desc: 'Secure data access with configurable permissions.' },
  { icon: FileText, title: 'Quotation Management', desc: 'Generate and track professional quotes with ease.' },
  { icon: CheckSquare, title: 'Task Management', desc: 'Assign, track, and complete tasks tied to customer accounts.' },
];

export default function CRM() {
  const ref = useScrollAnimation();
  const gridRef = useScrollAnimation();

  return (
    <section id="crm" className="bg-violet-50 section-padding">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="animate-on-scroll text-center mb-14">
          <p className="section-subtitle">Customer Relations</p>
          <h2 className="section-title mb-4">
            Powerful <span className="gradient-text">CRM Platform</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Manage your entire customer lifecycle — from the first touchpoint to long-term retention — in one intelligent, connected platform.
          </p>
        </div>

        <div ref={gridRef} className="animate-on-scroll grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map(feat => (
            <div
              key={feat.title}
              className="group bg-white rounded-2xl p-5 shadow-card hover:shadow-violet-lg hover:-translate-y-1 transition-all duration-300 border border-violet-50 hover:border-violet-200"
            >
              <div className="w-11 h-11 bg-violet-50 group-hover:bg-violet-700 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300">
                <feat.icon className="w-5 h-5 text-violet-700 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-poppins font-semibold text-gray-900 text-sm mb-1.5 group-hover:text-violet-700 transition-colors">
                {feat.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="btn-primary inline-flex"
          >
            Get a CRM Demo
          </a>
        </div>
      </div>
    </section>
  );
}
