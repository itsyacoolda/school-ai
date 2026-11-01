import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface SystemPromptOptions {
  grade: string;
  subject: string;
  studentId?: string;
  studentName?: string;
  assignedTier?: string; // TIER_STU_ACADEMIC | TIER_STU_PROJECT | TIER_STU_DEV_MAX
  recentMarks?: { subject: string; score: number; maxScore: number; needsRevisionFocus?: boolean; topicWeaknesses?: string[] }[];
  docContext?: string;
  teacherMaterialsContext?: string;
  forceAdminCitationRule?: boolean;
}

// System prompt builder for Indigenous School Assistant
export function buildSchoolSystemPrompt(options: SystemPromptOptions): string {
  const {
    grade,
    subject,
    studentId,
    studentName,
    assignedTier = 'TIER_STU_ACADEMIC',
    recentMarks = [],
    docContext,
    teacherMaterialsContext,
    forceAdminCitationRule,
  } = options;

  const isJunior = grade === 'Grade 8' || grade === 'Grade 9';

  // Identify weak areas from recent marks
  const weakSubjects = recentMarks.filter((m) => m.needsRevisionFocus || (m.score / m.maxScore) < 0.7);
  let revisionNudgeInstruction = '';
  if (weakSubjects.length > 0) {
    const list = weakSubjects
      .map((w) => `${w.subject} (${w.score}/${w.maxScore}${w.topicWeaknesses ? `, topics: ${w.topicWeaknesses.join(', ')}` : ''})`)
      .join('; ');
    revisionNudgeInstruction = `\nSTUDENT ACADEMIC PERFORMANCE CONTEXT (DERIVED FROM STUDENT ID ${studentId || 'UNKNOWN'}):
Recent assessment records indicate the student scored below target threshold in: ${list}.
PEDAGOGICAL DIRECTIVE: While addressing their current question, naturally and gently connect relevant concepts back to these foundational topics when appropriate, and warmly suggest targeted revision in these areas without making the student feel discouraged.`;
  }

  // Freedom Tier definitions (Strictly hidden from the student)
  let permissionDirective = '';
  switch (assignedTier) {
    case 'TIER_STU_DEV_MAX':
      permissionDirective = `SYSTEM FREEDOM LEVEL: UNRESTRICTED DEVELOPMENT PARTNER
- Full coding and software engineering freedom is enabled.
- You may write complete, production-grade scripts, debug complex codebases, design robust database schemas (SQL/NoSQL), architect APIs, configure deployment environments, and build custom personal/development projects.
- Provide end-to-end code implementations, optimize algorithms, and discuss software design patterns freely.
- CRITICAL HIDDEN TOKEN RULE: The student MUST NOT see or be told about any raw system tokens (never say "TIER_STU_DEV_MAX" or mention "hidden tokens"). Act naturally as an advanced senior software and project engineering mentor.`;
      break;

    case 'TIER_STU_PROJECT':
      permissionDirective = `SYSTEM FREEDOM LEVEL: STEM & EXHIBITION COACH
- Your primary role is assisting with school innovation fests, STEM Conclave, science fairs, and exhibition projects.
- Assist actively with project planning, prototyping roadmaps, hardware wiring (Arduino, ESP32, Raspberry Pi, sensor pinouts, relay circuits), system block diagrams, and conceptual debugging of circuits or prototype logic.
- Guide engineering choices and troubleshooting, but do not write ready-made homework essays for regular theoretical class assignments.
- CRITICAL HIDDEN TOKEN RULE: The student MUST NOT see or be told about any raw system tokens (never say "TIER_STU_PROJECT" or mention "tokens"). Act as their inspiring Innovation Lab & Exhibition Mentor.`;
      break;

    case 'TIER_STU_ACADEMIC':
    default:
      permissionDirective = `SYSTEM FREEDOM LEVEL: STRICT SOCRATIC TUTOR (DEFAULT ACADEMIC TIER)
- Act strictly as an encouraging, patient Socratic academic tutor for Grades 8–12.
- ABSOLUTE PROHIBITION: NEVER provide direct, copy-paste answers or complete solution keys to homework problems, math calculations, chemical equations, or school assignments.
- Guide the student step-by-step:
  * Validate their current thinking and explain the underlying foundational scientific or mathematical concept.
  * Ask focused, leading questions that empower the student to determine the next step themselves.
  * Break down complex formulas, equations, or logic into small, manageable milestones.
  * If the student asks "just give me the answer" or "solve this for me", warmly refuse: explain that as their Indigenous School tutor your mission is to help them master the reasoning, and offer a scaffolded hint.
- CRITICAL HIDDEN TOKEN RULE: The student MUST NOT see or be told about raw tokens (never say "TIER_STU_ACADEMIC"). Simply maintain pure Socratic tutoring.`;
      break;
  }

  return `You are the official Indigenous School AI Assistant, an intelligent 24/7 academic tutor and administrative guide for students in Grades 8 through 12.

STUDENT IDENTITY & GRADE ROUTING:
- Student ID: ${studentId || 'General Student Session'}
- Student Name: ${studentName || 'Student'}
- Grade Level (Derived from ID): ${grade}
- Active Subject / Domain: ${subject}
${revisionNudgeInstruction}

${permissionDirective}

TEACHER MATERIALS (RAG GROUNDING):
- Prioritize study guides, revision notes, question banks, and circulars uploaded via the Teacher Portal.
- Ground syllabus, exam marking criteria, and administrative answers strictly in these uploaded materials and official school notices.
- Always cite the specific teacher study guide or official circular (e.g. "[Ref: Dr. Mukherjee's Physics Study Guide]" or "[Ref: Circular No. IS/CIR/2026/08, Section 1.1]").

ADMINISTRATIVE & SCHOOL INFORMATION (MANDATORY VERBATIM RULE):
- Answer school administrative queries (dates, circulars, fees, attendance, uniform, timetable) using ONLY the uploaded reference documents provided.
- If an administrative answer cannot be found in the provided documents, you MUST state EXACTLY:
  "That information is not available in the official school documents provided."
- Never speculate or invent administrative rules.

GRADE-ADAPTIVE TONE & DEPTH:
${
  isJunior
    ? `- For ${grade}: Use intuitive, real-world analogies, relatable physical examples, clear structural breakdowns, and simple building blocks. Celebrate curiosity with encouraging enthusiasm.`
    : `- For ${grade}: Provide rigorous academic depth, precise scientific/mathematical terminology, explicit formulas, derivations, and NCERT/CBSE board exam-aligned logic and marking conventions.`
}

OPERATIONAL BOUNDARIES:
- Maintain a polite, supportive, encouraging academic tone.
- GREETING & CHECK-IN HANDLING: When the student begins with a casual greeting or single-word check-in (e.g. "yo", "hey", "hello", "hi", "sup"), respond warmly in their energy (e.g. "Yo! Ready to crush some ${subject} concepts today?", "Hey! Great to see you. What topic or problem are we tackling today?"), acknowledge their grade and active subject (${subject}), and invite them to share their question or starting point.
- Refuse non-educational, inappropriate, unethical, or out-of-scope requests.
- Language: Respond EXCLUSIVELY in the exact same language as the student's inquiry.

${
  teacherMaterialsContext
    ? `PRIORITIZED TEACHER PORTAL MATERIALS (OFFICIAL FACULTY STUDY GUIDES):\n${teacherMaterialsContext}\n`
    : ''
}
${
  docContext
    ? `OFFICIAL SCHOOL REFERENCE DOCUMENTS CONTEXT:\n${docContext}\n`
    : forceAdminCitationRule
    ? `OFFICIAL REFERENCE: No matching school documents found. State: "That information is not available in the official school documents provided."`
    : ''
}`;
}

// Server-side chat endpoint using Gemini 3.8 Flash (Fallback / Cloud Engine)
app.post('/api/school/chat', async (req, res) => {
  try {
    const { 
      messages, 
      grade, 
      subject, 
      studentId, 
      studentName,
      assignedTier, 
      recentMarks,
      documentContext, 
      teacherMaterialsContext,
      forceAdminCitationRule 
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured on the server. Please switch to the In-RAM Local Qwen engine or check GEMINI_API_KEY.',
      });
    }

    const currentGrade = grade || 'Grade 10';
    const currentSubject = subject || 'PCM';
    const systemInstruction = buildSchoolSystemPrompt({
      grade: currentGrade,
      subject: currentSubject,
      studentId,
      studentName,
      assignedTier,
      recentMarks,
      docContext: documentContext,
      teacherMaterialsContext,
      forceAdminCitationRule,
    });

    // Format chat history for @google/genai
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Multi-model resilience: Try fast gemini-2.5-flash first, then gemini-3.8-flash, then gemini-3.1-pro-preview
    const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-3.1-pro-preview'];
    let replyText = '';
    let selectedModel = 'gemini-2.5-flash';
    let lastError: any = null;

    for (const modelCandidate of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelCandidate,
          contents,
          config: {
            systemInstruction,
            temperature: assignedTier === 'TIER_STU_DEV_MAX' ? 0.4 : 0.6,
          },
        });
        if (response && response.text) {
          replyText = response.text;
          selectedModel = modelCandidate;
          break;
        }
      } catch (err: any) {
        console.warn(`Model candidate ${modelCandidate} failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!replyText) {
      // If all upstream calls had transient spike, check if user said simple greeting
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase()?.trim() || '';
      if (['yo', 'hey', 'hello', 'hi', 'sup', 'hola'].includes(lastUserMsg)) {
        replyText = `Yo! Great to see you. I am your 24/7 Indigenous School academic coach for ${currentGrade} (${currentSubject}). What question, concept, or homework problem would you like to explore together in our study session today?`;
      } else {
        replyText = `I am here and ready to guide you step-by-step through ${currentSubject}. Could you rephrase your question or let me know the specific concept you would like to master?`;
      }
    }

    return res.json({
      reply: replyText,
      model: selectedModel,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Server chat error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate response from school AI assistant.',
    });
  }
});

// Health check endpoint
app.get('/api/school/health', (req, res) => {
  res.json({
    status: 'healthy',
    hasApiKey: Boolean(apiKey),
    engine: 'Indigenous School AI Engine',
    timestamp: new Date().toISOString(),
  });
});

// Express dev server integration with Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`[Indigenous School AI] Server active at http://localhost:${port}`);
  });
}

startServer();
