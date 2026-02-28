import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Zap, Bell, Trophy, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] bg-white text-slate-900 font-sans selection:bg-brand-primary/30 border-4 sm:border-[12px] border-slate-900 rounded-[24px] sm:rounded-[48px] m-2 sm:m-4 overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b-2 sm:border-b-4 border-slate-900 z-50 px-3 sm:px-6 py-2 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-primary border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer"
          >
            <CheckCircle2 className="text-white" size={18} />
          </motion.div>
          <span className="text-base sm:text-xl font-black tracking-tighter uppercase whitespace-nowrap">Vibrant Tasker</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onLogin} className="text-xs sm:text-sm font-bold hover:text-brand-primary transition-colors hidden min-[400px]:block">Login</button>
          <motion.button 
            whileHover={{ scale: 1.05, translateZ: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSignup}
            className="bg-slate-900 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-[10px] sm:text-sm shadow-[2px_2px_0px_0px_rgba(16,185,129,1)] sm:shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] hover:shadow-none hover:translate-x-[1px] sm:hover:translate-x-[2px] hover:translate-y-[1px] sm:hover:translate-y-[2px] transition-all"
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-10 sm:pt-20 pb-10 sm:pb-20 px-3 sm:px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-brand-accent border-2 border-slate-900 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-default"
          >
            Productivity Reimagined
          </motion.div>
          <h1 className="text-xl sm:text-8xl font-black leading-tight sm:leading-[0.9] tracking-normal sm:tracking-tighter uppercase mb-6 break-words">
            Crush your <span className="text-brand-primary">Goals</span> with style.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-lg font-medium">
            The task manager that feels like a game. Earn XP, unlock badges, and get smart email reminders for your most important work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSignup}
              className="bg-brand-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-sm sm:text-lg border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Start Tasking Now <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <motion.div 
            whileHover={{ rotate: 1, scale: 1.01 }}
            className="bg-slate-100 border-4 border-slate-900 rounded-3xl p-8 shadow-[12px_12px_0px_0px_rgba(16,185,129,1)]"
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

      {/* Deep Dive Section */}
      <section className="py-12 sm:py-20 bg-brand-accent border-y-2 sm:border-y-4 border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-4">What can you do?</h2>
            <p className="text-lg sm:text-xl font-medium text-slate-700 max-w-2xl mx-auto">Everything you need to stay organized, motivated, and ahead of your deadlines.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Task Management', desc: 'Create, edit, and organize tasks with priorities and due dates. Use our intuitive drag-and-drop feel interface.' },
              { title: 'Progress Tracking', desc: 'Watch your productivity soar with detailed stats and visual progress indicators for all your projects.' },
              { title: 'Email Reminders', desc: 'Get notified when tasks are due. Our smart system sends reminders directly to your inbox.' },
              { title: 'XP & Levels', desc: 'Every completed task earns you XP. Level up your profile and unlock unique achievement badges.' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10, rotate: i % 2 === 0 ? 1 : -1 }}
                className="bg-white border-4 border-slate-900 p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              >
                <h3 className="text-xl font-black uppercase mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="bg-rose-100 border-4 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-2 cursor-default"
              >
                <h4 className="font-black uppercase mb-2">Students</h4>
                <p className="text-xs font-medium">Track assignments, exams, and study sessions with ease.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="bg-amber-100 border-4 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 cursor-default"
              >
                <h4 className="font-black uppercase mb-2">Creatives</h4>
                <p className="text-xs font-medium">Manage projects, deadlines, and creative breakthroughs.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="bg-indigo-100 border-4 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1 cursor-default"
              >
                <h4 className="font-black uppercase mb-2">Teams</h4>
                <p className="text-xs font-medium">Keep your personal workflow sharp while staying on top of work.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="bg-emerald-100 border-4 border-slate-900 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3 cursor-default"
              >
                <h4 className="font-black uppercase mb-2">Gamers</h4>
                <p className="text-xs font-medium">Level up your real-life stats just like your favorite RPG.</p>
              </motion.div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tighter mb-6 break-words">Who is it for?</h2>
            <p className="text-base sm:text-xl text-slate-600 mb-6 font-medium">
              Vibrant Tasker is built for anyone who finds traditional task managers boring. If you want a tool that celebrates your wins and keeps you engaged, you're in the right place.
            </p>
            <ul className="space-y-4">
              {['Gamified progress tracking', 'Clean, bold aesthetic', 'Smart productivity', 'No-nonsense organization'].map((text, i) => (
                <motion.li 
                  key={i} 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 font-bold cursor-default"
                >
                  <div className="w-6 h-6 bg-brand-primary border-2 border-slate-900 rounded flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  {text}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tighter mb-4 break-words">Core Features</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="text-amber-400" />, title: 'Gamified XP', desc: 'Level up as you complete tasks and unlock exclusive badges. Your productivity becomes your score.' },
              { icon: <Bell className="text-brand-primary" />, title: 'Smart Reminders', desc: 'Never miss a deadline with automated email notifications. We keep you on track even when you are away.' },
              { icon: <Trophy className="text-indigo-400" />, title: 'Achievements', desc: 'Track your progress and celebrate your productivity wins with a beautiful badge gallery.' },
            ].map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-slate-800 border-4 border-white p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(16,185,129,1)] hover:shadow-[12px_12px_0px_0px_rgba(16,185,129,1)] transition-all"
              >
                <div className="w-12 h-12 bg-slate-700 border-2 border-white rounded-lg flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black uppercase mb-2">{f.title}</h3>
                <p className="text-slate-400 font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center bg-white border-t-4 border-slate-900">
        <p className="font-bold text-slate-900 uppercase tracking-widest text-sm">© 2026 Vibrant Tasker • Built for Doers</p>
      </footer>
    </div>
  );
};
