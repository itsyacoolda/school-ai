import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  Cpu, 
  Menu, 
  CheckCircle2, 
  TrendingDown,
  X,
  User,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { 
  GradeLevel, 
  HighSchoolStream,
  SecondLanguage,
  ThirdLanguage,
  ModelEngineType, 
  ChatMessage as ChatMessageType, 
  SchoolDocument,
  TeacherMaterial,
  StudentProfile,
  PermissionTier,
  WebLLMLoadingProgress,
  AuthSession 
} from './types';
import { OFFICIAL_SCHOOL_DOCUMENTS } from './data/officialSchoolDocs';
import { 
  PRESET_STUDENTS, 
  INITIAL_TEACHER_MATERIALS, 
  getOrDeriveStudentProfile, 
  deriveGradeFromStudentId,
  getSubjectsForStudentCurriculum,
  PRESET_TEACHERS 
} from './data/studentRoster';
import { searchSchoolAndTeacherDocuments, isAdministrativeQuery } from './utils/documentSearch';
import { getSystemPrompt } from './utils/socraticPrompt';
import { detectPermissionTierFromChat } from './utils/contextDetection';
import { webLlmService, AVAILABLE_RAM_MODELS } from './services/webLlmService';

import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { StudentIDBar } from './components/StudentIDBar';
import { CurriculumSubjectBar } from './components/CurriculumSubjectBar';
import { SocraticToolsBar } from './components/SocraticToolsBar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { EngineStatusModal } from './components/EngineStatusModal';
import { TeacherPortalModal } from './components/TeacherPortalModal';
import { FormulaScratchpad } from './components/FormulaScratchpad';
import { SessionSidebar, SavedSession } from './components/SessionSidebar';
import { StudentProfileScreen } from './components/StudentProfileScreen';
import { SchoolGoogleAuthModal } from './components/SchoolGoogleAuthModal';

export default function App() {
  // Navigation & View State ('student_profile' screen shown after login; 'chat' is clean AI study room)
  const [currentView, setCurrentView] = useState<'student_profile' | 'chat'>('student_profile');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showStarters, setShowStarters] = useState(true);

  // Dedicated Login Screen as the entry point (no auto-bypass)
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);

  // Student Profiles State
  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('is_school_students');
    if (saved) {
      try { return JSON.parse(saved); } catch { return PRESET_STUDENTS; }
    }
    return PRESET_STUDENTS;
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return localStorage.getItem('is_active_student_id') || 'IS-2026-G10-042';
  });

  const currentProfile = getOrDeriveStudentProfile(activeStudentId, students);

  // Curriculum & Subject State (Strictly class/stream aligned, NO TABS)
  const [grade, setGrade] = useState<GradeLevel>(currentProfile.grade);
  const [highSchoolStream, setHighSchoolStream] = useState<HighSchoolStream>(
    currentProfile.stream || 'Science (PCM)'
  );
  const [secondLang, setSecondLang] = useState<SecondLanguage>(
    currentProfile.secondLanguage || 'Hindi Course-A'
  );
  const [thirdLang, setThirdLang] = useState<ThirdLanguage>(
    currentProfile.thirdLanguage || 'Sanskrit'
  );

  // Active Subject within curriculum
  const [activeSubject, setActiveSubject] = useState<string>(() => {
    const initialSubjects = getSubjectsForStudentCurriculum(
      currentProfile.grade, 
      currentProfile.stream || 'Science (PCM)', 
      currentProfile.secondLanguage || 'Hindi Course-A', 
      currentProfile.thirdLanguage || 'Sanskrit'
    );
    return initialSubjects[0]?.name || 'Mathematics';
  });

  // Teacher Materials (RAG Grounding)
  const [teacherMaterials, setTeacherMaterials] = useState<TeacherMaterial[]>(() => {
    const saved = localStorage.getItem('is_teacher_materials');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_TEACHER_MATERIALS; }
    }
    return INITIAL_TEACHER_MATERIALS;
  });

  // AI Multi-Model & In-RAM Engine State (Default to cloud-gemini for instant <1s responses, with In-RAM toggle available anytime)
  const [engine, setEngine] = useState<ModelEngineType>('cloud-gemini');
  const [activeModelId, setActiveModelId] = useState<string>('Qwen3-4B-q4f16_1-MLC');
  const [isWebGpuSupported, setIsWebGpuSupported] = useState(false);
  const [isRamEngineReady, setIsRamEngineReady] = useState(false);
  const [isRamEngineLoading, setIsRamEngineLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<WebLLMLoadingProgress | undefined>();

  // School Reference Documents
  const [documents, setDocuments] = useState<SchoolDocument[]>(() => {
    const saved = localStorage.getItem('is_school_docs');
    if (saved) {
      try { return JSON.parse(saved); } catch { return OFFICIAL_SCHOOL_DOCUMENTS; }
    }
    return OFFICIAL_SCHOOL_DOCUMENTS;
  });

  // Chat & Session State
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicTier, setDynamicTier] = useState<PermissionTier>('TIER_STU_ACADEMIC');
  const [sessions, setSessions] = useState<SavedSession[]>(() => {
    const saved = localStorage.getItem('is_saved_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => `sess-${Date.now()}`);

  // Modals
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false);
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist authentication & student choices
  useEffect(() => {
    if (authSession) {
      localStorage.setItem('is_auth_session', JSON.stringify(authSession));
    } else {
      localStorage.removeItem('is_auth_session');
    }
  }, [authSession]);

  useEffect(() => {
    localStorage.setItem('is_school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('is_teacher_materials', JSON.stringify(teacherMaterials));
  }, [teacherMaterials]);

  useEffect(() => {
    localStorage.setItem('is_school_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('is_saved_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Auto-sync messages into the active study session so work is never lost
  useEffect(() => {
    if (messages.length === 0) return;
    const userMsgs = messages.filter((m) => m.role === 'user');
    if (userMsgs.length === 0) return;

    setSessions((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === currentSessionId);
      const firstSnippet = userMsgs[0]?.content.slice(0, 36);
      const fallbackTitle = `${firstSnippet}...`;

      const title =
        existingIndex >= 0 && prev[existingIndex].title && !prev[existingIndex].title.endsWith('...')
          ? prev[existingIndex].title
          : fallbackTitle || `${activeSubject} Study Session`;

      const updated: SavedSession = {
        id: currentSessionId,
        title,
        goal: existingIndex >= 0 ? prev[existingIndex].goal : undefined,
        timestamp: existingIndex >= 0 ? prev[existingIndex].timestamp : Date.now(),
        lastActiveAt: Date.now(),
        grade,
        subject: activeSubject,
        messages,
        isPinned: existingIndex >= 0 ? prev[existingIndex].isPinned : false,
      };

      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = updated;
        return copy;
      } else {
        return [updated, ...prev];
      }
    });
  }, [messages, currentSessionId, grade, activeSubject]);

  // Sync Student ID changes with Grade Routing
  useEffect(() => {
    setGrade(currentProfile.grade);
    if (currentProfile.stream) setHighSchoolStream(currentProfile.stream);
    if (currentProfile.secondLanguage) setSecondLang(currentProfile.secondLanguage);
    if (currentProfile.thirdLanguage) setThirdLang(currentProfile.thirdLanguage);
    localStorage.setItem('is_active_student_id', activeStudentId);

    // Update active subject to curriculum default
    const subs = getSubjectsForStudentCurriculum(
      currentProfile.grade, 
      currentProfile.stream || 'Science (PCM)', 
      currentProfile.secondLanguage || 'Hindi Course-A', 
      currentProfile.thirdLanguage || 'Sanskrit'
    );
    if (subs.length > 0) setActiveSubject(subs[0].name);
  }, [activeStudentId, currentProfile.grade]);

  // Check WebGPU support & setup loading callback
  useEffect(() => {
    const supported = webLlmService.isWebGPUSupported();
    setIsWebGpuSupported(supported);

    if (!supported) {
      setEngine('cloud-gemini');
    }

    webLlmService.setProgressCallback((report) => {
      setLoadingProgress(report);
      setIsRamEngineLoading(true);
    });
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initial greeting tailored to class, subject, and marks
  useEffect(() => {
    if (messages.length === 0 && authSession) {
      const isJunior = grade === 'Grade 8' || grade === 'Grade 9';
      const weakSubjects = currentProfile.recentMarks.filter((m) => m.needsRevisionFocus);

      let roleGreeting = '';
      if (currentProfile.assignedTier === 'TIER_STU_DEV_MAX') {
        roleGreeting = `Software Development Partner mode is active. You have full coding freedom: write full scripts, debug complex programs, and architect system designs!`;
      } else if (currentProfile.assignedTier === 'TIER_STU_PROJECT') {
        roleGreeting = `STEM Project & Exhibition Coach mode is active. I am ready to help you plan science fair prototypes, hardware wiring (Arduino/Pi), and circuit schematics!`;
      } else {
        roleGreeting = `As your Socratic academic tutor, I guide you step-by-step through fundamental concepts and formula breakdowns without copy-paste answers.`;
      }

      let revisionLine = '';
      if (weakSubjects.length > 0) {
        revisionLine = `\n\n🎯 Targeted Revision: Recent term assessments show we should also reinforce foundational concepts in ${weakSubjects.map((w) => `${w.subject} (${w.score}/${w.maxScore})`).join(', ')}.`;
      }

      const greeting = isJunior
        ? `Hello ${currentProfile.fullName}! Welcome to your Socratic Academic Coach. 🎓\n\nClass: ${grade} | Focus Subject: ${activeSubject}\n\n${roleGreeting}${revisionLine}\n\nWhat question or problem should we examine together?`
        : `Greetings ${currentProfile.fullName}. Welcome to the Indigenous School AI Academic Coach.\n\nClass: ${grade} | Stream: ${grade === 'Grade 11' || grade === 'Grade 12' ? highSchoolStream : 'General'}\nFocus Subject: ${activeSubject}\n\n${roleGreeting}${revisionLine}\n\nWhat academic concept or formula shall we explore today?`;

      const initialMessage: ChatMessageType = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: greeting,
        timestamp: Date.now(),
        engine,
        grade,
        subject: activeSubject,
        tier: currentProfile.assignedTier,
        studentId: currentProfile.studentId,
      };

      setMessages([initialMessage]);
    }
  }, [grade, activeSubject, activeStudentId, authSession, currentProfile.assignedTier]);

  // Explicit Bidirectional Engine Toggle Handler (Fixes toggle-back bug)
  const handleEngineChange = (newEngine: ModelEngineType) => {
    setEngine(newEngine);

    if (newEngine === 'ram-qwen') {
      if (isWebGpuSupported && !isRamEngineReady && !isRamEngineLoading) {
        setIsRamEngineLoading(true);
        webLlmService.initializeEngine(activeModelId)
          .then(() => {
            setIsRamEngineReady(true);
            setIsRamEngineLoading(false);
          })
          .catch((err) => {
            console.warn('In-RAM model background initialization note:', err);
            setIsRamEngineLoading(false);
          });
      }
    }
  };

  // Change In-RAM Model Variant (Qwen 3, Llama 3.2, SmolLM2)
  const handleSelectRamModel = async (modelId: string) => {
    setActiveModelId(modelId);
    setEngine('ram-qwen');

    if (!isWebGpuSupported) {
      alert('WebGPU is not enabled in this browser. Switching to Cloud Server.');
      setEngine('cloud-gemini');
      return;
    }

    try {
      setIsRamEngineLoading(true);
      await webLlmService.initializeEngine(modelId);
      setIsRamEngineReady(true);
      setIsRamEngineLoading(false);
    } catch (err: any) {
      console.warn('In-RAM model loading note:', err);
      setIsRamEngineLoading(false);
      alert(`Notice: ${err?.message || 'WebGPU device allocation limit'}. Seamlessly switching to Cloud Server.`);
      setEngine('cloud-gemini');
    }
  };

  // Handle student question
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Check for success keywords to trigger celebratory confetti
    const lower = text.toLowerCase();
    if (
      lower.includes('i got it') ||
      lower.includes('i solved it') ||
      lower.includes('understood') ||
      lower.includes('eureka') ||
      lower.includes('answer is correct')
    ) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#047857', '#d97706', '#10b981', '#f59e0b'],
      });
    }

    const userMessage: ChatMessageType = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      engine,
      grade,
      subject: activeSubject,
      tier: currentProfile.assignedTier,
      studentId: currentProfile.studentId,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Dynamically evaluate permission tier based on conversation context after a few texts
    // Teachers do NOT have a command to adjust tokens; tokens are context-determined
    const activeTier = detectPermissionTierFromChat(updatedMessages);
    setDynamicTier(activeTier);
    userMessage.tier = activeTier;

    // Search both Teacher Materials (prioritized) and Official School Documents
    const isAdmin = isAdministrativeQuery(text);
    const searchResult = searchSchoolAndTeacherDocuments(text, documents, teacherMaterials);
    const forceAdminNotFound = isAdmin && !searchResult.hasRelevantDocs;

    // Build Prompt with Hidden Token, Student Profile, and Teacher Materials Context
    const systemPrompt = getSystemPrompt({
      grade,
      subject: activeSubject,
      studentProfile: currentProfile,
      permissionTier: activeTier,
      documentContext: searchResult.documentContextString,
      teacherMaterialsContext: searchResult.teacherMaterialsContextString,
      forceAdminCitationRule: forceAdminNotFound,
    });

    const assistantMessageId = `asst-${Date.now()}`;
    const initialAssistantMessage: ChatMessageType = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      engine,
      grade,
      subject: activeSubject,
      tier: activeTier,
      studentId: currentProfile.studentId,
      citations: searchResult.hasRelevantDocs ? searchResult.matchedCitations : undefined,
    };

    // Mandatory rule if admin answer not in documents
    if (forceAdminNotFound) {
      const notFoundMessage: ChatMessageType = {
        ...initialAssistantMessage,
        content:
          'That information is not available in the official school documents provided.\n\nPlease check official school circulars or consult the administrative office.',
      };
      setMessages([...updatedMessages, notFoundMessage]);
      setIsLoading(false);
      return;
    }

    try {
      if (engine === 'ram-qwen' && isWebGpuSupported) {
        // Run In-RAM client-side model (Qwen, Llama 3.2, or SmolLM2)
        if (!isRamEngineReady) {
          setIsRamEngineLoading(true);
          await webLlmService.initializeEngine(activeModelId);
          setIsRamEngineReady(true);
          setIsRamEngineLoading(false);
        }

        let fullGeneratedText = '';
        await webLlmService.generateChatStream(
          updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          systemPrompt,
          (delta, fullText, speed) => {
            fullGeneratedText = fullText;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: fullText,
                      generationSpeedTokPerSec: speed,
                    }
                  : msg
              )
            );
          }
        );

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullGeneratedText || 'Let us explore this step together. What is the fundamental concept here?' }
              : msg
          )
        );
      } else {
        // Cloud Server Engine (Gemini 3.8 Flash via Express backend)
        const response = await fetch('/api/school/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
            grade,
            subject: activeSubject,
            studentId: currentProfile.studentId,
            studentName: currentProfile.fullName,
            assignedTier: activeTier,
            recentMarks: currentProfile.recentMarks,
            documentContext: searchResult.documentContextString,
            teacherMaterialsContext: searchResult.teacherMaterialsContextString,
            forceAdminCitationRule: forceAdminNotFound,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Server error while generating response.');
        }

        const data = await response.json();
        const finalizedMessage: ChatMessageType = {
          ...initialAssistantMessage,
          content: data.reply,
        };

        setMessages([...updatedMessages, finalizedMessage]);
      }
    } catch (err: any) {
      console.error('Generation error:', err);

      // Fallback to server if In-RAM encountered memory issue
      if (engine === 'ram-qwen') {
        try {
          const fallbackRes = await fetch('/api/school/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
              grade,
              subject: activeSubject,
              studentId: currentProfile.studentId,
              studentName: currentProfile.fullName,
              assignedTier: currentProfile.assignedTier,
              recentMarks: currentProfile.recentMarks,
              documentContext: searchResult.documentContextString,
              teacherMaterialsContext: searchResult.teacherMaterialsContextString,
              forceAdminCitationRule: forceAdminNotFound,
            }),
          });
          const data = await fallbackRes.json();
          const fallbackMsg: ChatMessageType = {
            ...initialAssistantMessage,
            engine: 'cloud-gemini',
            content: `*(Note: In-RAM WebGPU memory limit reached; answered via School Cloud Engine)*\n\n${data.reply}`,
          };
          setMessages([...updatedMessages, fallbackMsg]);
          setIsLoading(false);
          return;
        } catch {
          // Both failed
        }
      }

      const errorMessage: ChatMessageType = {
        ...initialAssistantMessage,
        content:
          'I apologize, but I encountered an error retrieving this step. Let us re-examine your question or check the school circulars.',
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start new study session
  const handleNewSession = (customTitle?: string, goal?: string) => {
    const newId = `sess-${Date.now()}`;
    const initialTitle = customTitle?.trim() || `${activeSubject} Study Session`;
    const newSession: SavedSession = {
      id: newId,
      title: initialTitle,
      goal: goal?.trim() || undefined,
      timestamp: Date.now(),
      lastActiveAt: Date.now(),
      grade,
      subject: activeSubject,
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  // Rename existing session
  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle.trim() } : s))
    );
  };

  // Toggle pin status
  const handleTogglePinSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  // Select saved session
  const handleSelectSession = (id: string) => {
    const found = sessions.find((s) => s.id === id);
    if (found) {
      setCurrentSessionId(found.id);
      setMessages(found.messages);
      setGrade(found.grade);
      setActiveSubject(found.subject);
      setIsSidebarOpen(false);
    }
  };

  // Subject change preserving study sessions
  const handleSubjectChange = (newSub: string) => {
    if (newSub === activeSubject) return;

    // Check if there is already a saved session for this subject & grade
    const existingForSubject = sessions.find(
      (s) => s.subject === newSub && s.grade === grade && s.messages.length > 0
    );

    if (existingForSubject) {
      setActiveSubject(newSub);
      setCurrentSessionId(existingForSubject.id);
      setMessages(existingForSubject.messages);
    } else {
      setActiveSubject(newSub);
      const newId = `sess-${Date.now()}`;
      const newSession: SavedSession = {
        id: newId,
        title: `${newSub} Study Session`,
        timestamp: Date.now(),
        lastActiveAt: Date.now(),
        grade,
        subject: newSub,
        messages: [],
      };
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newId);
      setMessages([]);
    }
  };

  // Handle 2nd language selection for Grade 9 & 10
  const handleSecondLanguageChange = (newLang: SecondLanguage) => {
    const oldLang = secondLang;
    setSecondLang(newLang);
    if (activeSubject === oldLang) {
      handleSubjectChange(newLang);
    }
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === currentProfile.studentId
          ? {
              ...s,
              secondLanguage: newLang,
              recentMarks: s.recentMarks.map((m) =>
                m.subject === oldLang ? { ...m, subject: newLang } : m
              ),
            }
          : s
      )
    );
  };

  // Delete saved session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        handleSelectSession(remaining[0].id);
      } else {
        const freshId = `sess-${Date.now()}`;
        setCurrentSessionId(freshId);
        setMessages([]);
      }
    }
  };

  // Export session notes to markdown
  const handleExportSession = () => {
    const textContent = messages
      .map(
        (m) =>
          `### ${m.role === 'assistant' ? 'Indigenous School AI Coach' : 'Student'} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.content}\n\n---`
      )
      .join('\n\n');

    const header = `# Indigenous School Socratic Tutoring Session Notes\nStudent: ${currentProfile.fullName} (${currentProfile.studentId})\nGrade: ${grade} | Subject: ${activeSubject}\nDate: ${new Date().toLocaleDateString()}\n\n---\n\n`;
    const fullDoc = header + textContent;

    const blob = new Blob([fullDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IndigenousSchool_Notes_${currentProfile.studentId}_${activeSubject.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Curriculum subjects for student's grade and stream
  const curriculumSubjects = getSubjectsForStudentCurriculum(
    grade,
    highSchoolStream,
    secondLang,
    thirdLang
  );

  // If user is not logged in, show Login Page
  if (!authSession) {
    return (
      <LoginPage
        students={students}
        onLoginSuccess={(session) => {
          setAuthSession(session);
          if (session.role === 'student' && session.studentProfile) {
            setActiveStudentId(session.studentProfile.studentId);
            setGrade(session.studentProfile.grade);
            setCurrentView('student_profile'); // Student info screen shown after login!
          } else if (session.role === 'teacher') {
            setCurrentView('chat');
            setIsTeacherPortalOpen(true);
          }
        }}
      />
    );
  }

  // Student Profile & Academic Overview Screen (shown after login and accessible on demand)
  if (authSession.role === 'student' && currentView === 'student_profile') {
    return (
      <>
        <StudentProfileScreen
          profile={currentProfile}
          onEnterChat={(chosenSubject) => {
            if (chosenSubject && chosenSubject !== activeSubject) {
              handleSubjectChange(chosenSubject);
            }
            setCurrentView('chat');
          }}
          onOpenScratchpad={() => setIsScratchpadOpen(true)}
          onOpenGoogleGuide={() => setIsGoogleModalOpen(true)}
          savedSessions={sessions}
          linkedGoogleAccount={authSession.googleAccount}
          onLogout={() => {
            setAuthSession(null);
            setMessages([]);
            setCurrentView('student_profile');
            localStorage.removeItem('is_auth_session');
          }}
          activeSubject={activeSubject}
          secondLanguage={secondLang}
          onSecondLanguageChange={handleSecondLanguageChange}
        />

        {/* Formula Reference Drawer */}
        <FormulaScratchpad
          isOpen={isScratchpadOpen}
          onClose={() => setIsScratchpadOpen(false)}
          onSendScratchpadToChat={(text) => {
            setIsScratchpadOpen(false);
            setCurrentView('chat');
            handleSendMessage(text);
          }}
          subject={activeSubject}
        />

        {/* School Google Workspace Guide & Linker Modal */}
        <SchoolGoogleAuthModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          currentProfile={currentProfile}
          onLinkGoogleAccount={(googleInfo) => {
            setAuthSession((prev) => (prev ? { ...prev, googleAccount: googleInfo } : null));
            setStudents((prev) =>
              prev.map((s) =>
                s.studentId === currentProfile.studentId
                  ? { ...s, googleLinked: true, googleEmail: googleInfo.email }
                  : s
              )
            );
          }}
        />
      </>
    );
  }

  // Active in-RAM model config
  const activeRamConfig = AVAILABLE_RAM_MODELS.find((m) => m.id === activeModelId) || AVAILABLE_RAM_MODELS[0];

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Clean Scholastic Header with Subject Switcher & Student Profile Access */}
      <Header
        currentEngine={engine}
        onEngineChange={handleEngineChange}
        onOpenEngineModal={() => setIsEngineModalOpen(true)}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
        onToggleStudySessions={() => setIsSidebarOpen((prev) => !prev)}
        sessionCount={sessions.length}
        isStudySessionsOpen={isSidebarOpen}
        isRamEngineReady={isRamEngineReady}
        isRamEngineLoading={isRamEngineLoading}
        activeModelName={activeRamConfig.displayName}
        grade={grade}
        authSession={authSession}
        onLogout={() => {
          setAuthSession(null);
          setMessages([]);
          setCurrentView('student_profile');
          localStorage.removeItem('is_auth_session');
        }}
        onOpenStudentProfile={() => setCurrentView('student_profile')}
        activeSubject={activeSubject}
        curriculumSubjects={curriculumSubjects}
        onSubjectChange={handleSubjectChange}
        secondLanguage={secondLang}
        onSecondLanguageChange={handleSecondLanguageChange}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
        onOpenGoogleGuide={() => setIsGoogleModalOpen(true)}
      />

      {/* Teacher / Faculty Mode Advisory Banner (Only shown in teacher mode) */}
      {authSession?.role === 'teacher' && (
        <div className="bg-amber-950 text-amber-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/50">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Faculty Mode
            </span>
            <span>
              Logged in as <strong>{authSession.teacher?.fullName}</strong> ({authSession.teacher?.designation}). Review student marks & RAG materials.
            </span>
          </div>
          <button
            onClick={() => setIsTeacherPortalOpen(true)}
            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
          >
            Open Teacher Portal & RAG Materials
          </button>
        </div>
      )}

      {/* Clean Main Chat Workspace */}
      <div className={`flex-1 flex w-full mx-auto overflow-hidden transition-all duration-300 ${isFocusMode ? 'max-w-4xl px-2 sm:px-4' : 'max-w-7xl'}`}>
        
        {/* Study Sessions Sidebar (collapsible) */}
        {!isFocusMode && (
          <SessionSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
            onRenameSession={handleRenameSession}
            onTogglePinSession={handleTogglePinSession}
            onExportSession={handleExportSession}
            activeSubject={activeSubject}
            grade={grade}
          />
        )}

        {/* Clean Central Chat Interface */}
        <main className={`flex-1 flex flex-col min-w-0 bg-white border-x border-slate-200/80 h-[calc(100vh-65px)] transition-all ${isFocusMode ? 'rounded-2xl my-2 shadow-sm border' : ''}`}>
          
          {/* Clean Sub-Bar: Active Subject & Minimal Engine Status */}
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-600 flex items-center gap-1.5 cursor-pointer"
                title="Toggle study sessions sidebar"
              >
                <Menu className="w-4 h-4 text-emerald-800" />
                <span className="font-semibold text-[11px] text-slate-700 hidden sm:inline">Sessions</span>
              </button>
              
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
                <span className="font-bold text-slate-800 font-serif">{activeSubject}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 text-[11px]">{grade}</span>
                {authSession.role === 'student' && (
                  <>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={() => setCurrentView('student_profile')}
                      className="text-emerald-800 hover:underline font-mono text-[11px] font-semibold cursor-pointer"
                      title="View Student Profile"
                    >
                      {currentProfile.studentId}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* In-RAM vs Cloud Engine Badge */}
            <div className="flex items-center gap-2">
              {engine === 'ram-qwen' ? (
                <div 
                  onClick={() => setIsEngineModalOpen(true)}
                  className="cursor-pointer flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300/60 text-[11px] font-semibold hover:bg-emerald-200/70 transition-colors"
                >
                  <Cpu className="w-3 h-3 text-emerald-700" />
                  <span>In-RAM</span>
                  <span className="text-emerald-700 text-[10px] font-mono hidden sm:inline">Unlimited</span>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEngineModalOpen(true)}
                  className="cursor-pointer flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-semibold hover:bg-slate-200 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Gemini Cloud</span>
                </div>
              )}

              {/* Focus Mode Quick Switcher */}
              <button
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  isFocusMode ? 'text-emerald-800 bg-emerald-50' : 'text-slate-400 hover:text-slate-700'
                }`}
                title={isFocusMode ? 'Exit Focus Mode' : 'Clean Focus Mode'}
              >
                {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Clean, Dismissible Topic Starters (3 compact chips) */}
            {messages.length === 1 && showStarters && (
              <div className="max-w-xl mx-auto py-2.5 px-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Quick Socratic study starters for {activeSubject}:</span>
                  </div>
                  <button
                    onClick={() => setShowStarters(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                    title="Dismiss suggestions"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    {
                      label: '💡 Concept Intuition',
                      query: `Can you explain the foundational concept behind ${activeSubject} step-by-step with an analogy, without giving direct answers?`,
                    },
                    {
                      label: '🧭 Leading Question (Step 1)',
                      query: `Give me a leading question on ${activeSubject} so I can solve the first stage myself.`,
                    },
                    {
                      label: '✓ Verify My Thought Process',
                      query: `I wrote down my preliminary steps for a problem in ${activeSubject}. Can you verify if my logic is sound?`,
                    },
                  ].map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(card.query)}
                      className="px-2.5 py-1.5 text-left rounded-lg border border-emerald-200/80 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-[11px] font-medium text-slate-700 transition-all cursor-pointer shadow-2xs"
                    >
                      {card.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Chat Messages */}
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600 animate-pulse max-w-sm">
                <GraduationCap className="w-4 h-4 text-emerald-800 animate-bounce" />
                <span>
                  {engine === 'ram-qwen'
                    ? `${activeRamConfig.displayName} is processing in RAM...`
                    : 'Indigenous School AI is thinking...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Footer: Socratic Nudges + Clean Input Form */}
          <div className="p-3 sm:p-4 border-t border-slate-100 bg-white space-y-2">
            
            {/* Socratic Nudges Bar (clean and minimal) */}
            <SocraticToolsBar
              grade={grade}
              onSendNudge={handleSendMessage}
              disabled={isLoading}
            />

            {/* Input Bar */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onStopGeneration={() => setIsLoading(false)}
              grade={grade}
              subject={activeSubject}
              onOpenDocs={() => setIsTeacherPortalOpen(true)}
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
              <span className="flex items-center gap-1 text-[10px]">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                Socratic AI Academic Coach • Indigenous School
              </span>
              <span className="text-[10px] hidden sm:inline">
                Step-by-step guidance • Socratic method active
              </span>
            </div>
          </div>

        </main>
      </div>

      {/* Engine Status & Multi-Model Diagnostics Modal */}
      <EngineStatusModal
        isOpen={isEngineModalOpen}
        onClose={() => setIsEngineModalOpen(false)}
        currentEngine={engine}
        onEngineChange={handleEngineChange}
        isWebGpuSupported={isWebGpuSupported}
        isRamEngineReady={isRamEngineReady}
        isRamEngineLoading={isRamEngineLoading}
        loadingProgress={loadingProgress}
        activeModelId={activeModelId}
        onSelectModel={handleSelectRamModel}
      />

      {/* Teacher & Faculty Portal Modal */}
      <TeacherPortalModal
        isOpen={isTeacherPortalOpen}
        onClose={() => setIsTeacherPortalOpen(false)}
        students={students}
        teacherMaterials={teacherMaterials}
        onAddTeacherMaterial={(m) => setTeacherMaterials((prev) => [m, ...prev])}
        activeStudentId={activeStudentId}
        onSwitchActiveStudent={(sid) => {
          setActiveStudentId(sid);
          const target = getOrDeriveStudentProfile(sid, students);
          setGrade(target.grade);
          if (target.stream) setHighSchoolStream(target.stream);
          setMessages([]);
          setDynamicTier('TIER_STU_ACADEMIC');
        }}
        currentDynamicTier={dynamicTier}
      />

      {/* Formula Reference & Scratchpad Drawer */}
      <FormulaScratchpad
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        onSendScratchpadToChat={handleSendMessage}
        subject={activeSubject}
      />

      {/* School Google Workspace Guide & Linker Modal */}
      <SchoolGoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        currentProfile={currentProfile}
        onLinkGoogleAccount={(googleInfo) => {
          setAuthSession((prev) => (prev ? { ...prev, googleAccount: googleInfo } : null));
          setStudents((prev) =>
            prev.map((s) =>
              s.studentId === currentProfile.studentId
                ? { ...s, googleLinked: true, googleEmail: googleInfo.email }
                : s
            )
          );
        }}
      />

    </div>
  );
}
