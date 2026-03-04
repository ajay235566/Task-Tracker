import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, MessageSquare, User, CheckCircle2, ArrowLeft } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface ContactPageProps {
  onBack?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    trackEvent('contact_form_submit');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsSubmitted(true);
        trackEvent('contact_form_success');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto min-h-[50vh] flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-brand-primary border-4 border-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <CheckCircle2 size={40} className="text-white" />
        </motion.div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Message Sent!</h2>
        <p className="text-slate-500 font-bold max-w-md mb-8">
          Thank you for reaching out. We've received your message and will get back to you as soon as possible.
        </p>
        <button
          onClick={onBack}
          className="vibrant-button bg-slate-900 text-white px-8 py-3 flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-10 bg-white">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Contact Info */}
        <div className="md:w-1/3 space-y-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4">
              Get in <span className="text-brand-primary">Touch</span>
            </h1>
            <p className="text-slate-500 font-bold leading-relaxed">
              Have questions, feedback, or just want to say hi? We'd love to hear from you.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 bg-brand-accent border-2 border-slate-900 rounded-lg flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Email Us</p>
                <p className="text-xs font-bold">support@taskit.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-10 h-10 bg-brand-primary border-2 border-slate-900 rounded-lg flex items-center justify-center">
                <MessageSquare size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Live Chat</p>
                <p className="text-xs font-bold">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white border-4 border-slate-900 p-6 sm:p-8 rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase flex items-center gap-2">
                  <User size={14} /> Full Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full p-3 border-2 border-slate-900 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase flex items-center gap-2">
                  <Mail size={14} /> Email Address
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full p-3 border-2 border-slate-900 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-slate-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase">Subject</label>
              <input
                required
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="w-full p-3 border-2 border-slate-900 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase">Message</label>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us more about your inquiry..."
                className="w-full p-3 border-2 border-slate-900 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-slate-50 resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-500 rounded-lg text-red-600 text-xs font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full vibrant-button bg-brand-primary text-white py-4 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Send size={20} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
