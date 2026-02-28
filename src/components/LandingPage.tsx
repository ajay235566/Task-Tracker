import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Zap, Bell, Trophy, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b-2 border-slate-900 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <CheckCircle2 className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Vibrant Tasker</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogin} className="text-sm font-bold hover:text-brand-primary transition-colors">Login</button>
          <button 
            onClick={onSignup}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl sm:text-8xl font-black leading-[0.9] tracking-tighter uppercase mb-6">
            Crush your <span className="text-brand-primary">Goals</span> with style.
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-lg font-medium">
            The task manager that feels like a game. Earn XP, unlock badges, and get smart email reminders for your most important work.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onSignup}
              className="bg-brand-primary text-white px-8 py-4 rounded-xl font-black text-lg border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2"
            >
              Start Tasking Now <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-slate-100 border-4 border-slate-900 rounded-3xl p-8 shadow-[12px_12px_0px_0px_rgba(16,185,129,1)]">
            <div className="space-y-4">
              {[
                { title: 'Design Landing Page', priority: 'high', status: 'done' },
                { title: 'Setup Email Reminders', priority: 'medium', status: 'in-progress' },
                { title: 'Launch Product', priority: 'high', status: 'todo' },
              ].map((task, i) => (
                <div key={i} className="bg-white border-2 border-slate-900 p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 border-slate-900 ${task.status === 'done' ? 'bg-brand-primary' : 'bg-white'}`} />
                    <span className="font-bold">{task.title}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border-2 border-slate-900 ${task.priority === 'high' ? 'bg-rose-100' : 'bg-amber-100'}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Floating Accents */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-6 -right-6 bg-amber-400 border-4 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Trophy className="text-white" size={32} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-6 -left-6 bg-brand-primary border-4 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Zap className="text-white" size={32} />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 border-y-4 border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-amber-500" />, title: 'Gamified XP', desc: 'Level up as you complete tasks and unlock exclusive badges.' },
            { icon: <Bell className="text-brand-primary" />, title: 'Smart Reminders', desc: 'Never miss a deadline with automated email notifications.' },
            { icon: <Trophy className="text-indigo-500" />, title: 'Achievements', desc: 'Track your progress and celebrate your productivity wins.' },
          ].map((f, i) => (
            <div key={i} className="bg-white border-4 border-slate-900 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-12 h-12 bg-slate-100 border-2 border-slate-900 rounded-lg flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black uppercase mb-2">{f.title}</h3>
              <p className="text-slate-600 font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t-2 border-slate-100">
        <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">© 2026 Vibrant Tasker • Built for Doers</p>
      </footer>
    </div>
  );
};
