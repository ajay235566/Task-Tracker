import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Zap, Bell, Trophy, ArrowRight, FileText, Layout, Download, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { TEMPLATE_LIST, TEMPLATE_CONFIGS } from './ResumeTemplates';
import { ScrambledText } from './ScrambledText';
import { trackEvent } from '../lib/analytics';

const ResumePreviewMini: React.FC<{ templateId: string }> = ({ templateId }) => {
  const config = TEMPLATE_CONFIGS.find(c => c.id === templateId) || TEMPLATE_CONFIGS[0];

  return (
    <div className="w-full h-full relative overflow-hidden p-4 flex flex-col gap-2" style={{ backgroundColor: config.bg }}>
      {config.layout === 'sidebar' ? (
        <div className="flex h-full gap-3">
          <div className="w-1/3 rounded-lg p-2 space-y-2" style={{ backgroundColor: config.accent }}>
            <div className="w-8 h-8 rounded-full bg-white/20" />
            <div className="h-2 bg-white/20 rounded w-full" />
            <div className="h-2 bg-white/20 rounded w-2/3" />
            <div className="pt-4 space-y-1">
              <div className="h-1 bg-white/10 rounded w-full" />
              <div className="h-1 bg-white/10 rounded w-full" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="h-4 rounded w-3/4" style={{ backgroundColor: config.accent + '33' }} />
              <div className="h-2 rounded w-1/2" style={{ backgroundColor: config.accent + '11' }} />
            </div>
            <div className="space-y-2">
              <div className="h-2 rounded w-full" style={{ backgroundColor: config.accent + '22' }} />
              <div className="h-2 rounded w-full" style={{ backgroundColor: config.accent + '22' }} />
              <div className="h-2 rounded w-3/4" style={{ backgroundColor: config.accent + '22' }} />
            </div>
          </div>
        </div>
      ) : config.layout === 'timeline' ? (
        <div className="h-full flex flex-col gap-4">
          <div className="border-b-2 pb-2" style={{ borderColor: config.accent + '22' }}>
            <div className="h-6 rounded w-1/2" style={{ backgroundColor: config.accent }} />
          </div>
          <div className="flex flex-1 gap-4">
            <div className="w-1/4 space-y-2">
              <div className="h-2 rounded w-full" style={{ backgroundColor: config.accent + '11' }} />
              <div className="h-2 rounded w-full" style={{ backgroundColor: config.accent + '11' }} />
            </div>
            <div className="flex-1 relative pl-4 border-l-2" style={{ borderColor: config.accent + '11' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="mb-4 relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: config.accent }} />
                  <div className="h-3 rounded w-3/4 mb-1" style={{ backgroundColor: config.accent + '22' }} />
                  <div className="h-2 rounded w-1/2" style={{ backgroundColor: config.accent + '11' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full space-y-6">
          <div className="text-center space-y-2 border-b-2 pb-4" style={{ borderColor: config.accent + '11' }}>
            <div className="h-6 rounded w-1/2 mx-auto" style={{ backgroundColor: config.accent }} />
            <div className="h-2 rounded w-1/3 mx-auto" style={{ backgroundColor: config.accent + '44' }} />
          </div>
          <div className="space-y-4">
            <div className="h-3 rounded w-1/4" style={{ backgroundColor: config.accent + '66' }} />
            <div className="space-y-2">
              <div className="h-2 rounded w-full" style={{ backgroundColor: config.accent + '11' }} />
              <div className="h-2 rounded w-full" style={{ backgroundColor: config.accent + '11' }} />
              <div className="h-2 rounded w-3/4" style={{ backgroundColor: config.accent + '11' }} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-3 rounded w-1/4" style={{ backgroundColor: config.accent + '66' }} />
            <div className="space-y-2">
              <div className="h-2 rounded w-full" style={{ backgroundColor: config.accent + '11' }} />
              <div className="h-2 rounded w-full" style={{ backgroundColor: config.accent + '11' }} />
            </div>
          </div>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: config.accent }} />
    </div>
  );
};

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
  onContact: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup, onContact }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.8;
      const target = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      carouselRef.current.scrollTo({
        left: target,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen sm:min-h-[calc(100vh-2rem)] bg-white text-slate-900 font-sans selection:bg-brand-primary/30 border-0 sm:border-[12px] border-slate-900 rounded-none sm:rounded-[48px] m-0 sm:m-4 overflow-x-hidden max-w-full relative">
      {/* Background Pattern for Mobile */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] sm:opacity-[0.05] z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-white/90 backdrop-blur-md border-b-2 sm:border-b-4 border-slate-900 z-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-1 sm:gap-2 cursor-pointer group shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <motion.div 
            whileHover={{ rotate: 360 }}
            className="w-7 h-7 sm:w-10 sm:h-10 bg-brand-primary border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
          >
            <CheckCircle2 className="text-white" size={16} />
          </motion.div>
          <span className="text-sm sm:text-xl font-black tracking-tighter uppercase whitespace-nowrap group-hover:text-brand-primary transition-colors">Task It</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-4">
          <button onClick={() => { trackEvent('landing_contact_click'); onContact(); }} className="text-xs sm:text-sm font-bold hover:text-brand-primary transition-colors hidden sm:block">Contact</button>
          <button onClick={() => { trackEvent('landing_login_click'); onLogin(); }} className="text-[10px] sm:text-sm font-bold hover:text-brand-primary transition-colors hidden min-[350px]:block">Login</button>
          <motion.button 
            whileHover={{ scale: 1.05, translateZ: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { trackEvent('landing_signup_click'); onSignup(); }}
            className="bg-slate-900 text-white px-2.5 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-[10px] sm:text-sm shadow-[2px_2px_0px_0px_rgba(16,185,129,1)] sm:shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] hover:shadow-none hover:translate-x-[1px] sm:hover:translate-x-[2px] hover:translate-y-[1px] sm:hover:translate-y-[2px] transition-all whitespace-nowrap"
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-32 px-6 sm:px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 sm:gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-brand-accent border-2 border-slate-900 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-default"
          >
            🚀 Productivity Reimagined
          </motion.div>
          <h1 className="text-4xl sm:text-8xl font-black leading-[1.1] sm:leading-[0.9] tracking-tight sm:tracking-tighter uppercase mb-6 break-words">
            Crush your <span className="text-brand-primary inline-block transform -rotate-2 bg-slate-900 text-white px-3 sm:px-0 sm:bg-transparent sm:text-brand-primary">Goals</span> <br className="hidden sm:block" /> with style.
          </h1>
          <p className="text-base sm:text-xl text-slate-600 mb-10 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
            The task manager that feels like a game. Earn XP, unlock badges, and get smart email reminders for your most important work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <motion.button 
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { trackEvent('landing_hero_cta_click'); onSignup(); }}
              className="bg-brand-primary text-slate-900 px-8 py-5 rounded-2xl font-black text-lg border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-3 w-full sm:w-auto group"
            >
              Start Tasking Now 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
            </motion.button>
            <button 
              onClick={onLogin}
              className="sm:hidden text-slate-900 font-black uppercase tracking-widest text-xs py-4 border-2 border-slate-900 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              Log In to Account
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative pr-6 sm:pr-0"
        >
          <motion.div 
            whileHover={{ rotate: 1, scale: 1.01 }}
            className="bg-slate-100 border-4 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] sm:shadow-[12px_12px_0px_0px_rgba(16,185,129,1)]"
          >
            <div className="space-y-4">
              {[
                { title: 'Design Landing Page', priority: 'high', status: 'done' },
                { title: 'Setup Email Reminders', priority: 'medium', status: 'in-progress' },
                { title: 'Launch Product', priority: 'high', status: 'todo' },
              ].map((task, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 10, backgroundColor: '#f8fafc' }}
                  className="bg-white border-2 border-slate-900 p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between cursor-default gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-6 h-6 rounded-full border-2 border-slate-900 shrink-0 ${task.status === 'done' ? 'bg-brand-primary' : 'bg-white'}`} />
                    <span className="font-bold truncate">{task.title}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border-2 border-slate-900 shrink-0 ${task.priority === 'high' ? 'bg-rose-100' : 'bg-amber-100'}`}>
                    {task.priority}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* Floating Accents */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="absolute top-0 right-0 sm:-top-6 sm:-right-6 bg-amber-400 border-4 border-slate-900 p-2 sm:p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer z-10"
          >
            <Trophy className="text-white" size={24} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            whileHover={{ scale: 1.2, rotate: -10 }}
            className="absolute bottom-0 left-0 sm:-bottom-6 sm:-left-6 bg-brand-primary border-4 border-slate-900 p-2 sm:p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer z-10"
          >
            <Zap className="text-white" size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* Resume Creation Section */}
      <section className="py-20 sm:py-24 bg-white border-b-4 border-slate-900 overflow-x-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="max-w-7xl mx-auto px-6 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-block bg-indigo-100 border-2 border-slate-900 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                ✨ New Feature
              </div>
              <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight sm:tracking-tighter mb-6 leading-[1.1] sm:leading-none">
                Build a <span className="text-indigo-600 underline decoration-slate-900 decoration-4 underline-offset-4">Resume</span> <br className="hidden sm:block" /> that stands out.
              </h2>
              <p className="text-base sm:text-xl text-slate-600 mb-10 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Our professional resume builder helps you create a stunning CV in minutes. Choose from 20+ templates designed to get you hired.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: <Layout size={18} />, text: '20+ Professional Templates' },
                  { icon: <Palette size={18} />, text: 'Customizable Colors & Fonts' },
                  { icon: <Download size={18} />, text: 'One-click PDF Export' },
                  { icon: <FileText size={18} />, text: 'ATS-Friendly Layouts' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-bold text-slate-700">
                    <div className="w-8 h-8 bg-indigo-50 border-2 border-slate-900 rounded flex items-center justify-center text-indigo-600">
                      {item.icon}
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSignup}
                className="bg-indigo-600 text-white px-6 py-4 sm:px-8 sm:py-4 rounded-xl font-black text-sm sm:text-lg border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Create My Resume <ArrowRight size={20} />
              </motion.button>
            </motion.div>

            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600/5 -rotate-3 rounded-3xl border-4 border-dashed border-slate-300" />
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-white border-4 border-slate-900 rounded-3xl p-4 sm:p-8 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] sm:shadow-[12px_12px_0px_0px_rgba(79,70,229,1)]"
              >
                <div className="aspect-[3/4] bg-white rounded-xl border-2 border-slate-900 overflow-hidden relative group">
                  <ResumePreviewMini templateId="template-1" />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all">
                    <div className="bg-white border-4 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-[80%]">
                      <FileText className="mx-auto mb-4 text-indigo-600" size={48} />
                      <h3 className="text-xl font-black uppercase mb-2">Live Editor</h3>
                      <p className="text-xs font-bold text-slate-500">Real-time preview as you type your details.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Template Carousel */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tighter">Popular Templates</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => scroll('left')}
                  className="w-10 h-10 border-2 border-slate-900 rounded-full flex items-center justify-center bg-white cursor-pointer hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="w-10 h-10 border-2 border-slate-900 rounded-full flex items-center justify-center bg-white cursor-pointer hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden py-4 -mx-4 px-4">
              <div 
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto pt-12 pb-8 no-scrollbar snap-x scroll-smooth"
              >
                {TEMPLATE_LIST.slice(0, 12).map((template, i) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ y: -10, rotate: i % 2 === 0 ? 1 : -1 }}
                    className="flex-none w-48 sm:w-64 snap-start"
                  >
                    <div className="bg-white border-4 border-slate-900 rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group cursor-pointer">
                      <div className="aspect-[3/4] bg-white relative overflow-hidden">
                        <ResumePreviewMini templateId={template.id} />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
                      </div>
                      <div className="p-4 border-t-4 border-slate-900 flex justify-between items-center bg-white">
                        <span className="font-black uppercase text-xs sm:text-sm">{template.name}</span>
                        <div className="w-6 h-6 bg-indigo-600 border-2 border-slate-900 rounded flex items-center justify-center">
                          <ArrowRight size={12} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-20 sm:py-32 bg-brand-accent border-y-2 sm:border-y-4 border-slate-900 overflow-x-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-6 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight sm:tracking-tighter mb-6 leading-[1.1] sm:leading-none">What can you do?</h2>
            <p className="text-base sm:text-xl font-medium text-slate-800 max-w-2xl mx-auto leading-relaxed">Everything you need to stay organized, motivated, and ahead of your deadlines.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pr-2 sm:pr-0">
            {[
              { title: 'Task Management', desc: 'Create, edit, and organize tasks with priorities and due dates. Use our intuitive drag-and-drop feel interface.', color: 'bg-white' },
              { title: 'Progress Tracking', desc: 'Watch your productivity soar with detailed stats and visual progress indicators for all your projects.', color: 'bg-white' },
              { title: 'Email Reminders', desc: 'Get notified when tasks are due. Our smart system sends reminders directly to your inbox.', color: 'bg-white' },
              { title: 'XP & Levels', desc: 'Every completed task earns you XP. Level up your profile and unlock unique achievement badges.', color: 'bg-white' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, rotate: i % 2 === 0 ? 1 : -1 }}
                className={`${item.color} border-4 border-slate-900 p-6 sm:p-8 rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 border-2 border-slate-900 rounded-xl mb-4 sm:mb-6 flex items-center justify-center group-hover:bg-brand-primary transition-colors">
                  <span className="font-black text-lg sm:text-xl">{i + 1}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase mb-3 sm:mb-4 tracking-tight">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Task Tracker Section */}
      <section className="py-20 sm:py-32 bg-brand-primary/10 border-b-4 border-slate-900 overflow-x-hidden relative">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -ml-32 -mb-32" />
        <div className="max-w-7xl mx-auto px-6 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-brand-primary/5 rotate-3 rounded-[2.5rem] border-4 border-dashed border-slate-300" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative bg-white border-4 border-slate-900 rounded-[2.5rem] p-6 sm:p-10 shadow-[10px_10px_0px_0px_rgba(16,185,129,1)] sm:shadow-[20px_20px_0px_0px_rgba(16,185,129,1)]"
              >
                <div className="space-y-4">
                  {[
                    { title: 'Complete Project Proposal', priority: 'high', status: 'done', xp: '+50 XP' },
                    { title: 'Review Team Feedback', priority: 'medium', status: 'in-progress', xp: '+20 XP' },
                    { title: 'Update Resume', priority: 'high', status: 'todo', xp: '+50 XP' },
                  ].map((task, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 10, backgroundColor: '#f8fafc' }}
                      className="bg-white border-2 border-slate-900 p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between cursor-default gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-6 h-6 rounded-full border-2 border-slate-900 shrink-0 ${task.status === 'done' ? 'bg-brand-primary' : 'bg-white'}`} />
                        <div className="min-w-0">
                          <span className="font-bold truncate block">{task.title}</span>
                          <span className="text-[10px] font-black text-brand-primary">{task.xp}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border-2 border-slate-900 shrink-0 ${task.priority === 'high' ? 'bg-rose-100' : 'bg-amber-100'}`}>
                        {task.priority}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="inline-block bg-emerald-100 border-2 border-slate-900 px-3 py-1 rounded-full text-xs font-black uppercase mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Gamified Experience
              </div>
              <h2 className="text-xl sm:text-6xl font-black uppercase tracking-tight sm:tracking-tighter mb-6 leading-tight sm:leading-none">
                Master your <span className="text-brand-primary">Tasks</span>.
              </h2>
              <p className="text-base sm:text-xl text-slate-600 mb-8 font-medium">
                Turn your to-do list into a game. Earn XP, level up, and unlock achievements as you crush your daily goals.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8 pr-2 sm:pr-0">
                {[
                  { label: 'XP Points', value: 'Earn for every task' },
                  { label: 'Levels', value: 'Unlock new features' },
                  { label: 'Badges', value: 'Show off your wins' },
                  { label: 'Reminders', value: 'Never miss a beat' }
                ].map((item, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05, backgroundColor: '#f8fafc' }} className="bg-white border-2 border-slate-900 p-3 rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] sm:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-[10px] font-black uppercase text-slate-400">{item.label}</p>
                    <p className="text-xs font-bold text-slate-900">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSignup}
                className="bg-brand-primary text-white px-6 py-4 sm:px-8 sm:py-4 rounded-xl font-black text-sm sm:text-lg border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Start Tasking <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 sm:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Students', desc: 'Track assignments, exams, and study sessions with ease.', color: 'bg-rose-100', rotate: 'rotate-1' },
                { title: 'Creatives', desc: 'Manage projects, deadlines, and creative breakthroughs.', color: 'bg-amber-100', rotate: '-rotate-1' },
                { title: 'Teams', desc: 'Keep your personal workflow sharp while staying on top of work.', color: 'bg-indigo-100', rotate: '-rotate-2' },
                { title: 'Gamers', desc: 'Level up your real-life stats just like your favorite RPG.', color: 'bg-emerald-100', rotate: 'rotate-2' }
              ].map((type, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className={`${type.color} border-4 border-slate-900 p-8 rounded-[2.5rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${type.rotate} cursor-default`}
                >
                  <h4 className="text-xl font-black uppercase mb-3 tracking-tight">{type.title}</h4>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">{type.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight sm:tracking-tighter mb-8 leading-[1.1] sm:leading-none">Who is it for?</h2>
            <p className="text-base sm:text-xl text-slate-600 mb-10 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Vibrant Tasker is built for anyone who finds traditional task managers boring. If you want a tool that celebrates your wins and keeps you engaged, you're in the right place.
            </p>
            <ul className="space-y-5 inline-block lg:block text-left">
              {['Gamified progress tracking', 'Clean, bold aesthetic', 'Smart productivity', 'No-nonsense organization'].map((text, i) => (
                <motion.li 
                  key={i} 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 font-bold cursor-default text-slate-800"
                >
                  <div className="w-8 h-8 bg-brand-primary border-2 border-slate-900 rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <CheckCircle2 size={18} className="text-slate-900" />
                  </div>
                  <span className="text-lg">{text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        <div className="max-w-7xl mx-auto px-6 sm:px-6 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight sm:tracking-tighter mb-6 leading-[1.1] sm:leading-none">Core Features</h2>
            <p className="text-slate-400 font-medium max-w-xl mx-auto">Everything you need to level up your life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              { icon: <Zap className="text-amber-400" />, title: 'Gamified XP', desc: 'Level up as you complete tasks and unlock exclusive badges. Your productivity becomes your score.' },
              { icon: <Bell className="text-brand-primary" />, title: 'Smart Reminders', desc: 'Never miss a deadline with automated email notifications. We keep you on track even when you are away.' },
              { icon: <Trophy className="text-indigo-400" />, title: 'Achievements', desc: 'Track your progress and celebrate your productivity wins with a beautiful badge gallery.' },
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-slate-800 border-4 border-white p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(16,185,129,1)] hover:shadow-[12px_12px_0px_0px_rgba(16,185,129,1)] transition-all"
              >
                <div className="w-14 h-14 bg-slate-700 border-2 border-white rounded-2xl flex items-center justify-center mb-8">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t-4 border-slate-900 flex flex-col items-center justify-center gap-8">
        <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
          <p className="font-bold text-slate-900 uppercase tracking-widest text-sm">
            © 2026 Vibrant Tasker • Built for People Like Me
          </p>

          {/* Your GIF mapping logic remains here */}
          {[
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWczZzl0b21vbTRjZDZlbGd1a2VheDA3N3RwZ3FsaDd0NHFrZDF0eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26ufnwz3wDUli7GU0/giphy.gif"
          ].map((gif, idx) => (
            <div 
              key={idx} 
              className={cn(
                "h-12.5 w-12.5 shrink-0 border-2 border-slate-900 rounded overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white",
                idx > 0 && "hidden md:block"
              )}
            >
              <img 
                src={gif} 
                alt={`Anime ${idx}`} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-[13.5px] sm:text-[18px] font-black text-slate-900 uppercase tracking-tighter">
            Created by{" "}
            <ScrambledText text="Ajay Kumar Nallamothu" />
          </p>
        </div>
      </footer>
    </div>
  );
};
