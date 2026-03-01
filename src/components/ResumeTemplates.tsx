import React from 'react';
import { ResumeData } from '../types';
import { User, Briefcase, GraduationCap, Phone, Mail, MapPin, Globe, Star, Languages, Award } from 'lucide-react';

export interface TemplateProps {
  data: ResumeData;
}

export interface TemplateConfig {
  id: string;
  name: string;
  accent: string;
  secondary: string;
  bg: string;
  style: string;
  layout: 'single' | 'sidebar' | 'timeline';
}

export const TEMPLATE_CONFIGS: TemplateConfig[] = [
  { id: 'template-1',  name: "Executive",    accent: "#1a1a2e", secondary: "#e8c547", bg: "#ffffff", style: "classic",   layout: "single" },
  { id: 'template-2',  name: "Nordic",       accent: "#2d6a4f", secondary: "#95d5b2", bg: "#fafffe", style: "minimal",   layout: "single" },
  { id: 'template-3',  name: "Crimson",      accent: "#c1121f", secondary: "#fff0f0", bg: "#ffffff", style: "bold",      layout: "single" },
  { id: 'template-4',  name: "Slate Blue",   accent: "#023e8a", secondary: "#caf0f8", bg: "#ffffff", style: "modern",    layout: "single" },
  { id: 'template-5',  name: "Ember",        accent: "#e76f51", secondary: "#264653", bg: "#fdfdfd", style: "creative",  layout: "sidebar"},
  { id: 'template-6',  name: "Violet",       accent: "#7b2d8b", secondary: "#e0aaff", bg: "#ffffff", style: "elegant",   layout: "single" },
  { id: 'template-7',  name: "Midnight",     accent: "#0d1117", secondary: "#58a6ff", bg: "#0d1117", style: "tech",      layout: "single" },
  { id: 'template-8',  name: "Sage",         accent: "#606c38", secondary: "#fefae0", bg: "#fefae0", style: "organic",   layout: "single" },
  { id: 'template-9',  name: "Rose Gold",    accent: "#c9184a", secondary: "#ffb3c1", bg: "#fff9fb", style: "luxury",    layout: "single" },
  { id: 'template-10', name: "Charcoal",     accent: "#343a40", secondary: "#dee2e6", bg: "#ffffff", style: "pro",       layout: "single" },
  { id: 'template-11', name: "Cobalt",       accent: "#1b4965", secondary: "#bee9e8", bg: "#f0f9ff", style: "corporate", layout: "sidebar"},
  { id: 'template-12', name: "Terracotta",   accent: "#bc4749", secondary: "#f2e8c6", bg: "#fffbf5", style: "warm",      layout: "single" },
  { id: 'template-13', name: "Obsidian",     accent: "#1c1c1e", secondary: "#48cae4", bg: "#111113", style: "dark",      layout: "sidebar"},
  { id: 'template-14', name: "Forest",       accent: "#386641", secondary: "#a7c957", bg: "#f8fff5", style: "nature",    layout: "single" },
  { id: 'template-15', name: "Coral Pop",    accent: "#ff6b6b", secondary: "#ffd93d", bg: "#fffef0", style: "vibrant",   layout: "single" },
  { id: 'template-16', name: "Navy Gold",    accent: "#14213d", secondary: "#fca311", bg: "#ffffff", style: "prestige",  layout: "sidebar"},
  { id: 'template-17', name: "Blush",        accent: "#a05c7b", secondary: "#ffe4ed", bg: "#fff8fa", style: "soft",      layout: "single" },
  { id: 'template-18', name: "Graphite",     accent: "#4a4e69", secondary: "#c9ada7", bg: "#faf9f8", style: "refined",   layout: "single" },
  { id: 'template-19', name: "Teal Storm",   accent: "#005f73", secondary: "#94d2bd", bg: "#f0fdfb", style: "fresh",     layout: "sidebar"},
  { id: 'template-20', name: "Plum Drama",   accent: "#4a0e4e", secondary: "#f72585", bg: "#ffffff", style: "dramatic",  layout: "single" },
  { id: 'template-21', name: "Marketing Timeline", accent: "#2b3d4f", secondary: "#8da2b5", bg: "#ffffff", style: "timeline", layout: "timeline" },
];

const UniversalTemplate: React.FC<{ data: ResumeData, config: TemplateConfig }> = ({ data, config }) => {
  const isDark = config.style === "tech" || config.style === "dark";
  const fg = isDark ? "#e6edf3" : "#1a1a1a";
  const fgMid = isDark ? "#8b949e" : "#555";
  const fgLight = isDark ? "#6e7681" : "#888";

  const SectionTitle = ({ title }: { title: string }) => {
    const base = { marginTop: data.sectionSpacing, marginBottom: 8 };
    if (["elegant", "luxury", "prestige", "soft"].includes(config.style))
      return (
        <div style={{ ...base, display: "flex", alignItems: "center", gap: 10, fontSize: 9, letterSpacing: 5, textTransform: "uppercase", color: config.accent }}>
          <div style={{ flex: 1, height: 1, background: config.accent + "55" }} />
          {title}
          <div style={{ flex: 1, height: 1, background: config.accent + "55" }} />
        </div>
      );
    if (["tech", "dark"].includes(config.style))
      return <div style={{ ...base, color: config.secondary, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>// {title}</div>;
    if (["bold", "dramatic"].includes(config.style))
      return (
        <div style={{ ...base, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 22, height: 4, background: config.accent, borderRadius: 2 }} />
          <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 2 }}>{title}</span>
        </div>
      );
    if (["warm", "nature", "organic", "vibrant"].includes(config.style))
      return <div style={{ ...base, fontSize: 12, fontWeight: 700, color: config.accent }}>✦ {title}</div>;
    
    return <div style={{ ...base, fontSize: 10, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", color: config.accent, borderBottom: `2px solid ${config.accent}`, paddingBottom: 4 }}>{title}</div>;
  };

  if (config.layout === "sidebar") {
    const sideAccent = (config.style === "dark" || config.style === "tech") ? config.secondary : "rgba(255,255,255,0.9)";
    const sideFaint = "rgba(255,255,255,0.6)";
    const sideColor = (config.style === "dark" || config.style === "tech") ? "#111" : config.accent;
    const SidebarSectionTitle = (t: string) => <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: sideAccent, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 12, marginTop: 14, marginBottom: 8 }}>{t}</div>;

    return (
      <div style={{ display: "flex", fontFamily: data.fontFamily, background: config.bg, minHeight: '297mm', fontSize: `${data.fontSize}px`, lineHeight: 1.55, color: fg }}>
        <div style={{ width: '70mm', flexShrink: 0, background: sideColor, color: "#fff", padding: `${data.margin}mm`, minHeight: '297mm' }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, marginBottom: 12 }}>
            {(data.fullName || "?").charAt(0)}
          </div>
          <h1 style={{ fontSize: '1.5em', fontWeight: 800, margin: "0 0 4px", color: "#fff", lineHeight: 1.2 }}>{data.fullName}</h1>
          <div style={{ fontSize: '0.9em', color: sideFaint, marginBottom: 16 }}>{data.email}</div>
          <div style={{ fontSize: '0.8em', color: sideFaint, lineHeight: 2.1 }}>
            {data.email && <div>✉ {data.email}</div>}
            {data.phone && <div>☏ {data.phone}</div>}
            {data.location && <div>⚲ {data.location}</div>}
          </div>
          {data.summary && (
            <>
              {SidebarSectionTitle("Profile")}
              <p style={{ fontSize: '0.8em', color: sideFaint, lineHeight: 1.65, margin: 0 }}>{data.summary}</p>
            </>
          )}
          {data.skills.length > 0 && (
            <>
              {SidebarSectionTitle("Skills")}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {data.skills.map((sk, i) => (
                  <span key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 4, padding: "1px 6px", fontSize: '0.7em' }}>{sk}</span>
                ))}
              </div>
            </>
          )}
        </div>
        <div style={{ flex: 1, padding: `${data.margin}mm`, minHeight: '297mm' }}>
          {data.experiences.length > 0 && (
            <>
              <SectionTitle title="Experience" />
              {data.experiences.map(e => (
                <div key={e.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1em' }}>{e.position}</span>
                    <span style={{ color: fgLight, fontSize: '0.8em' }}>{e.startDate} – {e.endDate}</span>
                  </div>
                  <div style={{ color: config.accent, fontWeight: 600, fontSize: '1em' }}>{e.company}</div>
                  <p style={{ color: fgMid, marginTop: 3, fontSize: '0.9em' }}>{e.description}</p>
                </div>
              ))}
            </>
          )}
          {data.education.length > 0 && (
            <>
              <SectionTitle title="Education" />
              {data.education.map(e => (
                <div key={e.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700 }}>{e.degree}</span>
                    <span style={{ color: fgLight, fontSize: '0.8em' }}>{e.graduationDate}</span>
                  </div>
                  <div style={{ color: config.accent, fontSize: '0.9em' }}>{e.school}</div>
                </div>
              ))}
            </>
          )}
          {data.projects.length > 0 && (
            <>
              <SectionTitle title="Projects" />
              {data.projects.map(pr => (
                <div key={pr.id} style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 700 }}>{pr.name}</span>
                  {pr.link && <span style={{ color: config.accent, fontSize: '0.8em' }}> — {pr.link}</span>}
                  {pr.description && <div style={{ color: fgMid, fontSize: '0.9em', marginTop: 2 }}>{pr.description}</div>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }

  if (config.layout === "timeline") {
    const iconStyle = { width: 24, height: 24, borderRadius: '50%', background: config.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 };
    const timelineLineStyle = { position: 'absolute' as const, left: 11, top: 0, bottom: 0, width: 2, background: '#e2e8f0', zIndex: 5 };
    
    return (
      <div style={{ fontFamily: data.fontFamily, background: config.bg, minHeight: '297mm', fontSize: `${data.fontSize}px`, lineHeight: 1.55, color: fg }}>
        {/* Header */}
        <div style={{ padding: `${data.margin}mm`, paddingBottom: 10 }}>
          <h1 style={{ fontSize: '3em', fontWeight: 900, color: config.accent, margin: 0, textTransform: 'uppercase', letterSpacing: '-1px' }}>{data.fullName}</h1>
          <div style={{ fontSize: '1.2em', color: fgMid, textTransform: 'uppercase', letterSpacing: '2px', marginTop: 4 }}>{data.title}</div>
          <div style={{ height: 2, background: config.accent, marginTop: 15, width: '100%' }} />
        </div>

        <div style={{ display: 'flex', padding: `0 ${data.margin}mm ${data.margin}mm` }}>
          {/* Left Column */}
          <div style={{ width: '35%', paddingRight: 30 }}>
            <div style={{ marginBottom: 25 }}>
              <h2 style={{ fontSize: '1.2em', fontWeight: 800, textTransform: 'uppercase', borderBottom: `2px solid ${fg}`, paddingBottom: 5, marginBottom: 15 }}>Contact</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9em' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Phone size={14} /> <span>{data.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Mail size={14} /> <span>{data.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <MapPin size={14} /> <span>{data.location}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 25 }}>
              <h2 style={{ fontSize: '1.2em', fontWeight: 800, textTransform: 'uppercase', borderBottom: `2px solid ${fg}`, paddingBottom: 5, marginBottom: 15 }}>Skills</h2>
              <ul style={{ padding: 0, listStyle: 'none', fontSize: '0.9em' }}>
                {data.skills.map((skill, i) => (
                  <li key={i} style={{ marginBottom: 5, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: config.accent }} /> {skill}
                  </li>
                ))}
              </ul>
            </div>

            {data.projects.length > 0 && (
              <div style={{ marginBottom: 25 }}>
                <h2 style={{ fontSize: '1.2em', fontWeight: 800, textTransform: 'uppercase', borderBottom: `2px solid ${fg}`, paddingBottom: 5, marginBottom: 15 }}>Projects</h2>
                {data.projects.map(p => (
                  <div key={p.id} style={{ marginBottom: 10, fontSize: '0.9em' }}>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ color: fgMid, fontSize: '0.85em' }}>{p.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column with Timeline */}
          <div style={{ width: '65%', position: 'relative', paddingLeft: 40 }}>
            <div style={timelineLineStyle} />
            
            {/* Profile */}
            <div style={{ position: 'relative', marginBottom: 30 }}>
              <div style={{ ...iconStyle, position: 'absolute', left: -53, top: 0 }}>
                <User size={14} />
              </div>
              <h2 style={{ fontSize: '1.2em', fontWeight: 800, textTransform: 'uppercase', borderBottom: `2px solid #e2e8f0`, paddingBottom: 5, marginBottom: 15 }}>Profile</h2>
              <p style={{ fontSize: '0.95em', color: fgMid, fontStyle: 'italic' }}>"{data.summary}"</p>
            </div>

            {/* Experience */}
            <div style={{ position: 'relative', marginBottom: 30 }}>
              <div style={{ ...iconStyle, position: 'absolute', left: -53, top: 0 }}>
                <Briefcase size={14} />
              </div>
              <h2 style={{ fontSize: '1.2em', fontWeight: 800, textTransform: 'uppercase', borderBottom: `2px solid #e2e8f0`, paddingBottom: 5, marginBottom: 15 }}>Work Experience</h2>
              {data.experiences.map(e => (
                <div key={e.id} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1em' }}>{e.company}</div>
                    <div style={{ fontSize: '0.8em', fontWeight: 700, color: fgLight }}>{e.startDate} - {e.endDate}</div>
                  </div>
                  <div style={{ fontWeight: 600, color: config.accent, marginBottom: 8 }}>{e.position}</div>
                  <p style={{ fontSize: '0.9em', color: fgMid, margin: 0 }}>{e.description}</p>
                </div>
              ))}
            </div>

            {/* Education */}
            <div style={{ position: 'relative', marginBottom: 30 }}>
              <div style={{ ...iconStyle, position: 'absolute', left: -53, top: 0 }}>
                <GraduationCap size={14} />
              </div>
              <h2 style={{ fontSize: '1.2em', fontWeight: 800, textTransform: 'uppercase', borderBottom: `2px solid #e2e8f0`, paddingBottom: 5, marginBottom: 15 }}>Education</h2>
              {data.education.map(e => (
                <div key={e.id} style={{ marginBottom: 15 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1em' }}>{e.degree}</div>
                    <div style={{ fontSize: '0.8em', fontWeight: 700, color: fgLight }}>{e.graduationDate}</div>
                  </div>
                  <div style={{ color: fgMid }}>{e.school}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isBold = config.style === "bold" || config.style === "dramatic";
  const isElegant = ["elegant", "luxury", "prestige"].includes(config.style);

  return (
    <div style={{ fontFamily: data.fontFamily, background: config.bg, color: fg, minHeight: '297mm', fontSize: `${data.fontSize}px`, lineHeight: 1.55 }}>
      <div style={{
        padding: `${data.margin}mm`,
        paddingBottom: isBold ? `${data.margin}mm` : 16,
        background: isBold ? config.accent : "transparent",
        borderBottom: (!isBold && !isElegant) ? `2.5px solid ${config.accent}` : "none",
        textAlign: isElegant ? "center" : "left",
        marginBottom: isBold ? 0 : data.sectionSpacing,
      }}>
        {isElegant && <div style={{ fontSize: 9, letterSpacing: 6, color: config.accent, textTransform: "uppercase", marginBottom: 10 }}>Curriculum Vitae</div>}
        <h1 style={{
          fontSize: isElegant ? '2.5em' : '2em',
          fontWeight: isElegant ? 300 : 900,
          letterSpacing: isElegant ? 3 : -0.5,
          color: isBold ? "#fff" : config.accent,
          margin: 0, lineHeight: 1.1,
        }}>{data.fullName}</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8, fontSize: '0.8em', color: isBold ? "rgba(255,255,255,0.65)" : fgLight, justifyContent: isElegant ? "center" : "flex-start" }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>☏ {data.phone}</span>}
          {data.location && <span>⚲ {data.location}</span>}
        </div>
      </div>

      <div style={{ padding: `0 ${data.margin}mm ${data.margin}mm` }}>
        {data.summary && (
          isElegant
            ? <p style={{ textAlign: "center", maxWidth: "82%", margin: `${data.sectionSpacing}px auto`, fontStyle: "italic", color: fgMid }}>{data.summary}</p>
            : <><SectionTitle title="Summary" /><p style={{ color: fgMid }}>{data.summary}</p></>
        )}

        {data.experiences.length > 0 && (
          <>
            <SectionTitle title="Experience" />
            {data.experiences.map(e => (
              <div key={e.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1em' }}>{e.position}</span>
                  <span style={{ color: fgLight, fontSize: '0.8em' }}>{e.startDate} – {e.endDate}</span>
                </div>
                <div style={{ color: config.accent, fontWeight: 600, fontSize: '1em' }}>{e.company}</div>
                <p style={{ color: fgMid, marginTop: 3, fontSize: '0.9em' }}>{e.description}</p>
              </div>
            ))}
          </>
        )}

        {data.education.length > 0 && (
          <>
            <SectionTitle title="Education" />
            {data.education.map(e => (
              <div key={e.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700 }}>{e.degree}</span>
                  <span style={{ color: fgLight, fontSize: '0.8em' }}>{e.graduationDate}</span>
                </div>
                <div style={{ color: config.accent, fontSize: '0.9em' }}>{e.school}</div>
              </div>
            ))}
          </>
        )}

        {data.skills.length > 0 && (
          <>
            <SectionTitle title="Skills" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {data.skills.map((sk, i) => (
                <span key={i} style={{ background: config.accent + "22", border: `1px solid ${config.accent}55`, borderRadius: 20, padding: "2px 10px", color: config.accent, fontSize: '0.8em' }}>{sk}</span>
              ))}
            </div>
          </>
        )}

        {data.projects.length > 0 && (
          <>
            <SectionTitle title="Projects" />
            {data.projects.map(pr => (
              <div key={pr.id} style={{ marginBottom: 10 }}>
                <span style={{ fontWeight: 700, color: config.accent }}>{pr.name}</span>
                {pr.link && <span style={{ color: config.accent, fontSize: '0.8em' }}> — {pr.link}</span>}
                {pr.description && <div style={{ color: fgMid, marginTop: 2, fontSize: '0.9em' }}>{pr.description}</div>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export const TemplateThumbnail: React.FC<{ templateId: string, selected: boolean }> = ({ templateId, selected }) => {
  const config = TEMPLATE_CONFIGS.find(c => c.id === templateId);
  if (!config) return null;

  return (
    <div style={{
      width: 48, height: 64, borderRadius: 4, overflow: "hidden", background: config.bg, position: "relative",
      border: '1px solid #000', flexShrink: 0
    }}>
      {config.layout === "sidebar" ? (
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ width: 16, background: config.accent, padding: "2px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.35)", margin: "0 auto 2px" }} />
            {[4, 6, 3, 5, 4, 5].map((w, i) => <div key={i} style={{ height: 1, background: "rgba(255,255,255,0.3)", borderRadius: 1, width: w, marginBottom: 1 }} />)}
          </div>
          <div style={{ flex: 1, padding: "2px" }}>
            <div style={{ height: 2, background: config.accent, borderRadius: 1, width: "80%", marginBottom: 1 }} />
            <div style={{ height: 1, background: config.accent + "88", borderRadius: 1, width: "55%", marginBottom: 3 }} />
            {[15, 12, 14, 10, 13, 11].map((w, i) => <div key={i} style={{ height: 1, background: "#ddd", borderRadius: 1, width: `${w}px`, marginBottom: 1 }} />)}
          </div>
        </div>
      ) : config.layout === "timeline" ? (
        <div style={{ height: "100%" }}>
          <div style={{ padding: 4, borderBottom: `1px solid ${config.accent}` }}>
            <div style={{ height: 4, background: config.accent, width: '70%' }} />
          </div>
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: '30%', borderRight: '1px solid #eee', padding: 2 }}>
              {[10, 15, 12, 8].map((w, i) => <div key={i} style={{ height: 1, background: '#ccc', width: `${w}px`, marginBottom: 2 }} />)}
            </div>
            <div style={{ flex: 1, padding: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 4, top: 0, bottom: 0, width: 1, background: '#eee' }} />
              {[20, 25, 18, 22].map((w, i) => (
                <div key={i} style={{ marginLeft: 8, marginBottom: 4 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: config.accent, position: 'absolute', left: 2.5 }} />
                  <div style={{ height: 2, background: '#ddd', width: `${w}px` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ height: "100%" }}>
          <div style={{ background: ["bold", "dramatic"].includes(config.style) ? config.accent : config.bg, padding: 3 }}>
            <div style={{ height: 2, background: ["bold", "dramatic"].includes(config.style) ? "rgba(255,255,255,0.9)" : config.accent, borderRadius: 1, width: "65%", marginBottom: 1 }} />
            <div style={{ height: 1, background: ["bold", "dramatic"].includes(config.style) ? "rgba(255,255,255,0.5)" : config.accent + "88", borderRadius: 1, width: "40%" }} />
          </div>
          <div style={{ height: 0.5, background: config.accent + "55", margin: "1px 3px" }} />
          <div style={{ padding: "1px 3px" }}>
            {[18, 15, 17, 12, 16, 14, 17].map((w, i) => (
              <div key={i} style={{ height: 1, background: "#ddd", borderRadius: 1, width: `${w}px`, marginBottom: 1 }} />
            ))}
          </div>
        </div>
      )}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: config.accent }} />
    </div>
  );
};

export const TEMPLATES: Record<string, React.FC<TemplateProps>> = TEMPLATE_CONFIGS.reduce((acc, config) => {
  acc[config.id] = ({ data }) => <UniversalTemplate data={data} config={config} />;
  return acc;
}, {} as Record<string, React.FC<TemplateProps>>);

export const TEMPLATE_LIST = TEMPLATE_CONFIGS.map(config => ({
  id: config.id,
  name: config.name,
  thumbnail: `https://picsum.photos/seed/resume-${config.id}/200/280`
}));
