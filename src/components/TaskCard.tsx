import React from 'react';
import { Task } from '../types';
import { Calendar, Clock, MoreVertical, Trash2, Edit2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit, onStatusChange }) => {
  const priorityColors = {
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const statusIcons = {
    todo: <Circle size={18} className="text-slate-400" />,
    'in-progress': <Clock size={18} className="text-brand-secondary" />,
    done: <CheckCircle2 size={18} className="text-brand-primary" />,
  };

  return (
    <div className="vibrant-card p-4 flex flex-col gap-3 group relative">
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

      <div>
        <h3 className="font-bold text-lg leading-tight mb-1">{task.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>
      </div>

      <div className="mt-auto pt-3 border-t-2 border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Calendar size={14} />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
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
          {statusIcons[task.status]}
        </div>
      </div>
    </div>
  );
};
