import React, { useState } from 'react';
import { 
  GraduationCap, 
  KeyRound, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  AlertCircle,
  Sparkles,
  BookOpen,
  School,
  Globe,
  Info
} from 'lucide-react';
import { StudentProfile, TeacherUser, AuthSession, GoogleAccountInfo } from '../types';
import { PRESET_STUDENTS, PRESET_TEACHERS } from '../data/studentRoster';
import { SchoolGoogleAuthModal } from './SchoolGoogleAuthModal';

interface LoginPageProps {
  onLoginSuccess: (session: AuthSession) => void;
  students: StudentProfile[];
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  students,
}) => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [identifier, setIdentifier] = useState('IS-2026-G10-042');
  const [password, setPassword] = useState('student123');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleRoleSwitch = (newRole: 'student' | 'teacher') => {
    setRole(newRole);
    setErrorMessage('');
    if (newRole === 'student') {
      setIdentifier('IS-2026-G10-042');
      setPassword('student123');
    } else {
      setIdentifier('TCH-HOD-PHYS');
      setPassword('teacher123');
    }
  };

  const handleQuickLogin = (roleType: 'student' | 'teacher', id: string) => {
    setRole(roleType);
    setIdentifier(id);
    setErrorMessage('');
    if (roleType === 'student') {
      const found = students.find((s) => s.studentId === id) || PRESET_STUDENTS[0];
      onLoginSuccess({
        role: 'student',
        studentProfile: found,
        token: `stu-token-${Date.now()}`,
        authProvider: 'password',
      });
    } else {
      const foundTeacher = PRESET_TEACHERS.find((t) => t.teacherId === id) || PRESET_TEACHERS[0];
      onLoginSuccess({
        role: 'teacher',
        teacher: foundTeacher,
        token: `tch-token-${Date.now()}`,
        authProvider: 'password',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedId = identifier.trim().toLowerCase();
    const isTeacherPass = password === 'teacher123' || password === 'teacher' || password === 'admin123';
    const isStudentPass = password === 'student123' || password === 'student';

    // Both use the same login page with different passwords:
    if (role === 'teacher' || isTeacherPass || trimmedId.startsWith('tch')) {
      if (!isTeacherPass) {
        setErrorMessage('Invalid faculty password. (Use password "teacher123" for faculty login)');
        return;
      }

      const foundTeacher = PRESET_TEACHERS.find(
        (t) => t.teacherId.toLowerCase() === trimmedId
      ) || PRESET_TEACHERS[0];

      onLoginSuccess({
        role: 'teacher',
        teacher: foundTeacher,
        token: `tch-token-${Date.now()}`,
        authProvider: 'password',
      });
      return;
    }

    // Otherwise log in as student
    const foundStudent = students.find(
      (s) =>
        s.studentId.toLowerCase() === trimmedId ||
        s.fullName.toLowerCase().includes(trimmedId) ||
        trimmedId.includes(s.fullName.toLowerCase().split(' ')[0])
    ) || PRESET_STUDENTS[0];

    onLoginSuccess({
      role: 'student',
      studentProfile: foundStudent,
      token: `stu-token-${Date.now()}`,
      authProvider: 'password',
    });
  };

  const handleGoogleAccountLinked = (googleInfo: GoogleAccountInfo) => {
    // Attempt to match with existing student by email prefix or default to Aarav Patel
    const emailPrefix = googleInfo.email.split('@')[0].toLowerCase();
    const matched = students.find((s) => {
      const nameKey = s.fullName.toLowerCase().replace(/\s+/g, '.');
      return emailPrefix.includes(nameKey) || googleInfo.email.toLowerCase().includes(s.studentId.toLowerCase());
    }) || students[0];

    const updatedProfile: StudentProfile = {
      ...matched,
      googleLinked: true,
      googleEmail: googleInfo.email,
    };

    onLoginSuccess({
      role: 'student',
      studentProfile: updatedProfile,
      token: `google-token-${Date.now()}`,
      authProvider: 'google-workspace',
      googleAccount: googleInfo,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042f2e] via-[#064e3b] to-[#022c22] flex items-center justify-center p-4 selection:bg-amber-400 selection:text-slate-900">
      <div className="w-full max-w-md">
        
        {/* Crest & Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 shadow-xl flex items-center justify-center text-emerald-950 border-2 border-amber-200">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">
            Indigenous School
          </h1>
          <p className="text-xs text-emerald-200/90 font-medium">
            Official 24/7 Socratic Academic Coach &amp; Faculty Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-emerald-900/20 overflow-hidden">
          
          {/* Role Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              className={`py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'student'
                  ? 'bg-emerald-50/80 text-emerald-900 border-b-2 border-emerald-800'
                  : 'bg-slate-50 text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('teacher')}
              className={`py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'teacher'
                  ? 'bg-emerald-50/80 text-emerald-900 border-b-2 border-emerald-800'
                  : 'bg-slate-50 text-slate-500 hover:text-slate-800'
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-700" />
              <span>Teacher / Faculty</span>
            </button>
          </div>

          <div className="p-6 sm:p-7 space-y-5">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* School Google Sign-In Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                {/* Official Google G SVG */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with School Google Account</span>
              </button>
              
              <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
                <span className="text-emerald-800 font-medium">@indigenous-school.edu</span>
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="text-slate-500 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                  <span>How to connect</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400">
                Or sign in with School ID
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* ID Input */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  {role === 'student' ? 'Official Student ID' : 'Faculty / Teacher ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    {role === 'student' ? <User className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === 'student' ? 'e.g. IS-2026-G10-042' : 'e.g. TCH-HOD-PHYS'}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all uppercase"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {role === 'student' ? 'Demo: student123' : 'Demo: teacher123'}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Log In to {role === 'student' ? 'Student Academic Portal' : 'Faculty Administration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick-Select Demo Accounts:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student', 'IS-2026-G10-042')}
                  className="p-2 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 transition-colors cursor-pointer"
                >
                  <span className="font-bold block truncate text-slate-800">Aarav Patel (Gr 10)</span>
                  <span className="text-[10px] text-emerald-800 font-mono font-medium">IS-2026-G10-042</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('student', 'IS-2026-G12-108')}
                  className="p-2 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 transition-colors cursor-pointer"
                >
                  <span className="font-bold block truncate text-slate-800">Priya Sharma (Gr 12)</span>
                  <span className="text-[10px] text-emerald-800 font-mono font-medium">IS-2026-G12-108</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('student', 'IS-2026-G08-019')}
                  className="p-2 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 transition-colors cursor-pointer"
                >
                  <span className="font-bold block truncate text-slate-800">Maya Lin (Gr 8)</span>
                  <span className="text-[10px] text-emerald-800 font-mono font-medium">IS-2026-G08-019</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('teacher', 'TCH-HOD-PHYS')}
                  className="p-2 text-left rounded-xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200 text-amber-950 transition-colors cursor-pointer"
                >
                  <span className="font-bold block truncate">Dr. Mukherjee (Faculty)</span>
                  <span className="text-[10px] text-amber-700 font-mono font-medium">TCH-HOD-PHYS</span>
                </button>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> CBSE / NCERT Compliant
            </span>
            <span>Academic Year 2026–27</span>
          </div>

        </div>
      </div>

      {/* School Google Workspace Guide & Linker Modal */}
      <SchoolGoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onLinkGoogleAccount={handleGoogleAccountLinked}
      />
    </div>
  );
};
