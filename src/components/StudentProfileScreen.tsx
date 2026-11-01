import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  LogOut, 
  FileText
} from 'lucide-react';
import { StudentProfile, SubjectScore, SavedSession, GoogleAccountInfo, GradeLevel, SecondLanguage, SECOND_LANGUAGES } from '../types';

interface StudentProfileScreenProps {
  profile: StudentProfile;
  onEnterChat: (subject?: string) => void;
  onOpenScratchpad: () => void;
  onOpenGoogleGuide?: () => void;
  savedSessions: SavedSession[];
  linkedGoogleAccount?: GoogleAccountInfo | null;
  onLogout: () => void;
  activeSubject: string;
  secondLanguage?: SecondLanguage;
  onSecondLanguageChange?: (lang: SecondLanguage) => void;
}

export const StudentProfileScreen: React.FC<StudentProfileScreenProps> = ({
  profile,
  onEnterChat,
  onOpenScratchpad,
  onOpenGoogleGuide,
  savedSessions,
  linkedGoogleAccount,
  onLogout,
  activeSubject,
  secondLanguage,
  onSecondLanguageChange,
}) => {
  const [selectedSubject, setSelectedSubject] = useState(activeSubject);

  // Compute overall percentage
  const totalScored = profile.recentMarks.reduce((acc, m) => acc + m.score, 0);
  const totalMax = profile.recentMarks.reduce((acc, m) => acc + m.maxScore, 0);
  const overallPercentage = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0;

  const weakSubjects = profile.recentMarks.filter((m) => m.needsRevisionFocus);



  return (
    <div className="min-h-screen bg-[#fcfbfa] text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Top Academic Navigation Bar */}
      <header className="border-b border-emerald-900/10 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* School Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-amber-300 shadow-md border border-emerald-700/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight font-serif">
                  Indigenous School
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300/50">
                  Student Academic Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Academic Year 2026–27 • Socratic AI Learning System
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onEnterChat(selectedSubject)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <span>Enter AI Study Room</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Student Profile Dashboard Content */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 flex-1">
        
        {/* Welcome & Student Hero Card */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/15 via-transparent to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-emerald-950 font-bold text-2xl font-serif shadow-lg border-2 border-amber-200 shrink-0">
                {profile.fullName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight">
                    {profile.fullName}
                  </h2>
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-white/15 text-amber-200 rounded-lg border border-white/20">
                    {profile.studentId}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-700/80 text-emerald-100 rounded-lg">
                    {profile.grade}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 flex flex-wrap items-center gap-2">
                  <span>Socratic AI Study Profile</span>
                  {profile.stream && (
                    <>
                      <span>•</span>
                      <span className="text-amber-300 font-semibold">{profile.stream}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Overall Academic Health Gauge */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15 shrink-0">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-300">
                  {overallPercentage}%
                </div>
                <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">
                  Cumulative Term Avg
                </div>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">
                  {weakSubjects.length === 0 ? 'Optimal Standing' : `${weakSubjects.length} Areas For Revision`}
                </div>
                <p className="text-[11px] text-emerald-200 max-w-[140px] leading-tight">
                  {weakSubjects.length === 0
                    ? 'All subjects meeting scholastic benchmarks.'
                    : 'Targeted Socratic revision recommended.'}
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Main Grid: Left Column = Study Tools & Sessions; Right Column = Marks & Revision */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Quick Study Tools & Recent Sessions */}
          <div className="space-y-6">
            
            {/* Quick Tools & 2nd Language Selection */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-800" />
                <span>Study Tools &amp; Options</span>
              </h3>

              {/* 2nd Language Picker for Grade 9 & 10 */}
              {(profile.grade === 'Grade 10' || profile.grade === 'Grade 9') && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">2nd Language</span>
                    {onSecondLanguageChange ? (
                      <select
                        value={profile.secondLanguage || secondLanguage || 'Hindi Course-A'}
                        onChange={(e) => onSecondLanguageChange(e.target.value as SecondLanguage)}
                        className="font-semibold text-emerald-800 bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer shadow-2xs"
                      >
                        {SECOND_LANGUAGES.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-semibold text-emerald-800">
                        {profile.secondLanguage || secondLanguage || 'Hindi Course-A'}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Grade 10 core subjects: Math, English, Science, Social Science &amp; 2nd Language.
                  </p>
                </div>
              )}

              {/* Formula Scratchpad Button */}
              <button
                onClick={onOpenScratchpad}
                className="w-full py-2.5 px-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Open Formula Sheet &amp; Scratchpad</span>
              </button>
            </div>

            {/* Saved Study Sessions */}
            {savedSessions.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-800" />
                    <span>Recent Study Sessions</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {savedSessions.length} saved
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {savedSessions.slice(0, 4).map((sess) => (
                    <div
                      key={sess.id}
                      onClick={() => onEnterChat(sess.subject)}
                      className="p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                          {sess.title}
                        </span>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/70 px-1.5 py-0.2 rounded">
                          {sess.subject}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{sess.messages?.length || 0} messages</span>
                        <span>{new Date(sess.lastActiveAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Academic Marks & Socratic Subject Launchpad (2 cols wide) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Subject Scorecard & Diagnostic Revision Alerts */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-800" />
                    <span>Term Examination Marks &amp; Learning Analytics</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official Mid-Term Assessment Scores (Out of 80 for theory / 70 for practicals)
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Proficient
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Revision Focus
                  </span>
                </div>
              </div>

              {/* Marks Matrix */}
              <div className="space-y-3.5">
                {profile.recentMarks.map((m, idx) => {
                  const pct = Math.round((m.score / m.maxScore) * 100);
                  const isWeak = m.needsRevisionFocus;

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isWeak
                          ? 'border-amber-300 bg-amber-50/30 shadow-2xs'
                          : 'border-slate-200/80 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 font-serif">
                              {m.subject}
                            </h4>
                            {isWeak ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                Revision Recommended
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Strong Mastery
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">
                            Assessment: {m.term}
                          </div>
                        </div>

                        {/* Marks & CTA Button */}
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <div className="text-base font-extrabold text-slate-900 font-serif">
                              {m.score} <span className="text-xs font-normal text-slate-400">/ {m.maxScore}</span>
                            </div>
                            <div className="text-[11px] font-semibold text-slate-500">
                              {pct}%
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedSubject(m.subject);
                              onEnterChat(m.subject);
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                              isWeak
                                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                            }`}
                          >
                            <span>{isWeak ? 'Revise with AI' : 'Practice'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWeak ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Weak Topic Chips if any */}
                      {m.topicWeaknesses && m.topicWeaknesses.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="text-slate-500 font-semibold text-[10px] uppercase">
                            Teacher Weakness Notes:
                          </span>
                          {m.topicWeaknesses.map((topic, tidx) => (
                            <span
                              key={tidx}
                              className="px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-900 border border-amber-300/70 font-medium"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch AI Study Room Hero CTA Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-emerald-700/50">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold uppercase tracking-wider">
                    24/7 Scholastic AI Tutor
                  </span>
                  <span className="text-xs text-emerald-200">
                    Clean Socratic Study Room
                  </span>
                </div>
                <h4 className="text-lg font-bold font-serif">
                  Ready to start a focused study session?
                </h4>
                <p className="text-xs text-emerald-100 max-w-md">
                  Experience step-by-step guidance without direct calculation spoilers. Step through Stage 1, test your reasoning, and master tough concepts.
                </p>
              </div>

              <button
                onClick={() => onEnterChat(selectedSubject)}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer"
              >
                <span>Enter AI Study Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
