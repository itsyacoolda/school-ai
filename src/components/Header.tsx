import React from 'react';
import { 
  GraduationCap, 
  Cpu, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  HardDrive,
  LogOut,
  User,
  KeyRound,
  Layers,
  ChevronDown,
  Maximize2,
  Minimize2,
  Globe
} from 'lucide-react';
import { ModelEngineType, GradeLevel, AuthSession, SecondLanguage, SECOND_LANGUAGES } from '../types';
import { SubjectMeta } from '../data/studentRoster';

interface HeaderProps {
  currentEngine: ModelEngineType;
  onEngineChange: (engine: ModelEngineType) => void;
  onOpenEngineModal: () => void;
  onOpenScratchpad: () => void;
  onToggleStudySessions?: () => void;
  sessionCount?: number;
  isStudySessionsOpen?: boolean;
  isRamEngineReady: boolean;
  isRamEngineLoading: boolean;
  activeModelName: string;
  grade: GradeLevel;
  authSession: AuthSession | null;
  onLogout: () => void;
  onOpenStudentProfile?: () => void;
  activeSubject?: string;
  curriculumSubjects?: SubjectMeta[];
  onSubjectChange?: (subject: string) => void;
  secondLanguage?: SecondLanguage;
  onSecondLanguageChange?: (lang: SecondLanguage) => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  onOpenGoogleGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentEngine,
  onEngineChange,
  onOpenEngineModal,
  onOpenScratchpad,
  onToggleStudySessions,
  sessionCount = 0,
  isStudySessionsOpen = false,
  isRamEngineReady,
  isRamEngineLoading,
  activeModelName,
  grade,
  authSession,
  onLogout,
  onOpenStudentProfile,
  activeSubject,
  curriculumSubjects = [],
  onSubjectChange,
  secondLanguage,
  onSecondLanguageChange,
  isFocusMode = false,
  onToggleFocusMode,
  onOpenGoogleGuide,
}) => {
  const isNinthOrTenth = grade === 'Grade 9' || grade === 'Grade 10';

  return (
    <header className="border-b border-emerald-900/10 bg-white/95 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Brand, Crest & Subject Switcher */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onOpenStudentProfile}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center shadow-xs border border-emerald-700/30 text-amber-300 cursor-pointer hover:opacity-90 transition-opacity"
            title="View Student Profile & Info"
          >
            <GraduationCap className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-serif">
                  Indigenous School
                </h1>
                <span className="hidden sm:inline-flex px-1.5 py-0.2 text-[9px] font-semibold bg-emerald-100 text-emerald-800 rounded border border-emerald-300/50">
                  AI Coach
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Socratic Study Room • {grade}
              </p>
            </div>

            {/* Clean Inline Subject Switcher */}
            {curriculumSubjects.length > 0 && onSubjectChange && activeSubject && (
              <div className="ml-2 pl-2 border-l border-slate-200 flex items-center gap-2">
                <div className="relative">
                  <select
                    value={activeSubject}
                    onChange={(e) => onSubjectChange(e.target.value)}
                    className="appearance-none bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/80 text-emerald-900 text-xs font-bold py-1.5 pl-3 pr-7 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer transition-colors shadow-2xs font-serif"
                    title="Switch active subject"
                  >
                    {curriculumSubjects.map((sub) => (
                      <option key={sub.name} value={sub.name} className="font-sans text-slate-800">
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-700 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* 2nd Language Picker for Grade 9 & 10 */}
                {isNinthOrTenth && secondLanguage && onSecondLanguageChange && (
                  <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
                    <Globe className="w-3 h-3 text-emerald-700" />
                    <span className="text-[10px] uppercase font-bold text-slate-400">2nd Lang:</span>
                    <select
                      value={secondLanguage}
                      onChange={(e) => {
                        const newLang = e.target.value as SecondLanguage;
                        onSecondLanguageChange(newLang);
                        if (activeSubject === secondLanguage) onSubjectChange(newLang);
                      }}
                      className="text-xs font-semibold text-slate-700 bg-transparent border-none p-0 focus:outline-none cursor-pointer"
                      title="Select Grade 10 Second Language"
                    >
                      {SECOND_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Engine Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Student Info Button (Primary navigation to Student Info Screen) */}
          {authSession?.role === 'student' && onOpenStudentProfile && (
            <button
              onClick={onOpenStudentProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs"
              title="Open Student Profile, Marks Sheet & Attendance"
            >
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>Student Profile</span>
              <span className="hidden lg:inline text-[10px] text-slate-400 font-normal">
                ({authSession.studentProfile?.fullName.split(' ')[0]})
              </span>
            </button>
          )}

          {/* Study Sessions Button */}
          {onToggleStudySessions && (
            <button
              onClick={onToggleStudySessions}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all shadow-2xs cursor-pointer ${
                isStudySessionsOpen
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title="Open or close saved Study Sessions & Focus Timer"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Sessions</span>
              {sessionCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isStudySessionsOpen ? 'bg-emerald-900 text-emerald-100' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {sessionCount}
                </span>
              )}
            </button>
          )}

          {/* Formula & Scratchpad Button */}
          <button
            onClick={onOpenScratchpad}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/80 transition-colors shadow-2xs cursor-pointer"
            title="Open Formula Reference Sheet & Scratchpad"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Formulas</span>
          </button>

          {/* Focus Mode Toggle */}
          {onToggleFocusMode && (
            <button
              onClick={onToggleFocusMode}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isFocusMode
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500'
              }`}
              title={isFocusMode ? 'Exit Clean Focus Mode' : 'Enter Clean Focus Mode (Distraction-Free)'}
            >
              {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Dual Engine Toggle (Compact In-RAM vs Cloud) */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs shadow-inner">
            <button
              type="button"
              onClick={() => onEngineChange('ram-qwen')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentEngine === 'ram-qwen'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title="Runs inside your PC RAM via WebGPU with unlimited tokens"
            >
              <Cpu className="w-3 h-3" />
              <span className="hidden sm:inline">In-RAM</span>
              {isRamEngineLoading && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
              )}
              {isRamEngineReady && currentEngine === 'ram-qwen' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onEngineChange('cloud-gemini')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentEngine === 'cloud-gemini'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title="Cloud speed powered by Gemini 3.8 Flash"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Cloud</span>
            </button>
          </div>

          {/* Engine Model Selector */}
          <button
            onClick={onOpenEngineModal}
            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs cursor-pointer"
            title="Inspect Model Diagnostics / RAM Allocation"
          >
            <HardDrive className="w-4 h-4 text-emerald-800" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Log out of current session"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
