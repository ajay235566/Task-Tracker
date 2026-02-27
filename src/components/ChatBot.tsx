import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAI } from '../services/gemini';
import { Task, Message } from '../types';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

interface ChatBotProps {
  tasks: Task[];
}

export const ChatBot: React.FC<ChatBotProps> = ({ tasks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! I'm your Task Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI([...messages, userMessage], tasks);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 h-[500px] flex flex-col vibrant-card overflow-hidden bg-white"
          >
            {/* Header */}
            <div className="p-4 border-b-2 border-slate-900 bg-brand-primary flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold">
                <Bot size={20} />
                <span>Task Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] p-3 rounded-lg text-sm",
                    m.role === 'user' 
                      ? "bg-brand-accent border-2 border-slate-900 font-medium" 
                      : "bg-slate-100 border-2 border-slate-900"
                  )}>
                    <div className="flex items-center gap-2 mb-1 opacity-60 text-[10px] uppercase font-bold">
                      {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                      {m.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <Markdown>{m.content}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 border-2 border-slate-900 p-3 rounded-lg">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t-2 border-slate-900 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your tasks..."
                  className="flex-1 px-3 py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-brand-primary vibrant-button p-2"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all border-2 border-slate-900",
          isOpen ? "bg-brand-secondary rotate-90" : "bg-brand-primary hover:scale-110"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};
