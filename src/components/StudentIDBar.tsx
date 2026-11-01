import React, { useState } from 'react';
import { 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  TrendingDown, 
  Sparkles, 
  Layers, 
  KeyRound, 
  CheckCircle, 
  HelpCircle,
  Award,
  SlidersHorizontal,
  Code2,
  Wrench,
  BookOpen,
  Bot
} from 'lucide-react';
import { StudentProfile, PermissionTier } from '../types';

interface StudentIDBarProps {
  currentProfile: StudentProfile;
  students: StudentProfile[];
  onSelectStudentId: (studentId: string) => void;
  onOpenTeacherPortal: () => void;
  activeDynamicTier?: PermissionTier;
}

export const StudentIDBar: React.FC<StudentIDBarProps> = ({
  currentProfile,
  students,
  onSelectStudentId,
  onOpenTeacherPortal,
  activeDynamicTier = 'TIER_STU_ACADEMIC',
}) => {
  const [showMarksSheet, setShowMarksSheet] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [isEditingId, setIsEditingId] = useState(false);

  const weakSubjects = currentProfile.recentMarks.filter((m) => m.needsRevisionFocus);

  // Friendly human role label for the student (NEVER exposing the raw secret tokens)
  const getFriendlyModeInfo = (tier: PermissionTier) => {
    switch (tier) {
      case 'TIER_STU_DEV_MAX':
        return {
          title: 'Auto-Detected: Software Dev Partner',
          icon: <Code2 className="w-3.5 h-3.5 text-blue-600" />,
          desc: 'Chat context shifted to software engineering & app development. Full code enabled.',
          badgeClass: 'bg-blue-100 text-blue-900 border-blue-300 ring-1 ring-blue-400/40',
        };
      case 'TIER_STU_PROJECT':
        return {
          title: 'Auto-Detected: STEM & Exhibition Coach',
          icon: <Wrench className="w-3.5 h-3.5 text-amber-600" />,
          desc: 'Chat context shifted to hardware prototypes, Arduino, circuits, and science exhibition.',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-400/40',
        };
      case 'TIER_STU_ACADEMIC':
      default:
        return {
          title: 'Auto-Detected: Socratic Academic Coach',
          icon: <BookOpen className="w-3.5 h-3.5 text-emerald-700" />,
          desc: 'Academic tutoring context: Guides step-by-step reasoning without direct answer dumps.',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-1 ring-emerald-400/40',
        };
    }
  };

  const modeInfo = getFriendlyModeInfo(activeDynamicTier);

  const handleCustomIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onSelectStudentId(customInput.trim());
    setIsEditingId(false);
    setCustomInput('');
  };

  return (
    <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Left: Student Identity & Grade Routing */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Student ID:
            </span>

            {isEditingId ? (
              <form onSubmit={handleCustomIdSubmit} className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. IS-2026-G10-042"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="px-2 py-0.5 text-xs font-mono font-bold border border-emerald-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600 uppercase"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 text-xs bg-emerald-800 text-white rounded font-bold"
                >
                  Set
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingId(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1.5">
                <select
                  value={currentProfile.studentId}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setIsEditingId(true);
                    } else {
                      onSelectStudentId(e.target.value);
                    }
                  }}
                  className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md border border-slate-300 focus:outline-none cursor-pointer"
                >
                  {students.map((stu) => (
                    <option key={stu.studentId} value={stu.studentId}>
                      {stu.studentId} ({stu.fullName} - {stu.grade})
                    </option>
                  ))}
                  <option value="CUSTOM">+ Enter Custom Student ID...</option>
                </select>

                <span className="text-xs font-semibold text-slate-700">
                  {currentProfile.fullName}
                </span>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Auto-Routed: {currentProfile.grade}
                </span>
              </div>
            )}
          </div>

          {/* Role / Freedom Display (Clean Student-Friendly Label Driven by Context) */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-2xs ${modeInfo.badgeClass}`}
            title={modeInfo.desc}
          >
            {modeInfo.icon}
            <span>{modeInfo.title}</span>
          </div>
        </div>

        {/* Right: Recent Marks Review & Teacher Portal */}
        <div className="flex items-center gap-2.5">
          
          {/* Recent Marks Toggle */}
          <button
            onClick={() => setShowMarksSheet(!showMarksSheet)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            <span>Recent Marks Review</span>
            {weakSubjects.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
            {showMarksSheet ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* Teacher Portal Trigger */}
          <button
            onClick={onOpenTeacherPortal}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 transition-colors shadow-xs"
            title="Open Teacher Portal to review student progress and upload study guides"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Faculty Portal</span>
          </button>

        </div>

      </div>

      {/* Expandable Recent Marks & Suggested Revision Focus Area */}
      {showMarksSheet && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 animate-in fade-in duration-150">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-200">
            
            {/* Subject Scores (Strictly out of 80 / 70) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700">Recent Term Marks:</span>
              {currentProfile.recentMarks.map((m, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                    m.needsRevisionFocus
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {m.subject}: <strong>{m.score}/{m.maxScore}</strong>
                </div>
              ))}
            </div>

            {/* Targeted Revision Nudge */}
            {weakSubjects.length > 0 ? (
              <div className="flex items-center gap-2 text-rose-900 bg-rose-100/60 px-3 py-1 rounded-lg border border-rose-200 text-xs">
                <TrendingDown className="w-4 h-4 text-rose-700 shrink-0" />
                <span>
                  <strong>AI Revision Focus: </strong>
                  The assistant will gently guide reinforcement in: {weakSubjects.map((w) => w.subject).join(', ')}.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-emerald-800 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Academic performance on track across all evaluated subjects.</span>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
