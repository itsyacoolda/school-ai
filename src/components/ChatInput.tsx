import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Square, 
  Sparkles, 
  CornerDownLeft,
  Paperclip
} from 'lucide-react';
import { GradeLevel, SubjectStream } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onStopGeneration?: () => void;
  grade: GradeLevel;
  subject: SubjectStream;
  onOpenDocs: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStopGeneration,
  grade,
  subject,
  onOpenDocs,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Setup Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      setVoiceNotice('Voice dictation is not available in this browser environment.');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Clean, concise prompt placeholder
  const getPlaceholder = () => {
    return 'Ask your question here...';
  };

  return (
    <div className="space-y-2">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white border border-slate-300 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/20 rounded-2xl shadow-sm transition-all"
      >
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          rows={2}
          className="w-full px-4 pt-3 pb-12 text-sm text-slate-800 placeholder-slate-400 bg-transparent resize-none focus:outline-none"
        />

        {/* Action Bar Bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            {/* Study materials shortcut button */}
            <button
              type="button"
              onClick={onOpenDocs}
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-800 hover:bg-slate-100 transition-colors flex items-center gap-1 text-[11px] font-medium"
              title="Reference Faculty Study Materials"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Faculty Notes & Materials</span>
            </button>

            {/* Voice Dictation */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium ${
                isListening
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'text-slate-500 hover:text-emerald-800 hover:bg-slate-100'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Dictate with voice'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-rose-600" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Voice</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Shift + Enter for new line
            </span>

            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>Ask Tutor</span>
                <Send className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
