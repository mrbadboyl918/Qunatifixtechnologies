import {
  Code2, Globe, Smartphone, Brain, Users, BarChart3,
  Package, Cloud, Wifi, Layers, ArrowRight,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const services = [
  {
    icon: Code2,
    title: 'Custom Software Development',
    color: 'violet',
    items: ['Enterprise Applications', 'Business Software', 'SaaS Platforms', 'Desktop Applications', 'Cloud Applications'],
    href: '#software-solutions',
  },
  {
    icon: Globe,
    title: 'Web Development',
    color: 'purple',
    items: ['Corporate Websites', 'Business Portals', 'E-Commerce', 'Admin Dashboards', 'CMS Solutions', 'Progressive Web Apps'],
    href: '#software-solutions',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    color: 'violet',
    items: ['Android Apps', 'iOS Apps', 'Flutter', 'React Native', 'Enterprise Mobile Applications'],
    href: '#software-solutions',
  },
  {
    icon: Brain,
    title: 'Artificial Intelligence & Automation',
    color: 'purple',
    items: ['AI Chatbots', 'AI Agents', 'OpenAI Integration', 'Google ADK', 'Business Process Automation', 'Workflow Automation', 'Document Automation', 'Email Automation', 'Data Intelligence', 'Machine Learning'],
    href: '#automation',
  },
  {
    icon: Users,
    title: 'CRM Solutions',
    color: 'violet',
    items: ['Lead Management', 'Customer Management', 'Sales Pipeline', 'Quotation Management', 'Marketing Automation', 'Customer Support', 'Analytics Dashboard'],
    href: '#crm',
  },
  {
    icon: BarChart3,
    title: 'HRMS Solutions',
    color: 'purple',
    items: ['Employee Management', 'Attendance', 'Payroll', 'Leave Management', 'Recruitment', 'Performance Management', 'Training', 'Employee Self-Service Portal'],
    href: '#hrms',
  },
  {
    icon: Package,
    title: 'ERP Solutions',
    color: 'violet',
    items: ['Finance', 'Inventory', 'Accounting', 'Warehouse', 'Sales', 'Purchase', 'Manufacturing', 'Reporting'],
    href: '#software-solutions',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions',
    color: 'purple',
    items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Cloud Migration', 'Cloud Security', 'DevOps', 'Hosting'],
    href: '#contact',
  },
  {
    icon: Wifi,
    title: 'Telecom Engineering',
    color: 'violet',
    items: ['FTTH Planning', 'OSP Design', 'Fiber Network Planning', 'GIS Mapping', 'IQGeo', 'QGIS', 'AutoCAD', 'Permit Management', 'Telecom Documentation'],
    href: '#contact',
  },
  {
    icon: Layers,
    title: 'UI/UX Design',
    color: 'purple',
    items: ['Figma', 'Wireframes', 'Prototypes', 'Design Systems', 'Responsive UI', 'User Experience'],
    href: '#contact',
  },
];

export default function Services() {
  const titleRef = useScrollAnimation();
  const gridRef = useScrollAnimation();

  return (
    <section id="services" className="bg-white section-padding">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="animate-on-scroll text-center mb-16">
          <p className="section-subtitle">What We Offer</p>
          <h2 className="section-title mb-4">
            Comprehensive{' '}
            <span className="gradient-text">Technology Services</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            From custom software to AI automation, we deliver end-to-end technology solutions that drive measurable business value.
          </p>
        </div>

        <div ref={gridRef} className="animate-on-scroll grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map(service => (
            <a
              key={service.title}
              href={service.href}
              onClick={e => { e.preventDefault(); document.getElementById(service.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-card hover:shadow-violet-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Hover gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-700 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-violet-100 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-violet-700 group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="font-poppins font-semibold text-base text-gray-900 group-hover:text-white mb-3 transition-colors duration-300 leading-snug">
                  {service.title}
                </h3>

                <ul className="space-y-1.5 mb-4">
                  {service.items.slice(0, 5).map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-violet-100 transition-colors duration-300">
                      <span className="w-1 h-1 bg-violet-400 group-hover:bg-violet-200 rounded-full shrink-0 transition-colors" />
                      {item}
                    </li>
                  ))}
                  {service.items.length > 5 && (
                    <li className="text-xs text-violet-400 group-hover:text-violet-200 font-medium transition-colors">
                      +{service.items.length - 5} more
                    </li>
                  )}
                </ul>

                <div className="flex items-center gap-1 text-xs font-semibold text-violet-600 group-hover:text-white transition-colors">
                  Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
