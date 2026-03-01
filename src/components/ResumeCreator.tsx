import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, ResumeTemplate } from '../types';
import { TEMPLATES, TEMPLATE_LIST, TemplateThumbnail } from './ResumeTemplates';
import { ResumeEditor } from './ResumeEditor';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Save, Layout, Edit3, Eye, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import jsPDF from 'jspdf';

export const ResumeCreator: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templatePreviewId, setTemplatePreviewId] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const defaultResume: ResumeData = {
    id: Math.random().toString(36).substr(2, 9),
    userId: '',
    fullName: 'Alex Rivera',
    title: 'Senior Software Engineer',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 0123-4567',
    location: 'San Francisco, CA',
    summary: 'Senior Software Engineer with 8+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture. Passionate about mentoring teams and driving technical excellence.',
    experiences: [
      {
        id: 'exp1',
        company: 'TechFlow Systems',
        position: 'Lead Frontend Engineer',
        startDate: 'Jan 2020',
        endDate: 'Present',
        description: 'Architected and maintained a high-traffic SaaS platform using React and GraphQL. Reduced bundle size by 40% and improved lighthouse scores from 60 to 95.'
      },
      {
        id: 'exp2',
        company: 'DataPulse AI',
        position: 'Software Engineer',
        startDate: 'Jun 2016',
        endDate: 'Dec 2019',
        description: 'Developed real-time data visualization dashboards for enterprise clients. Implemented automated testing suites that reduced production bugs by 25%.'
      }
    ],
    education: [
      {
        id: 'edu1',
        school: 'University of California, Berkeley',
        degree: 'B.S. in Computer Science',
        graduationDate: 'May 2016'
      }
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker', 'System Design', 'Agile'],
    projects: [
      {
        id: 'proj1',
        name: 'OpenSource UI Kit',
        description: 'A comprehensive, accessible component library used by over 5,000 developers worldwide.',
        link: 'github.com/alex/uikit'
      }
    ],
    templateId: 'template-1',
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    margin: 15,
    sectionSpacing: 20,
    updatedAt: new Date().toISOString()
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem('vibrant-token');
      const res = await fetch('/api/resumes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setResumes(data);
      if (data.length > 0) {
        setCurrentResume(data[0]);
      } else {
        setCurrentResume(defaultResume);
      }
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    }
  };

  const handleSave = async () => {
    if (!currentResume) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('vibrant-token');
      const isNew = !resumes.find(r => r.id === currentResume.id);
      const url = isNew ? '/api/resumes' : `/api/resumes/${currentResume.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...currentResume, updatedAt: new Date().toISOString() })
      });

      if (res.ok) {
        fetchResumes();
      }
    } catch (err) {
      console.error('Failed to save resume:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!printRef.current || !currentResume) return;
    setIsExporting(true);
    
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const dataUrl = await domToPng(printRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        width: 794, // A4 width at 96dpi
        height: 1123, // A4 height at 96dpi
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${currentResume.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!currentResume) return null;

  const SelectedTemplate = TEMPLATES[currentResume.templateId] || TEMPLATES['template-1'];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            Resume Creator <Sparkles className="text-brand-primary" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Build a professional resume that stands out.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => {
              setTemplatePreviewId(currentResume.templateId);
              setShowTemplates(true);
            }}
            className="flex-1 sm:flex-none vibrant-button bg-white border-2 border-slate-900 flex items-center justify-center gap-2"
          >
            <Layout size={18} /> Templates
          </button>
          <button 
            onClick={() => setShowPreview(true)}
            className="flex-1 sm:flex-none vibrant-button bg-brand-accent border-2 border-slate-900 flex items-center justify-center gap-2"
          >
            <Eye size={18} /> Preview
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none vibrant-button bg-brand-primary text-white flex items-center justify-center gap-2"
          >
            <Save size={18} /> {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 sm:flex-none vibrant-button bg-slate-900 text-white flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download size={18} /> {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Live Preview', desc: 'See your changes in real-time as you type.' },
          { title: 'Multiple Templates', desc: 'Choose from 20+ professional layouts.' },
          { title: 'PDF Export', desc: 'Download your resume as a high-quality PDF.' }
        ].map((item, i) => (
          <div key={i} className="bg-slate-50 border-2 border-slate-900 p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black uppercase text-xs mb-1">{item.title}</h3>
            <p className="text-[10px] font-bold text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Content - Editor Only */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <ResumeEditor 
            data={currentResume} 
            onChange={setCurrentResume} 
          />
        </div>
        <div className="space-y-6">
          <div className="bg-white border-4 border-slate-900 p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-brand-primary" /> Pro Tips
            </h3>
            <ul className="space-y-4">
              {[
                { title: 'Quantify Impact', desc: 'Use numbers (e.g., "Increased sales by 20%") to show your value.' },
                { title: 'Keywords Matter', desc: 'Include skills mentioned in the job description for ATS.' },
                { title: 'Keep it Concise', desc: 'Aim for 1-2 pages. Focus on your most relevant experience.' },
                { title: 'Proofread', desc: 'Check for typos. A clean resume shows attention to detail.' }
              ].map((tip, i) => (
                <li key={i}>
                  <p className="font-bold text-xs uppercase mb-1">{tip.title}</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{tip.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-[6px_6px_0px_0px_rgba(16,185,129,1)]">
            <h3 className="text-lg font-black uppercase mb-2">Ready to Apply?</h3>
            <p className="text-xs font-medium text-slate-400 mb-4">Export your resume as a PDF and start your journey.</p>
            <button 
              onClick={handleDownload}
              className="w-full bg-brand-primary text-white py-3 rounded-xl font-black uppercase text-xs border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-slate-200 border-4 border-slate-900 rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <span className="font-black uppercase tracking-widest text-xs">Resume Preview</span>
                <button onClick={() => setShowPreview(false)} className="p-1 hover:bg-white/10 rounded">
                  <Check size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 sm:p-8">
                <div className="bg-white shadow-2xl mx-auto origin-top transform scale-[0.6] sm:scale-100 mb-20" style={{ width: '210mm', minHeight: '297mm' }}>
                  <SelectedTemplate data={currentResume} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Template Modal */}
      <AnimatePresence>
        {showTemplates && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTemplates(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white border-4 border-slate-900 rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b-2 border-slate-900 flex justify-between items-center bg-brand-primary text-white">
                <h2 className="text-2xl font-black uppercase">Choose a Template</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (templatePreviewId) {
                        setCurrentResume({ ...currentResume, templateId: templatePreviewId });
                      }
                      setShowTemplates(false);
                    }}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  >
                    Apply Template
                  </button>
                  <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-black/10 rounded-lg">
                    <Check size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                {/* Template List */}
                <div className="w-1/3 border-r-2 border-slate-900 overflow-y-auto p-4 grid grid-cols-1 gap-4 bg-slate-50">
                  {TEMPLATE_LIST.map(template => (
                    <button 
                      key={template.id}
                      onClick={() => setTemplatePreviewId(template.id)}
                      className={`group relative p-3 border-4 rounded-xl transition-all text-left ${templatePreviewId === template.id ? 'border-brand-primary bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent hover:bg-white'}`}
                    >
                      <div className="flex items-center gap-3">
                        <TemplateThumbnail templateId={template.id} selected={templatePreviewId === template.id} />
                        <div>
                          <p className="font-black uppercase text-xs">{template.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">Professional Style</p>
                        </div>
                      </div>
                      {templatePreviewId === template.id && (
                        <div className="absolute top-2 right-2 text-brand-primary">
                          <Check size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Template Preview Area */}
                <div className="flex-1 bg-slate-200 overflow-y-auto p-8 flex justify-center">
                  <div className="bg-white shadow-2xl origin-top transform scale-[0.5] lg:scale-[0.75]" style={{ width: '210mm', minHeight: '297mm' }}>
                    {templatePreviewId && (
                      (() => {
                        const PreviewTemplate = TEMPLATES[templatePreviewId];
                        return <PreviewTemplate data={currentResume} />;
                      })()
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Print Content */}
      <div className="fixed -left-[9999px] top-0">
        <div 
          ref={printRef}
          style={{ width: '210mm', minHeight: '297mm' }}
          className="bg-white"
        >
          <SelectedTemplate data={currentResume} />
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-print-content, #resume-print-content * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
};
