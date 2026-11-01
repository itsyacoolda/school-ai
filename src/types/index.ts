export type GradeLevel = 'Grade 8' | 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12';
export type SubjectName = string;
export type SubjectStream = string;

export type HighSchoolStream = 
  | 'Science (PCM)'
  | 'Science (PCB)'
  | 'Commerce'
  | 'Humanities'
  | 'Computer Science & AI';

export type SecondLanguage = 'Hindi Course-A' | 'Sanskrit' | 'French' | 'Spanish' | 'German';
export type ThirdLanguage = 'Sanskrit' | 'French' | 'German' | 'Spanish';

export const SECOND_LANGUAGES: SecondLanguage[] = [
  'Hindi Course-A',
  'Sanskrit',
  'French',
  'German',
  'Spanish',
];

export const THIRD_LANGUAGES: ThirdLanguage[] = [
  'Sanskrit',
  'French',
  'German',
  'Spanish',
];

export type ModelEngineType = 'ram-qwen' | 'cloud-gemini';

export type RamModelFamily = 'qwen' | 'llama' | 'smollm';

export interface RamModelConfig {
  id: string;
  displayName: string;
  family: RamModelFamily;
  provider: string;
  estimatedRamMB: number;
  description: string;
  recommended?: boolean;
}

export type PermissionTier = 'TIER_STU_ACADEMIC' | 'TIER_STU_PROJECT' | 'TIER_STU_DEV_MAX';

export interface SubjectScore {
  subject: string;
  score: number;
  maxScore: number; // Out of 80 (or 70 for practical subjects in 11-12)
  term: string;
  needsRevisionFocus?: boolean;
  topicWeaknesses?: string[];
}

export interface StudentProfile {
  studentId: string;
  fullName: string;
  grade: GradeLevel;
  stream?: HighSchoolStream; // For 11th & 12th
  secondLanguage?: SecondLanguage; // For 9th & 10th
  thirdLanguage?: ThirdLanguage; // For 8th
  houseName: string;
  assignedTier: PermissionTier;
  recentMarks: SubjectScore[];
  academicAdvisor: string;
  email?: string;
  googleLinked?: boolean;
  googleEmail?: string;
  attendancePercentage?: number;
  rollNumber?: string;
}

export interface GoogleAccountInfo {
  email: string;
  hd?: string;
  name: string;
  picture?: string;
  sub?: string;
  verifiedSchoolAccount: boolean;
}

export interface TeacherUser {
  teacherId: string;
  fullName: string;
  department: string;
  designation: string;
}

export interface AuthSession {
  role: 'student' | 'teacher';
  studentProfile?: StudentProfile;
  teacher?: TeacherUser;
  token: string;
  authProvider?: 'password' | 'google-workspace';
  googleAccount?: GoogleAccountInfo;
}

export interface TeacherMaterial {
  id: string;
  title: string;
  authorTeacher: string;
  subject: SubjectStream;
  targetGrades: GradeLevel[];
  uploadDate: string;
  materialType: 'Study Guide' | 'Revision Notes' | 'Circular' | 'Question Bank' | 'Lab Manual';
  content: string;
  priorityWeight: number; // Higher priority in RAG
}

export interface SchoolCitation {
  documentId: string;
  documentTitle: string;
  section: string;
  excerpt: string;
  isTeacherUploaded?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  engine: ModelEngineType;
  grade: GradeLevel;
  subject: SubjectStream;
  tier?: PermissionTier;
  studentId?: string;
  citations?: SchoolCitation[];
  isSocraticStep?: boolean;
  tokensGenerated?: number;
  generationSpeedTokPerSec?: number;
}

export interface SchoolDocument {
  id: string;
  title: string;
  circularNumber?: string;
  category: 'Circular' | 'Handbook' | 'Timetable' | 'Syllabus' | 'Policy';
  date: string;
  effectiveForGrades: string[];
  summary: string;
  sections: {
    heading: string;
    sectionNumber: string;
    content: string;
  }[];
  isCustomUploaded?: boolean;
}

export interface WebLLMLoadingProgress {
  progress: number;
  text: string;
  timeElapsed?: number;
}

export interface StudySession {
  id: string;
  title: string;
  goal?: string;
  timestamp: number;
  lastActiveAt: number;
  grade: GradeLevel;
  subject: string;
  messages: ChatMessage[];
  isPinned?: boolean;
}

export interface SavedSession extends StudySession {}

export interface EngineStats {
  engineType: ModelEngineType;
  modelName: string;
  ramUsageEstimateMB: number;
  webGpuSupported: boolean;
  deviceInfo?: string;
  totalTokensProcessed: number;
  isReady: boolean;
  isLoading: boolean;
  loadingProgress?: WebLLMLoadingProgress;
}
