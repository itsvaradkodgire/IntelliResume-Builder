import React, { useState } from 'react';
import type { SharedData, RoleData, Project, SkillCategory, EducationEntry } from '../types.ts';
import { PencilIcon, PlusIcon, TrashIcon } from './icons.tsx';

// Reusable EditableField component for simple text/textarea inputs
const EditableField: React.FC<{
  value: string;
  onSave: (value: string) => void;
  isTextarea?: boolean;
  placeholder?: string;
  inputClassName?: string;
  textClassName?: string;
  as?: keyof JSX.IntrinsicElements;
}> = ({ value, onSave, isTextarea = false, placeholder, inputClassName, textClassName, as: Component = 'p' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    if (currentValue.trim() !== value.trim()) {
      onSave(currentValue.trim());
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTextarea && !e.shiftKey) {
        handleSave();
    } else if (e.key === 'Escape') {
        setCurrentValue(value);
        setIsEditing(false);
    }
  };

  if (isEditing) {
    const commonProps = {
      value: currentValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCurrentValue(e.target.value),
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
      className: `w-full bg-slate-100/50 p-1 -m-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 ${inputClassName}`,
      placeholder,
      autoFocus: true
    };
    return isTextarea ? <textarea {...commonProps} rows={Math.max(2, currentValue.split('\n').length)} /> : <input type="text" {...commonProps} />;
  }

  return (
    <Component
      onClick={() => setIsEditing(true)}
      className={`hover:bg-blue-50/50 p-1 -m-1 rounded cursor-pointer group transition-colors relative ${textClassName}`}
    >
      {value || <span className="text-slate-400">{placeholder}</span>}
      <PencilIcon className="w-3 h-3 absolute top-1.5 right-1.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Component>
  );
};

// --- SECTION COMPONENTS ---

const HeaderSection: React.FC<{ data: SharedData; onUpdate: (data: Partial<SharedData>) => void; }> = ({ data, onUpdate }) => (
  <header className="text-center mb-10">
    <EditableField as="h1" value={data.name} onSave={(val) => onUpdate({ name: val })} textClassName="text-5xl font-bold text-slate-800" inputClassName="text-5xl font-bold text-center" placeholder="Your Name" />
    <div className="flex flex-col items-center justify-center gap-x-4 gap-y-1 text-sm text-slate-600 mt-3">
        <div className='flex gap-x-4'>
            <EditableField value={data.email} onSave={(val) => onUpdate({ email: val })} placeholder="your.email@example.com" textClassName="text-center" inputClassName="text-center"/>
            <span>|</span>
            <EditableField value={data.phone} onSave={(val) => onUpdate({ phone: val })} placeholder="(123) 456-7890" textClassName="text-center" inputClassName="text-center"/>
        </div>
        <div className='flex gap-x-4'>
            <EditableField value={data.github} onSave={(val) => onUpdate({ github: val })} placeholder="github.com/in/you" textClassName="text-center" inputClassName="text-center"/>
            <span>|</span>
            <EditableField value={data.linkedin} onSave={(val) => onUpdate({ linkedin: val })} placeholder="linkedin.com/in/you" textClassName="text-center" inputClassName="text-center"/>
        </div>
    </div>
  </header>
);

const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <section className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">{title}</h2>
        {children}
    </section>
);


const SummarySection: React.FC<{ summary: string; onUpdate: (summary: string) => void; }> = ({ summary, onUpdate }) => (
    <Section title="Summary">
        <EditableField isTextarea value={summary} onSave={onUpdate} textClassName="text-slate-700 leading-relaxed whitespace-pre-wrap" placeholder="Write a brief summary..." />
    </Section>
);

const SkillsSection: React.FC<{ skills: SkillCategory[]; onUpdate: (skills: SkillCategory[]) => void; }> = ({ skills, onUpdate }) => {
    const handleUpdate = (index: number, field: keyof SkillCategory, value: string) => {
        const newSkills = skills.map((skill, i) => i === index ? { ...skill, [field]: value } : skill);
        onUpdate(newSkills);
    };
    const handleAdd = () => onUpdate([...skills, { id: `skillcat_${Date.now()}`, category: 'New Category', list: 'New Skill' }]);
    const handleDelete = (index: number) => onUpdate(skills.filter((_, i) => i !== index));

    return (
        <Section title="Skills">
            <div className="space-y-2">
                {skills.map((skill, index) => (
                    <div key={skill.id} className="flex items-start gap-2 group">
                        <div className="w-1/4 font-bold text-slate-700 text-right pr-2 shrink-0">
                           <EditableField value={skill.category} onSave={(val) => handleUpdate(index, 'category', val)} textClassName="font-bold" inputClassName="font-bold text-right" />
                        </div>
                        <div className="flex-grow">
                           <EditableField value={skill.list} onSave={(val) => handleUpdate(index, 'list', val)} textClassName="text-slate-700" />
                        </div>
                         <button onClick={() => handleDelete(index)} className="ml-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={handleAdd} className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <PlusIcon className="w-3 h-3" /> Add Category
            </button>
        </Section>
    );
};

const ProjectExperienceSection: React.FC<{ projects: Project[]; onUpdate: (proj: Project[]) => void; }> = ({ projects, onUpdate }) => {
    const handleUpdate = (index: number, field: keyof Project, value: any) => {
        const newProjects = projects.map((proj, i) => i === index ? { ...proj, [field]: value } : proj);
        onUpdate(newProjects);
    };
    const handleAdd = () => onUpdate([...projects, { id: `proj_${Date.now()}`, name: "Project Name", description: "Project description.", technologies: "Tech 1, Tech 2" }]);
    const handleDelete = (index: number) => onUpdate(projects.filter((_, i) => i !== index));

    return (
        <Section title="Project Experience">
            {projects.map((proj, index) => (
                <div key={proj.id} className="mb-4 relative group">
                    <button onClick={() => handleDelete(index)} className="absolute top-0 right-0 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <TrashIcon className="w-4 h-4"/>
                    </button>
                    <EditableField as="h3" value={proj.name} onSave={(val) => handleUpdate(index, 'name', val)} textClassName="text-md font-bold text-slate-800" placeholder="Project Name" />
                    <EditableField isTextarea value={proj.description} onSave={(val) => handleUpdate(index, 'description', val)} textClassName="mt-1 text-slate-700 whitespace-pre-wrap" placeholder="Project description" />
                    <div className="mt-1 text-slate-700 flex items-baseline gap-2">
                        <span className="font-bold">Technologies:</span>
                        <div className="flex-1">
                            <EditableField value={proj.technologies} onSave={(val) => handleUpdate(index, 'technologies', val)} placeholder="Comma, separated, list" />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={handleAdd} className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <PlusIcon className="w-3 h-3" /> Add Project
            </button>
        </Section>
    );
};

const EducationSection: React.FC<{ education: EducationEntry[]; onUpdate: (edu: EducationEntry[]) => void; }> = ({ education, onUpdate }) => {
    const handleUpdate = (index: number, field: keyof EducationEntry, value: any) => {
        const newEducation = education.map((entry, i) => i === index ? { ...entry, [field]: value } : entry);
        onUpdate(newEducation);
    };
    const handleAdd = () => onUpdate([...education, { id: `edu_${Date.now()}`, school: "University Name", degree: "Degree", dateRange: "Month Year - Month Year", details: "Grades or details" }]);
    const handleDelete = (index: number) => onUpdate(education.filter((_, i) => i !== index));

    return (
        <Section title="Education">
            {education.map((entry, index) => (
                <div key={entry.id} className="mb-4 relative group">
                     <button onClick={() => handleDelete(index)} className="absolute top-0 right-0 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <TrashIcon className="w-4 h-4"/>
                    </button>
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                             <EditableField as="h3" value={entry.school} onSave={(val) => handleUpdate(index, 'school', val)} textClassName="text-md font-bold text-slate-800" placeholder="School Name" />
                             <EditableField value={entry.degree} onSave={(val) => handleUpdate(index, 'degree', val)} textClassName="text-slate-700" placeholder="Degree" />
                        </div>
                        <div className="text-right text-sm text-slate-600 shrink-0">
                            <EditableField value={entry.dateRange} onSave={(val) => handleUpdate(index, 'dateRange', val)} textClassName="font-medium text-right" inputClassName="text-right" placeholder="Date Range" />
                            <EditableField value={entry.details} onSave={(val) => handleUpdate(index, 'details', val)} textClassName="text-right" inputClassName="text-right" placeholder="Details (GPA, etc)" />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={handleAdd} className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <PlusIcon className="w-3 h-3" /> Add Education
            </button>
        </Section>
    )
};

const CertificationsSection: React.FC<{ certifications: string[]; onUpdate: (certs: string[]) => void; }> = ({ certifications, onUpdate }) => {
    const handleUpdate = (index: number, value: string) => {
        const newCerts = certifications.map((c, i) => i === index ? value : c);
        onUpdate(newCerts.filter(c => c.trim() !== '')); // Also remove if becomes empty
    };
    const handleAdd = () => onUpdate([...certifications, 'New Certification']);
    const handleDelete = (index: number) => onUpdate(certifications.filter((_, i) => i !== index));

    return (
        <Section title="Certifications">
            <ul className="list-disc list-inside space-y-1">
                {certifications.map((cert, index) => (
                    <li key={index} className="text-slate-700 flex items-start group">
                        <span className="mr-2 mt-1.5">•</span>
                        <div className="flex-1">
                            <EditableField value={cert} onSave={(val) => handleUpdate(index, val)} textClassName="w-full" />
                        </div>
                        <button onClick={() => handleDelete(index)} className="ml-2 mt-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                    </li>
                ))}
            </ul>
             <button onClick={handleAdd} className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <PlusIcon className="w-3 h-3" /> Add Certification
            </button>
        </Section>
    );
};

const HobbiesSection: React.FC<{ hobbies: string; onUpdate: (hobbies: string) => void; }> = ({ hobbies, onUpdate }) => (
    <Section title="Hobbies">
        <EditableField value={hobbies} onSave={onUpdate} textClassName="text-slate-700" placeholder="Your hobbies..."/>
    </Section>
);

// --- MAIN DOCUMENT COMPONENT ---

interface ResumeDocumentProps {
  sharedData: SharedData;
  roleData: RoleData;
  onUpdateSharedData: (data: Partial<SharedData>) => void;
  onUpdateRoleData: (data: Partial<Omit<RoleData, 'id' | 'roleName'>>) => void;
}

const ResumeDocument: React.FC<ResumeDocumentProps> = ({ sharedData, roleData, onUpdateSharedData, onUpdateRoleData }) => {
  const handleEducationUpdate = (education: EducationEntry[]) => {
    onUpdateSharedData({ education });
  };
  
  return (
    <main className="bg-white p-12 shadow-lg rounded-lg max-w-4xl mx-auto my-8 print:shadow-none print:my-0 print:p-0 print:max-w-none">
      <HeaderSection data={sharedData} onUpdate={onUpdateSharedData} />
      <div className="space-y-4">
          <SummarySection summary={roleData.summary} onUpdate={(val) => onUpdateRoleData({ summary: val })} />
          <SkillsSection skills={roleData.skills} onUpdate={(val) => onUpdateRoleData({ skills: val })} />
          <ProjectExperienceSection projects={roleData.projects} onUpdate={(val) => onUpdateRoleData({ projects: val })} />
          <EducationSection education={sharedData.education} onUpdate={handleEducationUpdate} />
          <CertificationsSection certifications={roleData.certifications} onUpdate={(val) => onUpdateRoleData({ certifications: val })} />
          <HobbiesSection hobbies={roleData.hobbies} onUpdate={(val) => onUpdateRoleData({ hobbies: val })} />
      </div>
    </main>
  );
};

export default ResumeDocument;