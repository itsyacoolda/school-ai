import React, { useState } from 'react';
import { 
  GraduationCap, 
  User, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectCitation?: (citationId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectCitation }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCitations, setShowCitations] = useState(true);

  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner speech
    const cleanText = message.content
      .replace(/[#*`_~]/g, '')
      .replace(/\[Ref:.*?\]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div
      className={`py-4 px-4 sm:px-6 rounded-2xl transition-all ${
        isAssistant
          ? 'bg-white border border-slate-200/90 shadow-xs'
          : 'bg-emerald-50/70 border border-emerald-200/60 ml-auto max-w-3xl'
      }`}
    >
      <div className="flex items-start gap-3.5">
        
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isAssistant
              ? 'bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 border border-emerald-700/40'
              : 'bg-slate-800 text-white'
          }`}
        >
          {isAssistant ? (
            <GraduationCap className="w-5 h-5" />
          ) : (
            <User className="w-4 h-4 text-emerald-300" />
          )}
        </div>

        {/* Message Body */}
        <div className="flex-1 min-w-0 space-y-2">
          
          {/* Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {isAssistant ? 'Indigenous School AI Assistant' : 'Student'}
              </span>
              
              {isAssistant && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Socratic Guide
                </span>
              )}

              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Badges & Actions */}
            <div className="flex items-center gap-1.5">
              {isAssistant && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 border ${
                  message.engine === 'ram-qwen'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  {message.engine === 'ram-qwen' ? (
                    <>
                      <Cpu className="w-3 h-3 text-emerald-700" /> In-RAM Local (WebGPU)
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-600" /> Cloud API (Gemini 3.8 Flash)
                    </>
                  )}
                </span>
              )}

              {/* Speech Button */}
              {isAssistant && 'speechSynthesis' in window && (
                <button
                  onClick={handleSpeak}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title={isSpeaking ? 'Stop reading' : 'Read aloud with scholastic voice'}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Copy text"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Formatted Content */}
          <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-2">
            {message.content}
          </div>

          {/* Citations Box (for administrative queries) */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCitations(!showCitations)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified School Reference Citations ({message.citations.length})</span>
                {showCitations ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showCitations && (
                <div className="mt-2 space-y-2">
                  {message.citations.map((cite, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/70 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-emerald-950">
                        <span className="truncate">{cite.documentTitle}</span>
                        <span className="text-[10px] font-mono text-emerald-700 shrink-0 ml-2">
                          {cite.section}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 italic">
                        "{cite.excerpt}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Token / Speed stats if available */}
          {message.generationSpeedTokPerSec && message.generationSpeedTokPerSec > 0 && (
            <div className="text-[10px] text-emerald-800 font-mono text-right pt-1 flex items-center justify-end gap-1">
              <Cpu className="w-3 h-3 text-emerald-700" />
              <span>Executed locally in PC RAM / WebGPU: <strong>{message.generationSpeedTokPerSec} tokens/sec</strong></span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
