import React from 'react';
import { Badge } from '../types';
import { motion } from 'motion/react';
import { Trophy, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

interface BadgeGalleryProps {
  badges: Badge[];
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ badges }) => {
  return (
    <div className="vibrant-card p-6 bg-white">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-brand-primary" size={24} />
        <h2 className="text-xl font-black tracking-tight">Achievements</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className={cn(
              "relative p-4 rounded-2xl border-4 flex flex-col items-center text-center gap-2 transition-all",
              badge.unlockedAt 
                ? "border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ring-4 ring-brand-primary/20" 
                : "border-slate-200 bg-slate-50 opacity-40 grayscale"
            )}
          >
            <div className={cn(
              "relative w-20 h-20 mb-2 rounded-full p-2 border-2 border-slate-900 bg-slate-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
              badge.unlockedAt && "bg-gradient-to-br from-brand-primary/20 to-brand-accent/20"
            )}>
              <img 
                src={badge.icon} 
                alt={badge.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              {!badge.unlockedAt && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                  <Lock size={24} className="text-white drop-shadow-md" />
                </div>
              )}
            </div>
            
            <h3 className="text-sm font-black uppercase leading-tight tracking-tighter">{badge.name}</h3>
            <p className="text-[10px] text-slate-500 font-bold leading-tight">{badge.description}</p>
            
            {badge.unlockedAt && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-3 -right-3 bg-brand-secondary text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                GOT IT!
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
