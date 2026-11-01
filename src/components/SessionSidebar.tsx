import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Download, 
  BookOpen, 
  X,
  Search,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Pin,
  Edit2,
  Check,
  Target
} from 'lucide-react';
import { GradeLevel, StudySession, SavedSession } from '../types';

export type { SavedSession };

interface SessionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: StudySession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: (customTitle?: string, goal?: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onRenameSession?: (id: string, newTitle: string) => void;
  onTogglePinSession?: (id: string) => void;
  onExportSession: () => void;
  activeSubject?: string;
  grade?: GradeLevel;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onTogglePinSession,
  onExportSession,
  activeSubject = 'Mathematics',
  grade = 'Grade 10',
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'timer'>('sessions');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionGoal, setNewSessionGoal] = useState('');
  
  // Inline editing state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');

  // Study Focus Timer state (Pomodoro: default 25 min = 1500 sec)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState<number>(25);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = (minutes: number = timerPreset) => {
    setIsTimerRunning(false);
    setTimerPreset(minutes);
    setTimerSeconds(minutes * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle session creation
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newSessionTitle.trim() || `${activeSubject} Study Session`;
    onNewSession(title, newSessionGoal.trim());
    setNewSessionTitle('');
    setNewSessionGoal('');
    setIsCreatingSession(false);
  };

  // Handle inline rename
  const handleStartRename = (sess: StudySession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(sess.id);
    setEditTitleText(sess.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (onRenameSession && editTitleText.trim()) {
      onRenameSession(id, editTitleText.trim());
    }
    setEditingSessionId(null);
  };

  // Filtered and sorted sessions
  const filteredSessions = sessions.filter((sess) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sess.title.toLowerCase().includes(q) ||
      sess.subject.toLowerCase().includes(q) ||
      (sess.goal && sess.goal.toLowerCase().includes(q))
    );
  });

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (b.lastActiveAt || b.timestamp) - (a.lastActiveAt || a.timestamp);
  });

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-80 bg-slate-50 border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-800 text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Study Sessions
              </h3>
              <p className="text-[10px] text-slate-400">
                {sessions.length} saved • {grade}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs (Sessions vs Focus Timer) */}
        <div className="flex border-b border-slate-200 bg-slate-100/80 p-1 gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'sessions'
                ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Sessions ({sessions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'timer'
                ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Focus Timer</span>
            {isTimerRunning && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>
        </div>

        {/* Tab 1: Sessions List & Management */}
        {activeTab === 'sessions' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* New Session Action */}
            <div className="p-3 border-b border-slate-200/70 bg-white/60 space-y-2">
              {!isCreatingSession ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onNewSession()}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Study Session</span>
                  </button>
                  <button
                    onClick={() => setIsCreatingSession(true)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold"
                    title="Create session with custom title and goal"
                  >
                    <Target className="w-4 h-4 text-emerald-700" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateSubmit} className="space-y-2 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                  <div className="text-[11px] font-bold text-emerald-900 flex items-center justify-between">
                    <span>Create Custom Study Session</span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingSession(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newSessionTitle}
                    onChange={(e) => setNewSessionTitle(e.target.value)}
                    placeholder={`e.g. ${activeSubject} Exam Revision`}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={newSessionGoal}
                    onChange={(e) => setNewSessionGoal(e.target.value)}
                    placeholder="Optional study goal (e.g. Solve 3 derivations)"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px] focus:outline-none focus:border-emerald-600"
                  />
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreatingSession(false)}
                      className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900"
                    >
                      Start Session
                    </button>
                  </div>
                </form>
              )}

              {/* Search Bar */}
              {sessions.length > 2 && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search study sessions..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              )}
            </div>

            {/* Sessions Scroll List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5">
              {sessions.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-slate-600">No study sessions saved yet</p>
                  <p className="text-[11px] text-slate-400">
                    Send a question to your Socratic tutor or click &quot;New Study Session&quot; above to start!
                  </p>
                </div>
              ) : sortedSessions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No sessions match &quot;{searchQuery}&quot;
                </div>
              ) : (
                sortedSessions.map((sess) => {
                  const isActive = sess.id === currentSessionId;
                  const isEditing = editingSessionId === sess.id;
                  const msgCount = sess.messages.length;

                  return (
                    <div
                      key={sess.id}
                      onClick={() => onSelectSession(sess.id)}
                      className={`group relative p-2.5 rounded-xl cursor-pointer text-xs transition-all border ${
                        isActive
                          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 font-medium shadow-xs ring-1 ring-emerald-600/20'
                          : 'bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          <MessageSquare
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isActive ? 'text-emerald-800' : 'text-slate-400'
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            {isEditing ? (
                              <div
                                className="flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  value={editTitleText}
                                  onChange={(e) => setEditTitleText(e.target.value)}
                                  className="w-full px-1.5 py-0.5 bg-white border border-emerald-500 rounded text-xs focus:outline-none"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveRename(sess.id, e);
                                    if (e.key === 'Escape') setEditingSessionId(null);
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={(e) => handleSaveRename(sess.id, e)}
                                  className="p-1 text-emerald-700 hover:bg-emerald-100 rounded"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <p className="font-semibold truncate text-xs text-slate-800">
                                {sess.title}
                              </p>
                            )}

                            {sess.goal && (
                              <p className="text-[10px] text-emerald-700 italic truncate flex items-center gap-1 mt-0.5">
                                <Target className="w-2.5 h-2.5 shrink-0" />
                                <span>{sess.goal}</span>
                              </p>
                            )}

                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                              <span className="font-medium text-emerald-800 bg-emerald-100/70 px-1 rounded">
                                {sess.subject}
                              </span>
                              <span>•</span>
                              <span>{msgCount} {msgCount === 1 ? 'msg' : 'msgs'}</span>
                              <span>•</span>
                              <span>
                                {new Date(sess.lastActiveAt || sess.timestamp).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Hover Actions */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {onTogglePinSession && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onTogglePinSession(sess.id);
                              }}
                              className={`p-1 rounded hover:bg-slate-200 transition-colors ${
                                sess.isPinned ? 'text-amber-600' : 'text-slate-400'
                              }`}
                              title={sess.isPinned ? 'Unpin session' : 'Pin session to top'}
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                          )}
                          {onRenameSession && !isEditing && (
                            <button
                              onClick={(e) => handleStartRename(sess, e)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                              title="Rename session"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={(e) => onDeleteSession(sess.id, e)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete session"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Focus Timer (Pomodoro Study Tool) */}
        {activeTab === 'timer' && (
          <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-800">
                <Timer className="w-4 h-4" />
                <span>Study Focus Timer</span>
              </div>

              {/* Big Timer Display */}
              <div className="font-mono text-4xl font-extrabold tracking-tight text-slate-800 py-2">
                {formatTimer(timerSeconds)}
              </div>

              {/* Status */}
              <p className="text-[11px] text-slate-500">
                {isTimerRunning
                  ? 'Deep focus mode active. Keep studying!'
                  : timerSeconds === 0
                  ? '🎉 Study sprint completed! Take a 5-min break.'
                  : 'Ready for a focused Socratic session'}
              </p>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {isTimerRunning ? (
                  <button
                    onClick={handlePauseTimer}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartTimer}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Focus</span>
                  </button>
                )}

                <button
                  onClick={() => handleResetTimer(timerPreset)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Presets */}
              <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-slate-100 text-[11px]">
                <button
                  onClick={() => handleResetTimer(15)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    timerPreset === 15 ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  15 min
                </button>
                <button
                  onClick={() => handleResetTimer(25)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    timerPreset === 25 ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  25 min
                </button>
                <button
                  onClick={() => handleResetTimer(45)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    timerPreset === 45 ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  45 min
                </button>
              </div>
            </div>

            {/* Active Session Goal Card */}
            {currentSession && (
              <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-emerald-900 font-bold text-[11px]">
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-emerald-700" />
                    Active Session Goal
                  </span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-950 px-1.5 py-0.5 rounded">
                    {currentSession.subject}
                  </span>
                </div>
                <p className="text-slate-700 font-medium">
                  {currentSession.goal || currentSession.title}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-800 pt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{currentSession.messages.length} questions & hints exchanged</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 bg-white space-y-2">
          <button
            onClick={onExportSession}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export Session Notes (.md)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
