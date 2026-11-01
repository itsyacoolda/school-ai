import React from 'react';
import { GradeLevel, SubjectStream } from '../types';
import { 
  Atom, 
  Terminal, 
  Landmark, 
  TrendingUp, 
  Building2, 
  Sparkles,
  Award
} from 'lucide-react';

interface GradeStreamSelectorProps {
  currentGrade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  currentSubject: SubjectStream;
  onSubjectChange: (subject: SubjectStream) => void;
}

const GRADES: GradeLevel[] = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

const SUBJECTS: { id: SubjectStream; name: string; icon: React.ReactNode; desc: string }[] = [
  { 
    id: 'PCM', 
    name: 'PCM (Physics, Chem, Math)', 
    icon: <Atom className="w-3.5 h-3.5 text-blue-600" />,
    desc: 'Kinematics, Calculus, Organic Chemistry, Vectors'
  },
  { 
    id: 'CS', 
    name: 'CS & AI', 
    icon: <Terminal className="w-3.5 h-3.5 text-emerald-600" />,
    desc: 'Python, Algorithms, SQL, Machine Learning ethics'
  },
  { 
    id: 'Commerce', 
    name: 'Commerce & Economics', 
    icon: <TrendingUp className="w-3.5 h-3.5 text-amber-600" />,
    desc: 'Accountancy, Macroeconomics, Business Studies'
  },
  { 
    id: 'Humanities', 
    name: 'Humanities & Social Sciences', 
    icon: <Landmark className="w-3.5 h-3.5 text-purple-600" />,
    desc: 'History, Political Science, Geography, Sociology'
  },
  { 
    id: 'School Administration', 
    name: 'School Circulars & Policies', 
    icon: <Building2 className="w-3.5 h-3.5 text-rose-600" />,
    desc: 'Exam dates, attendance, fees, circulars, handbooks'
  },
];

export const GradeStreamSelector: React.FC<GradeStreamSelectorProps> = ({
  currentGrade,
  onGradeChange,
  currentSubject,
  onSubjectChange,
}) => {
  const isJunior = currentGrade === 'Grade 8' || currentGrade === 'Grade 9';

  return (
    <div className="bg-gradient-to-r from-emerald-950/5 via-slate-50 to-amber-950/5 border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Grade Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Grade:
          </span>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
            {GRADES.map((grade) => {
              const active = currentGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => onGradeChange(grade)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    active
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {grade.replace('Grade ', 'Gr ')}
                </button>
              );
            })}
          </div>

          {/* Mode Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100/70 text-emerald-900 border border-emerald-200">
            {isJunior ? (
              <>
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Analogy & Foundation Mode (Grades 8–9)</span>
              </>
            ) : (
              <>
                <Award className="w-3 h-3 text-emerald-700" />
                <span>CBSE/NCERT Rigorous Depth (Grades 10–12)</span>
              </>
            )}
          </div>
        </div>

        {/* Subject Stream Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Domain:
          </span>
          <div className="flex items-center gap-1.5">
            {SUBJECTS.map((sub) => {
              const active = currentSubject === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSubjectChange(sub.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    active
                      ? 'bg-white border-emerald-600 text-emerald-900 font-bold shadow-xs ring-1 ring-emerald-600/30'
                      : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {sub.icon}
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
