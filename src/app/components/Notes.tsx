import { useState } from "react";
import { useNavigate } from "react-router";
import { useBible } from "../contexts/BibleContext";
import { john3Verses } from "../data/bibleData";
import { ChevronLeft, Trash2, Edit2, FileText, X } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "./OfflineBanner";

export function Notes() {
  const navigate = useNavigate();
  const { notes, deleteNote, updateNote, darkMode } = useBible();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (noteId: string, currentText: string) => {
    setEditingNote(noteId);
    setEditText(currentText);
  };

  const handleSaveEdit = () => {
    if (editingNote && editText.trim()) {
      updateNote(editingNote, editText);
      setEditingNote(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditText('');
  };

  // Get verse details for each note
  const notesWithVerses = notes.map(note => {
    const verse = john3Verses.find(v => v.id === note.verseId);
    return { ...note, verse };
  }).filter(n => n.verse);

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-950 min-h-screen">
        <OfflineBanner />

        {/* Header */}
        <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
              aria-label="Back to home"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notes</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-6">
          {notesWithVerses.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Notes Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add notes to verses as you read to save your thoughts and reflections
              </p>
              <button
                onClick={() => navigate('/read')}
                className="bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Start Reading
              </button>
            </div>
          ) : (
            /* Notes List */
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {notesWithVerses.length} {notesWithVerses.length === 1 ? 'note' : 'notes'}
              </p>
              
              {notesWithVerses.map(({ id, verseId, text, timestamp, verse }) => (
                <div
                  key={id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
                >
                  {/* Verse Reference */}
                  <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                      {verse!.book} {verse!.chapter}:{verse!.verse}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      "{verse!.text}"
                    </p>
                  </div>

                  {/* Note Content */}
                  <div className="mb-3">
                    <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                      {text}
                    </p>
                  </div>

                  {/* Metadata and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(timestamp).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(id, text)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        aria-label="Edit note"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNote(id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Edit Dialog */}
        {editingNote && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Note</h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-4">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full h-32 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-lg p-3 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  autoFocus
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editText.trim()}
                    className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}