import {
  Heart, GraduationCap, ShoppingBag, Factory, Radio,
  HardHat, Home, DollarSign, Shield, Landmark, Truck,
  Hotel, Rocket, Building2, ShoppingCart,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const industries = [
  { icon: Heart, label: 'Healthcare' },
  { icon: GraduationCap, label: 'Education' },
  { icon: ShoppingBag, label: 'Retail' },
  { icon: Factory, label: 'Manufacturing' },
  { icon: Radio, label: 'Telecommunications' },
  { icon: HardHat, label: 'Construction' },
  { icon: Home, label: 'Real Estate' },
  { icon: DollarSign, label: 'Finance' },
  { icon: Shield, label: 'Insurance' },
  { icon: Landmark, label: 'Government' },
  { icon: Truck, label: 'Logistics' },
  { icon: Hotel, label: 'Hospitality' },
  { icon: Rocket, label: 'Startups' },
  { icon: Building2, label: 'SMBs' },
  { icon: ShoppingCart, label: 'E-Commerce' },
];

export default function Industries() {
  const ref = useScrollAnimation();
  const gridRef = useScrollAnimation();

  return (
    <section id="industries" className="bg-violet-50 section-padding">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="animate-on-scroll text-center mb-14">
          <p className="section-subtitle">Our Reach</p>
          <h2 className="section-title mb-4">
            Industries <span className="gradient-text">We Serve</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We deliver tailored technology solutions across diverse industries, helping businesses of every size transform and scale.
          </p>
        </div>

        <div ref={gridRef} className="animate-on-scroll grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-4">
          {industries.map(ind => (
            <div
              key={ind.label}
              className="group flex flex-col items-center gap-3 bg-white rounded-2xl p-5 shadow-card hover:shadow-violet-lg hover:-translate-y-1 transition-all duration-300 border border-white hover:border-violet-200 cursor-default"
            >
              <div className="w-12 h-12 bg-violet-50 group-hover:bg-violet-700 rounded-xl flex items-center justify-center transition-colors duration-300">
                <ind.icon className="w-6 h-6 text-violet-700 group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-violet-700 transition-colors text-center leading-tight">
                {ind.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
