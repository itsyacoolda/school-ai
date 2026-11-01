import { SchoolDocument, SchoolCitation, TeacherMaterial } from '../types';

export function searchSchoolAndTeacherDocuments(
  query: string,
  documents: SchoolDocument[],
  teacherMaterials: TeacherMaterial[] = []
): {
  matchedCitations: SchoolCitation[];
  documentContextString: string;
  teacherMaterialsContextString: string;
  hasRelevantDocs: boolean;
} {
  const normalizedQuery = query.toLowerCase().trim();
  const tokens = normalizedQuery
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  // 1. Search Teacher Materials (Prioritized)
  const scoredTeacherMaterials: { mat: TeacherMaterial; score: number }[] = [];
  for (const mat of teacherMaterials) {
    let score = mat.priorityWeight || 5; // Base priority
    const text = (mat.title + ' ' + mat.content + ' ' + mat.authorTeacher).toLowerCase();

    for (const token of tokens) {
      if (text.includes(token)) {
        score += 2;
        if (mat.title.toLowerCase().includes(token)) score += 3;
      }
    }

    if (score > (mat.priorityWeight || 5)) {
      scoredTeacherMaterials.push({ mat, score });
    }
  }

  scoredTeacherMaterials.sort((a, b) => b.score - a.score);
  const topTeacherMats = scoredTeacherMaterials.slice(0, 3);

  // 2. Search Official School Documents
  const scoredSections: {
    doc: SchoolDocument;
    section: SchoolDocument['sections'][0];
    score: number;
  }[] = [];

  for (const doc of documents) {
    for (const sec of doc.sections) {
      let score = 0;
      const secText = (doc.title + ' ' + sec.heading + ' ' + sec.content).toLowerCase();

      for (const token of tokens) {
        if (secText.includes(token)) {
          score += 1;
          if (sec.heading.toLowerCase().includes(token)) score += 2;
          if (doc.title.toLowerCase().includes(token)) score += 2;
        }
      }

      // Bonus for administrative keywords
      if (
        (normalizedQuery.includes('exam') || normalizedQuery.includes('date') || normalizedQuery.includes('timetable')) &&
        doc.category === 'Timetable'
      ) {
        score += 3;
      }
      if (
        (normalizedQuery.includes('fee') || normalizedQuery.includes('scholarship') || normalizedQuery.includes('cost')) &&
        doc.id.includes('cir-2026-03')
      ) {
        score += 3;
      }
      if (
        (normalizedQuery.includes('uniform') || normalizedQuery.includes('leave') || normalizedQuery.includes('attendance') || normalizedQuery.includes('cheating')) &&
        doc.category === 'Handbook'
      ) {
        score += 3;
      }

      if (score > 1) {
        scoredSections.push({ doc, section: sec, score });
      }
    }
  }

  scoredSections.sort((a, b) => b.score - a.score);
  const topSections = scoredSections.slice(0, 4);

  // Construct citations list
  const matchedCitations: SchoolCitation[] = [
    ...topTeacherMats.map((item) => ({
      documentId: item.mat.id,
      documentTitle: item.mat.title,
      section: `${item.mat.materialType} by ${item.mat.authorTeacher}`,
      excerpt: item.mat.content.slice(0, 220) + '...',
      isTeacherUploaded: true,
    })),
    ...topSections.map((item) => ({
      documentId: item.doc.id,
      documentTitle: item.doc.title,
      section: `${item.section.sectionNumber}: ${item.section.heading}`,
      excerpt: item.section.content,
      isTeacherUploaded: false,
    })),
  ];

  const teacherMaterialsContextString = topTeacherMats
    .map(
      (item) =>
        `TEACHER MATERIAL: "${item.mat.title}" (${item.mat.materialType} by ${item.mat.authorTeacher})\nTarget Grades: ${item.mat.targetGrades.join(', ')}\nCONTENT:\n${item.mat.content}\n---`
    )
    .join('\n\n');

  const documentContextString = topSections
    .map(
      (item) =>
        `DOCUMENT: ${item.doc.title}\nSECTION ${item.section.sectionNumber} (${item.section.heading}):\n${item.section.content}\n---`
    )
    .join('\n\n');

  return {
    matchedCitations,
    documentContextString,
    teacherMaterialsContextString,
    hasRelevantDocs: topTeacherMats.length > 0 || topSections.length > 0,
  };
}

export function isAdministrativeQuery(query: string): boolean {
  const adminKeywords = [
    'fee', 'fees', 'tuition', 'uniform', 'dress code', 'leave', 'attendance', 'admit card',
    'timetable', 'time table', 'exam date', 'exam schedule', 'mid-term', 'pre-board', 'holiday',
    'circular', 'handbook', 'scholarship', 'library', 'fines', 'sports day', 'stem conclave',
    'fest', 'conduct', 'cheating', 'plagiarism', 'reporting time', 'prohibited items',
    'concession', 'marks distribution', 'blueprint', 'weightage', 'syllabus for board'
  ];

  const lower = query.toLowerCase();
  return adminKeywords.some((kw) => lower.includes(kw));
}
