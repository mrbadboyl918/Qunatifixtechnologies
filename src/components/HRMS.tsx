import {
  LayoutDashboard, Clock, DollarSign, Calendar,
  UserPlus, BarChart, BookOpen, Monitor, Bell, FileText,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const modules = [
  { icon: LayoutDashboard, label: 'Employee Dashboard' },
  { icon: Clock, label: 'Attendance Tracking' },
  { icon: DollarSign, label: 'Payroll Management' },
  { icon: Calendar, label: 'Leave Management' },
  { icon: UserPlus, label: 'Recruitment' },
  { icon: BarChart, label: 'Performance Management' },
  { icon: BookOpen, label: 'Training & Development' },
  { icon: Monitor, label: 'Asset Management' },
  { icon: FileText, label: 'Reports & Analytics' },
  { icon: Bell, label: 'Notifications' },
];

export default function HRMS() {
  const ref = useScrollAnimation();

  return (
    <section id="hrms" className="bg-white section-padding">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="animate-on-scroll grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <p className="section-subtitle">HR Management</p>
            <h2 className="section-title mb-5">
              Complete HR Management{' '}
              <span className="gradient-text">Platform</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              Quantifix HRMS is a comprehensive Human Resource Management System designed to streamline every HR function — from recruitment to retirement. Manage your entire workforce from a single, intelligent platform.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {modules.map(mod => (
                <div
                  key={mod.label}
                  className="flex items-center gap-3 bg-violet-50 hover:bg-violet-100 rounded-xl px-4 py-3 transition-colors group"
                >
                  <div className="w-8 h-8 bg-violet-100 group-hover:bg-violet-700 rounded-lg flex items-center justify-center transition-colors shrink-0">
                    <mod.icon className="w-4 h-4 text-violet-700 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{mod.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="btn-primary"
              >
                Request Demo
              </a>
            </div>
          </div>

          {/* Right: visual card */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-3xl p-8 shadow-violet">
              {/* Mock dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-poppins font-bold text-lg text-gray-900">Employee Overview</span>
                  <span className="text-xs text-violet-600 bg-violet-50 px-3 py-1 rounded-full font-medium border border-violet-100">Live</span>
                </div>
                {[
                  { label: 'Total Employees', value: '248', change: '+12%', color: 'violet' },
                  { label: 'Present Today', value: '231', change: '93.1%', color: 'green' },
                  { label: 'On Leave', value: '17', change: '6.9%', color: 'orange' },
                  { label: 'New Hires (Month)', value: '8', change: '+3', color: 'blue' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-50">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <div className="text-right">
                      <span className="font-poppins font-bold text-gray-900">{stat.value}</span>
                      <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                    </div>
                  </div>
                ))}

                {/* Attendance bar */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Attendance Rate</span>
                    <span className="font-semibold text-violet-700">93.1%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-violet-700 to-violet-500 h-2.5 rounded-full" style={{ width: '93.1%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {['Payroll', 'Leaves', 'Training'].map(item => (
                    <div key={item} className="bg-violet-700 text-white rounded-xl p-3 text-center text-sm font-medium select-none">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
