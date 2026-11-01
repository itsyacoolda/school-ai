import React from 'react';
import { 
  Lightbulb, 
  Binary, 
  HelpCircle, 
  CheckCheck, 
  Sparkles, 
  Compass, 
  FileCheck2
} from 'lucide-react';
import { GradeLevel } from '../types';

interface SocraticToolsBarProps {
  grade: GradeLevel;
  onSendNudge: (prompt: string) => void;
  disabled?: boolean;
}

export const SocraticToolsBar: React.FC<SocraticToolsBarProps> = ({
  grade,
  onSendNudge,
  disabled,
}) => {
  const isJunior = grade === 'Grade 8' || grade === 'Grade 9';

  const nudges = [
    {
      id: 'concept',
      label: 'Concept Spark',
      icon: <Lightbulb className="w-3.5 h-3.5 text-amber-500" />,
      tooltip: 'Explain the underlying fundamental concept',
      prompt: 'Could you explain the core underlying concept and principle here first, without giving me the direct calculation or solution?',
    },
    {
      id: 'formula',
      label: 'Formula / Method Clue',
      icon: <Binary className="w-3.5 h-3.5 text-blue-500" />,
      tooltip: 'Give the relevant formula and identify the given variables',
      prompt: 'Which formula, theorem, or standard method should I recall for this? Please break down what each symbol or variable represents.',
    },
    {
      id: 'breakdown',
      label: 'Step-by-Step Question',
      icon: <Compass className="w-3.5 h-3.5 text-emerald-600" />,
      tooltip: 'Ask a leading question to start stage 1',
      prompt: 'Can you guide me step-by-step? Ask me a leading question for Step 1 so I can work it out myself.',
    },
    {
      id: 'check',
      label: 'Verify My Reasoning',
      icon: <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />,
      tooltip: 'Have the tutor review your reasoning without spoiling the rest',
      prompt: 'Here is what I think so far. Can you check my thought process and tell me if my logic is sound or where I might have made an error?',
    },
    ...(isJunior
      ? [
          {
            id: 'analogy',
            label: 'Real-World Analogy',
            icon: <Sparkles className="w-3.5 h-3.5 text-purple-500" />,
            tooltip: 'Use a relatable everyday example',
            prompt: 'Can you give me an intuitive real-world analogy to help me visualize this concept clearly?',
          },
        ]
      : [
          {
            id: 'exam-logic',
            label: 'CBSE Exam Marking Logic',
            icon: <FileCheck2 className="w-3.5 h-3.5 text-indigo-500" />,
            tooltip: 'Structure according to NCERT/CBSE marking expectations',
            prompt: 'How would an NCERT / CBSE board examiner expect this derivation, calculation, or theory to be structured in a written exam paper?',
          },
        ]),
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none text-xs">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
        <HelpCircle className="w-3 h-3 text-emerald-700" /> Socratic Nudges:
      </span>
      {nudges.map((nudge) => (
        <button
          key={nudge.id}
          disabled={disabled}
          onClick={() => onSendNudge(nudge.prompt)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/90 hover:border-emerald-300 text-xs font-medium whitespace-nowrap transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title={nudge.tooltip}
        >
          {nudge.icon}
          <span>{nudge.label}</span>
        </button>
      ))}
    </div>
  );
};
