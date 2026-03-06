import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/";

interface ScrambledTextProps {
  text: string;
  className?: string;
}

export const ScrambledText: React.FC<ScrambledTextProps> = ({ text, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      className={`inline-block cursor-default transition-all duration-300 ${isHovered ? 'tracking-[0.1em] sm:tracking-[0.15em]' : 'tracking-normal'} ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text.split('').map((char, i) => (
        <Letter key={i} char={char} isHovered={isHovered} />
      ))}
    </span>
  );
};

const Letter = ({ char, isHovered }: { char: string, isHovered: boolean }) => {
  const [glitchChar, setGlitchChar] = useState(char);

  useEffect(() => {
    if (isHovered || char === ' ') {
      setGlitchChar(char);
      return;
    }

    const interval = setInterval(() => {
      setGlitchChar(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
    }, 150 + Math.random() * 150);

    return () => clearInterval(interval);
  }, [isHovered, char]);

  // Generate random offsets for the "scattered" look when not hovered
  // We use a ref or state to keep them stable during a single "unhovered" session if we wanted,
  // but randomizing on every render/animate call while not hovered creates a "shaky/glitchy" effect which is also cool.
  // To make it truly "scattered" but stable, we'd need to store the random values.
  
  const randomX = (Math.random() - 0.5) * 15;
  const randomY = (Math.random() - 0.5) * 15;
  const randomRotate = (Math.random() - 0.5) * 60;

  return (
    <motion.span
      className="inline-block"
      animate={{
        x: isHovered ? 0 : randomX,
        y: isHovered ? 0 : randomY,
        rotate: isHovered ? 0 : randomRotate,
        color: isHovered ? "#00FF00" : "#94a3b8",
        scale: isHovered ? 1.2 : 0.9,
        opacity: isHovered ? 1 : 0.7,
        marginRight: isHovered ? "0.02em" : "0em",
        marginLeft: isHovered ? "0.02em" : "0em",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15
      }}
    >
      {char === ' ' ? '\u00A0' : glitchChar}
    </motion.span>
  );
};
