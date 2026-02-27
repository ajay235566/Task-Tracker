import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: any) => void;
  icon?: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  icon,
  className,
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 bg-white px-3 py-2 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none group w-full sm:w-auto",
          isOpen && "shadow-none translate-x-0 translate-y-0 bg-slate-50"
        )}
      >
        {icon && <div className="text-slate-900 group-hover:scale-110 transition-transform">{icon}</div>}
        <span className="text-xs font-black uppercase tracking-tight truncate max-w-[120px]">
          {selectedOption.label}
        </span>
        <ChevronDown 
          size={14} 
          className={cn("ml-auto transition-transform duration-200", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className={cn(
              "absolute top-full mt-2 w-full min-w-[160px] bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 rounded-lg overflow-hidden",
              align === 'right' ? "right-0" : "left-0"
            )}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-xs font-bold transition-colors border-b last:border-b-0 border-slate-100 hover:bg-brand-primary/10 flex items-center justify-between",
                  value === option.value ? "bg-brand-primary/20 text-slate-900" : "text-slate-600"
                )}
              >
                {option.label}
                {value === option.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary border border-slate-900" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
