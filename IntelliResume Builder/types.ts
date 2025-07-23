export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  dateRange: string;
  details: string;
}

export interface SharedData {
  name: string;
  email:string;
  phone: string;
  github: string;
  linkedin: string;
  education: EducationEntry[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
}

export interface SkillCategory {
    id: string;
    category: string;
    list: string;
}

export interface RoleData {
  id: string;
  roleName: string;
  summary: string;
  skills: SkillCategory[];
  projects: Project[];
  certifications: string[];
  hobbies: string;
}
