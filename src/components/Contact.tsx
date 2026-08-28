import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Send, AlertCircle, MessageCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/lib/supabase';

const services = [
  'Custom Software Development', 'Web Development', 'Mobile App Development',
  'AI & Automation', 'CRM Solutions', 'HRMS Solutions', 'ERP Solutions',
  'Cloud Solutions', 'Telecom Engineering', 'UI/UX Design', 'Other',
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

export default function Contact() {
  const ref = useScrollAnimation();
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', company: '', service: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    const { error } = await supabase.from('contact_submissions').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      company: form.company || null,
      service: form.service || null,
      message: form.message,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError('Something went wrong. Please try again or email us directly.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-white section-padding">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="animate-on-scroll text-center mb-14">
          <p className="section-subtitle">Get In Touch</p>
          <h2 className="section-title mb-4">
            Let's Build Your Next{' '}
            <span className="gradient-text">Digital Solution</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Ready to start your digital transformation journey? Reach out and let's discuss how Quantifix can help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-violet-700 to-violet-600 text-white rounded-2xl p-8 shadow-violet-lg">
              <h3 className="font-poppins font-bold text-xl mb-6">Contact Information</h3>
              <div className="space-y-5">
                <a
                  href="mailto:quantifixtechnologies@outlook.com"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-violet-200 text-xs mb-0.5">Email</div>
                    <div className="text-sm font-medium break-all">quantifixtechnologies@outlook.com</div>
                  </div>
                </a>
                <a
                  href="tel:+919014786159"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-violet-200 text-xs mb-0.5">Phone</div>
                    <div className="text-sm font-medium">+91 9014786159</div>
                  </div>
                </a>
                <a
                  href="https://wa.me/919014786159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-violet-200 text-xs mb-0.5">WhatsApp</div>
                    <div className="text-sm font-medium">+91 9014786159</div>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-violet-200 text-xs mb-0.5">Location</div>
                    <div className="text-sm font-medium leading-relaxed">Floor No: 7, Flat No: 604,<br />DSL Building, Survey Colony,<br />IADA, Uppal, Hyderabad,<br />Telangana 500039</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden shadow-card border border-gray-100 h-52">
              <iframe
                title="Quantifix Technologies Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.5569!3d17.4044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99d98a87b56b%3A0xa682505ac3ec2cae!2sQuantifix%20Technologies%20pvt%20ltd!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-poppins font-bold text-xl text-gray-900 mb-2">Message Sent!</h4>
                <p className="text-gray-500 mb-6">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' }); }}
                  className="btn-outline text-sm py-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-violet-50 border border-violet-100 rounded-2xl p-8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXXXXXXX"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Your company"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Required</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"
                  >
                    <option value="">Select a service</option>
                    {services.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project, requirements, or any questions..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
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
        </div>
      </div>
    </section>
  );
}
