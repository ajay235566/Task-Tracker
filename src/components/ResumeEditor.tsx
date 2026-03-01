import React from 'react';
import { ResumeData, ResumeExperience, ResumeEducation, ResumeProject } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, User, Briefcase, GraduationCap, Code, Layout, Type, Move, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = React.useState<string>('personal');

  const updateField = (field: keyof ResumeData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addExperience = () => {
    const newExp: ResumeExperience = {
      id: Math.random().toString(36).substr(2, 9),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    updateField('experiences', [...data.experiences, newExp]);
  };

  const updateExperience = (id: string, field: keyof ResumeExperience, value: string) => {
    const newExps = data.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp);
    updateField('experiences', newExps);
  };

  const removeExperience = (id: string) => {
    updateField('experiences', data.experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: Math.random().toString(36).substr(2, 9),
      school: '',
      degree: '',
      graduationDate: ''
    };
    updateField('education', [...data.education, newEdu]);
  };

  const updateEducation = (id: string, field: keyof ResumeEducation, value: string) => {
    const newEdus = data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu);
    updateField('education', newEdus);
  };

  const removeEducation = (id: string) => {
    updateField('education', data.education.filter(edu => edu.id !== id));
  };

  const addProject = () => {
    const newProj: ResumeProject = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      link: ''
    };
    updateField('projects', [...data.projects, newProj]);
  };

  const updateProject = (id: string, field: keyof ResumeProject, value: string) => {
    const newProjs = data.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj);
    updateField('projects', newProjs);
  };

  const removeProject = (id: string) => {
    updateField('projects', data.projects.filter(proj => proj.id !== id));
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  const SectionHeader = ({ id, icon: Icon, title }: { id: string, icon: any, title: string }) => (
    <button 
      onClick={() => toggleSection(id)}
      className={`w-full flex items-center justify-between p-4 border-b-2 border-slate-900 transition-colors ${activeSection === id ? 'bg-brand-primary text-white' : 'bg-white hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="font-black uppercase tracking-tight">{title}</span>
      </div>
      {activeSection === id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
  );

  return (
    <div className="bg-white border-4 border-slate-900 rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* Personal Info */}
      <div className="border-b-2 border-slate-900">
        <SectionHeader id="personal" icon={User} title="Personal Info" />
        <AnimatePresence>
          {activeSection === 'personal' && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase">Full Name</label>
                    <input 
                      type="text" 
                      value={data.fullName} 
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase">Job Title</label>
                    <input 
                      type="text" 
                      value={data.title} 
                      onChange={(e) => updateField('title', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase">Email</label>
                    <input 
                      type="email" 
                      value={data.email} 
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase">Phone</label>
                    <input 
                      type="text" 
                      value={data.phone} 
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase">Location</label>
                    <input 
                      type="text" 
                      value={data.location} 
                      onChange={(e) => updateField('location', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase">Summary</label>
                  <textarea 
                    value={data.summary} 
                    onChange={(e) => updateField('summary', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Experience */}
      <div className="border-b-2 border-slate-900">
        <SectionHeader id="experience" icon={Briefcase} title="Work Experience" />
        <AnimatePresence>
          {activeSection === 'experience' && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {data.experiences.map((exp, index) => (
                  <div key={exp.id} className="p-4 border-2 border-slate-200 rounded-xl relative bg-slate-50">
                    <button 
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Company</label>
                        <input 
                          type="text" 
                          value={exp.company} 
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Position</label>
                        <input 
                          type="text" 
                          value={exp.position} 
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Start Date</label>
                        <input 
                          type="text" 
                          value={exp.startDate} 
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="MM/YYYY"
                          className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">End Date</label>
                        <input 
                          type="text" 
                          value={exp.endDate} 
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="MM/YYYY or Present"
                          className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase">Description</label>
                      <textarea 
                        value={exp.description} 
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={addExperience}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <Plus size={20} /> Add Experience
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Education */}
      <div className="border-b-2 border-slate-900">
        <SectionHeader id="education" icon={GraduationCap} title="Education" />
        <AnimatePresence>
          {activeSection === 'education' && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {data.education.map((edu) => (
                  <div key={edu.id} className="p-4 border-2 border-slate-200 rounded-xl relative bg-slate-50">
                    <button 
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">School / University</label>
                        <input 
                          type="text" 
                          value={edu.school} 
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Degree / Course</label>
                        <input 
                          type="text" 
                          value={edu.degree} 
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <label className="text-[10px] font-black uppercase">Graduation Date</label>
                      <input 
                        type="text" 
                        value={edu.graduationDate} 
                        onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                        placeholder="MM/YYYY"
                        className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={addEducation}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <Plus size={20} /> Add Education
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skills */}
      <div className="border-b-2 border-slate-900">
        <SectionHeader id="skills" icon={Code} title="Skills" />
        <AnimatePresence>
          {activeSection === 'skills' && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="bg-brand-secondary text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {skill}
                      <button 
                        onClick={() => updateField('skills', data.skills.filter((_, idx) => idx !== i))}
                        className="hover:text-slate-900"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add a skill..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.currentTarget.value.trim();
                        if (val && !data.skills.includes(val)) {
                          updateField('skills', [...data.skills, val]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button className="bg-slate-900 text-white px-4 py-2 font-black uppercase text-xs">Add</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Projects */}
      <div className="border-b-2 border-slate-900">
        <SectionHeader id="projects" icon={Layout} title="Projects" />
        <AnimatePresence>
          {activeSection === 'projects' && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="p-4 border-2 border-slate-200 rounded-xl relative bg-slate-50">
                    <button 
                      onClick={() => removeProject(proj.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Project Name</label>
                        <input 
                          type="text" 
                          value={proj.name} 
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Link (Optional)</label>
                        <input 
                          type="text" 
                          value={proj.link || ''} 
                          onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                          className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase">Description</label>
                        <textarea 
                          value={proj.description} 
                          onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-2 py-1 text-sm border-2 border-slate-900 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={addProject}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <Plus size={20} /> Add Project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Style Controls */}
      <div>
        <SectionHeader id="style" icon={Layout} title="Style & Layout" />
        <AnimatePresence>
          {activeSection === 'style' && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase flex items-center gap-2">
                      <Type size={14} /> Font Family
                    </label>
                    <select 
                      value={data.fontFamily}
                      onChange={(e) => updateField('fontFamily', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-slate-900 focus:outline-none"
                    >
                      <option value="Inter, sans-serif">Inter (Modern)</option>
                      <option value="'Playfair Display', serif">Playfair (Elegant)</option>
                      <option value="'JetBrains Mono', monospace">JetBrains (Tech)</option>
                      <option value="system-ui, sans-serif">System (Clean)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase flex items-center gap-2">
                      <Maximize size={14} /> Font Size ({data.fontSize}px)
                    </label>
                    <input 
                      type="range" 
                      min="10" 
                      max="20" 
                      value={data.fontSize}
                      onChange={(e) => updateField('fontSize', parseInt(e.target.value))}
                      className="w-full accent-brand-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase flex items-center gap-2">
                      <Move size={14} /> Margins ({data.margin}mm)
                    </label>
                    <input 
                      type="range" 
                      min="5" 
                      max="30" 
                      value={data.margin}
                      onChange={(e) => updateField('margin', parseInt(e.target.value))}
                      className="w-full accent-brand-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase flex items-center gap-2">
                      <Layout size={14} /> Section Spacing ({data.sectionSpacing}px)
                    </label>
                    <input 
                      type="range" 
                      min="10" 
                      max="50" 
                      value={data.sectionSpacing}
                      onChange={(e) => updateField('sectionSpacing', parseInt(e.target.value))}
                      className="w-full accent-brand-accent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
