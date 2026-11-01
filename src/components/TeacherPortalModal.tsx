import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  KeyRound, 
  Upload, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Plus, 
  FileText,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Bot,
  Activity
} from 'lucide-react';
import { StudentProfile, TeacherMaterial, PermissionTier, GradeLevel } from '../types';

interface TeacherPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProfile[];
  teacherMaterials: TeacherMaterial[];
  onAddTeacherMaterial: (material: TeacherMaterial) => void;
  activeStudentId: string;
  onSwitchActiveStudent: (studentId: string) => void;
  currentDynamicTier?: PermissionTier;
}

export const TeacherPortalModal: React.FC<TeacherPortalModalProps> = ({
  isOpen,
  onClose,
  students,
  teacherMaterials,
  onAddTeacherMaterial,
  activeStudentId,
  onSwitchActiveStudent,
  currentDynamicTier = 'TIER_STU_ACADEMIC',
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'materials'>('students');

  // New Material Form State
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matAuthor, setMatAuthor] = useState('');
  const [matSubject, setMatSubject] = useState('Science');
  const [matType, setMatType] = useState<TeacherMaterial['materialType']>('Study Guide');
  const [matGrade, setMatGrade] = useState<GradeLevel>('Grade 10');
  const [matContent, setMatContent] = useState('');

  if (!isOpen) return null;

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim() || !matContent.trim()) return;

    const newMat: TeacherMaterial = {
      id: `mat-${Date.now()}`,
      title: matTitle.trim(),
      authorTeacher: matAuthor.trim() || 'School Faculty',
      subject: matSubject,
      targetGrades: [matGrade],
      uploadDate: new Date().toISOString().split('T')[0],
      materialType: matType,
      content: matContent.trim(),
      priorityWeight: 10,
    };

    onAddTeacherMaterial(newMat);
    setIsAddingMaterial(false);
    setMatTitle('');
    setMatAuthor('');
    setMatContent('');
  };

  const getTierContextDescription = (tier: PermissionTier) => {
    switch (tier) {
      case 'TIER_STU_DEV_MAX':
        return {
          title: 'Software Development Partner',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
          desc: 'Triggered when chat requests software engineering, database schemas, or codebases.',
        };
      case 'TIER_STU_PROJECT':
        return {
          title: 'STEM & Exhibition Coach',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          desc: 'Triggered when chat discusses science fairs, Arduino, sensors, or prototypes.',
        };
      case 'TIER_STU_ACADEMIC':
      default:
        return {
          title: 'Strict Socratic Tutor',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          desc: 'Default mode: Guides step-by-step; withholds direct homework solutions.',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  Faculty & Teacher Portal
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Academic Monitoring & RAG Management
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Review student progress and upload high-priority study materials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('students')}
              className={`py-3 font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'students'
                  ? 'border-emerald-800 text-emerald-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Performance ({students.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`py-3 font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'materials'
                  ? 'border-emerald-800 text-emerald-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Teacher Study Guides & RAG ({teacherMaterials.length})</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <Bot className="w-3.5 h-3.5 text-amber-700" />
            <span>Tokens are determined by chat context (no teacher cmd)</span>
          </div>
        </div>

        {/* Tab 1: Student Profiles & Dynamic Context Monitoring */}
        {activeTab === 'students' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
            
            {/* Automatic Context Explanation Banner */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Activity className="w-4 h-4 text-amber-700" />
                <span>Teacher Advisory: Tokens Determined Dynamically by Chat Context</span>
              </div>
              <p className="text-amber-900/90 leading-relaxed">
                As per school guidelines, <strong>teachers do not have a command (cmd) to adjust tokens</strong>. The system tokens and permission levels are not manually assigned; instead, the AI assistant <strong>automatically determines tokens based on the context of the chat after a few texts</strong> from the student.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded-lg bg-white border border-amber-200">
                  <span className="font-bold text-emerald-800 block">1. Socratic Tutor (Default)</span>
                  <span className="text-slate-600">Active by default. Never reveals direct answers to homework.</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-amber-200">
                  <span className="font-bold text-amber-800 block">2. STEM & Exhibition Coach</span>
                  <span className="text-slate-600">Auto-engages when chat discusses Arduino, sensors, circuits.</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-amber-200">
                  <span className="font-bold text-blue-800 block">3. Dev Partner (Max Freedom)</span>
                  <span className="text-slate-600">Auto-engages when chat discusses software engineering or full scripts.</span>
                </div>
              </div>
            </div>

            {/* Students Table / Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Enrolled Students & Recent Term Assessment Marks
              </h3>

              <div className="grid gap-3">
                {students.map((stu) => {
                  const isActive = activeStudentId === stu.studentId;
                  const weakSubjects = stu.recentMarks.filter((m) => m.needsRevisionFocus);
                  const tierInfo = getTierContextDescription(
                    isActive ? currentDynamicTier : stu.assignedTier
                  );

                  return (
                    <div
                      key={stu.studentId}
                      className={`p-4 rounded-xl border transition-all ${
                        isActive
                          ? 'border-emerald-700 bg-emerald-50/30 ring-1 ring-emerald-700/50'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        
                        {/* Student Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {stu.fullName}
                            </span>
                            <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-semibold">
                              {stu.studentId}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                              {stu.grade}
                            </span>
                            {stu.stream && (
                              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-medium">
                                {stu.stream}
                              </span>
                            )}
                            <span className="text-xs text-slate-500">{stu.houseName}</span>
                          </div>

                          {/* Recent Marks across Curriculum (Marks strictly out of 80 / 70) */}
                          <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                            <span className="text-slate-500 font-medium">Recent Marks:</span>
                            {stu.recentMarks.map((m, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                                  m.needsRevisionFocus
                                    ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
                                    : 'bg-white text-slate-700 border border-slate-200'
                                }`}
                              >
                                {m.subject}: {m.score}/{m.maxScore}
                              </span>
                            ))}
                          </div>

                          {weakSubjects.length > 0 && (
                            <p className="text-[11px] text-rose-700 flex items-center gap-1 pt-0.5">
                              <TrendingDown className="w-3 h-3" />
                              <span>
                                Needs revision focus in: {weakSubjects.map((w) => w.subject).join(', ')}
                              </span>
                            </p>
                          )}
                        </div>

                        {/* Live Context Badge & Profile Switcher */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              AI Detected Context:
                            </span>
                            <span
                              className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-lg border shadow-2xs ${tierInfo.color}`}
                              title={tierInfo.desc}
                            >
                              {tierInfo.title}
                            </span>
                          </div>

                          <button
                            onClick={() => onSwitchActiveStudent(stu.studentId)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              isActive
                                ? 'bg-emerald-800 text-white cursor-default'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {isActive ? 'Current Student' : 'Load Profile'}
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Teacher Materials & RAG Grounding */}
        {activeTab === 'materials' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Teacher Uploaded Study Guides & Question Banks (RAG)
                </h3>
                <p className="text-xs text-slate-500">
                  These materials receive highest priority weighting in the AI Assistant's retrieval system.
                </p>
              </div>

              <button
                onClick={() => setIsAddingMaterial(!isAddingMaterial)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingMaterial ? 'Cancel' : 'Upload New Study Material'}</span>
              </button>
            </div>

            {isAddingMaterial && (
              <form onSubmit={handleCreateMaterial} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  New Faculty Study Guide / Revision Material
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Masterclass Revision: Calculus Limits & Continuity"
                      value={matTitle}
                      onChange={(e) => setMatTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Author / Teacher Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. H. Mukherjee (Physics HOD)"
                      value={matAuthor}
                      onChange={(e) => setMatAuthor(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={matSubject}
                      onChange={(e) => setMatSubject(e.target.value)}
                      placeholder="e.g. Science, Mathematics, Physics"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Material Type</label>
                    <select
                      value={matType}
                      onChange={(e) => setMatType(e.target.value as TeacherMaterial['materialType'])}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="Study Guide">Study Guide</option>
                      <option value="Revision Notes">Revision Notes</option>
                      <option value="Question Bank">Question Bank</option>
                      <option value="Lab Manual">Lab Manual</option>
                      <option value="Circular">Circular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Grade</label>
                    <select
                      value={matGrade}
                      onChange={(e) => setMatGrade(e.target.value as GradeLevel)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Study Guide Content / Notes *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Enter teacher notes, key derivations, board exam scoring tips, formulas, and common pitfalls..."
                    value={matContent}
                    onChange={(e) => setMatContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingMaterial(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-emerald-800 text-white rounded-lg shadow-xs hover:bg-emerald-900"
                  >
                    Save & Index Material
                  </button>
                </div>
              </form>
            )}

            {/* List of Teacher Materials */}
            <div className="space-y-3">
              {teacherMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
                        {mat.materialType}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {mat.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      RAG Priority: High ({mat.priorityWeight}/10)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>By: <strong className="text-slate-700">{mat.authorTeacher}</strong></span>
                    <span>•</span>
                    <span>Target: {mat.targetGrades.join(', ')}</span>
                    <span>•</span>
                    <span>Uploaded: {mat.uploadDate}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-mono bg-white p-2.5 rounded-lg border border-slate-200 line-clamp-3">
                    {mat.content}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Teacher Portal: Verified notes prioritized in retrieval. Tokens determined by chat context.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
