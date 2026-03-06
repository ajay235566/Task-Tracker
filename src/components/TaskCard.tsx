import React from 'react';
import { Task } from '../types';
import { Calendar, Clock, MoreVertical, Trash2, Edit2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit, onStatusChange }) => {
  const isDone = task.status === 'done';

  const priorityColors = {
    low: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const statusIcons = {
    todo: <Circle size={18} className="text-slate-400" />,
    'in-progress': <Clock size={18} className="text-brand-secondary" />,
    done: (
      <motion.div
        initial={{ scale: 0.5, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <CheckCircle2 size={18} className="text-brand-primary" />
      </motion.div>
    ),
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDone ? 0.7 : 1, 
        y: 0,
        scale: isDone ? 0.98 : 1,
        backgroundColor: isDone ? '#f8fafc' : '#ffffff'
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "vibrant-card p-4 flex flex-col gap-3 group relative overflow-hidden",
        isDone && "border-slate-200 shadow-none"
      )}
    >
      {isDone && (
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
        />
      )}

      <div className="flex justify-between items-start">
        <span className={cn(
          "text-[10px] font-bold uppercase px-2 py-0.5 rounded border-2 border-slate-900",
          priorityColors[task.priority]
        )}>
          {task.priority}
        </span>
        <div className="flex gap-1">
          <button 
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-rose-50 text-rose-600 rounded transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="relative">
        <h3 className={cn(
          "font-bold text-lg leading-tight mb-1 transition-all duration-500",
          isDone ? "text-slate-400" : "text-slate-900"
        )}>
          {task.title}
          {isDone && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="absolute top-1/2 left-0 h-[2px] bg-slate-400 -translate-y-1/2"
            />
          )}
        </h3>
        <p className={cn(
          "text-sm line-clamp-2 transition-colors duration-500",
          isDone ? "text-slate-300" : "text-slate-600"
        )}>
          {task.description}
        </p>
      </div>

      <div className="mt-auto pt-3 border-t-2 border-slate-100 flex items-center justify-between">
        <div className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-md border-2 transition-colors",
          isDone ? "bg-slate-50 border-slate-200 text-slate-400" : 
          new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0)) ? "bg-rose-50 border-rose-200 text-rose-600" :
          new Date(task.dueDate).toDateString() === new Date().toDateString() ? "bg-amber-50 border-amber-200 text-amber-600" :
          "bg-slate-50 border-slate-200 text-slate-600"
        )}>
          <Calendar size={12} />
          <span className="text-[10px] font-bold uppercase">
            {new Date(task.dueDate).toDateString() === new Date().toDateString() ? 'Today' : 
             new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            className="text-xs font-bold bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <AnimatePresence mode="wait">
            <motion.div
              key={task.status}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {statusIcons[task.status]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
