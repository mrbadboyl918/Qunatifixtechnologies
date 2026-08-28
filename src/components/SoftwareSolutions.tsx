import {
  Package, Users, BarChart3, BookOpen, Heart,
  GraduationCap, Archive, Calculator, ShoppingCart,
  DollarSign, Trello, PieChart, Building, Code2, Globe,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const solutions = [
  { icon: Package, label: 'ERP Software' },
  { icon: Users, label: 'CRM Software' },
  { icon: BarChart3, label: 'HRMS' },
  { icon: BookOpen, label: 'Learning Management System' },
  { icon: Heart, label: 'Hospital Management' },
  { icon: GraduationCap, label: 'School ERP' },
  { icon: Archive, label: 'Inventory Management' },
  { icon: Calculator, label: 'Accounting Software' },
  { icon: ShoppingCart, label: 'POS' },
  { icon: DollarSign, label: 'Finance Management' },
  { icon: Trello, label: 'Project Management' },
  { icon: PieChart, label: 'Business Intelligence' },
  { icon: Building, label: 'Enterprise Applications' },
  { icon: Code2, label: 'Custom Software' },
  { icon: Globe, label: 'SaaS Products' },
];

export default function SoftwareSolutions() {
  const ref = useScrollAnimation();
  const gridRef = useScrollAnimation();

  return (
    <section id="software-solutions" className="bg-white section-padding">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="animate-on-scroll text-center mb-14">
          <p className="section-subtitle">Ready-to-Deploy</p>
          <h2 className="section-title mb-4">
            Software <span className="gradient-text">Solutions</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Production-ready, customizable software products built for modern businesses — deploy quickly and scale with confidence.
          </p>
        </div>

        <div ref={gridRef} className="animate-on-scroll grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {solutions.map(sol => (
            <div
              key={sol.label}
              className="group flex flex-col items-center gap-3 bg-gradient-to-br from-violet-50 to-white border border-violet-100 hover:border-violet-400 rounded-2xl p-5 hover:shadow-violet-lg hover:-translate-y-1 transition-all duration-300 cursor-default text-center"
            >
              <div className="w-12 h-12 bg-white group-hover:bg-violet-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-violet transition-all duration-300 border border-violet-100 group-hover:border-violet-700">
                <sol.icon className="w-5 h-5 text-violet-700 group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-violet-700 transition-colors leading-tight">
                {sol.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-16 bg-gradient-to-r from-violet-700 to-violet-600 rounded-3xl p-10 text-center text-white shadow-violet-lg">
          <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-3">
            Ready to Transform Your Business?
          </h3>
          <p className="text-violet-100 mb-6 max-w-xl mx-auto">
            Partner with Quantifix Technologies to accelerate your digital transformation with custom software, AI-powered automation, HRMS, CRM, ERP, cloud solutions, and telecom engineering services.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#contact"
              onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="bg-white text-violet-700 font-semibold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors shadow-md hover:-translate-y-0.5"
            >
              Start Your Project
            </a>
            <a
              href="#contact"
              onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors hover:-translate-y-0.5"
            >
              Schedule a Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
