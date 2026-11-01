import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Upload, 
  Search, 
  BookOpen, 
  Calendar, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { SchoolDocument } from '../types';

interface DocumentLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: SchoolDocument[];
  onAddCustomDocument: (doc: SchoolDocument) => void;
  onSelectDocumentForQuery: (docTitle: string, initialQuestion?: string) => void;
}

export const DocumentLibraryModal: React.FC<DocumentLibraryModalProps> = ({
  isOpen,
  onClose,
  documents,
  onAddCustomDocument,
  onSelectDocumentForQuery,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDoc, setActiveDoc] = useState<SchoolDocument | null>(documents[0] || null);
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCircularNo, setNewCircularNo] = useState('');
  const [newCategory, setNewCategory] = useState<SchoolDocument['category']>('Circular');
  const [newContent, setNewContent] = useState('');

  if (!isOpen) return null;

  const categories = ['All', 'Circular', 'Handbook', 'Timetable', 'Syllabus', 'Policy'];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.sections.some((s) => s.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const sections = newContent.split('\n\n').map((paragraph, idx) => ({
      sectionNumber: `Section ${idx + 1}`,
      heading: `Notice Item ${idx + 1}`,
      content: paragraph.trim(),
    }));

    const newDoc: SchoolDocument = {
      id: `custom-doc-${Date.now()}`,
      title: newTitle.trim(),
      circularNumber: newCircularNo.trim() || `IS/CUSTOM/${Date.now().toString().slice(-4)}`,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      effectiveForGrades: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
      summary: newContent.slice(0, 160) + '...',
      sections,
      isCustomUploaded: true,
    };

    onAddCustomDocument(newDoc);
    setActiveDoc(newDoc);
    setIsUploading(false);
    setNewTitle('');
    setNewCircularNo('');
    setNewContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-900 to-emerald-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Official School Reference Documents
              </h2>
              <p className="text-xs text-emerald-200">
                School Handbooks, Assessment Circulars, Syllabi & Attendance Policies
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploading(!isUploading)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-amber-200 border border-emerald-600/50 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Back to Library' : 'Upload Circular'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isUploading ? (
          /* Upload Form */
          <div className="p-6 overflow-y-auto max-w-2xl mx-auto w-full space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Upload or Paste Official School Circular
              </h3>
              <p className="text-xs text-slate-500">
                This document will be instantly indexed into the AI Assistant’s verified reference knowledge base.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Circular No. 2026/22: Winter Vacation & Remedial Schedule"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Circular / Reference No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IS/CIR/2026/22"
                    value={newCircularNo}
                    onChange={(e) => setNewCircularNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as SchoolDocument['category'])}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="Circular">Circular</option>
                    <option value="Handbook">Handbook</option>
                    <option value="Timetable">Timetable</option>
                    <option value="Syllabus">Syllabus</option>
                    <option value="Policy">Policy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Text / Content *
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Paste official notice text here. Separate distinct paragraphs or rules with blank lines."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 rounded-lg shadow-xs"
                >
                  Index Document
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Split View: Left List, Right Detail */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Column: Search & List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50">
              
              {/* Search & Filter */}
              <div className="p-3 border-b border-slate-200 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search circulars, exams, rules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-emerald-800 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filteredDocs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No matching documents found.
                  </div>
                ) : (
                  filteredDocs.map((doc) => {
                    const isSelected = activeDoc?.id === doc.id;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => setActiveDoc(doc)}
                        className={`w-full text-left p-3 transition-colors flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-100/60 border-l-4 border-emerald-800'
                            : 'hover:bg-slate-100/70'
                        }`}
                      >
                        <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-800' : 'text-slate-400'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              {doc.category}
                            </span>
                            <span className="text-[10px] text-slate-400">{doc.date}</span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-900 truncate">
                            {doc.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {doc.summary}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Document Details */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {activeDoc ? (
                <div className="max-w-3xl space-y-5">
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-900">
                        {activeDoc.category}
                      </span>
                      {activeDoc.circularNumber && (
                        <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-slate-100 text-slate-700">
                          {activeDoc.circularNumber}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">Published: {activeDoc.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif">
                      {activeDoc.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 italic">
                      Applicable to: {activeDoc.effectiveForGrades.join(', ')}
                    </p>
                  </div>

                  {/* Ask question shortcut */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-emerald-900">
                      <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Have a question about this official notice?</span>
                    </div>
                    <button
                      onClick={() => {
                        onSelectDocumentForQuery(activeDoc.title);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shrink-0"
                    >
                      Ask AI with this Document
                    </button>
                  </div>

                  {/* Sections */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Verified Clauses & Provisions
                    </h4>
                    {activeDoc.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-emerald-950">
                            {sec.sectionNumber} — {sec.heading}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Official Clause
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                          {sec.content}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Select a document from the left to view clauses.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Citation Guarantee: All administrative responses cite these clauses verbatim.</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs font-medium text-slate-700 hover:text-slate-900"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
