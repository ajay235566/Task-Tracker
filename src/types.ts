export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  reminderSent?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // URL or icon name
  unlockedAt?: string;
  requirement: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  graduationDate: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface ResumeData {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  projects: ResumeProject[];
  templateId: string;
  fontFamily: string;
  fontSize: number;
  margin: number;
  sectionSpacing: number;
  updatedAt: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
}
