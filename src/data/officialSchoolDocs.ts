import { SchoolDocument } from '../types';

export const OFFICIAL_SCHOOL_DOCUMENTS: SchoolDocument[] = [
  {
    id: 'is-cir-2026-08',
    title: 'Circular No. IS/CIR/2026/08: Annual & Terminal Assessment Schedule 2026-27',
    circularNumber: 'IS/CIR/2026/08',
    category: 'Timetable',
    date: '2026-08-14',
    effectiveForGrades: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    summary: 'Comprehensive examination dates, reporting times, hall protocols, and admit card rules for mid-term, pre-board, and final annual assessments.',
    sections: [
      {
        sectionNumber: 'Section 1.1',
        heading: 'Mid-Term 1 Assessment Dates',
        content: 'Mid-Term 1 Examinations for Grades 8 through 12 will commence on September 15, 2026, and conclude on September 28, 2026. Practical examinations and internal assessments will be conducted between September 8 and September 12, 2026.',
      },
      {
        sectionNumber: 'Section 1.2',
        heading: 'Pre-Board Examinations (Grades 10 & 12)',
        content: 'Pre-Board Assessment Phase I for Grade 10 and Grade 12 will run from December 5, 2026, to December 18, 2026. Phase II (Remedial & Mock Board) will occur from January 12 to January 23, 2027.',
      },
      {
        sectionNumber: 'Section 1.3',
        heading: 'Annual Examination (Grades 8, 9, 11)',
        content: 'Annual Examinations for non-board classes (Grades 8, 9, and 11) are scheduled from February 18, 2027, to March 10, 2027. Results declaration is on March 25, 2027.',
      },
      {
        sectionNumber: 'Section 2.1',
        heading: 'Examination Hall Protocols & Timing',
        content: 'Reporting time is sharp 8:15 AM at the designated examination hall. The reading time is 15 minutes (8:45 AM - 9:00 AM). Writing time is 9:00 AM to 12:00 PM. No candidate will be admitted after 8:30 AM under any circumstances. School uniform and student ID / Admit Card are strictly mandatory.',
      },
      {
        sectionNumber: 'Section 2.2',
        heading: 'Permitted & Prohibited Items in Exam Hall',
        content: 'Permitted: Transparent pouches with blue/black ballpoint pens, geometry box, transparent water bottle, analog non-programmable wristwatch. Prohibited: Smart watches, mobile devices, programmable calculators (standard scientific calculators allowed ONLY for Grade 11-12 Accountancy/Math if board permits), bags, written chits.',
      },
    ],
  },
  {
    id: 'is-handbook-2026',
    title: 'Indigenous School Student Handbook & Code of Conduct 2026-27 (Edition XI)',
    circularNumber: 'IS/HB/2026-27',
    category: 'Handbook',
    date: '2026-06-01',
    effectiveForGrades: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    summary: 'School rules regarding attendance thresholds, uniform dress code, academic integrity, library privileges, and campus decorum.',
    sections: [
      {
        sectionNumber: 'Section 3.1',
        heading: 'Attendance Mandate (75% Rule)',
        content: 'Students must maintain a minimum of 75% attendance across all academic quarters. Candidates with attendance below 75% without authorized medical leave certified by a registered medical practitioner will not be issued an Admit Card for Terminal or Board examinations.',
      },
      {
        sectionNumber: 'Section 3.4',
        heading: 'Leave of Absence Procedure',
        content: 'Planned leave of more than 2 days requires a written application submitted to the Class Teacher and Vice-Principal at least 3 days in advance. Medical leave requires a medical fitness certificate and prescription slip submitted within 48 hours of rejoining school.',
      },
      {
        sectionNumber: 'Section 4.2',
        heading: 'Uniform and Grooming Code',
        content: 'Regular Uniform: Forest emerald blazer or sweater with official school crest, crisp white collared shirt, charcoal grey formal trousers or pleated skirt, school tie, black polished formal shoes, and dark green socks. Wednesday & Saturday: House sports track jersey with white sports shoes.',
      },
      {
        sectionNumber: 'Section 5.1',
        heading: 'Academic Integrity & Plagiarism Policy',
        content: 'Any student caught plagiarizing assignments, copying homework, submitting AI-generated direct assignments without teacher authorization, or cheating during assessments will receive an automatic zero on the assignment, followed by Level 2 counseling with the Academic Dean.',
      },
      {
        sectionNumber: 'Section 6.3',
        heading: 'Library Borrowing & Resource Center Rules',
        content: 'Students in Grades 8 to 10 may borrow up to 2 books for 14 days. Students in Grades 11 and 12 may borrow up to 4 books for 21 days, including reference journals. Late fines are 5 units per day after the grace period.',
      },
    ],
  },
  {
    id: 'is-cir-2026-14',
    title: 'Circular No. IS/CIR/2026/14: Annual STEM Conclave, Cultural Fest & Sports Meet 2026',
    circularNumber: 'IS/CIR/2026/14',
    category: 'Circular',
    date: '2026-09-02',
    effectiveForGrades: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    summary: 'Dates, registration deadlines, and house participation rules for the annual inter-house STEM exhibition, cultural carnival, and athletic sports day.',
    sections: [
      {
        sectionNumber: 'Section 1.1',
        heading: 'Indigenous Innovation STEM Conclave',
        content: 'The Annual Indigenous Innovation STEM Conclave will be held on October 24 and 25, 2026. Categories include: Sustainable Energy Models, Autonomous Robotics, AI & Data Science Prototypes, and Indigenous Botanical Herbarium. Registration closes October 10, 2026.',
      },
      {
        sectionNumber: 'Section 1.2',
        heading: 'Annual Cultural Fest ("Tarang 2026")',
        content: 'Tarang 2026 Cultural Fest will be celebrated on November 14 and 15, 2026. Events include Debate, One-Act Plays, Classical and Contemporary Dance, Eastern & Western Band Solos, and Fine Arts painting.',
      },
      {
        sectionNumber: 'Section 1.3',
        heading: 'Annual Athletics Meet & Sports Day',
        content: 'The 42nd Annual Athletics Meet will be hosted at the School Stadium on December 21 and 22, 2026. March-past rehearsals begin on December 10, 2026.',
      },
    ],
  },
  {
    id: 'is-syl-pcm-2026',
    title: 'Syllabus & Weightage Blueprint: Senior Secondary PCM (Physics, Chemistry, Mathematics)',
    category: 'Syllabus',
    date: '2026-06-15',
    effectiveForGrades: ['Grade 11', 'Grade 12'],
    summary: 'Unit-wise marks distribution, mandatory practical experiments, and key NCERT/CBSE theoretical concepts for Physics, Chemistry, and Mathematics.',
    sections: [
      {
        sectionNumber: 'Section PCM-1.1',
        heading: 'Grade 12 Physics Theory Blueprint (70 Marks)',
        content: 'Electrostatics & Current Electricity: 16 Marks. Magnetic Effects of Current & Magnetism: 17 Marks. Optics (Ray & Wave): 18 Marks. Dual Nature of Radiation & Atoms/Nuclei: 12 Marks. Electronic Devices (Semiconductors): 7 Marks. Practical assessment is 30 marks including external viva.',
      },
      {
        sectionNumber: 'Section PCM-1.2',
        heading: 'Grade 12 Chemistry Theory Blueprint (70 Marks)',
        content: 'Physical Chemistry (Solutions, Electrochemistry, Chemical Kinetics): 23 Marks. Inorganic Chemistry (d- and f-Block Elements, Coordination Compounds): 14 Marks. Organic Chemistry (Haloalkanes, Alcohols, Aldehydes/Ketones, Amines, Biomolecules): 33 Marks.',
      },
      {
        sectionNumber: 'Section PCM-1.3',
        heading: 'Grade 12 Mathematics Theory Blueprint (80 Marks)',
        content: 'Relations & Functions: 8 Marks. Algebra (Matrices & Determinants): 10 Marks. Calculus (Continuity, Differentiability, Application of Derivatives, Integrals, Differential Equations): 35 Marks. Vectors & 3D Geometry: 14 Marks. Linear Programming: 5 Marks. Probability: 8 Marks. Internal assessment is 20 marks.',
      },
      {
        sectionNumber: 'Section PCM-2.1',
        heading: 'Grade 8 & 9 Integrated Science & Math Guidelines',
        content: 'Grade 8: Cell Structure, Friction, Light, Sound, Force & Pressure, Rational Numbers, Linear Equations in One Variable, Mensuration. Grade 9: Motion, Force & Laws of Motion, Gravitation, Work & Energy, Matter in Our Surroundings, Atoms & Molecules, Number Systems, Polynomials, Coordinate Geometry, Triangles, Quadrilaterals.',
      },
    ],
  },
  {
    id: 'is-syl-cs-2026',
    title: 'Syllabus & Weightage Blueprint: Computer Science & Informatics / AI (Grades 9-12)',
    category: 'Syllabus',
    date: '2026-06-15',
    effectiveForGrades: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    summary: 'Curriculum roadmap covering Python programming, SQL databases, Computer Networks, and Machine Learning concepts.',
    sections: [
      {
        sectionNumber: 'Section CS-1.1',
        heading: 'Grade 11 & 12 Computer Science (Python & SQL)',
        content: 'Unit 1: Computational Thinking and Programming (Python) - 40 Marks (Functions, File Handling text/binary/csv, Data Structures: Stacks). Unit 2: Computer Networks - 10 Marks (Topologies, Protocols HTTP/FTP/TCP/IP, Network security). Unit 3: Database Management (SQL) - 20 Marks (DDL/DML queries, Joins, Group By, Primary/Foreign keys). Practical: 30 Marks.',
      },
      {
        sectionNumber: 'Section CS-2.1',
        heading: 'Grade 9 & 10 Artificial Intelligence & Digital Literacy',
        content: 'Foundational AI Project Cycle (Problem Scoping, Data Acquisition, Data Exploration, Modelling, Evaluation), Introduction to Python basics, Ethics of AI, Computer Vision and Natural Language Processing introduction.',
      },
    ],
  },
  {
    id: 'is-syl-comm-2026',
    title: 'Syllabus & Weightage Blueprint: Commerce, Economics & Business Studies (Grades 11-12)',
    category: 'Syllabus',
    date: '2026-06-15',
    effectiveForGrades: ['Grade 11', 'Grade 12'],
    summary: 'Syllabus structure and marking weightage for Accountancy, Macroeconomics, and Business Management.',
    sections: [
      {
        sectionNumber: 'Section COMM-1.1',
        heading: 'Grade 12 Accountancy Blueprint (80 Marks)',
        content: 'Part A: Accounting for Partnership Firms and Companies (60 Marks) - Partnership Fundamentals, Goodwill, Admission, Retirement, Death, Dissolution (36 Marks), Accounting for Share Capital and Debentures (24 Marks). Part B: Financial Statement Analysis and Cash Flow Statement (20 Marks). Project Work: 20 Marks.',
      },
      {
        sectionNumber: 'Section COMM-1.2',
        heading: 'Grade 12 Economics Blueprint (80 Marks)',
        content: 'Part A: Introductory Macroeconomics (40 Marks) - National Income and Related Aggregates (10 Marks), Money and Banking (6 Marks), Determination of Income and Employment (12 Marks), Government Budget and the Economy (6 Marks), Balance of Payments (6 Marks). Part B: Indian Economic Development (40 Marks). Project: 20 Marks.',
      },
    ],
  },
  {
    id: 'is-syl-hum-2026',
    title: 'Syllabus & Weightage Blueprint: Humanities & Social Sciences (Grades 8-12)',
    category: 'Syllabus',
    date: '2026-06-15',
    effectiveForGrades: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    summary: 'Curriculum details for History, Political Science, Geography, and Social Studies.',
    sections: [
      {
        sectionNumber: 'Section HUM-1.1',
        heading: 'Grade 11 & 12 Political Science & History',
        content: 'Political Science: Part A Contemporary World Politics (40 Marks), Part B Politics in India Since Independence (40 Marks). History: Themes in Indian History Part I (Ancient), Part II (Medieval), Part III (Modern), each carrying 25 Marks + 5 Marks Map work. Project Work: 20 Marks.',
      },
      {
        sectionNumber: 'Section HUM-2.1',
        heading: 'Grades 8-10 Social Science',
        content: 'Four pillars: History (India & the Contemporary World), Geography (Contemporary India), Political Science (Democratic Politics), Economics (Understanding Economic Development). 20 marks each + 20 marks internal assessment.',
      },
    ],
  },
  {
    id: 'is-cir-2026-03',
    title: 'Circular No. IS/CIR/2026/03: Tuition Fees, Merit Scholarships & Financial Aid 2026-27',
    circularNumber: 'IS/CIR/2026/03',
    category: 'Policy',
    date: '2026-04-05',
    effectiveForGrades: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    summary: 'Quarterly fee payment schedule, late fee penalties, merit scholarship criteria, and sibling concession details.',
    sections: [
      {
        sectionNumber: 'Section 1.1',
        heading: 'Quarterly Fee Due Dates',
        content: 'Quarter 1 (Apr-Jun): Due by April 10, 2026. Quarter 2 (Jul-Sep): Due by July 10, 2026. Quarter 3 (Oct-Dec): Due by October 10, 2026. Quarter 4 (Jan-Mar): Due by January 10, 2027. Late payment fee of 50 units per week applies after a 10-day grace window.',
      },
      {
        sectionNumber: 'Section 2.1',
        heading: 'Merit-Based Scholarships (Grades 8 to 12)',
        content: 'Rank 1 across the grade receives a 100% Tuition Fee Waiver for the following academic year. Rank 2 and Rank 3 receive a 50% Tuition Fee Waiver. Science & Mathematics Olympiad medalists qualify for a special 30% academic grant.',
      },
      {
        sectionNumber: 'Section 2.2',
        heading: 'Sibling Concession',
        content: 'A 20% concession on tuition fees is awarded to the younger sibling enrolled in the school, subject to satisfactory attendance and conduct.',
      },
    ],
  },
];
