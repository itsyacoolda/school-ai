import React from 'react';
import { 
  GradeLevel, 
  HighSchoolStream, 
  SecondLanguage, 
  ThirdLanguage 
} from '../types';
import { getSubjectsForStudentCurriculum, SubjectMeta } from '../data/studentRoster';
import { 
  GraduationCap, 
  Layers, 
  Globe2, 
  BookMarked,
  Sparkles
} from 'lucide-react';

interface CurriculumSubjectBarProps {
  grade: GradeLevel;
  stream?: HighSchoolStream;
  onStreamChange: (stream: HighSchoolStream) => void;
  secondLanguage: SecondLanguage;
  onSecondLanguageChange: (lang: SecondLanguage) => void;
  thirdLanguage: ThirdLanguage;
  onThirdLanguageChange: (lang: ThirdLanguage) => void;
  activeSubject: string;
  onSubjectChange: (subject: string) => void;
}

const HIGH_SCHOOL_STREAMS: HighSchoolStream[] = [
  'Science (PCM)',
  'Science (PCB)',
  'Commerce',
  'Humanities',
  'Computer Science & AI',
];

const SECOND_LANGUAGES: SecondLanguage[] = [
  'Hindi Course-A',
  'Sanskrit',
  'French',
  'Spanish',
  'German',
];

const THIRD_LANGUAGES: ThirdLanguage[] = [
  'Sanskrit',
  'French',
  'German',
  'Spanish',
];

export const CurriculumSubjectBar: React.FC<CurriculumSubjectBarProps> = ({
  grade,
  stream = 'Science (PCM)',
  onStreamChange,
  secondLanguage,
  onSecondLanguageChange,
  thirdLanguage,
  onThirdLanguageChange,
  activeSubject,
  onSubjectChange,
}) => {
  const isHighSchool = grade === 'Grade 11' || grade === 'Grade 12';
  const isEighth = grade === 'Grade 8';
  const isNinthOrTenth = grade === 'Grade 9' || grade === 'Grade 10';

  // Compute available subjects strictly for this grade and chosen stream/language
  const curriculumSubjects: SubjectMeta[] = getSubjectsForStudentCurriculum(
    grade,
    isHighSchool ? stream : undefined,
    secondLanguage,
    thirdLanguage
  );

  return (
    <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Left Side: Grade & Stream / Language Configuration */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-900 text-white font-bold text-xs shadow-2xs">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>{grade}</span>
          </div>

          {/* If 11th or 12th: Show Stream Selector */}
          {isHighSchool && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Stream:
              </span>
              <select
                value={stream}
                onChange={(e) => {
                  const newStream = e.target.value as HighSchoolStream;
                  onStreamChange(newStream);
                  // Default to first subject of that stream
                  const subs = getSubjectsForStudentCurriculum(grade, newStream, secondLanguage, thirdLanguage);
                  if (subs.length > 0) onSubjectChange(subs[0].name);
                }}
                className="px-2.5 py-1 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                {HIGH_SCHOOL_STREAMS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* If 9th or 10th: Show 2nd Language Selector */}
          {isNinthOrTenth && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-emerald-700" /> 2nd Language:
              </span>
              <select
                value={secondLanguage}
                onChange={(e) => {
                  const newLang = e.target.value as SecondLanguage;
                  onSecondLanguageChange(newLang);
                  if (activeSubject === secondLanguage) onSubjectChange(newLang);
                }}
                className="px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
              >
                {SECOND_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          )}

          {/* If 8th: Show 3rd Language Selector */}
          {isEighth && (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-emerald-700" /> 3rd Language:
              </span>
              <select
                value={thirdLanguage}
                onChange={(e) => {
                  const newLang = e.target.value as ThirdLanguage;
                  onThirdLanguageChange(newLang);
                  if (activeSubject === thirdLanguage) onSubjectChange(newLang);
                }}
                className="px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
              >
                {THIRD_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          )}

        </div>

        {/* Right Side: Subjects Active for this specific student/class (NO TABS!) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] shrink-0 mr-1">
            Subject Focus:
          </span>

          <div className="flex items-center gap-1.5">
            {curriculumSubjects.map((sub) => {
              const isSelected = activeSubject.toLowerCase().includes(sub.name.toLowerCase()) || 
                                sub.name.toLowerCase().includes(activeSubject.toLowerCase());
              return (
                <button
                  key={sub.name}
                  onClick={() => onSubjectChange(sub.name)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-emerald-800 border-emerald-900 text-white shadow-xs'
                      : 'bg-white border-slate-300/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{sub.name}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-emerald-950/60 text-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    /{sub.maxMarks}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
