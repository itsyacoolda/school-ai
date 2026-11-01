import { 
  StudentProfile, 
  TeacherMaterial, 
  GradeLevel, 
  HighSchoolStream, 
  SecondLanguage, 
  ThirdLanguage,
  TeacherUser 
} from '../types';

export interface SubjectMeta {
  name: string;
  maxMarks: number; // 80 for theory (or 70 for science/practical subjects in 11-12)
  isPractical?: boolean;
}

// Generates the official curriculum subjects based on class & stream
export function getSubjectsForStudentCurriculum(
  grade: GradeLevel,
  stream?: HighSchoolStream,
  secondLanguage: SecondLanguage = 'Hindi Course-A',
  thirdLanguage: ThirdLanguage = 'Sanskrit'
): SubjectMeta[] {
  if (grade === 'Grade 8') {
    // 8th: English, Math, Science, Social Science, Hindi, and selected 3rd Language
    return [
      { name: 'English', maxMarks: 80 },
      { name: 'Mathematics', maxMarks: 80 },
      { name: 'Science', maxMarks: 80 },
      { name: 'Social Science', maxMarks: 80 },
      { name: 'Hindi', maxMarks: 80 },
      { name: thirdLanguage, maxMarks: 80 },
    ];
  }

  if (grade === 'Grade 9' || grade === 'Grade 10') {
    // 9th & 10th: English, Math, Science, Social Science, and selected 2nd Language
    return [
      { name: 'Mathematics', maxMarks: 80 },
      { name: 'English', maxMarks: 80 },
      { name: 'Science', maxMarks: 80 },
      { name: 'Social Science', maxMarks: 80 },
      { name: secondLanguage, maxMarks: 80 },
    ];
  }

  // Grades 11 and 12: strictly dependent on selected stream
  const activeStream = stream || 'Science (PCM)';

  switch (activeStream) {
    case 'Science (PCM)':
      return [
        { name: 'Physics', maxMarks: 70, isPractical: true },
        { name: 'Chemistry', maxMarks: 70, isPractical: true },
        { name: 'Mathematics', maxMarks: 80 },
        { name: 'English Core', maxMarks: 80 },
        { name: 'Computer Science', maxMarks: 70, isPractical: true },
      ];

    case 'Science (PCB)':
      return [
        { name: 'Physics', maxMarks: 70, isPractical: true },
        { name: 'Chemistry', maxMarks: 70, isPractical: true },
        { name: 'Biology', maxMarks: 70, isPractical: true },
        { name: 'English Core', maxMarks: 80 },
        { name: 'Physical Education / Psychology', maxMarks: 70, isPractical: true },
      ];

    case 'Commerce':
      return [
        { name: 'Accountancy', maxMarks: 80 },
        { name: 'Business Studies', maxMarks: 80 },
        { name: 'Economics', maxMarks: 80 },
        { name: 'English Core', maxMarks: 80 },
        { name: 'Applied Mathematics', maxMarks: 80 },
      ];

    case 'Humanities':
      return [
        { name: 'History', maxMarks: 80 },
        { name: 'Political Science', maxMarks: 80 },
        { name: 'Geography', maxMarks: 70, isPractical: true },
        { name: 'Economics', maxMarks: 80 },
        { name: 'English Core', maxMarks: 80 },
      ];

    case 'Computer Science & AI':
      return [
        { name: 'Computer Science (Python & SQL)', maxMarks: 70, isPractical: true },
        { name: 'Artificial Intelligence & Robotics', maxMarks: 70, isPractical: true },
        { name: 'Mathematics', maxMarks: 80 },
        { name: 'Physics', maxMarks: 70, isPractical: true },
        { name: 'English Core', maxMarks: 80 },
      ];

    default:
      return [
        { name: 'Physics', maxMarks: 70, isPractical: true },
        { name: 'Chemistry', maxMarks: 70, isPractical: true },
        { name: 'Mathematics', maxMarks: 80 },
        { name: 'English Core', maxMarks: 80 },
      ];
  }
}

export const PRESET_TEACHERS: TeacherUser[] = [
  {
    teacherId: 'TCH-HOD-PHYS',
    fullName: 'Dr. H. Mukherjee',
    department: 'Department of Physics',
    designation: 'Senior Faculty & Physics HOD',
  },
  {
    teacherId: 'TCH-SR-MATH',
    fullName: 'Mrs. S. Sen',
    department: 'Department of Mathematics',
    designation: 'Senior Secondary Mathematics Specialist',
  },
  {
    teacherId: 'TCH-LEAD-CS',
    fullName: 'Mr. A. Roy',
    department: 'Computer Science & AI Lab',
    designation: 'Lead Faculty - Informatics & Robotics',
  },
];

export const PRESET_STUDENTS: StudentProfile[] = [
  {
    studentId: 'IS-2026-G10-042',
    fullName: 'Aarav Patel',
    grade: 'Grade 10',
    secondLanguage: 'Hindi Course-A',
    houseName: 'Kaveri House',
    assignedTier: 'TIER_STU_ACADEMIC',
    academicAdvisor: 'Mrs. S. Sen (Senior Math Faculty)',
    recentMarks: [
      {
        subject: 'Mathematics',
        score: 44,
        maxScore: 80,
        term: 'Mid-Term Assessment',
        needsRevisionFocus: true,
        topicWeaknesses: ['Quadratic Equations', 'Trigonometric Identities'],
      },
      {
        subject: 'English',
        score: 68,
        maxScore: 80,
        term: 'Mid-Term Assessment',
        needsRevisionFocus: false,
      },
      {
        subject: 'Science',
        score: 52,
        maxScore: 80,
        term: 'Mid-Term Assessment',
        needsRevisionFocus: true,
        topicWeaknesses: ['Light: Refraction & Lens Formula', 'Electricity'],
      },
      {
        subject: 'Social Science',
        score: 66,
        maxScore: 80,
        term: 'Mid-Term Assessment',
        needsRevisionFocus: false,
      },
      {
        subject: 'Hindi Course-A',
        score: 71,
        maxScore: 80,
        term: 'Mid-Term Assessment',
        needsRevisionFocus: false,
      },
    ],
  },
  {
    studentId: 'IS-2026-G12-108',
    fullName: 'Priya Sharma',
    grade: 'Grade 12',
    stream: 'Science (PCM)',
    houseName: 'Brahmaputra House',
    assignedTier: 'TIER_STU_PROJECT',
    academicAdvisor: 'Dr. H. Mukherjee (Physics HOD)',
    recentMarks: [
      {
        subject: 'Physics',
        score: 58,
        maxScore: 70, // Practical subject out of 70
        term: 'Terminal Assessment Phase 1',
        needsRevisionFocus: false,
      },
      {
        subject: 'Chemistry',
        score: 61,
        maxScore: 70, // Practical subject out of 70
        term: 'Terminal Assessment Phase 1',
        needsRevisionFocus: false,
      },
      {
        subject: 'Mathematics',
        score: 56,
        maxScore: 80, // Non-practical theory out of 80
        term: 'Terminal Assessment Phase 1',
        needsRevisionFocus: true,
        topicWeaknesses: ['Definite Integrals', '3D Coordinate Geometry'],
      },
      {
        subject: 'English Core',
        score: 72,
        maxScore: 80,
        term: 'Terminal Assessment Phase 1',
        needsRevisionFocus: false,
      },
      {
        subject: 'Computer Science',
        score: 66,
        maxScore: 70,
        term: 'Terminal Assessment Phase 1',
        needsRevisionFocus: false,
      },
    ],
  },
  {
    studentId: 'IS-2026-G11-031',
    fullName: 'Kaelen Ross',
    grade: 'Grade 11',
    stream: 'Computer Science & AI',
    houseName: 'Narmada House',
    assignedTier: 'TIER_STU_DEV_MAX',
    academicAdvisor: 'Mr. A. Roy (Lead CS & Informatics)',
    recentMarks: [
      {
        subject: 'Computer Science (Python & SQL)',
        score: 68,
        maxScore: 70,
        term: 'Mid-Term Assessment',
        needsRevisionFocus: false,
      },
      {
        subject: 'Artificial Intelligence & Robotics',
        score: 67,
        maxScore: 70,
        term: 'Mid-Term Assessment',
        needsRevisionFocus: false,
      },
      {
        subject: 'Mathematics',
        score: 64,
        maxScore: 80,
        term: 'Mid-Term Assessment',
        needsRevisionFocus: false,
      },
      {
        subject: 'Physics',
        score: 46,
        maxScore: 70,
        term: 'Mid-Term Assessment',
        needsRevisionFocus: true,
        topicWeaknesses: ['Rotational Dynamics', 'Centre of Mass & Torques'],
      },
      {
        subject: 'English Core',
        score: 69,
        maxScore: 80,
        term: 'Mid-Term Assessment',
        needsRevisionFocus: false,
      },
    ],
  },
  {
    studentId: 'IS-2026-G08-019',
    fullName: 'Maya Lin',
    grade: 'Grade 8',
    thirdLanguage: 'Sanskrit',
    houseName: 'Ganga House',
    assignedTier: 'TIER_STU_ACADEMIC',
    academicAdvisor: 'Mr. P. Verma (Middle School Science)',
    recentMarks: [
      {
        subject: 'English',
        score: 67,
        maxScore: 80,
        term: 'Quarterly Diagnostic',
        needsRevisionFocus: false,
      },
      {
        subject: 'Mathematics',
        score: 45,
        maxScore: 80,
        term: 'Quarterly Diagnostic',
        needsRevisionFocus: true,
        topicWeaknesses: ['Linear Equations in One Variable', 'Mensuration Area'],
      },
      {
        subject: 'Science',
        score: 51,
        maxScore: 80,
        term: 'Quarterly Diagnostic',
        needsRevisionFocus: true,
        topicWeaknesses: ['Friction & Pressure', 'Sound Vibrations'],
      },
      {
        subject: 'Social Science',
        score: 68,
        maxScore: 80,
        term: 'Quarterly Diagnostic',
        needsRevisionFocus: false,
      },
      {
        subject: 'Hindi',
        score: 64,
        maxScore: 80,
        term: 'Quarterly Diagnostic',
        needsRevisionFocus: false,
      },
      {
        subject: 'Sanskrit',
        score: 62,
        maxScore: 80,
        term: 'Quarterly Diagnostic',
        needsRevisionFocus: false,
      },
    ],
  },
  {
    studentId: 'IS-2026-G09-075',
    fullName: 'David O\'Connor',
    grade: 'Grade 9',
    secondLanguage: 'French',
    houseName: 'Yamuna House',
    assignedTier: 'TIER_STU_PROJECT',
    academicAdvisor: 'Ms. T. Bannerjee (Innovation Lab Coordinator)',
    recentMarks: [
      {
        subject: 'English',
        score: 72,
        maxScore: 80,
        term: 'Term 1 Exam',
        needsRevisionFocus: false,
      },
      {
        subject: 'Mathematics',
        score: 48,
        maxScore: 80,
        term: 'Term 1 Exam',
        needsRevisionFocus: true,
        topicWeaknesses: ['Polynomials & Factor Theorem', 'Coordinate Geometry'],
      },
      {
        subject: 'Science',
        score: 63,
        maxScore: 80,
        term: 'Term 1 Exam',
        needsRevisionFocus: false,
      },
      {
        subject: 'Social Science',
        score: 65,
        maxScore: 80,
        term: 'Term 1 Exam',
        needsRevisionFocus: false,
      },
      {
        subject: 'French',
        score: 69,
        maxScore: 80,
        term: 'Term 1 Exam',
        needsRevisionFocus: false,
      },
    ],
  },
];

export const INITIAL_TEACHER_MATERIALS: TeacherMaterial[] = [
  {
    id: 'mat-phys-10-quad',
    title: 'Dr. Mukherjee\'s High-Yield Physics Study Guide: Ray Optics & Circuit Analysis (Grade 10)',
    authorTeacher: 'Dr. H. Mukherjee (Physics HOD)',
    subject: 'Science',
    targetGrades: ['Grade 10'],
    uploadDate: '2026-09-04',
    materialType: 'Study Guide',
    priorityWeight: 10,
    content: `CRITICAL BOARD EXAM STUDY GUIDE - RAY OPTICS & CURRENT ELECTRICITY (Max Marks: 80 Theory)
1. Sign Convention (Cartesian): Object distance (u) is ALWAYS negative. For convex lens: focal length (f) is POSITIVE. For concave lens: focal length (f) is NEGATIVE.
2. Mirror Formula vs Lens Formula: Lens formula is 1/v - 1/u = 1/f. Mirror formula is 1/v + 1/u = 1/f. Magnification for lens m = v/u; for mirror m = -v/u.
3. Common Student Pitfall: Forgetting units! Power of lens P = 1/f (in meters!). If f is in cm, P = 100/f Dioptres.
4. Ohm's Law Circuit Analysis: Series resistors share current I; voltage divides (V = V1 + V2). Parallel resistors share voltage V; current divides (I = I1 + I2). Equivalent resistance in parallel: 1/Rp = 1/R1 + 1/R2.`,
  },
  {
    id: 'mat-math-10-quad',
    title: 'Mrs. Sen\'s Step-by-Step Revision Notes: Mastering Quadratic Equations & Discriminant Logic',
    authorTeacher: 'Mrs. S. Sen (Senior Math Faculty)',
    subject: 'Mathematics',
    targetGrades: ['Grade 10'],
    uploadDate: '2026-09-08',
    materialType: 'Revision Notes',
    priorityWeight: 10,
    content: `HIGH-PRIORITY REVISION NOTES: QUADRATIC EQUATIONS (ax² + bx + c = 0, a ≠ 0)
1. Discriminant Analysis (D = b² - 4ac):
   - If D > 0: Two distinct real roots x = (-b ± √D) / (2a).
   - If D = 0: Two equal real roots x = -b / (2a).
   - If D < 0: No real roots.
2. Factoring by Splitting the Middle Term: Find two numbers p and q such that p + q = b and p × q = a × c.
3. Word Problems Technique: Always declare variable clearly with units (e.g., "Let the speed of the train be x km/h"). Write the equation based on time difference: Time = Distance / Speed.`,
  },
  {
    id: 'mat-cs-11-12-dev',
    title: 'Mr. Roy\'s Software Architecture & Project Engineering Handbook (Grades 11-12)',
    authorTeacher: 'Mr. A. Roy (Lead CS & Informatics)',
    subject: 'Computer Science (Python & SQL)',
    targetGrades: ['Grade 11', 'Grade 12'],
    uploadDate: '2026-08-20',
    materialType: 'Lab Manual',
    priorityWeight: 10,
    content: `SOFTWARE ARCHITECTURE & DEV ENVIRONMENT GUIDELINES:
1. Python Best Practices: Follow PEP-8, use typing annotations, and implement robust try-except error handling. Always use virtual environments and requirements.txt.
2. Database Schema Design (3NF): Ensure atomic attributes (1NF), eliminate partial functional dependencies (2NF), and remove transitive dependencies (3NF). Use foreign keys with CASCADE or RESTRICT rules.
3. Microservices & API Design: RESTful endpoints using standard HTTP verbs (GET, POST, PUT, DELETE). Always validate JSON payloads and return appropriate status codes (200, 201, 400, 404, 500).
4. STEM Hardware Wiring: Pull-up vs Pull-down resistors on GPIO pins. Ensure common ground (GND) across microcontrollers (ESP32/Arduino) and external power supplies to prevent floating voltages.`,
  },
];

export function deriveGradeFromStudentId(id: string): GradeLevel {
  const upper = id.toUpperCase();
  if (upper.includes('G08') || upper.includes('G8') || upper.includes('GRADE8') || upper.includes('GRADE-8')) return 'Grade 8';
  if (upper.includes('G09') || upper.includes('G9') || upper.includes('GRADE9') || upper.includes('GRADE-9')) return 'Grade 9';
  if (upper.includes('G10') || upper.includes('GRADE10') || upper.includes('GRADE-10')) return 'Grade 10';
  if (upper.includes('G11') || upper.includes('GRADE11') || upper.includes('GRADE-11')) return 'Grade 11';
  if (upper.includes('G12') || upper.includes('GRADE12') || upper.includes('GRADE-12')) return 'Grade 12';
  return 'Grade 10';
}

export function getOrDeriveStudentProfile(studentId: string, currentProfiles: StudentProfile[]): StudentProfile {
  const trimmed = studentId.trim();
  const existing = currentProfiles.find(
    (s) => s.studentId.toLowerCase() === trimmed.toLowerCase()
  );
  if (existing) return existing;

  const derivedGrade = deriveGradeFromStudentId(trimmed);
  const isHighSchool = derivedGrade === 'Grade 11' || derivedGrade === 'Grade 12';

  const curriculum = getSubjectsForStudentCurriculum(
    derivedGrade, 
    isHighSchool ? 'Science (PCM)' : undefined, 
    'Hindi Course-A', 
    'Sanskrit'
  );

  return {
    studentId: trimmed || `IS-2026-${derivedGrade.replace(' ', 'G')}-099`,
    fullName: `Student (${trimmed})`,
    grade: derivedGrade,
    stream: isHighSchool ? 'Science (PCM)' : undefined,
    secondLanguage: derivedGrade === 'Grade 9' || derivedGrade === 'Grade 10' ? 'Hindi Course-A' : undefined,
    thirdLanguage: derivedGrade === 'Grade 8' ? 'Sanskrit' : undefined,
    houseName: 'Tagore House',
    assignedTier: 'TIER_STU_ACADEMIC',
    academicAdvisor: 'Class Academic Mentor',
    recentMarks: curriculum.map((sub) => ({
      subject: sub.name,
      score: Math.round(sub.maxMarks * 0.72),
      maxScore: sub.maxMarks,
      term: 'Recent Terminal Assessment',
      needsRevisionFocus: false,
    })),
  };
}
