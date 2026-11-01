import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  BookMarked, 
  PenTool, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { SubjectStream } from '../types';

interface FormulaScratchpadProps {
  isOpen: boolean;
  onClose: () => void;
  onSendScratchpadToChat: (scratchText: string) => void;
  subject: SubjectStream;
}

interface FormulaItem {
  name: string;
  formula: string;
  variables: string;
  subject: SubjectStream;
}

const FORMULA_BANK: FormulaItem[] = [
  // Physics / Math
  {
    name: 'Equations of Motion (Uniform Acceleration)',
    formula: 'v = u + at  |  s = ut + ½at²  |  v² = u² + 2as',
    variables: 'u = initial velocity, v = final velocity, a = acceleration, s = displacement, t = time',
    subject: 'PCM',
  },
  {
    name: "Newton's Second Law & Momentum",
    formula: 'F = dp/dt = m · a  |  p = m · v',
    variables: 'F = net force (N), m = mass (kg), a = acceleration (m/s²), p = linear momentum',
    subject: 'PCM',
  },
  {
    name: "Ohm's Law & Electric Power",
    formula: 'V = I · R  |  P = V · I = I² · R = V² / R',
    variables: 'V = potential difference (Volts), I = current (Amperes), R = resistance (Ohms), P = power (Watts)',
    subject: 'PCM',
  },
  {
    name: 'Quadratic Formula & Roots',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    variables: 'Discriminant D = b² - 4ac (D > 0: two real roots, D = 0: equal real roots, D < 0: complex roots)',
    subject: 'PCM',
  },
  {
    name: 'Calculus: Fundamental Derivatives',
    formula: 'd/dx(xⁿ) = n·xⁿ⁻¹  |  d/dx(sin x) = cos x  |  d/dx(eˣ) = eˣ  |  d/dx(ln x) = 1/x',
    variables: 'Chain rule: d/dx(f(g(x))) = f\'(g(x)) · g\'(x)',
    subject: 'PCM',
  },
  {
    name: 'Calculus: Fundamental Integrals',
    formula: '∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + C (n ≠ -1)  |  ∫ (1/x) dx = ln|x| + C',
    variables: 'Integration by parts: ∫ u · v dx = u ∫ v dx - ∫ (u\' ∫ v dx) dx',
    subject: 'PCM',
  },
  // CS
  {
    name: 'Time Complexity Hierarchy (Big-O)',
    formula: 'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)',
    variables: 'Binary Search: O(log n), MergeSort/QuickSort average: O(n log n), Nested Loop: O(n²)',
    subject: 'CS',
  },
  {
    name: 'SQL Aggregates & Group By Pattern',
    formula: 'SELECT dept, AVG(salary) FROM employees WHERE active = 1 GROUP BY dept HAVING AVG(salary) > 50000;',
    variables: 'Execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY',
    subject: 'CS',
  },
  // Commerce
  {
    name: 'National Income Aggregate Identities (Macroeconomics)',
    formula: 'GDP_mp = C + I + G + (X - M)  |  NNP_fc = GDP_mp - Dep + NFIA - NIT',
    variables: 'C = consumption, I = investment, G = govt spending, NFIA = net factor income abroad, NIT = net indirect taxes',
    subject: 'Commerce',
  },
  {
    name: 'Price Elasticity of Demand (Ed)',
    formula: 'Ed = (ΔQ / Q) / (ΔP / P) = (ΔQ / ΔP) × (P / Q)',
    variables: 'Q = initial quantity demanded, P = initial price, ΔQ = change in qty, ΔP = change in price',
    subject: 'Commerce',
  },
  {
    name: 'Accounting Equation & Working Capital',
    formula: 'Assets = Liabilities + Capital  |  Working Capital = Current Assets - Current Liabilities',
    variables: 'Balance Sheet fundamental identity',
    subject: 'Commerce',
  },
];

export const FormulaScratchpad: React.FC<FormulaScratchpadProps> = ({
  isOpen,
  onClose,
  onSendScratchpadToChat,
  subject,
}) => {
  const [scratchpadText, setScratchpadText] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (formulaText: string, index: number) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleInsertIntoScratchpad = (formulaText: string) => {
    setScratchpadText((prev) => (prev ? `${prev}\n\n${formulaText}` : formulaText));
  };

  const handleSendToTutor = () => {
    if (!scratchpadText.trim()) return;
    onSendScratchpadToChat(scratchpadText);
    onClose();
  };

  const relevantFormulas = FORMULA_BANK.filter(
    (f) => f.subject === subject || subject === 'School Administration' || f.subject === 'PCM'
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-amber-900 to-amber-950 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
            <BookMarked className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              Formula Sheet & Scratchpad
            </h3>
            <p className="text-[11px] text-amber-200">
              NCERT / CBSE Formulas & Working Canvas
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-amber-800/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Interactive Scratchpad Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-700">
            <span className="font-bold flex items-center gap-1.5 text-slate-900">
              <PenTool className="w-3.5 h-3.5 text-emerald-700" /> Student Scratchpad & Draft
            </span>
            {scratchpadText && (
              <button
                onClick={() => setScratchpadText('')}
                className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            Write down your intermediate calculation, code, or reasoning here, then send to the Socratic tutor for step verification.
          </p>
          <textarea
            value={scratchpadText}
            onChange={(e) => setScratchpadText(e.target.value)}
            placeholder="e.g. My Step 1: Let initial velocity u = 0.
Using s = ut + 0.5 * a * t^2...
Is this the correct equation?"
            rows={5}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white resize-y"
          />
          <button
            onClick={handleSendToTutor}
            disabled={!scratchpadText.trim()}
            className="w-full py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Scratchpad Draft to Tutor</span>
          </button>
        </div>

        <hr className="border-slate-200" />

        {/* Quick Insert Symbols */}
        <div className="space-y-1.5">
          <span className="font-bold text-slate-700 block">Quick Symbols:</span>
          <div className="flex flex-wrap gap-1">
            {['θ', 'π', 'Δ', 'α', 'β', 'λ', 'ω', '√', '∫', '²', '³', '≠', '≤', '≥', '±', '→', '∑'].map((sym) => (
              <button
                key={sym}
                onClick={() => setScratchpadText((prev) => prev + sym)}
                className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-mono text-xs font-semibold flex items-center justify-center transition-colors"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Formula Bank */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Standard Formulas
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Click to insert
            </span>
          </div>

          <div className="space-y-2">
            {relevantFormulas.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/40 hover:border-amber-300 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-xs">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.formula, idx)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
                      title="Copy formula"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => handleInsertIntoScratchpad(item.formula)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/60"
                      title="Insert to scratchpad"
                    >
                      + Insert
                    </button>
                  </div>
                </div>
                <div className="p-1.5 bg-white rounded border border-slate-200 font-mono text-[11px] text-emerald-900 font-medium">
                  {item.formula}
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  {item.variables}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
